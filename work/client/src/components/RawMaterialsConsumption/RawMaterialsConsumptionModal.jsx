import React, { Fragment, useEffect, useMemo, useState } from 'react';
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { useRecipeContext } from '#components/contexts/RecipeContext.js';
import { useDispatch } from 'react-redux';
import {
  updateRawMaterialConsumptionRawMaterialsWarehouse,
  updateRemainingStock,
} from '#components/redux/actions/warehouseAction.js';
import {
  addNewMainRawMatConsumption,
  deleteRawMatConsumption,
} from '#components/redux/actions/recipeAction.js';
import { useWarehouseContext } from '#components/contexts/WarehouseContext.js';
import { useModalContext } from '#components/contexts/ModalContext.js';
import { useProductsContext } from '#components/contexts/ProductContext.js';
import { addNewLotesList } from '#components/redux/actions/lotesListAction.js';
import Select from 'react-select';
import '#components/Styles/table.css';

const RawMaterialsConsumptionModal = React.memo(
  ({ isOpen, toggle, selectedRow }) => {
    const {
      list_of_recipes = [],
      main_raw_mat_consumption,
      lotesListCheck,
      setLotesListCheck,
    } = useRecipeContext();
    const { latestProducts } = useProductsContext();
    const { raw_materials_warehouse = [], warehouse_data } = useWarehouseContext();

    const { setMainRawMaterialConsumptionMadal } = useModalContext();
    const dispatch = useDispatch();

    const [form, setForm] = useState({});
    const [wastedMode, setWastedMode] = useState('default');
    const [confirmFlag, setConfirmFlag] = useState(false);
    const [govno, setGovno] = useState(false);
    const [selectedRecipe, setSelectedRecipe] = useState(null);
    const [availableRecipes, setAvailableRecipes] = useState([]);
    const [productionVolume, setProductionVolume] = useState('');
    const [recipeArticle, setRecipeArticle] = useState('');

    useEffect(() => {
      setAvailableRecipes([]);
      setSelectedRecipe(null);
      setForm({});
      setWastedMode('default');
      setProductionVolume('');
      setConfirmFlag(false);
      setLotesListCheck(true);
      setGovno(false);
    }, []);

    useEffect(() => {
      if (!isOpen) return;
      setRecipeArticle(selectedRow?.recipe_article ?? '');
    }, [selectedRow, isOpen]);

    const materialsMap = useMemo(
      () => [
        { label: 'Sand', key: 'sand_dry' },
        { label: 'Sand slurry (dry)', key: 'sand_slurry_dry' },
        { label: 'Lime', key: 'lime' },
        { label: 'Cement', key: 'cement' },
        { label: 'Gypsum', key: 'gypsum_dry' },
        { label: 'Return slurry (dry)', key: 'return_dry' },
        { label: 'Gypsum stone', key: 'gypsum_stone' },
        { label: 'Aluminum 1', key: 'aluminum_paste' },
        { label: 'Aluminum 2', key: 'aluminum_paste_2' },
        { label: 'Grinding Balls', key: 'grinding_balls' },
        { label: 'AAC', key: 'aac' },
      ],
      [],
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
      [],
    );

    const recipeForUI = useMemo(() => selectedRecipe || null, [selectedRecipe]);

    const resolvedRecipe = useMemo(() => {
      return wastedMode === 'from_actual'
        ? selectedRow || null
        : selectedRecipe || null;
    }, [wastedMode, selectedRecipe, selectedRow]);

    const isRecipeLocked = wastedMode === 'from_actual';
    const hasAnyRecipe =
      Boolean(selectedRecipe) || (availableRecipes?.length ?? 0) > 0;

    const onHeaderFromActual = (e) => {
      setWastedMode((prev) => (e.target.checked ? 'from_actual' : 'default'));
    };

    const onHeaderManual = (e) => {
      setWastedMode((prev) => (e.target.checked ? 'manual' : 'default'));
    };

    useEffect(() => {
      if (!isOpen) return;

      const batchArticle = selectedRow?.batch_article;

      const product =
        batchArticle &&
        latestProducts?.find((p) => String(p.article) === String(batchArticle));

      let candidateRecipes = [];

      if (product) {
        candidateRecipes = (list_of_recipes || []).filter(
          (r) =>
            r.density === product.density && r.certificate === product.certificate,
        );
      }

      if (!candidateRecipes.length) {
        candidateRecipes = list_of_recipes || [];
      }

      setAvailableRecipes(candidateRecipes);

      const fromRowArticle = selectedRow?.recipe_article;
      const matched =
        fromRowArticle &&
        candidateRecipes.find((r) => String(r.article) === String(fromRowArticle));

      if (matched) {
        setSelectedRecipe(matched);
      } else {
        setSelectedRecipe(candidateRecipes.length ? candidateRecipes[0] : null);
      }
    }, [isOpen, selectedRow, latestProducts, list_of_recipes]);

    const handleChange = (key) => (e) => {
      const v = e.target.value;
      if (v === '' || /^-?\d*\.?\d*$/.test(v)) {
        setForm((p) => ({ ...p, [key]: v }));
      }
    };

    const handlePvChange = (e) => {
      const v = e.target.value;
      if (v === '' || /^-?\d*\.?\d*$/.test(v)) setProductionVolume(v);
    };

    const pvNumber = useMemo(
      () => (productionVolume === '' ? 0 : Number(productionVolume) || 0),
      [productionVolume],
    );

    const baseByLabel = (label, key) => {
      if (!recipeForUI || !key || !(key in recipeForUI)) return '—';
      const v = recipeForUI[key];
      return typeof v === 'number' ? v : (v ?? '—');
    };

    const logByKey = (key) => {
      const logs = selectedRow?.logs;
      if (!logs || !(key in logs)) return '';
      return logs[key];
    };

    const numOrNull = (v) => {
      if (v === '' || v === null || v === undefined) return null;
      const n = Number(v);
      return Number.isFinite(n) ? n : null;
    };

    const isEmptyOrZero = (v) => {
      if (v === '' || v === null || v === undefined || v === '—') return true;
      const n = Number(v);
      return !Number.isFinite(n) || n === 0;
    };

    const computeTotalByActual = useMemo(() => {
      const t = {};
      materialsMap.forEach(({ key }) => {
        const a = Number(form[`${key}_actual_reciepe`] || 0);
        t[`${key}_total`] = pvNumber ? +(a * pvNumber).toFixed(3) : '';
      });
      return t;
    }, [form, pvNumber, materialsMap]);

    const computeWasted = (key, label) => {
      const mode = wastedMode || 'default';
      const aVal = Number(form[`${key}_actual_reciepe`] || 0);
      const baseNum = Number(recipeForUI?.[key]);
      if (mode === 'manual') {
        const raw = form[`${key}_Wasted`];
        return raw === '' ? '' : Number(raw);
      }
      if (pvNumber === 0) return '';
      if (mode === 'from_actual') return +(aVal * pvNumber).toFixed(3);
      if (!Number.isFinite(baseNum)) return '';
      return +(baseNum * pvNumber).toFixed(3);
    };

    const getRecipeVolumeInfo = () => {
      const planned = Number(selectedRow?.production_volume || 0);
      const current = Number(productionVolume || 0);

      const alreadyConsumed = (main_raw_mat_consumption || [])
        .filter((r) => String(r.recipe_article) === String(recipeArticle))
        .reduce((sum, r) => sum + Number(r.consumed_volume || 0), 0);

      const totalAfterSave = alreadyConsumed + current;
      const diff = totalAfterSave - planned;

      return {
        planned,
        alreadyConsumed,
        current,
        totalAfterSave,
        diff,
      };
    };

    const confirmProductionVolume = () => {
      const info = getRecipeVolumeInfo();

      if (!info.planned) return true;

      if (info.diff > 0) {
        return window.confirm(
          `⚠️ Превышение production volume\n\n` +
            `План: ${info.planned}\n` +
            `Уже учтено: ${info.alreadyConsumed}\n` +
            `Текущее: ${info.current}\n\n` +
            `Сверх плана: ${info.diff}\n\n` +
            `Продолжить?`,
        );
      }

      if (info.diff < 0) {
        return window.confirm(
          `ℹ️ Production volume не достигнут\n\n` +
            `План: ${info.planned}\n` +
            `Будет учтено всего: ${info.totalAfterSave}\n\n` +
            `Осталось: ${Math.abs(info.diff)}\n\n` +
            `Продолжить?`,
        );
      }

      return true;
    };

    // const shouldShowRow = (label, key) => {
    //   if (ALWAYS_VISIBLE.has(label)) return true;

    //   const base = baseByLabel(label, key);
    //   const log = logByKey(key);
    //   const aVal = numOrNull(form[`${key}_actual_reciepe`]);
    //   const wVal = numOrNull(form[`${key}_Wasted`]);
    //   const total = computeTotalByActual[`${key}_total`];
    //   const wastedCalc = computeWasted(key, label);

    //   const hasMeaningfulBase = !isEmptyOrZero(base);
    //   const hasMeaningfulLog = !isEmptyOrZero(log);
    //   const hasMeaningfulA = aVal !== null && aVal !== 0;
    //   const hasMeaningfulW = wVal !== null && wVal !== 0;
    //   const hasMeaningfulTotal = total !== '' && Number(total) !== 0;
    //   const hasMeaningfulWasted = wastedCalc !== '' && Number(wastedCalc) !== 0;

    //   return (
    //     hasMeaningfulBase ||
    //     hasMeaningfulLog ||
    //     hasMeaningfulA ||
    //     hasMeaningfulW ||
    //     hasMeaningfulTotal ||
    //     hasMeaningfulWasted
    //   );
    // };

    const shouldShowRow = (label, key) => {
      if (ALWAYS_VISIBLE.has(label)) return true;

      const base = Number(recipeForUI?.[key]);
      const log = logByKey(key);
      const aVal = numOrNull(form[`${key}_actual_reciepe`]);
      const wVal = numOrNull(form[`${key}_Wasted`]);

      const hasMeaningfulBase = !isEmptyOrZero(base);
      const hasMeaningfulLog = !isEmptyOrZero(log);
      const hasMeaningfulA = aVal !== null && aVal !== 0;
      const hasMeaningfulW = wVal !== null && wVal !== 0;

      const hasAnyRecipeLocal =
        Boolean(selectedRecipe) || (availableRecipes?.length ?? 0) > 0;

      if (!hasAnyRecipeLocal) {
        return hasMeaningfulLog || hasMeaningfulA || hasMeaningfulW;
      }

      const total = computeTotalByActual[`${key}_total`];
      const wastedCalc = computeWasted(key, label);

      const hasMeaningfulTotal = total !== '' && Number(total) !== 0;
      const hasMeaningfulWasted = wastedCalc !== '' && Number(wastedCalc) !== 0;

      return (
        hasMeaningfulBase ||
        hasMeaningfulLog ||
        hasMeaningfulA ||
        hasMeaningfulW ||
        hasMeaningfulTotal ||
        hasMeaningfulWasted
      );
    };

    const buildRecipeSnapshot = () => {
      const snapshot = {};

      materialsMap.forEach(({ key }) => {
        const actual = Number(form[`${key}_actual_reciepe`]);

        if (wastedMode !== 'default' && Number.isFinite(actual) && actual > 0) {
          snapshot[key] = +actual.toFixed(5);
        } else {
          const base = Number(resolvedRecipe?.[key]);
          snapshot[key] = Number.isFinite(base) ? +base.toFixed(5) : 0;
        }
      });

      return snapshot;
    };

    const handleSave = () => {
      const ok = confirmProductionVolume();
      if (!ok) return;

      const materials = materialsMap
        .map(({ label, key }) => {
          const w = computeWasted(key, label);
          const wasted = w === '' ? null : Number(w);
          if (wasted === null || Number.isNaN(wasted) || wasted <= 0) return null;
          return { type: label, quantity: +wasted.toFixed(3) };
        })
        .filter(Boolean);

      if (!materials.length) {
        alert('Нет данных для списания материалов.');
        return;
      }

      if (resolvedRecipe?.produced_return_dry && Number(productionVolume) > 0) {
        const producedReturn =
          resolvedRecipe.produced_return_dry * Number(productionVolume);

        if (Number.isFinite(producedReturn) && producedReturn > 0) {
          materials.push({
            type: 'Return slurry (dry)',
            quantity: +producedReturn.toFixed(2),
          });
        }
      }

      if (govno) {
        const totalConsumedRaw = materials
          .filter(
            (m) => m.type !== 'Return slurry (dry)' && m.type !== 'Return (dry)',
          )
          .reduce((sum, m) => sum + (Number(m.quantity) || 0), 0);

        if (Number.isFinite(totalConsumedRaw) && totalConsumedRaw > 0) {
          const idx = materials.findIndex(
            (m) => m.type === 'Return slurry (dry)' || m.type === 'Return (dry)',
          );

          if (idx >= 0) {
            const prev = Number(materials[idx].quantity) || 0;
            materials[idx] = {
              ...materials[idx],
              type: 'Return slurry (dry)',
              quantity: +(prev + totalConsumedRaw).toFixed(2),
            };
          } else {
            materials.push({
              type: 'Return slurry (dry)',
              quantity: +totalConsumedRaw.toFixed(2),
            });
          }
        }
      }

      const shortages = [];
      for (const { type, quantity } of materials) {
        if (type === 'Return slurry (dry)' || type === 'Return (dry)') continue;

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

      if (shortages.length) {
        const msg =
          'Невозможно списать материалы — недостаточно на складе:\n\n' +
          shortages
            .map(
              (s) =>
                `${s.type}: нужно ${s.need}, на складе ${s.have} (не хватает ${s.lack})`,
            )
            .join('\n');
        alert(msg);
        return;
      }

      const body = { materials };
      dispatch(
        addNewMainRawMatConsumption({
          ...selectedRow,
          consumed_volume: Number(productionVolume),
        }),
      );

      const productDetails = latestProducts.find(
        (product) => product.article === selectedRow?.batch_article,
      );

      const prodDescription = productDetails.description.match(
        /BAUBLOCK®\s+([^ ]+(?:\s+[^ ]+)?\s+\d*\.?\d+)/,
      );

      const recipeSnapshot = buildRecipeSnapshot();

      const new_lotestList = {
        production_date: selectedRow?.date,
        product: prodDescription[1],
        quantity_cakes: Number(productionVolume),
        custom_recipe: wastedMode !== 'default',
        recipe: selectedRow?.recipe_article,
        ...recipeSnapshot,
      };

      addProductOrder();

      dispatch(updateRawMaterialConsumptionRawMaterialsWarehouse(body));
      dispatch(addNewLotesList({ new_lotestList, lotesListCheck }));
      if (confirmFlag) dispatch(deleteRawMatConsumption({ id: selectedRow?.id }));

      setMainRawMaterialConsumptionMadal(false);
      toggle();
      setProductionVolume('');
    };

    const ddmmyyFromISO = (iso) => {
      if (!iso) return '';
      const s = String(iso).trim();
      const m = s.match(/^(\d{4})-(\d{2})-(\d{2})$/);
      if (!m) return '';
      const yyyy = m[1];
      const mm = m[2];
      const dd = m[3];
      const yy = yyyy.slice(2);
      return `${yy}${mm}${dd}`;
    };

    const ddmmyyFromWarehouseArticle = (article) => {
      const a = String(article ?? '');
      if (a.length < 11) return '';
      return a.slice(5, 11);
    };

    const addProductOrder = async () => {
      const { batch_article, date: prodDate } = selectedRow;

      const product = latestProducts.find(
        (p) => String(p.article) === String(batch_article),
      );
      if (!product) return;

      const widthInArray = Number(product.widthInArray);
      const needRaw = Number(productionVolume) * widthInArray;

      const need = Math.floor(needRaw);

      if (!Number.isFinite(need) || need <= 0) return;
      const targetDate6 = ddmmyyFromISO(prodDate);

      if (!targetDate6) {
        console.warn(
          'Bad selectedRow.date, cannot match warehouse article date:',
          prodDate,
        );
        return;
      }

      const row = (warehouse_data || []).find((w) => {
        return (
          String(w.product_article) == String(batch_article) &&
          ddmmyyFromWarehouseArticle(w.article) == targetDate6
        );
      });

      if (!row) {
        console.warn('Warehouse row not found for:', { batch_article, targetDate6 });
        return;
      }

      const free0 = Number(row.free_quantity_remaining ?? 0) || 0;
      const ordered0 = Number(row.ordered_quantity ?? 0) || 0;
      const total0 = Number(row.total_quantity) || 0;

      let remainingToDeduct = need;

      let free1 = free0;
      let ordered1 = ordered0;

      const fromFree = Math.min(free1, remainingToDeduct);
      free1 -= fromFree;
      remainingToDeduct -= fromFree;

      if (remainingToDeduct > 0) {
        const fromOrdered = Math.min(ordered1, remainingToDeduct);
        ordered1 -= fromOrdered;
        remainingToDeduct -= fromOrdered;
      }

      if (remainingToDeduct > 0) {
        console.warn('Tried to deduct more than available in warehouse row:', {
          need,
          free0,
          ordered0,
          total0,
          remainingToDeduct,
        });
      }

      const total1 = total0 - need;

      const updatedRow = {
        ...row,
        warehouse_id: row.id,
        free_quantity_remaining: free1,
        ordered_quantity: ordered1,
        total_quantity: total1,
      };

      console.log(
        'updatedRow RawMaterialsConsumptionModal.jsx line 519',
        updatedRow,
      );
      dispatch(updateRemainingStock(updatedRow));
    };

    const handleRecipeChange = (selectedOption) => {
      const found = availableRecipes.find((r) => r.id === selectedOption.value);

      setSelectedRecipe(found || null);

      setRecipeArticle(found?.article || '');
    };

    useEffect(() => {
      const recipeArticle = selectedRow?.recipe_article;
      const planned = Number(selectedRow?.production_volume || 0);

      const alreadyConsumed = (main_raw_mat_consumption || [])
        .filter((r) => String(r.recipe_article) === String(recipeArticle))
        .reduce((sum, r) => sum + Number(r.consumed_volume || 0), 0);

      const total = planned - alreadyConsumed < 0 ? 0 : planned - alreadyConsumed;
      setProductionVolume(total);
    }, [selectedRow, isOpen]);

    return (
      <div>
        <Modal isOpen={isOpen} toggle={toggle} size="xl">
          <ModalHeader toggle={toggle}>
            <div className="d-flex gap-3 w-100" style={{ alignItems: 'flex-start' }}>
              <div style={{ minWidth: 240 }}>
                <span className="text-muted d-block" style={{ fontSize: 12 }}>
                  Recipe article:
                </span>
                <b className="d-block mb-2">{recipeArticle || '—'}</b>

                <span className="text-muted d-block mb-1" style={{ fontSize: 12 }}>
                  Production volume:
                </span>
                <input
                  className="form-control"
                  inputMode="decimal"
                  placeholder="0"
                  value={productionVolume}
                  onChange={handlePvChange}
                />
              </div>
              <div style={{ flex: 1, minWidth: 280 }}>
                <span className="text-muted d-block mb-1" style={{ fontSize: 12 }}>
                  Recipe:
                </span>
                {availableRecipes.length ? (
                  <Select
                    isDisabled={isRecipeLocked}
                    onChange={handleRecipeChange}
                    options={availableRecipes.map((r) => ({
                      value: r.id,
                      label: r.article,
                    }))}
                    value={
                      selectedRecipe
                        ? {
                            value: selectedRecipe.id,
                            label: selectedRecipe.article,
                          }
                        : null
                    }
                    menuPortalTarget={
                      typeof document !== 'undefined' ? document.body : null
                    }
                    styles={{
                      control: (provided) => ({
                        ...provided,
                        width: '40%',
                        minHeight: 36,
                        backgroundColor: 'white',
                      }),
                      menu: (provided) => ({
                        ...provided,
                        maxHeight: 360,
                        zIndex: 9999,
                      }),
                      menuList: (provided) => ({
                        ...provided,
                        maxHeight: 360,
                        overflowY: 'auto',
                      }),
                      menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                    }}
                  />
                ) : (
                  <span className="text-muted">No recipes</span>
                )}
              </div>
            </div>
          </ModalHeader>

          <Fragment>
            <ModalBody style={{ overflow: 'auto', maxHeight: '70vh' }}>
              <table className="table-waste">
                <thead>
                  <tr>
                    <th className="th-raw-first">Raw material</th>
                    <th className="th-mod-recipe">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          checked={wastedMode === 'from_actual'}
                          onChange={onHeaderFromActual}
                        />
                        <label className="form-check-label">
                          use modified recipe
                        </label>
                      </div>
                    </th>
                    <th className="th-total">total</th>
                    <th className="th-from-log">from log</th>
                    <th className="th-manual">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          checked={wastedMode === 'manual'}
                          onChange={onHeaderManual}
                        />
                        <label className="form-check-label">use manual input</label>
                      </div>
                    </th>
                  </tr>
                  <tr>
                    <th className="th-raw-second">Raw material</th>
                    <th className="th-mod-recipe-sub">Modified recipe</th>
                    <th className="th-total-sub">total</th>
                    <th className="th-from-log-sub">from log</th>
                    <th className="th-wasted-sub">Consumed</th>
                  </tr>
                </thead>

                <tbody>
                  {materialsMap.map(({ label, key }) => {
                    if (!shouldShowRow(label, key)) return null;

                    const aKey = `${key}_actual_reciepe`;
                    const wKey = `${key}_Wasted`;
                    const base = baseByLabel(label, key);
                    const total = computeTotalByActual[`${key}_total`];
                    const log = logByKey(key);
                    const wastedVal = computeWasted(key, label);

                    return (
                      <tr key={key}>
                        <td>
                          <div className="fw-semibold">{label}</div>
                          <div className="text-muted-small">
                            base: {isEmptyOrZero(base) ? '' : base}
                          </div>
                        </td>

                        <td>
                          <input
                            className="form-control"
                            inputMode="decimal"
                            placeholder="0"
                            value={form[aKey] ?? ''}
                            onChange={handleChange(aKey)}
                          />
                        </td>

                        <td style={{ minWidth: 120 }}>
                          {total === '' ? '' : total}
                        </td>
                        <td style={{ minWidth: 120 }}>
                          {isEmptyOrZero(log) ? '' : log}
                        </td>

                        <td>
                          <input
                            className="form-control"
                            inputMode="decimal"
                            placeholder="0"
                            value={
                              wastedMode === 'manual'
                                ? (form[wKey] ?? '')
                                : wastedVal === ''
                                  ? ''
                                  : String(wastedVal)
                            }
                            onChange={handleChange(wKey)}
                            disabled={wastedMode !== 'manual'}
                          />
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </ModalBody>

            <ModalFooter className="d-flex justify-content-between">
              <div className="d-flex align-items-center gap-2">
                <input
                  id="confirm-checkbox"
                  className="form-check-input"
                  type="checkbox"
                  checked={confirmFlag}
                  onChange={(e) => setConfirmFlag(e.target.checked)}
                />
                <label className="form-check-label" htmlFor="confirm-checkbox">
                  Production batch completed
                </label>
              </div>
              <div className="d-flex align-items-center gap-2">
                <input
                  id="warehouse-checkbox"
                  className="form-check-input"
                  type="checkbox"
                  checked={govno}
                  onChange={(e) => setGovno(e.target.checked)}
                />
                <label className="form-check-label" htmlFor="warehouse-checkbox">
                  Govno
                </label>
              </div>
              <div className="d-flex align-items-center gap-2">
                <input
                  id="warehouse-checkbox"
                  className="form-check-input"
                  type="checkbox"
                  checked={lotesListCheck}
                  onChange={(e) => setLotesListCheck(e.target.checked)}
                />
                <label className="form-check-label" htmlFor="warehouse-checkbox">
                  New batch
                </label>
              </div>

              <div className="d-flex gap-2">
                <button className="btn btn-outline-secondary" onClick={toggle}>
                  Cancel
                </button>
                <button className="btn btn-success" onClick={handleSave}>
                  Save
                </button>
              </div>
            </ModalFooter>
          </Fragment>
        </Modal>
      </div>
    );
  },
);

export default RawMaterialsConsumptionModal;
