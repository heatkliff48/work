-- Обнуление операционных данных MES с сохранением справочников.
--
-- Сохраняются как есть:
--   пользователи и права  — Users, UsersInfos, Roles, Pages, PageAndRoles
--   номенклатура          — Products, ProductCodes, FilesProducts, Tools, Anchors,
--                           DryMixesJournals, RelatedMaterialsJournals
--   рецептуры             — Recipes
--   история миграций      — SequelizeMeta
-- RawMaterialsWarehouses не очищается: строки по видам сырья нужны коду
-- (findOne по material_type), обнуляются только остатки и расход.
-- Всё остальное очищается, счётчики id начинаются с 1.
--
-- Запуск (приложение должно быть остановлено, бэкап сделан):
--   пробный прогон, в конце ROLLBACK:
--     psql -h <host> -U <user> -d <db> -f reset-operational-data.sql
--   применить:
--     psql -h <host> -U <user> -d <db> -v apply=1 -f reset-operational-data.sql
--
-- Скрипт пишет в текущую папку files-to-delete.txt — файлы из uploads/,
-- привязанные к очищаемым FilesOrders, FilesWarehouses, FilesLotesLists.
-- Требуется psql 10+ (\if).

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
\echo 'Список файлов для удаления из uploads/ записан в files-to-delete.txt'

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
  \echo 'ПРОБНЫЙ ПРОГОН: ROLLBACK, база не изменена. Для применения добавьте -v apply=1'
\endif
