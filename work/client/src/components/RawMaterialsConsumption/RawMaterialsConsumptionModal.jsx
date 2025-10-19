import React, { Fragment, useEffect, useMemo, useState } from 'react';
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { useRecipeContext } from '#components/contexts/RecipeContext.js';

const RawMaterialsConsumptionModal = React.memo(
  ({ isOpen, toggle, selectedRow, onSave }) => {
    const { list_of_recipes = [] } = useRecipeContext();

    const recipe = useMemo(
      () =>
        Array.isArray(list_of_recipes) && list_of_recipes.length
          ? list_of_recipes[0]
          : null,
      [list_of_recipes]
    );

    const materialsMap = useMemo(
      () => [
        {
          label: 'Sand',
          key: 'sand_dry',
        },
        {
          label: 'Sand slurry dry',
          key: 'sand_slurry_dry',
        },
        { label: 'Lime', key: 'lime' },
        { label: 'Cemento', key: 'cement' },
        { label: 'Gypsum', key: 'gypsum_dry' },
        { label: 'Gypsum stone', key: 'gypsum_stone' },
        { label: 'Aluminum 1', key: 'aluminum_paste' },
        { label: 'Aluminum 2', key: 'aluminum_paste_2' },
        { label: 'Grinding Balls', key: 'grinding_balls' },
        { label: 'AAC', key: 'aac' },
      ],
      [recipe]
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

    const handleSave = () => {
      const payload = {
        recipe_article: selectedRow?.recipe_article ?? null,
        production_volume: selectedRow?.production_volume ?? null,
        items: materialsMap.map(({ label, key }) => ({
          label,
          key,
          base: baseByLabel(label, key),
          actual_reciepe:
            form[`${key}_actual_reciepe`] === ''
              ? null
              : Number(form[`${key}_actual_reciepe`]),
          total:
            totals[`${key}_total`] === '' ? null : Number(totals[`${key}_total`]),
          log: logByKey(key) ?? null,
          wasted:
            form[`${key}_Wasted`] === '' ? null : Number(form[`${key}_Wasted`]),
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
                            base: {base}
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
