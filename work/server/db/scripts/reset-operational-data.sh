#!/usr/bin/env bash
# Обнуление операционных данных MES с сохранением справочников.
#
# Сохраняются: Users, UsersInfos, Roles, Pages, PageAndRoles, Products,
# ProductCodes, FilesProducts, Tools, Anchors, DryMixesJournals,
# RelatedMaterialsJournals, Recipes, SequelizeMeta.
# RawMaterialsWarehouses: строки остаются, остатки и расход обнуляются.
# Остальные таблицы очищаются, id начинаются с 1. Файлы очищенных заказов,
# склада, lotes и документы по сырью удаляются из uploads/.
#
# Шаги:
#   1. проверка подключения к базе;
#   2. бэкап базы и uploads/ в ~/mes_backup_<дата_время>/;
#   3. пробный прогон (ROLLBACK) — показывает, что останется;
#   4. после ответа "yes" — очистка и удаление файлов.
#
# Запуск на сервере (приложение должно быть остановлено):
#   bash reset-operational-data.sh
# из папки server (где лежат .env и uploads/). Если скрипт лежит в
# server/db/scripts/, его можно запускать из любой папки.

set -euo pipefail

DB_HOST=localhost
DB_USER='ags@baublock.com'

die() { echo "ОШИБКА: $*" >&2; exit 1; }
ask_yes() { local a; read -rp "$1 (yes/no): " a; [ "$a" = yes ]; }

SCRIPT_DIR=$(cd "$(dirname "$0")" && pwd)
if [ -f "$SCRIPT_DIR/../../.env" ]; then
  SERVER_DIR=$(cd "$SCRIPT_DIR/../.." && pwd)
else
  SERVER_DIR=$PWD
fi
[ -f "$SERVER_DIR/.env" ] || die "не найден .env в $SERVER_DIR — запустите скрипт из папки server"

# .env в формате "KEY = value"
env_get() {
  grep -E "^\s*$1\s*=" "$SERVER_DIR/.env" | head -1 | tr -d '\r' \
    | sed -E "s/^[^=]*=\s*//; s/\s+$//; s/^['\"]//; s/['\"]$//" || true
}

DB_NAME=$(env_get DB_NAME)
[ -n "$DB_NAME" ] || read -rp "Имя базы данных: " DB_NAME
if [ "$(env_get DB_USER)" = "$DB_USER" ] && [ -n "$(env_get DB_PASS)" ]; then
  PGPASSWORD=$(env_get DB_PASS)
else
  read -rsp "Пароль пользователя БД $DB_USER: " PGPASSWORD
  echo
fi
export PGHOST=$DB_HOST PGUSER=$DB_USER PGDATABASE=$DB_NAME PGPASSWORD

echo "== 1. Подключение: $PGUSER@$PGHOST, база $PGDATABASE, папка $SERVER_DIR"
psql -tAc 'SELECT 1' >/dev/null || die "не удалось подключиться к базе"
ask_yes "Приложение остановлено, продолжить?" || { echo "Отменено."; exit 0; }

BACKUP_DIR=~/mes_backup_$(date +%F_%H%M%S)
mkdir -p "$BACKUP_DIR"
echo "== 2. Бэкап в $BACKUP_DIR"
pg_dump -Fc -f "$BACKUP_DIR/db.dump"
pg_restore -l "$BACKUP_DIR/db.dump" >/dev/null || die "бэкап базы не читается"
if [ -d "$SERVER_DIR/uploads" ]; then
  tar czf "$BACKUP_DIR/uploads.tgz" -C "$SERVER_DIR" uploads
fi
ls -lh "$BACKUP_DIR"

SQL_FILE=$BACKUP_DIR/reset.sql
cat > "$SQL_FILE" <<'SQL'
-- Без -v apply=1 скрипт заканчивается ROLLBACK (пробный прогон).
-- Пишет в текущую папку files-to-delete.txt — файлы из uploads/,
-- привязанные к очищаемым FilesOrders, FilesWarehouses, FilesLotesLists.

\set ON_ERROR_STOP on
\pset footer off

CREATE TEMP VIEW row_counts AS
SELECT t.table_name AS "Таблица",
       (xpath('/row/n/text()',
              query_to_xml(format('SELECT count(*) AS n FROM public.%I', t.table_name),
                           false, true, '')))[1]::text::bigint AS "Строк"
FROM information_schema.tables t
WHERE t.table_schema = 'public' AND t.table_type = 'BASE TABLE';

\echo '=== ДО: строк в таблицах ==='
SELECT * FROM row_counts ORDER BY 1;

