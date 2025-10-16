import React, { Fragment, useEffect, useMemo, useState } from 'react';
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { useRecipeContext } from '#components/contexts/RecipeContext.js';

/**
 * props:
 * - isOpen: boolean
 * - toggle: () => void
 * - selectedRow: { recipe_article, production_volume, logs? }
 * - onSave?: (payload) => void
 *
 * Как работает:
 * - Берёт первый объект из list_of_recipes (твоя структура).
 * - По materialsMap строит строки таблицы (что показывать и какой ключ брать из рецепта).
 * - Считает total = actual_reciepe * production_volume.
 * - Лог (колонка “Из лога”) — берёт selectedRow?.logs?.[key] если появится.
 */
const RawMaterialsConsumptionModal = React.memo(
  ({ isOpen, toggle, selectedRow, onSave }) => {
    const { list_of_recipes = [] } = useRecipeContext();

    // 1) Текущий рецепт-объект (у тебя в массиве length=1)
    const recipe = useMemo(
      () =>
        Array.isArray(list_of_recipes) && list_of_recipes.length
          ? list_of_recipes[0]
          : null,
      [list_of_recipes]
    );

    // 2) Маппинг “как показать → какой ключ взять из recipe”.
    //    Подгони под свои поля. Если нужно — добавь/убери элементы.
    const materialsMap = useMemo(
      () => [
        {
          label: 'Sand',
          key: recipe?.sand_dry != null ? 'sand_dry' : 'sand_slurry_dry',
        },
        { label: 'Lime', key: 'lime' },
        { label: 'Cemento', key: 'cement' }, // как на скрине “Cemento”
        { label: 'Gypsum', key: 'gypsum_dry' },
        // Если у тебя разделены “gypsum stone” и т.д. — добавь нужный ключ:
        { label: 'Gypsum stone', key: 'gypsum_stone' }, // если нет в объекте, строка просто покажет base: —
        { label: 'Aluminum 1', key: 'aluminum_paste' }, // подгони при необходимости
        { label: 'Aluminum 2', key: 'aluminum_paste_2' },
        { label: 'Grinding Balls', key: 'grinding_balls' },
        { label: 'AAC', key: 'aac' },
      ],
      [recipe]
    );

    // 3) Форма: для каждого материала храним actual и wasted.
    const [form, setForm] = useState({});
    useEffect(() => {
      if (!isOpen) return;
      const initial = {};
      materialsMap.forEach(({ label }) => {
        initial[`${label}_actual_reciepe`] = '';
        initial[`${label}_Wasted`] = '';
      });
      setForm(initial);
    }, [isOpen, materialsMap]);

    const handleChange = (key) => (e) => {
      const v = e.target.value;
      if (v === '' || /^-?\d*\.?\d*$/.test(v)) {
        setForm((p) => ({ ...p, [key]: v }));
      }
    };

    // 4) Итого по каждому материалу (actual * production_volume)
    const totals = useMemo(() => {
      const pv = Number(selectedRow?.production_volume ?? 0);
      const t = {};
      materialsMap.forEach(({ label }) => {
        const a = Number(form[`${label}_actual_reciepe`] || 0);
        t[`${label}_total`] = pv ? +(a * pv).toFixed(3) : '';
      });
      return t;
    }, [form, selectedRow, materialsMap]);

    // 5) Значение из рецепта (база “By recipe”)
    const baseByLabel = (label, key) => {
      if (!recipe || !key || !(key in recipe)) return '—';
      const v = recipe[key];
      return typeof v === 'number' ? v : v ?? '—';
    };

    // 6) Значение из лога (если появится структура с логами)
    const logByKey = (key) => {
      const logs = selectedRow?.logs;
      if (!logs || !(key in logs)) return '';
      return logs[key];
    };

    const handleSave = () => {
      const payload = {
        recipe_article: selectedRow?.recipe_article ?? null,
        production_volume: selectedRow?.production_volume ?? null,
        items: materialsMap.map(({ label, key }) => ({
          label,
          key,
          base: baseByLabel(label, key),
          actual_reciepe:
            form[`${label}_actual_reciepe`] === ''
              ? null
              : Number(form[`${label}_actual_reciepe`]),
          total:
            totals[`${label}_total`] === ''
              ? null
              : Number(totals[`${label}_total`]),
          log: logByKey(key) ?? null,
          wasted:
            form[`${label}_Wasted`] === '' ? null : Number(form[`${label}_Wasted`]),
        })),
      };
      onSave?.(payload);
      toggle?.();
    };

    return (
      <div>
        <Modal isOpen={isOpen} toggle={toggle} size="xl">
          <ModalHeader toggle={toggle}>
            <div className="d-flex flex-column gap-1">
              <div>
                <span className="text-muted">Recipe article: </span>
                <b>{selectedRow?.recipe_article ?? '—'}</b>
              </div>
              <div className="text-muted">
                Production volume: <b>{selectedRow?.production_volume ?? '—'}</b>
              </div>
            </div>
          </ModalHeader>

          <Fragment>
            <ModalBody style={{ overflow: 'auto', maxHeight: '70vh' }}>
              <table className="table w-100 align-middle">
                <thead
                  style={{
                    position: 'sticky',
                    top: 0,
                    background: '#fff',
                    zIndex: 1,
                  }}
                >
                  <tr>
                    <th style={{ minWidth: 220, background: '#fff59d' }}>
                      By recipe
                    </th>
                    <th
                      colSpan={2}
                      style={{ background: '#ffe082', textAlign: 'center' }}
                    >
                      manual input
                    </th>
                    <th style={{ background: '#c8e6c9', textAlign: 'center' }}>
                      Из лога
                    </th>
                    <th style={{ background: '#ffe082', textAlign: 'center' }}>
                      manual input
                    </th>
                  </tr>
                  <tr>
                    <th style={{ background: '#fff59d' }}>Raw material</th>
                    <th style={{ background: '#ffe082' }}>*_actual_reciepe</th>
                    <th style={{ background: '#ffe082' }}>*_total</th>
                    <th style={{ background: '#c8e6c9' }}>*_log</th>
                    <th style={{ background: '#ffe082' }}>Wasted</th>
                  </tr>
                </thead>

                <tbody>
                  {materialsMap.map(({ label, key }) => {
                    const aKey = `${label}_actual_reciepe`;
                    const wKey = `${label}_Wasted`;
                    const base = baseByLabel(label, key);
                    const total = totals[`${label}_total`];
                    const log = logByKey(key);
                    return (
                      <tr key={label}>
                        {/* 1) By recipe (название + базовое значение из рецепта) */}
                        <td>
                          <div className="fw-semibold">{label}</div>
                          <div className="text-muted" style={{ fontSize: 12 }}>
                            base: {base}
                          </div>
                        </td>

                        {/* 2) manual input — actual_reciepe */}
                        <td>
                          <label
                            className="form-label mb-1"
                            style={{ fontSize: 12 }}
                          >
                            {aKey}
                          </label>
                          <input
                            className="form-control"
                            inputMode="decimal"
                            placeholder="0"
                            value={form[aKey] ?? ''}
                            onChange={handleChange(aKey)}
                            style={{ maxWidth: 160 }}
                          />
                        </td>

                        {/* 3) manual input — total (автовычисление) */}
                        <td style={{ minWidth: 120 }}>
                          {total === '' ? '' : total}
                        </td>

                        {/* 4) Из лога */}
                        <td style={{ minWidth: 120 }}>{log ?? ''}</td>

                        {/* 5) manual input — Wasted */}
                        <td>
                          <label
                            className="form-label mb-1"
                            style={{ fontSize: 12 }}
                          >
                            Wasted
                          </label>
                          <input
                            className="form-control"
                            inputMode="decimal"
                            placeholder="0"
                            value={form[wKey] ?? ''}
                            onChange={handleChange(wKey)}
                            style={{ maxWidth: 140 }}
                          />
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </ModalBody>

            <ModalFooter>
              <button className="btn btn-outline-secondary" onClick={toggle}>
                Cancel
              </button>
              <button className="btn btn-success" onClick={handleSave}>
                Save
              </button>
            </ModalFooter>
          </Fragment>
        </Modal>
      </div>
    );
  }
);

export default RawMaterialsConsumptionModal;
