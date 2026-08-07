import React, { useMemo, useState } from 'react';
import {
  addDays,
  addMonths,
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  format,
  isSameMonth,
  isToday,
  parseISO,
  startOfMonth,
  startOfWeek,
  subMonths,
} from 'date-fns';
import { ru } from 'date-fns/locale';
import { useSelector } from 'react-redux';
import Modal from 'react-bootstrap/Modal';
import { useRecipeContext } from '#components/contexts/RecipeContext.js';
import RawMaterialsPlan from '#components/RawMaterialsPlan/RawMaterialsPlan.jsx';

const WEEK_STARTS_ON = 1;

export default function TechnologyCalendar() {
  const [currentMonth, setCurrentMonth] = useState(startOfMonth(new Date()));
  const [selectedDate, setSelectedDate] = useState(null);
  const [recipeBatchId, setRecipeBatchId] = useState(null);

  const batchOutside = useSelector((state) => state.batchOutside);
  const recipeOrders = useSelector((state) => state.recipeOrders);
  const { list_of_recipes } = useRecipeContext();

  const monthLabel = useMemo(
    () => format(currentMonth, 'LLLL yyyy', { locale: ru }),
    [currentMonth],
  );

  const days = useMemo(() => {
    const start = startOfWeek(startOfMonth(currentMonth), {
      weekStartsOn: WEEK_STARTS_ON,
    });
    const end = endOfWeek(endOfMonth(currentMonth), {
      weekStartsOn: WEEK_STARTS_ON,
    });
    return eachDayOfInterval({ start, end });
  }, [currentMonth]);

  const weekDayHeaders = useMemo(() => {
    const base = startOfWeek(new Date(), { weekStartsOn: WEEK_STARTS_ON });
    return Array.from({ length: 7 }, (_, i) => ({
      key: i,
      label: format(addDays(base, i), 'EEEEE', { locale: ru }),
    }));
  }, []);

  const batchesByDate = useMemo(() => {
    const map = new Map();
    if (!Array.isArray(batchOutside)) return map;
    batchOutside.forEach((item) => {
      const iso = String(item?.date ?? '').slice(0, 10);
      if (!iso) return;
      if (!map.has(iso)) map.set(iso, []);
      map.get(iso).push(item);
    });
    return map;
  }, [batchOutside]);

  const selectedDayBatches = selectedDate
    ? batchesByDate.get(selectedDate) || []
    : [];

  const getRecipeForBatch = (batch) => {
    const order = Array.isArray(recipeOrders)
      ? recipeOrders.find((ro) => ro.id_batch === batch.id)
      : null;
    if (!order) return null;
    return (
      (Array.isArray(list_of_recipes) &&
        list_of_recipes.find((r) => r.id === order.id_recipe)) ||
      null
    );
  };

  return (
    <div style={styles.wrapper}>
      <div style={styles.header}>
        <button
          type="button"
          style={styles.navBtn}
          onClick={() => setCurrentMonth((m) => subMonths(m, 1))}
        >
          ←
        </button>
        <div style={styles.monthLabel}>{monthLabel}</div>
        <button
          type="button"
          style={styles.navBtn}
          onClick={() => setCurrentMonth((m) => addMonths(m, 1))}
        >
          →
        </button>
      </div>

      <div style={styles.grid}>
        {weekDayHeaders.map(({ key, label }) => (
          <div key={key} style={styles.headerCell}>
            {label}
          </div>
        ))}

        {days.map((day) => {
          const iso = format(day, 'yyyy-MM-dd');
          const inMonth = isSameMonth(day, currentMonth);
          const count = (batchesByDate.get(iso) || []).length;

          return (
            <button
              type="button"
              key={iso}
              onClick={() => setSelectedDate(iso)}
              style={{
                ...styles.tile,
                ...(isToday(day) ? styles.tileToday : null),
                opacity: inMonth ? 1 : 0.45,
              }}
            >
              <div style={styles.tileHead}>
                <span
                  style={{
                    ...styles.dayNumber,
                    ...(isToday(day) ? styles.dayNumberToday : null),
                  }}
                >
                  {format(day, 'd', { locale: ru })}
                </span>
                {count > 0 && <span style={styles.badge}>{count}</span>}
              </div>
            </button>
          );
        })}
      </div>

      <Modal show={!!selectedDate} onHide={() => setSelectedDate(null)} centered>
        <Modal.Header closeButton>
          <Modal.Title style={{ textTransform: 'capitalize' }}>
            {selectedDate &&
              format(parseISO(selectedDate), 'd MMMM yyyy', { locale: ru })}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedDayBatches.length === 0 && (
            <div style={styles.emptyState}>
              Нет запланированных партий на эту дату.
            </div>
          )}

          {selectedDayBatches.map((batch) => {
            const recipe = getRecipeForBatch(batch);
            return (
              <div key={batch.id} style={styles.batchRow}>
                <div>
                  <div style={styles.batchProduct}>{batch.product_article}</div>
                  <div style={styles.batchQty}>
                    {batch.quantity_pallets} поддонов
                  </div>
                </div>
                {recipe ? (
                  <span style={styles.recipeBadgeOk}>
                    Рецепт: {recipe.article}
                  </span>
                ) : (
                  <button
                    type="button"
                    style={styles.selectRecipeBtn}
                    onClick={() => setRecipeBatchId(batch.id)}
                  >
                    Выбрать рецепт
                  </button>
                )}
              </div>
            );
          })}
        </Modal.Body>
      </Modal>

      <Modal
        show={!!recipeBatchId}
        onHide={() => setRecipeBatchId(null)}
        fullscreen
      >
        <Modal.Header closeButton>
          <Modal.Title>Выбор рецепта</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {recipeBatchId && (
            <RawMaterialsPlan
              batchId={recipeBatchId}
              onSaved={() => setRecipeBatchId(null)}
            />
          )}
        </Modal.Body>
      </Modal>
    </div>
  );
}

