import React, { useMemo, useState } from 'react';
import {
  addDays,
  addMonths,
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  format,
  isBefore,
  isSameMonth,
  isToday,
  parseISO,
  startOfMonth,
  startOfWeek,
  subMonths,
} from 'date-fns';
import { useSelector } from 'react-redux';
import Modal from 'react-bootstrap/Modal';
import { useRecipeContext } from '#components/contexts/RecipeContext.js';
import RawMaterialsPlan from '#components/RawMaterialsPlan/RawMaterialsPlan.jsx';
import RecipeInfoModal from '#components/Recipe/RecipeInfoModal.jsx';

const WEEK_STARTS_ON = 1;
const WEEKEND_HEADER_INDEXES = [5, 6];

export default function TechnologyCalendar() {
  const [currentMonth, setCurrentMonth] = useState(startOfMonth(new Date()));
  const [selectedDate, setSelectedDate] = useState(null);
  const [recipeBatchId, setRecipeBatchId] = useState(null);
  const [recipeModalShow, setRecipeModalShow] = useState(false);
  const [selectedRecipe, setSelectedRecipe] = useState(null);

  const batchOutside = useSelector((state) => state.batchOutside);
  const recipeOrders = useSelector((state) => state.recipeOrders);
  const lotesListBatches = useSelector((state) => state.lotesListBatches);
  const { list_of_recipes } = useRecipeContext();

  const today = new Date();

  const monthLabel = useMemo(
    () => format(currentMonth, 'LLLL yyyy'),
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
      label: format(addDays(base, i), 'EEEEEE'),
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

  const recipeStatsByDate = useMemo(() => {
    const map = new Map();
    batchesByDate.forEach((batches, iso) => {
      let recipesSet = 0;
      let recipesUndefined = 0;
      batches.forEach((batch) => {
        const order = Array.isArray(recipeOrders)
          ? recipeOrders.find((ro) => ro.id_batch === batch.id)
          : null;
        if (order && order.id_recipe != null) {
          recipesSet += 1;
        } else {
          recipesUndefined += 1;
        }
      });
      map.set(iso, { recipesSet, recipesUndefined });
    });
    return map;
  }, [batchesByDate, recipeOrders]);

  const producedBatchesByDate = useMemo(() => {
    const map = new Map();
    if (!Array.isArray(lotesListBatches)) return map;
    lotesListBatches.forEach((item) => {
      const iso = String(item?.production_date ?? '').slice(0, 10);
      if (!iso || item?.batch_id == null) return;
      if (!map.has(iso)) map.set(iso, new Map());
      const dayMap = map.get(iso);
      const key = String(item.batch_id);
      const start = Number(item.cake_id_start);
      const finish = Number(item.cake_id_finish);
      if (!dayMap.has(key)) {
        dayMap.set(key, {
          ...item,
          cake_id_start: start,
          cake_id_finish: finish,
          quantity_cakes: finish - start + 1,
        });
        return;
      }
      const existing = dayMap.get(key);
      existing.cake_id_start = Math.min(existing.cake_id_start, start);
      existing.cake_id_finish = Math.max(existing.cake_id_finish, finish);
      existing.quantity_cakes =
        existing.cake_id_finish - existing.cake_id_start + 1;
    });
    return map;
  }, [lotesListBatches]);

  const isDatePast = (date) => isBefore(date, today) && !isToday(date);

  const selectedDateIsPast = selectedDate
    ? isDatePast(parseISO(selectedDate))
    : false;

  const selectedDayBatches = selectedDate
    ? batchesByDate.get(selectedDate) || []
    : [];

  const selectedDayProducedBatches = selectedDate
    ? Array.from(producedBatchesByDate.get(selectedDate)?.values() ?? [])
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

  const getRecipeByArticle = (article) =>
    (Array.isArray(list_of_recipes) &&
      list_of_recipes.find((r) => r.article === article)) ||
    null;

  const handleRecipeClick = (recipe) => {
    if (!recipe) return;
    setSelectedRecipe(recipe);
    setRecipeModalShow(true);
  };

  return (
    <div style={styles.wrapper}>
      <style>{`
        .tc-nav-btn { transition: background-color .15s ease, color .15s ease; }
        .tc-nav-btn:hover { background: #e2e8f0; color: #0f172a; }
        .tc-tile { transition: box-shadow .15s ease, border-color .15s ease, transform .15s ease; }
        .tc-tile:hover { border-color: #cbd5e1; box-shadow: 0 8px 20px rgba(15, 23, 42, 0.08); transform: translateY(-2px); }
        .tc-recipe-btn { transition: background-color .15s ease, color .15s ease, border-color .15s ease; }
        .tc-recipe-btn:hover { background: #2563eb; border-color: #2563eb; color: #fff; }
        .tc-recipe-view-btn { transition: background-color .15s ease; }
        .tc-recipe-view-btn:hover { background: #bbf7d0; }
      `}</style>

      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>Technology Calendar</h1>
          <p style={styles.subtitle}>
            Plan recipes ahead of time and track poured batches
          </p>
        </div>

        <div style={styles.navGroup}>
          <button
            type="button"
            className="tc-nav-btn"
            style={styles.navBtn}
            onClick={() => setCurrentMonth((m) => subMonths(m, 1))}
            aria-label="Previous month"
          >
            ‹
          </button>
          <div style={styles.monthLabel}>{monthLabel}</div>
          <button
            type="button"
            className="tc-nav-btn"
            style={styles.navBtn}
            onClick={() => setCurrentMonth((m) => addMonths(m, 1))}
            aria-label="Next month"
          >
            ›
          </button>
        </div>
      </div>

      <div style={styles.grid}>
        {weekDayHeaders.map(({ key, label }) => (
          <div
            key={key}
            style={{
              ...styles.headerCell,
              ...(WEEKEND_HEADER_INDEXES.includes(key)
                ? styles.headerCellWeekend
                : null),
            }}
          >
            {label}
          </div>
        ))}

        {days.map((day) => {
          const iso = format(day, 'yyyy-MM-dd');
          const inMonth = isSameMonth(day, currentMonth);
          const isWeekend = [0, 6].includes(day.getDay());
          const isPastDay = isDatePast(day);
          const { recipesSet = 0, recipesUndefined = 0 } =
            recipeStatsByDate.get(iso) || {};
          const producedCount = producedBatchesByDate.get(iso)?.size || 0;

          return (
            <button
              type="button"
              key={iso}
              className="tc-tile"
              onClick={() => setSelectedDate(iso)}
              style={{
                ...styles.tile,
                ...(inMonth ? null : styles.tileOutside),
                ...(isToday(day) ? styles.tileToday : null),
              }}
            >
              <div style={styles.tileHead}>
                <span
                  style={{
                    ...styles.dayNumber,
                    ...(isWeekend ? styles.dayNumberWeekend : null),
                    ...(inMonth ? null : styles.dayNumberOutside),
                    ...(isToday(day) ? styles.dayNumberToday : null),
                  }}
                >
                  {format(day, 'd')}
                </span>
              </div>

              <div style={styles.tileBody}>
                {isPastDay
                  ? producedCount > 0 && (
                      <span style={styles.badgeRow}>
                        <span style={{ ...styles.dot, ...styles.dotProduced }} />
                        <span style={styles.badgeCount}>{producedCount}</span>{' '}
                        casted
                      </span>
                    )
                  : (recipesSet > 0 || recipesUndefined > 0) && (
                      <>
                        {recipesSet > 0 && (
                          <span style={styles.badgeRow}>
                            <span style={{ ...styles.dot, ...styles.dotOk }} />
                            <span style={styles.badgeCount}>{recipesSet}</span>{' '}
                            recepies set
                          </span>
                        )}
                        {recipesUndefined > 0 && (
                          <span style={styles.badgeRow}>
                            <span style={{ ...styles.dot, ...styles.dotWarn }} />
                            <span style={styles.badgeCount}>
                              {recipesUndefined}
                            </span>{' '}
                            recepies undefined
                          </span>
                        )}
                      </>
                    )}
              </div>
            </button>
          );
        })}
      </div>

      <div style={styles.legend}>
        <span style={styles.legendItem}>
          <span style={{ ...styles.dot, ...styles.dotOk }} />
          recepies set
        </span>
        <span style={styles.legendItem}>
          <span style={{ ...styles.dot, ...styles.dotWarn }} />
          recepies undefined
        </span>
        <span style={styles.legendItem}>
          <span style={{ ...styles.dot, ...styles.dotProduced }} />
          casted
        </span>
      </div>

      <Modal show={!!selectedDate} onHide={() => setSelectedDate(null)} centered>
        <Modal.Header closeButton>
          <Modal.Title style={styles.modalTitle}>
            {selectedDate && format(parseISO(selectedDate), 'MMMM d, yyyy')}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedDateIsPast ? (
            <>
              {selectedDayProducedBatches.length === 0 && (
                <div style={styles.emptyState}>
                  No batches were poured on this date.
                </div>
              )}

              {selectedDayProducedBatches.map((batch) => {
                const recipe = getRecipeByArticle(batch.recipe);
                return (
                  <div key={batch.batch_id} style={styles.batchRow}>
                    <div>
                      <div style={styles.batchProduct}>{batch.product}</div>
                      <div style={styles.batchQty}>
                        {batch.quantity_cakes} cakes
                      </div>
                    </div>
                    {recipe ? (
                      <button
                        type="button"
                        className="tc-recipe-view-btn"
                        style={styles.recipeBadgeOkBtn}
                        onClick={() => handleRecipeClick(recipe)}
                      >
                        Recipe: {batch.recipe}
                      </button>
                    ) : (
                      <span style={styles.recipeBadgeOk}>
                        Recipe: {batch.recipe}
                      </span>
                    )}
                  </div>
                );
              })}
            </>
          ) : (
            <>
              {selectedDayBatches.length === 0 && (
                <div style={styles.emptyState}>
                  No batches are planned for this date.
                </div>
              )}

              {selectedDayBatches.map((batch) => {
                const recipe = getRecipeForBatch(batch);
                return (
                  <div key={batch.id} style={styles.batchRow}>
                    <div>
                      <div style={styles.batchProduct}>
                        {batch.product_article}
                      </div>
                      <div style={styles.batchQty}>
                        {batch.quantity_pallets} pallets
                      </div>
                    </div>
                    {recipe ? (
                      <button
                        type="button"
                        className="tc-recipe-view-btn"
                        style={styles.recipeBadgeOkBtn}
                        onClick={() => handleRecipeClick(recipe)}
                      >
                        Recipe: {recipe.article}
                      </button>
                    ) : (
                      <button
                        type="button"
                        className="tc-recipe-btn"
                        style={styles.selectRecipeBtn}
                        onClick={() => setRecipeBatchId(batch.id)}
                      >
                        Select recipe
                      </button>
                    )}
                  </div>
                );
              })}
            </>
          )}
        </Modal.Body>
      </Modal>

      <Modal
        show={!!recipeBatchId}
        onHide={() => setRecipeBatchId(null)}
        fullscreen
      >
        <Modal.Header closeButton>
          <Modal.Title>Select recipe</Modal.Title>
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

      {recipeModalShow && (
        <RecipeInfoModal
          show={recipeModalShow}
          onHide={() => setRecipeModalShow(false)}
          needDeleteButton={false}
          selectedRecipe={selectedRecipe}
        />
      )}
    </div>
  );
}

