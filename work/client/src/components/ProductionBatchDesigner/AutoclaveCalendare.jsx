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
import next3 from './next3.png';
import { updateBatchOutside } from '#components/redux/actions/batchOutsideAction.js';

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

  const [openDayISO, setOpenDayISO] = useState(null);
  const [internalMap, setInternalMap] = useState(() => Object.create(null));
  const [currentMonth, setCurrentMonth] = useState(
    initialMonth ? startOfMonth(initialMonth) : startOfMonth(new Date())
  );

  const batchOutside = useSelector((state) => state.batchOutside);
  const popoverRef = useRef(null);

  const map = internalMap;

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
        scheduled_autoclaves: Number(r.scheduled_autoclaves) || 0,
        produced_autoclave: Number(r.produced_autoclave ?? 0) || 0,
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

  function toNum(v) {
    return v === '' || v === null || v === undefined
      ? 0
      : Math.max(0, Number(v) || 0);
  }

  function setQty(iso, qtyRaw) {
    const prev = map[iso] ?? { scheduled_autoclaves: 0, produced_autoclave: 0 };

    // поддержка пустой строки из инпута
    const nextQty = qtyRaw === '' ? '' : clamp(qtyRaw, min, max);

    // не даём "выполнено" быть больше плана — только если план число
    const cap =
      typeof nextQty === 'number' ? nextQty : Number(prev.scheduled_autoclaves) || 0;
    const nextDone = clamp(prev.produced_autoclave, min, cap);

    const next = {
      ...map,
      [iso]: { scheduled_autoclaves: nextQty, produced_autoclave: nextDone },
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
        scheduled_autoclaves: Number(obj?.scheduled_autoclaves) || 0,
        total_arrays: existing?.total_arrays ?? 0,
        residual_arrays: existing?.residual_arrays ?? 0,
        filled_autoclaves: existing?.filled_autoclaves ?? 0,
        produced_autoclave: existing?.produced_autoclave ?? 0,
      };
    });

    dispatch(addNewAutoclaveCalendar(arr));
  };

  function findQocVsNextQuantityViolation(corridor) {
    if (!corridor || corridor.length < 2) return null;

    let maxRequired = 0; // максимум scheduled_autoclaves впереди
    for (let i = 0; i < corridor.length - 1; i++) {
      const nextQty = Number(corridor[i + 1]?.scheduled_autoclaves) || 0;
      if (nextQty >= maxRequired) maxRequired = nextQty;

      const qoc = Number(corridor[i]?.produced_autoclave) || 0;
      if (qoc > maxRequired) {
        return {
          at: corridor[i].date,
          actual: qoc,
          needAtLeast: maxRequired,
          becauseOfDate: corridor[i + 1].date,
        };
      }
    }
    return null;
  }

  function applyToMap(entries) {
    const patch = {};
    for (const r of entries) {
      patch[r.date] = (prev) => {
        const base = prev ?? { scheduled_autoclaves: 0, produced_autoclave: 0 };
        return {
          ...base,
          // план оставляем как был в карте (если хочешь — ставь r.scheduled_autoclaves)
          scheduled_autoclaves: base.scheduled_autoclaves,
          produced_autoclave: Number(r.produced_autoclave) || 0,
        };
      };
    }

    if (typeof onChange === 'function') {
      const nextMap = { ...map };
      for (const [date, updater] of Object.entries(patch)) {
        nextMap[date] = updater(nextMap[date]);
      }
      onChange(nextMap);
    } else {
      setInternalMap((prev) => {
        const next = { ...prev };
        for (const [date, updater] of Object.entries(patch)) {
          next[date] = updater(next[date]);
        }
        return next;
      });
    }
  }

  function shiftForwardOneStepWithPlan(corridor) {
    if (!corridor || corridor.length < 2) {
      return { redistributed: corridor ?? [], transfers: [] };
    }

    // Снимок "до"
    const work = corridor.map((d) => ({
      date: d.date,
      qty: Number(d.scheduled_autoclaves) || 0,
      oldQoc: Number(d.produced_autoclave) || 0,
    }));

    const n = work.length;
    const finalQoc = Array(n).fill(0);
    const transfers = [];

    // 1) Для каждого i переносим его старый qoc к i+1 (ограничиваем планом приемника)
    for (let i = 0; i < n - 1; i++) {
      const moved = Math.min(work[i].oldQoc, work[i + 1].qty);
      // фиксируем соседний шаг i -> i+1
      if (moved > 0) {
        transfers.push({ from: work[i].date, to: work[i + 1].date, amount: moved });
      }
      // левый день теряет отданное (остаток у него пока не ставим — см. шаг 2)
      // приемник i+1 получит РОВНО moved (без сложения со своим старым)
      finalQoc[i + 1] = moved;
    }

    // 2) Левый край: у самого левого остаётся только то, что не смог отдать вправо
    const movedFromLeft = Math.min(work[0].oldQoc, work[1].qty);
    finalQoc[0] = work[0].oldQoc - movedFromLeft;

    // 3) Промежуточные дни: держат только вход с предыдущего (уже установлен в шаге 1)
    //    т.е. никакого сложения со своим старым qoc не делаем.

    // 4) Собираем результат
    const redistributed = work.map((w, idx) => ({
      date: w.date,
      scheduled_autoclaves: w.qty,
      produced_autoclave: finalQoc[idx],
    }));

    return { redistributed, transfers };
  }

  function replanRightBatchOutside(items, transfers, opts = {}) {
    const unitField = opts.unitField ?? null;

    if (
      !Array.isArray(items) ||
      !Array.isArray(transfers) ||
      transfers.length === 0
    ) {
      return items ?? [];
    }

    // 1) Копия и нормализация дат
    const out = (items ?? []).map((x) => ({
      ...x,
      date: String(x.date).slice(0, 10),
    }));
    // Сортируем батчи по дате (возрастание), чтобы индексация была стабильной
    out.sort((a, b) => a.date.localeCompare(b.date));

    // 2) Индексация по дате: Map<ISO, number[]>
    const byDate = new Map();
    for (let i = 0; i < out.length; i++) {
      const iso = out[i].date;
      if (!byDate.has(iso)) byDate.set(iso, []);
      byDate.get(iso).push(i);
    }
    const ensureBucket = (iso) => {
      if (!byDate.has(iso)) byDate.set(iso, []);
      return byDate.get(iso);
    };

    // 3) Сортируем transfers: сначала правые цели
    //    — по to (desc), при равенстве — по from (desc), затем по amount (desc) для стабильности
    const ordered = [...transfers].sort((a, b) => {
      const t = String(b.to).localeCompare(String(a.to));
      if (t !== 0) return t;
      const f = String(b.from).localeCompare(String(a.from));
      if (f !== 0) return f;
      return (Number(b.amount) || 0) - (Number(a.amount) || 0);
    });

    // малые хелперы выборки/перемещения
    const takeOneIndexFrom = (iso) => {
      const bucket = byDate.get(iso);
      if (!bucket || bucket.length === 0) return null;
      // берём с конца — дешевле модифицировать массив
      return bucket.pop();
    };
    const moveIndexTo = (idx, isoTo) => {
      out[idx] = { ...out[idx], date: isoTo };
      ensureBucket(isoTo).push(idx);
    };

    // 4) Проигрываем план переносов по шагам
    for (const { from, to, amount } of ordered) {
      let need = Math.max(0, Math.floor(Number(amount) || 0));
      if (need === 0) continue;

      if (!unitField) {
        // режим: 1 запись = 1 единица
        while (need > 0) {
          const idx = takeOneIndexFrom(from);
          if (idx == null) {
            console.warn(
              '[replanRightBatchOutside] нет записей на',
              from,
              '→',
              to,
              'осталось',
              need
            );
            break;
          }
          moveIndexTo(idx, to);
          need -= 1;
        }
      } else {
        // режим: перенос по числовому полю (запись может дробиться)
        while (need > 0) {
          const bucket = byDate.get(from);
          if (!bucket || bucket.length === 0) {
            console.warn(
              '[replanRightBatchOutside] нет записей на',
              from,
              '→',
              to,
              'осталось',
              need
            );
            break;
          }
          const idx = bucket[bucket.length - 1]; // смотрим на последнюю
          const rec = out[idx];
          const units = Math.max(0, Number(rec[unitField]) || 0);
          if (units <= 0) {
            bucket.pop(); // пустая — убираем
            continue;
          }

          const take = Math.min(need, units);
          if (take === units) {
            // переносим запись целиком
            bucket.pop();
            moveIndexTo(idx, to);
          } else {
            // дробим запись: часть остаётся, часть — переносим как новую
            out[idx] = { ...rec, [unitField]: units - take, date: from }; // остаток
            const moved = { ...rec, [unitField]: take, date: to };
            const newIdx = out.length;
            out.push(moved);
            ensureBucket(to).push(newIdx);
          }

          need -= take;
        }
      }

      // синхронизируем корзину донора (если опустела, оставим пустой массив)
      if (!byDate.has(from)) byDate.set(from, []);
    }

    // 5) В финале придержим хронологию (не обязательно, но удобно для логов/UI)
    out.sort((a, b) => a.date.localeCompare(b.date));
    return out;
  }

  const nextHandler = (planQtyNum, doneNum, dayISO) => {
    // 1) Собираем и сортируем календарь
    const arr = Object.entries(map)
      .map(([date, obj]) => {
        const existing = autoclave_calendar.find((i) => i.date === date);
        return {
          date,
          scheduled_autoclaves: Number(obj?.scheduled_autoclaves) || 0,
          produced_autoclave: Number(
            existing?.produced_autoclave ?? obj?.produced_autoclave ?? 0
          ),
        };
      })
      .sort((a, b) => a.date.localeCompare(b.date));

    // 3) Поиск ближайшего подходящего «next» (как было)
    const fits = (rec) =>
      rec.produced_autoclave === 0 ||
      rec.scheduled_autoclaves - rec.produced_autoclave >= doneNum;

    const searchTail = arr.filter((r) => r.date > dayISO);

    // берём самый дальний подходящий, а не первый
    const farthestFit = (() => {
      const candidates = searchTail.filter(fits);
      return candidates.length ? candidates[candidates.length - 1] : null;
    })();

    // если ни один день не подошёл по fits — берём самый правый из хвоста
    const next =
      farthestFit ?? (searchTail.length ? searchTail[searchTail.length - 1] : null);

    // база от выбранного дня
    const tailFromDay = arr.filter((r) => r.date >= dayISO);

    // коридор включает next ДОЛЖЕННО (<=), чтобы сдвиг дошёл до самого правого дня
    const before = next
      ? tailFromDay.filter((r) => r.date <= next.date)
      : tailFromDay;

    const corridorForCheck = before; // before уже включает next
    const qvErr = findQocVsNextQuantityViolation(corridorForCheck);
    if (qvErr) {
      window.alert(
        `Не получится перенести партию: на ${qvErr.at} выполнено ${qvErr.actual}, ` +
          `а впереди требуется минимум ${qvErr.needAtLeast} (из-за плана на ${qvErr.becauseOfDate}).`
      );
      return;
    }

    // 5) Старая проверка план/выполнено в коридоре
    const violating = before.find(
      (d) => d.scheduled_autoclaves > planQtyNum && d.produced_autoclave < doneNum
    );
    if (violating) {
      window.alert(`Нельзя продолжить: ${violating.date}`);
      return;
    }

    // 6) (опционально) правки rightBatchOutside по датам коридора
    const beforeDates = new Set(before.map((r) => r.date));
    const rightBatchOutside = (batchOutside ?? []).filter((item) =>
      beforeDates.has(item?.date)
    );

    // 7) Перераспределяем и применяем (как у нас уже сделано)
    const { redistributed, transfers } = shiftForwardOneStepWithPlan(before);
    const movedRightA = replanRightBatchOutside(rightBatchOutside, transfers);

    applyToMap(redistributed);

    movedRightA.forEach((el) => {
      dispatch(updateBatchOutside(el));
    });
    dispatch(addNewAutoclaveCalendar(redistributed));
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

          const obj = map[iso] ?? { scheduled_autoclaves: 0, produced_autoclave: 0 };

          const autoclaveData = autoclave_calendar.find((el) => el.date == iso);

          const qty = autoclaveData
            ? autoclaveData.scheduled_autoclaves
            : obj.scheduled_autoclaves;
          const done = autoclaveData
            ? autoclaveData.produced_autoclave
            : obj.produced_autoclave;
          const fill_ac = autoclaveData ? autoclaveData?.filled_autoclaves : 0;

          const todayISO = format(new Date(), 'yyyy-MM-dd'); // date-fns уже используешь
          const isPastBtn = iso < todayISO;

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
                  {
                    // qty > 0 && done > 0 &&
                    isPastBtn && fill_ac !== done && (
                      <div
                        style={styles.btnNext}
                        onClick={(e) => {
                          e.stopPropagation();
                          nextHandler(qty, done, iso);
                        }}
                      >
                        <img
                          src={next3}
                          alt="next3"
                          style={{ width: '30px', height: '30px' }}
                        />
                      </div>
                    )
                  }
                </div>
                {(() => {
                  const scheduled = toNum(qty);
                  const filled = toNum(done);

                  const batchOutsideForDay = Array.isArray(batchOutside)
                    ? batchOutside.filter((item) => item?.date === iso)
                    : [];

                  const showProducedAutoclave =
                    fill_ac > 0 && batchOutsideForDay.length === 0;

                  const producedMode =
                    showProducedAutoclave && filled === scheduled && filled > 0;
                  const showInitialZero = scheduled === 0 && filled === 0;

                  if (showInitialZero) {
                    return (
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          paddingBottom: 8,
                        }}
                      >
                        <span
                          style={{
                            minWidth: 26,
                            height: 26,
                            borderRadius: 999,
                            display: 'inline-flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontWeight: 700,
                            fontSize: 12,
                            color: '#0f172a',
                            background: '#fecaca',
                            boxShadow: 'inset 0 0 0 1px rgba(0,0,0,.05)',
                          }}
                        >
                          0
                        </span>
                      </div>
                    );
                  }

                  if (producedMode) {
                    // Produced autoclaves (кружок #5aaccce6)
                    return (
                      <div
                        style={{
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          gap: 6,
                          padding: '4px 0 8px',
                        }}
                      >
                        <div
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: 8,
                            width: '100%',
                          }}
                        >
                          <span style={{ fontSize: 12, color: '#475569' }}>
                            Produced autoclaves
                          </span>
                          <span
                            style={{
                              minWidth: 26,
                              height: 26,
                              borderRadius: 999,
                              display: 'inline-flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontWeight: 700,
                              fontSize: 12,
                              color: '#0f172a',
                              background: '#5aaccce6',
                              boxShadow: 'inset 0 0 0 1px rgba(0,0,0,.05)',
                            }}
                          >
                            {filled}
                          </span>
                        </div>
                      </div>
                    );
                  }

                  // Обычный режим: сверху Filled (зелёный), по центру линия 50%, снизу Scheduled (красный)
                  return (
                    <div
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: 6,
                        padding: '4px 0 8px',
                      }}
                    >
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: 8,
                          width: '100%',
                        }}
                      >
                        <span style={{ fontSize: 12, color: '#475569' }}>
                          Filled autoclaves
                        </span>
                        <span
                          style={{
                            minWidth: 26,
                            height: 26,
                            borderRadius: 999,
                            display: 'inline-flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontWeight: 700,
                            fontSize: 12,
                            color: '#0f172a',
                            background: '#9ae6b4',
                            boxShadow: 'inset 0 0 0 1px rgba(0,0,0,.05)',
                          }}
                        >
                          {filled}
                        </span>
                      </div>

                      <div
                        style={{
                          width: '50%',
                          height: 0,
                          borderTop: '2px solid #e2e8f0',
                        }}
                      />

                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: 8,
                          width: '100%',
                        }}
                      >
                        <span style={{ fontSize: 12, color: '#475569' }}>
                          Scheduled autoclaves
                        </span>
                        <span
                          style={{
                            minWidth: 26,
                            height: 26,
                            borderRadius: 999,
                            display: 'inline-flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontWeight: 700,
                            fontSize: 12,
                            color: '#0f172a',
                            background: '#fecaca',
                            boxShadow: 'inset 0 0 0 1px rgba(0,0,0,.05)',
                          }}
                        >
                          {scheduled}
                        </span>
                      </div>
                    </div>
                  );
                })()}
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
                    <input
                      type="number"
                      inputMode="numeric"
                      min={0}
                      value={qty === 0 ? '' : qty}
                      placeholder="0"
                      onChange={(e) => setQty(iso, e.target.value)}
                      style={styles.input}
                    />
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
        <div style={styles.legend}>
          <span style={styles.legendItem}>
            <span style={{ ...styles.legendDot, ...styles.dotRed }} /> Scheduled
            autoclaves
          </span>
          <span style={styles.legendItem}>
            <span style={{ ...styles.legendDot, ...styles.dotGreen }} /> Filled
            autoclaves
          </span>
          <span style={styles.legendItem}>
            <span style={{ ...styles.legendDot, ...styles.dotGray }} /> Prduced
            autoclaves
          </span>
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
    right: '-10px',
    fontSize: '18px',
    padding: '0px 5px',
    borderRadius: '1000px',
    background: 'rgba(0, 68, 255, 0)',
    color: 'rgba(255, 255, 255, 1)',
  },
  badgePlan: {
    position: 'absolute',
    bottom: 23,
    right: '10px',
    fontSize: '20px',
    padding: '0px 5px',
    borderRadius: '1000px',
    background: '#ff0000ff',
    color: 'rgba(255, 255, 255, 1)',
  },
  badgeDone: {
    position: 'absolute',
    bottom: 23,
    right: 40,
    fontSize: '20px',
    padding: '0px 5px',
    borderRadius: 1000,
    border: '1px solid #94a3b8',
    background: 'rgba(9, 255, 0, 1)',
    color: '#000000ff',
  },
  badgeFinish: {
    position: 'absolute',
    bottom: 23,
    right: 40,
    fontSize: '20px',
    padding: '0px 5px',
    borderRadius: 1000,
    border: '1px solid #94a3b8',
    background: '#5aaccce6',
    color: '#000000ff',
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
  legend: { display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' },
  legendItem: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 6,
    color: '#475569',
    fontSize: 13,
  },
  legendDot: { width: 10, height: 10, borderRadius: '50%', display: 'inline-block' },
  dotRed: { background: 'rgb(254, 202, 202)' }, // как badgePlan
  dotGreen: { background: 'rgba(9, 255, 0, 1)' }, // как badgeDone
  dotGray: { background: '#5aaccce6' }, // «не активен»/прошедший/вне месяца
};
