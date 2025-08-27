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
import { useDispatch, useSelector } from 'react-redux';
import { addNewAutoclaveCalendar } from '#components/redux/actions/warehouseAction.js';
import { useWarehouseContext } from '#components/contexts/WarehouseContext.js';

export default function ProductionPlannerCalendar({
  initialMonth,
  onChange,
  min = 0,
  max = 9999,
  presets = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
  weekStartsOn = 1,
}) {
  const dispatch = useDispatch();
  const { autoclave_calendar } = useWarehouseContext();

  const [currentMonth, setCurrentMonth] = useState(
    initialMonth ? startOfMonth(initialMonth) : startOfMonth(new Date())
  );
  const [internalMap, setInternalMap] = useState(() => Object.create(null));
  const [openDayISO, setOpenDayISO] = useState(null);
  const [beforeNext, setBeforeNext] = useState([]);

  const batchOutside = useSelector((state) => state.batchOutside);

  const map = internalMap;

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
    return Array.from({ length: 7 }, (_, i) => ({
      key: i, // уникальный ключ
      label: format(addDays(base, i), 'EEEEE', { locale: ru }), // видимую букву оставляем
    }));
  }, [weekStartsOn]);

  useEffect(() => {
    if (!autoclave_calendar || !Array.isArray(autoclave_calendar)) return;
    const seeded = Object.create(null);
    for (const r of autoclave_calendar) {
      const iso = String(r.date).slice(0, 10); // 'YYYY-MM-DD'
      seeded[iso] = {
        quantity: Number(r.quantity) || 0,
        quantity_of_complited: Number(r.quantity_of_complited ?? 0) || 0,
      };
    }
    if (!onChange) setInternalMap(seeded);
    onChange?.(seeded);
  }, [autoclave_calendar]);

  function toISO(d) {
    return format(d, 'yyyy-MM-dd');
  }

  function clamp(n, lo, hi) {
    const x = Number(n);
    if (!Number.isFinite(x)) return lo;
    return Math.max(lo, Math.min(hi, x));
  }

  // сеттеры значений
  function setQty(iso, qty) {
    const prev = map[iso] ?? { quantity: 0, quantity_of_complited: 0 };
    const nextQty = clamp(qty, min, max);
    // не даём "выполнено" быть больше плана
    const nextDone = clamp(prev.quantity_of_complited, min, nextQty);

    const next = {
      ...map,
      [iso]: { quantity: nextQty, quantity_of_complited: nextDone },
    };
    if (!onChange) setInternalMap(next);
    onChange?.(next);
  }

  const today = new Date();

  const saveHandler = () => {
    const arr = Object.entries(map).map(([date, obj]) => {
      const existing = autoclave_calendar.find((item) => item.date === date);

      return {
        date,
        quantity: Number(obj?.quantity) || 0,
        quantity_of_complited: existing?.quantity_of_complited ?? 0,
      };
    });

    dispatch(addNewAutoclaveCalendar(arr));
  };

  const nextHandler = (planQtyNum, doneNum, dayISO) => {
    const arr = Object.entries(map)
      .map(([date, obj]) => {
        const existing = autoclave_calendar.find((i) => i.date === date);
        return {
          date,
          quantity: Number(obj?.quantity) || 0,
          quantity_of_complited: Number(
            existing?.quantity_of_complited ?? obj?.quantity_of_complited ?? 0
          ),
        };
      })
      .sort((a, b) => a.date.localeCompare(b.date));

    const tailFromDay = arr.filter((r) => r.date >= dayISO);

    const fits = (rec) =>
      rec.quantity_of_complited === 0 ||
      rec.quantity - rec.quantity_of_complited >= doneNum;

    const searchTail = arr.filter((r) => r.date > dayISO);
    const next = searchTail.find(fits);

    const before = next ? tailFromDay.filter((r) => r.date < next.date) : [];

    const violating = before.find(
      (d) => d.quantity < planQtyNum && d.quantity_of_complited < doneNum
    );
    if (violating) {
      window.alert(`Нельзя продолжить: look at ${violating.date} `);
      return;
    }

    setBeforeNext(before);

    const beforeDates = new Set(before.map((r) => r.date));
    const rightBatchOutside = (batchOutside ?? []).filter((item) =>
      beforeDates.has(item?.date)
    );

    for (let i = 0; i < before.length; i++) {

      
    }
  };

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
        {weekDayHeaders.map(({ key, label }) => (
          <div key={key} style={{ ...styles.cell, ...styles.headerCell }}>
            {label}
          </div>
        ))}

        {days.map((day) => {
          const iso = toISO(day);
          const inMonth = isSameMonth(day, currentMonth);
          const isOpen = openDayISO === iso;
          const isPast = isBefore(day, today) && !isToday(day);

          const obj = map[iso] ?? { quantity: 0, quantity_of_complited: 0 };
          const qty = obj.quantity;
          const done = obj.quantity_of_complited;

          return (
            <div key={iso} style={{ ...styles.cell, opacity: inMonth ? 1 : 0.5 }}>
              <button
                onClick={(e) => {
                  if (isPast) return;
                  setOpenDayISO(isOpen ? null : iso);
                }}
                style={{
                  ...styles.dayBtn,
                  ...(isToday(day) ? styles.today : null),
                  ...(isOpen ? styles.active : null),
                  ...(isPast ? styles.pastDay : null),
                }}
                title={iso}
              >
                <div style={styles.dayNumber}>
                  {format(day, 'd', { locale: ru })}
                  {qty > 0 && done > 0 && (
                    <div
                      style={styles.btnNext}
                      onClick={(e) => {
                        e.stopPropagation();
                        nextHandler(qty, done, iso);
                      }}
                    >
                      next
                    </div>
                  )}
                </div>
                {qty > 0 && (
                  <div style={styles.badgePlan} title="План">
                    {qty}
                  </div>
                )}
                {done >= 0 && (
                  <div style={styles.badgeDone} title="Выполнено">
                    {done}
                  </div>
                )}
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
      <div style={styles.footer}>
        <button style={styles.saveBtn} onClick={saveHandler}>
          Save
        </button>
        <div style={styles.hint}>
          Кликните по дате, чтобы установить план/выполнение.
        </div>
      </div>
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
  dayNumber: {
    position: 'absolute',
    fontWeight: 700,
    fontSize: 16,
    color: '#1e293b',
    top: '10px',
  },
  badge: {
    width: '10%',
    fontSize: 12,
    padding: '2px 6px',
    borderRadius: 999,
    background: '#000000ff',
  },
  btnNext: {
    position: 'absolute',
    bottom: 23,
    right: '10px',
    fontSize: '18px',
    padding: '0px 5px',
    borderRadius: '1000px',
    background: 'rgba(0, 68, 255, 1)',
    color: 'rgba(255, 255, 255, 1)',
  },
  badgePlan: {
    position: 'absolute',
    bottom: 23,
    right: '10px',
    fontSize: '20px',
    padding: '0px 5px',
    borderRadius: '1000px',
    background: 'rgba(9, 255, 0, 1)',
    color: 'rgba(0, 0, 0, 1)',
  },
  badgeDone: {
    position: 'absolute',
    bottom: 23,
    right: 40,
    fontSize: '20px',
    padding: '0px 5px',
    borderRadius: 1000,
    border: '1px solid #94a3b8',
    background: '#ff0000ff',
    color: '#ffffffff',
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
  footer: { marginTop: 12, display: 'flex', gap: 12, alignItems: 'center' },
  saveBtn: {
    border: 0,
    background: '#0ea5e9',
    color: '#fff',
    borderRadius: 10,
    padding: '10px 16px',
    fontWeight: 700,
    cursor: 'pointer',
  },
  hint: { marginTop: 8, fontSize: 12, color: '#64748b' },
};
