import React, { Fragment, useEffect, useMemo, useState } from 'react';
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { useRecipeContext } from '#components/contexts/RecipeContext.js';

// props:
// isOpen: bool
// toggle: () => void
// selectedRow: { recipe_article, production_volume }
// onSave?: (payload) => void
const RawMaterialsConsumptionModal = React.memo(
  ({ isOpen, toggle, selectedRow, onSave }) => {
    const { raw_materials_warehouse = [] } = useRecipeContext();
    // form: { "<Material>_actual_reciepe": "12.3", "<Material>_Wasted": "1.1", ... }
    const [form, setForm] = useState({});

    useEffect(() => {
      if (!isOpen) return;
      // инициализируем при открытии
      const initial = {};
      raw_materials_warehouse.forEach(([name]) => {
        initial[`${name}_actual_reciepe`] = '';
        initial[`${name}_Wasted`] = '';
      });
      setForm(initial);
    }, [isOpen]);

    const handleChange = (key) => (e) => {
      const v = e.target.value;
      if (v === '' || /^-?\d*\.?\d*$/.test(v)) {
        setForm((p) => ({ ...p, [key]: v }));
      }
    };

    const totals = useMemo(() => {
      const pv = Number(selectedRow?.production_volume ?? 0);
      const t = {};
      raw_materials_warehouse.forEach(([name]) => {
        const a = Number(form[`${name}_actual_reciepe`] || 0);
        t[`${name}_total`] = pv ? a * pv : '';
      });
      return t;
    }, [form, selectedRow, raw_materials_warehouse]);

    const handleSave = () => {
      const payload = {
        recipe_article: selectedRow?.recipe_article,
        production_volume: selectedRow?.production_volume,
        items: raw_materials_warehouse.map(([name, base]) => ({
          material: name,
          base,
          actual_reciepe:
            form[`${name}_actual_reciepe`] === ''
              ? null
              : Number(form[`${name}_actual_reciepe`]),
          total:
            totals[`${name}_total`] === '' ? null : Number(totals[`${name}_total`]),
          log: null, // по ТЗ пока пусто
          wasted:
            form[`${name}_Wasted`] === '' ? null : Number(form[`${name}_Wasted`]),
        })),
      };
      onSave?.(payload);
      toggle(); // закрываем
    };
    console.log('raw_materials_warehouse', raw_materials_warehouse);
    return (
      <div>
        <Modal isOpen={isOpen} toggle={toggle} size="xl">
          <ModalHeader toggle={toggle}>
            <div className="flex flex-col gap-0.5">
              <div>
                <span className="text-sm text-gray-500">Recipe article: </span>
                <span className="font-semibold">
                  {selectedRow?.recipe_article ?? '—'}
                </span>
              </div>
              <div className="text-sm text-gray-600">
                Production volume: <b>{selectedRow?.production_volume ?? '—'}</b>
              </div>
            </div>
          </ModalHeader>

          <Fragment>
            <ModalBody style={{ overflow: 'auto', maxHeight: '70vh' }}>
              <table className="w-100 table">
                <thead
                  style={{
                    position: 'sticky',
                    top: 0,
                    background: '#fff',
                    zIndex: 1,
                  }}
                >
                  <tr>
                    <th style={{ minWidth: 220 }}>Raw material</th>
                    <th>actual_reciepe</th>
                    <th>total</th>
                    <th>log</th>
                    <th>Wasted</th>
                  </tr>
                </thead>
                <tbody>
                  {raw_materials_warehouse.map(([name, base]) => {
                    console.log('name', name);
                    console.log('base', base);
                    const aKey = `${name}_actual_reciepe`;
                    const wKey = `${name}_Wasted`;
                    return (
                      <tr key={name}>
                        {/* 1. материал из склада */}
                        <td>
                          <div className="fw-medium">{name}</div>
                          {typeof base !== 'undefined' && (
                            <div className="text-muted" style={{ fontSize: 12 }}>
                              base: {base}
                            </div>
                          )}
                        </td>

                        {/* 2. ввод actual_reciepe */}
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

                        {/* 3. total = actual * production_volume */}
                        <td>
                          {totals[`${name}_total`] === ''
                            ? ''
                            : totals[`${name}_total`]}
                        </td>

                        {/* 4. log — пусто */}
                        <td />

                        {/* 5. Wasted — ввод */}
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