const styles = {
  wrapper: {
    background: '#f8fafc',
    padding: 24,
    borderRadius: 16,
    margin: 24,
    maxWidth: 900,
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  navBtn: {
    border: 'none',
    background: '#e2e8f0',
    borderRadius: 8,
    width: 36,
    height: 36,
    fontSize: 16,
    cursor: 'pointer',
  },
  monthLabel: {
    fontWeight: 700,
    fontSize: 20,
    textTransform: 'capitalize',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(7, 1fr)',
    gap: 10,
  },
  headerCell: {
    textAlign: 'center',
    fontWeight: 600,
    color: '#64748b',
    textTransform: 'capitalize',
    paddingBottom: 6,
  },
  tile: {
    background: '#fff',
    borderRadius: 12,
    minHeight: 84,
    padding: 10,
    boxShadow: '0 1px 2px rgba(15, 23, 42, 0.08)',
    border: '1px solid #e2e8f0',
    cursor: 'pointer',
    textAlign: 'left',
    width: '100%',
    boxSizing: 'border-box',
    font: 'inherit',
  },
  tileToday: {
    border: '1px solid #2563eb',
    boxShadow: '0 0 0 2px rgba(37, 99, 235, 0.15)',
  },
  tileHead: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  dayNumber: {
    fontSize: 14,
    fontWeight: 600,
    color: '#0f172a',
  },
  dayNumberToday: {
    color: '#2563eb',
  },
  badge: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 22,
    height: 22,
    padding: '0 6px',
    borderRadius: 999,
    background: '#2563eb',
    color: '#fff',
    fontSize: 12,
    fontWeight: 700,
  },
  emptyState: {
    color: '#64748b',
    textAlign: 'center',
    padding: '12px 0',
  },
  batchRow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
    padding: '10px 0',
    borderBottom: '1px solid #e2e8f0',
  },
  batchProduct: {
    fontWeight: 600,
    color: '#0f172a',
  },
  batchQty: {
    fontSize: 13,
    color: '#64748b',
  },
  recipeBadgeOk: {
    flexShrink: 0,
    fontSize: 12,
    fontWeight: 600,
    color: '#166534',
    background: '#dcfce7',
    borderRadius: 999,
    padding: '4px 10px',
  },
  selectRecipeBtn: {
    flexShrink: 0,
    border: '1px solid #2563eb',
    background: '#fff',
    color: '#2563eb',
    fontSize: 12,
    fontWeight: 600,
    borderRadius: 999,
    padding: '4px 10px',
    cursor: 'pointer',
  },
};
