import React, { useMemo, useState, useEffect, useRef } from 'react';
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
  startOfMonth,
  startOfWeek,
  subMonths,
} from 'date-fns';
import { ru } from 'date-fns/locale';

export default function ProductionPlannerCalendar({
  initialMonth,
  value,
  onChange,
  min = 0,
  max = 9999,
  presets = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
  weekStartsOn = 1,
}) {
  const [currentMonth, setCurrentMonth] = useState(
    initialMonth ? startOfMonth(initialMonth) : startOfMonth(new Date())
  );

  const [internalMap, setInternalMap] = useState(() => Object.create(null));
  const map = value ?? internalMap;

  const [openDayISO, setOpenDayISO] = useState(null);

  const popoverRef = useRef(null);
  useEffect(() => {
    function handleClickOutside(e) {
      if (popoverRef.current && !popoverRef.current.contains(e.target)) {
        setOpenDayISO(null);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const monthLabel = useMemo(
    () => format(currentMonth, 'LLLL yyyy', { locale: ru }),
    [currentMonth]
  );

  const days = useMemo(() => {
    const start = startOfWeek(startOfMonth(currentMonth), { weekStartsOn });
    const end = endOfWeek(endOfMonth(currentMonth), { weekStartsOn });
    return eachDayOfInterval({ start, end });
  }, [currentMonth, weekStartsOn]);

  const weekDayHeaders = useMemo(() => {
    const base = startOfWeek(new Date(), { weekStartsOn });
    return Array.from({ length: 7 }, (_, i) =>
      format(addDays(base, i), 'EEEEE', { locale: ru })
    );
  }, [weekStartsOn]);

  function toISO(d) {
    return format(d, 'yyyy-MM-dd');
  }

  function setQty(iso, qty) {
    const clamped = Math.max(min, Math.min(max, Number(qty) || 0));
    const next = { ...map, [iso]: clamped };
    if (!Number.isFinite(clamped)) return;
    if (!onChange) setInternalMap(next);
    onChange?.(next);
  }

  const today = new Date();

  return (
    <div style={styles.wrapper}>
      <div style={styles.header}>
        <button
          style={styles.navBtn}
          onClick={() => setCurrentMonth((m) => subMonths(m, 1))}
        >
          ←
        </button>
        <div style={styles.monthLabel}>{monthLabel}</div>
        <button
          style={styles.navBtn}
          onClick={() => setCurrentMonth((m) => addMonths(m, 1))}
        >
          →
        </button>
      </div>

      <div style={styles.grid}>
        {weekDayHeaders.map((wd) => (
          <div key={wd} style={{ ...styles.cell, ...styles.headerCell }}>
            {wd}
          </div>
        ))}

        {days.map((day) => {
          const iso = toISO(day);
          const qty = map[iso] ?? 0;
          const inMonth = isSameMonth(day, currentMonth);
          const isOpen = openDayISO === iso;
          const isPast = isBefore(day, today) && !isToday(day);

          return (
            <div key={iso} style={{ ...styles.cell, opacity: inMonth ? 1 : 0.5 }}>
              <button
                onClick={() => setOpenDayISO(isOpen ? null : iso)}
                style={{
                  ...styles.dayBtn,
                  ...(isToday(day) ? styles.today : null),
                  ...(isOpen ? styles.active : null),
                  ...(isPast ? styles.pastDay : null),
                }}
                disabled={isPast}
              >
                <div style={styles.dayNumber}>
                  {format(day, 'd', { locale: ru })}
                </div>
                {qty > 0 && <div style={styles.badge}>{qty}</div>}
              </button>

              {isOpen && (
                <div ref={popoverRef} style={styles.popover}>
                  <div style={styles.popHeader}>
                    <div>{format(day, 'd MMMM, EEEE', { locale: ru })}</div>
                    <button
                      style={styles.closeBtn}
                      onClick={() => setOpenDayISO(null)}
                    >
                      ✕
                    </button>
                  </div>
                  <div style={styles.row}>
                    <label style={styles.label}>Количество:</label>
                    <input type="number" value={qty} style={styles.input} />
                  </div>
                  <div style={{ ...styles.row, gap: 6, flexWrap: 'wrap' }}>
                    {presets.map((p, idx) => (
                      <button
                        key={`${iso}-preset-${idx}`}
                        style={styles.pill}
                        onClick={() => setQty(iso, p)}
                      >
                        {p}
                      </button>
                    ))}
                  </div>
                  <div style={{ ...styles.row, gap: 6, justifyContent: 'flex-end' }}>
                    <button
                      style={styles.primaryBtn}
                      onClick={() => setOpenDayISO(null)}
                    >
                      Готово
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
      <div style={styles.hint}>Кликните по дате, чтобы установить план на день.</div>
    </div>
  );
}

const styles = {
  wrapper: { background: '#f8fafc', padding: 24, borderRadius: 16, margin: 24 },
  header: { display: 'flex', justifyContent: 'space-between', marginBottom: 12 },
  navBtn: {
    border: '1px solid #cbd5e1',
    background: '#e2e8f0',
    color: '#1e293b',
    borderRadius: 8,
    padding: '6px 10px',
    fontWeight: 600,
  },
  monthLabel: { fontWeight: 700, fontSize: 20, textTransform: 'capitalize' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 8 },
  cell: {
    background: '#ffffff',
    border: '1px solid #e2e8f0',
    borderRadius: 12,
    minHeight: 80,
    position: 'relative',
  },
  headerCell: {
    background: '#f1f5f9',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  dayBtn: {
    width: '100%',
    height: '100%',
    border: 0,
    background: 'transparent',
    textAlign: 'left',
    padding: 8,
    position: 'relative',
    cursor: 'pointer',
  },
  today: { outline: '2px solid #93c5fd' },
  active: { boxShadow: 'inset 0 0 0 2px #2563eb' },
  pastDay: { cursor: 'not-allowed', color: '#94a3b8' },
  dayNumber: { fontWeight: 700, fontSize: 16, color: '#1e293b' },
  badge: {
    width: '10%',
    fontSize: 12,
    padding: '2px 6px',
    borderRadius: 999,
    background: '#000000ff',
  },
  popover: {
    position: 'absolute',
    zIndex: 1000,
    top: 8,
    left: 8,
    right: 8,
    background: '#fff',
    border: '1px solid #cbd5e1',
    borderRadius: 12,
    padding: 12,
  },
  popHeader: { display: 'flex', justifyContent: 'space-between', marginBottom: 8 },
  closeBtn: { border: 0, background: 'transparent', cursor: 'pointer' },
  row: { display: 'flex', gap: 8, marginTop: 8 },
  label: { width: 100, color: '#1e293b', fontWeight: 500, fontSize: 15 },
  input: {
    width: '0%',
    flex: 1,
    border: '1px solid #94a3b8',
    background: '#e2e8f0',
    color: '#1e293b',
    borderRadius: 8,
    padding: '4px 8px',
  },

  pill: {
    border: '1px solid #94a3b8',
    borderRadius: 999,
    padding: '4px 8px',
    background: '#e2e8f0',
    color: '#1e293b',
    cursor: 'pointer',
  },
  primaryBtn: {
    border: 0,
    background: '#2563eb',
    color: '#fff',
    borderRadius: 8,
    padding: '6px 12px',
    fontWeight: 600,
    cursor: 'pointer',
  },
  hint: { marginTop: 8, fontSize: 12, color: '#64748b' },
};