const styles = {
  wrapper: {
    background: '#f8fafc',
    padding: 28,
    borderRadius: 20,
    margin: 24,
    maxWidth: 1100,
    fontFamily:
      "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 20,
    gap: 16,
    flexWrap: 'wrap',
  },
  title: {
    fontWeight: 700,
    fontSize: 22,
    color: '#0f172a',
    margin: 0,
    letterSpacing: '-0.01em',
  },
  subtitle: {
    fontSize: 13,
    color: '#64748b',
    margin: '4px 0 0',
  },
  navGroup: {
    display: 'flex',
    alignItems: 'center',
    gap: 2,
    background: '#fff',
    border: '1px solid #e2e8f0',
    borderRadius: 999,
    padding: 4,
  },
  navBtn: {
    border: 'none',
    background: 'transparent',
    color: '#475569',
    borderRadius: 999,
    width: 32,
    height: 32,
    fontSize: 18,
    lineHeight: 1,
    cursor: 'pointer',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  monthLabel: {
    fontWeight: 600,
    fontSize: 14,
    color: '#0f172a',
    minWidth: 128,
    textAlign: 'center',
    textTransform: 'capitalize',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(7, 1fr)',
    gap: 12,
  },
  headerCell: {
    textAlign: 'center',
    fontWeight: 700,
    fontSize: 11,
    letterSpacing: '0.04em',
    textTransform: 'uppercase',
    color: '#94a3b8',
    paddingBottom: 8,
  },
  headerCellWeekend: {
    color: '#cbd5e1',
  },
  tile: {
    background: '#fff',
    borderRadius: 14,
    minHeight: 132,
    padding: 12,
    display: 'flex',
    flexDirection: 'column',
    gap: 8,
    boxShadow: '0 1px 2px rgba(15, 23, 42, 0.05)',
    border: '1px solid #e2e8f0',
    cursor: 'pointer',
    textAlign: 'left',
    width: '100%',
    boxSizing: 'border-box',
    font: 'inherit',
  },
  tileOutside: {
    background: '#f8fafc',
    borderColor: '#eef2f7',
  },
  tileToday: {
    border: '1px solid #93c5fd',
    boxShadow: '0 0 0 3px rgba(37, 99, 235, 0.1)',
  },
  tileHead: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  tileBody: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    gap: 6,
  },
  dayNumber: {
    fontSize: 14,
    fontWeight: 600,
    color: '#0f172a',
  },
  dayNumberWeekend: {
    color: '#94a3b8',
  },
  dayNumberOutside: {
    color: '#cbd5e1',
  },
  dayNumberToday: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: 24,
    height: 24,
    borderRadius: 999,
    background: '#2563eb',
    color: '#fff',
  },
  badgeRow: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 6,
    fontSize: 12,
    fontWeight: 500,
    color: '#475569',
    lineHeight: 1.2,
  },
  badgeCount: {
    fontWeight: 700,
    color: '#0f172a',
  },
  dot: {
    width: 7,
    height: 7,
    minWidth: 7,
    borderRadius: '50%',
  },
  dotOk: {
    background: '#16a34a',
  },
  dotWarn: {
    background: '#d97706',
  },
  dotProduced: {
    background: '#0d9488',
  },
  legend: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: 20,
    marginTop: 18,
    paddingTop: 16,
    borderTop: '1px solid #e2e8f0',
  },
  legendItem: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 8,
    fontSize: 12,
    color: '#64748b',
    fontWeight: 500,
  },
  modalTitle: {
    fontSize: 17,
    fontWeight: 700,
    color: '#0f172a',
  },
  emptyState: {
    color: '#64748b',
    textAlign: 'center',
    padding: '12px 0',
    fontSize: 14,
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
  recipeBadgeOkBtn: {
    flexShrink: 0,
    fontSize: 12,
    fontWeight: 600,
    color: '#166534',
    background: '#dcfce7',
    borderRadius: 999,
    padding: '4px 10px',
    border: 'none',
    cursor: 'pointer',
  },
  selectRecipeBtn: {
    flexShrink: 0,
    border: '1px solid #2563eb',
    background: '#fff',
    color: '#2563eb',
    fontSize: 12,
    fontWeight: 600,
    borderRadius: 999,
    padding: '5px 12px',
    cursor: 'pointer',
  },
};