\copy (SELECT file_name FROM "FilesOrders" WHERE file_name IS NOT NULL UNION SELECT file_name FROM "FilesWarehouses" WHERE file_name IS NOT NULL UNION SELECT file_name FROM "FilesLotesLists" WHERE file_name IS NOT NULL ORDER BY 1) TO 'files-to-delete.txt'

BEGIN;

TRUNCATE TABLE
  -- клиенты
  "Clients", "ClientLegalAddresses", "DeliveryAddresses", "ContactInfos", "ClientsPriceInfos",
  -- заказы и отгрузки
  "Orders", "OrdersProducts", "OrderDryMixedProducts", "OrderAnchorProducts",
  "OrderToolProducts", "OrderRelMatProducts", "OrderDispatches", "OrderToWarehouses",
  "FilesOrders", "Aldabarans",
  -- резервы
  "ReservedProducts", "ReservedDryMixes", "ReservedAnchors", "ReservedTools",
  "ReservedRelatedMaterials", "RelatedMaterialsBackorderLists",
  -- склад готовой продукции
  "Warehouses", "DryMixesWarehouses", "AnchorsWarehouses", "ToolsWarehouses",
  "RelatedMaterialsWarehouses", "StockBalances", "FilesWarehouses",
  -- склад сырья: приходы и расход
  "WarehouseSands", "WarehouseSandSlurries", "WarehouseSandPowders", "WarehouseLimes",
  "WarehouseCements", "WarehouseGypsums", "WarehouseGypsumStones", "WarehouseAluminum1s",
  "WarehouseAluminum2s", "WarehouseGrindingBalls", "WarehouseAACs", "WarehousePallets",
  "WarehousePlastics", "RawMatConsumptions", "RawMatConsumptionsCurrentMolds",
  -- производство
  "ProductionBatchLogs", "ListOfOrderedProductions", "ListOfOrderedProductionOEMs",
  "BatchOutsides", "RecipeOrders", "AutoclaveCalendares", "LotesListsBatches",
  "LotesListsCakes", "FilesLotesLists",
  -- качество
  "QualityManagements", "ProductionQualities", "QualityCompressions", "QualityDimensions",
  -- мониторинг
  "GreenLineMonitorings", "TemperatureDataMonitorings",
  -- сессии: все пользователи будут разлогинены
  "Sessions", "Refresh_sessions"
RESTART IDENTITY;

UPDATE "RawMaterialsWarehouses"
SET remaining_quantity = 0,
    consumed_quantity = 0,
    last_updated = to_char(now(), 'DD.MM.YYYY'),
    "updatedAt" = now();

\echo '=== ПОСЛЕ: непустые таблицы (должны остаться только сохраняемые) ==='
SELECT * FROM row_counts WHERE "Строк" > 0 ORDER BY 1;

\echo '=== ПОСЛЕ: остатки сырья ==='
SELECT material_type, remaining_quantity, consumed_quantity, last_updated
FROM "RawMaterialsWarehouses" ORDER BY id;

\if :{?apply}
  COMMIT;
  \echo 'COMMIT: изменения сохранены.'
\else
  ROLLBACK;
  \echo 'ПРОБНЫЙ ПРОГОН: ROLLBACK, база не изменена.'
\endif
SQL

echo "== 3. Пробный прогон (база не меняется)"
(cd "$BACKUP_DIR" && psql -f "$SQL_FILE") | tee "$BACKUP_DIR/dry-run.log"

ask_yes "Применить очистку?" || { echo "Отменено, база не изменена. Бэкап: $BACKUP_DIR"; exit 0; }

echo "== 4. Очистка"
(cd "$BACKUP_DIR" && psql -v apply=1 -f "$SQL_FILE") | tee "$BACKUP_DIR/apply.log"

echo "== 5. Удаление файлов из uploads/"
removed=0
while IFS= read -r f; do
  case "$f" in ''|*/*|..*) continue ;; esac
  if [ -f "$SERVER_DIR/uploads/$f" ]; then
    rm -- "$SERVER_DIR/uploads/$f"
    removed=$((removed + 1))
  fi
done < "$BACKUP_DIR/files-to-delete.txt"
rm -rf "$SERVER_DIR/uploads/rawMaterialsWarehouse"
echo "Удалено файлов: $removed, плюс папка uploads/rawMaterialsWarehouse"

cat <<EOF

Готово. Бэкап и логи: $BACKUP_DIR
Откат базы:   pg_restore -h $PGHOST -U '$PGUSER' -d $PGDATABASE --clean --if-exists $BACKUP_DIR/db.dump
Откат файлов: tar xzf $BACKUP_DIR/uploads.tgz -C $SERVER_DIR
Можно запускать приложение.
EOF
