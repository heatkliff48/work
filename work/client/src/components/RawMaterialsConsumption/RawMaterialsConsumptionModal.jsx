import React, { Fragment, useEffect, useMemo, useState } from 'react';
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { useRecipeContext } from '#components/contexts/RecipeContext.js';
import { useDispatch } from 'react-redux';
import { updateRawMaterialConsumptionRawMaterialsWarehouse } from '#components/redux/actions/warehouseAction.js';
import { deleteRawMatConsumption } from '#components/redux/actions/recipeAction.js';
import { useWarehouseContext } from '#components/contexts/WarehouseContext.js';

const RawMaterialsConsumptionModal = React.memo(
  ({ isOpen, toggle, selectedRow }) => {
    const { list_of_recipes = [] } = useRecipeContext();
    const { raw_materials_warehouse = [] } = useWarehouseContext();
    const dispatch = useDispatch();

    const recipe = useMemo(
      () =>
        Array.isArray(list_of_recipes) && list_of_recipes.length
          ? list_of_recipes[0]
          : null,
      [list_of_recipes]
    );

    const materialsMap = useMemo(
      () => [
        { label: 'Sand', key: 'sand_dry' },
        { label: 'Sand slurry (dry)', key: 'sand_slurry_dry' },
        { label: 'Lime', key: 'lime' },
        { label: 'Cement', key: 'cement' },
        { label: 'Gypsum', key: 'gypsum_dry' },
        { label: 'Gypsum stone', key: 'gypsum_stone' },
        { label: 'Aluminum 1', key: 'aluminum_paste' },
        { label: 'Aluminum 2', key: 'aluminum_paste_2' },
        { label: 'Grinding Balls', key: 'grinding_balls' },
        { label: 'AAC', key: 'aac' },
      ],
      [recipe]
    );

    const warehouseByType = React.useMemo(() => {
      const map = new Map();
      (raw_materials_warehouse || []).forEach((row) => {
        const type = String(row?.material_type ?? '').trim();
        const qty = Number(row?.remaining_quantity ?? 0) || 0;
        if (type) map.set(type, qty);
      });
      return map;
    }, [raw_materials_warehouse]);

    const ALWAYS_VISIBLE = useMemo(
      () => new Set(['Aluminum 1', 'Aluminum 2', 'Grinding Balls', 'AAC']),
      []
    );

    const [form, setForm] = useState({});
    useEffect(() => {
      if (!isOpen) return;
      const initial = {};
      materialsMap.forEach(({ key }) => {
        initial[`${key}_actual_reciepe`] = '';
        initial[`${key}_Wasted`] = '';
      });
      setForm(initial);
    }, [isOpen, materialsMap]);

    const handleChange = (key) => (e) => {
      const v = e.target.value;
      if (v === '' || /^-?\d*\.?\d*$/.test(v)) {
        setForm((p) => ({ ...p, [key]: v }));
      }
    };

    const totals = useMemo(() => {
      const pv = Number(selectedRow?.production_volume ?? 0);
      const t = {};
      materialsMap.forEach(({ key }) => {
        const a = Number(form[`${key}_actual_reciepe`] || 0);
        t[`${key}_total`] = pv ? +(a * pv).toFixed(3) : '';
      });
      return t;
    }, [form, selectedRow, materialsMap]);

    const baseByLabel = (label, key) => {
      if (!recipe || !key || !(key in recipe)) return '—';
      const v = recipe[key];
      return typeof v === 'number' ? v : v ?? '—';
    };

    const logByKey = (key) => {
      const logs = selectedRow?.logs;
      if (!logs || !(key in logs)) return '';
      return logs[key];
    };

    // helpers для проверки "пусто или 0"
    const numOrNull = (v) => {
      if (v === '' || v === null || v === undefined) return null;
      const n = Number(v);
      return Number.isFinite(n) ? n : null;
    };

    const isEmptyOrZero = (v) => {
      // строка '—' из base считаем пустым
      if (v === '' || v === null || v === undefined || v === '—') return true;
      const n = Number(v);
      return !Number.isFinite(n) || n === 0;
    };

    const shouldShowRow = (label, key) => {
      if (ALWAYS_VISIBLE.has(label)) return true;

      const base = baseByLabel(label, key);
      const log = logByKey(key);
      const aVal = numOrNull(form[`${key}_actual_reciepe`]);
      const wVal = numOrNull(form[`${key}_Wasted`]);
      const total = totals[`${key}_total`];

      // показываем, если есть что-то осмысленное: не пусто и не 0
      const hasMeaningfulBase = !isEmptyOrZero(base);
      const hasMeaningfulLog = !isEmptyOrZero(log);
      const hasMeaningfulA = aVal !== null && aVal !== 0;
      const hasMeaningfulW = wVal !== null && wVal !== 0;
      const hasMeaningfulTotal =
        total !== '' && Number.isFinite(Number(total)) && Number(total) !== 0;

      return (
        hasMeaningfulBase ||
        hasMeaningfulLog ||
        hasMeaningfulA ||
        hasMeaningfulW ||
        hasMeaningfulTotal
      );
    };

    // const handleSave = () => {
    //   const materials = materialsMap
    //     .map(({ label, key }) => {
    //       const raw = form[`${key}_Wasted`];
    //       const wasted =
    //         raw === '' || raw === null || raw === undefined ? null : Number(raw);

    //       if (wasted === null || Number.isNaN(wasted)) return null;

    //       return { type: label, quantity: wasted };
    //     })
    //     .filter(Boolean);

    //   const body = { materials };

    //   dispatch(updateRawMaterialConsumptionRawMaterialsWarehouse(body));
    //   dispatch(deleteRawMatConsumption({ id: selectedRow?.id }));
    //   toggle?.();
    // };

    // 2) обновлённый handleSave с проверкой наличия материалов
    const handleSave = () => {
      // Собираем только введённые пользователем значения "Wasted"
      const materials = materialsMap
        .map(({ label, key }) => {
          const raw = form[`${key}_Wasted`];
          const wasted =
            raw === '' || raw === null || raw === undefined ? null : Number(raw);
          if (wasted === null || Number.isNaN(wasted) || wasted <= 0) return null;
          return { type: label, quantity: wasted };
        })
        .filter(Boolean);

      // Если нечего списывать — просто выходим (можно показать уведомление, если нужно)
      if (!materials.length) {
        alert('Нет данных для списания материалов.');
        return;
      }

      // Проверяем наличие на складе
      const shortages = [];
      for (const { type, quantity } of materials) {
        const have = warehouseByType.get(type) ?? 0;
        if (quantity > have) {
          shortages.push({
            type,
            need: +Number(quantity).toFixed(3),
            have: +Number(have).toFixed(3),
            lack: +Number(quantity - have).toFixed(3),
          });
        }
      }

      // Если есть дефицит — предупреждаем и НИЧЕГО не отправляем
      if (shortages.length) {
        const msg =
          'Невозможно списать материалы — недостаточно на складе:\n\n' +
          shortages
            .map(
              (s) =>
                `${s.type}: нужно ${s.need}, на складе ${s.have} (не хватает ${s.lack})`
            )
            .join('\n');
        alert(msg);
        return;
      }

      // Всё ок — отправляем на списание
      const body = { materials };
      console.log('body', body);
      // dispatch(updateRawMaterialConsumptionRawMaterialsWarehouse(body));
      // dispatch(deleteRawMatConsumption({ id: selectedRow?.id }));
      // toggle?.();
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
                    if (!shouldShowRow(label, key)) return null;

                    const aKey = `${key}_actual_reciepe`;
                    const wKey = `${key}_Wasted`;
                    const base = baseByLabel(label, key);
                    const total = totals[`${key}_total`];
                    const log = logByKey(key);

                    return (
                      <tr key={key}>
                        <td>
                          <div className="fw-semibold">{label}</div>
                          <div className="text-muted" style={{ fontSize: 12 }}>
                            base: {isEmptyOrZero(base) ? '' : base}
                          </div>
                        </td>

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

                        <td style={{ minWidth: 120 }}>
                          {total === '' ? '' : total}
                        </td>

                        <td style={{ minWidth: 120 }}>
                          {isEmptyOrZero(log) ? '' : log}
                        </td>

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
