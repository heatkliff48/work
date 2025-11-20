import React, { Fragment, useEffect, useMemo, useState } from "react";
import { Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import { useRecipeContext } from "#components/contexts/RecipeContext.js";
import { useDispatch } from "react-redux";
import {
  addNewWarehouse,
  updateRawMaterialConsumptionRawMaterialsWarehouse,
  updListOfOrderedProduction,
} from "#components/redux/actions/warehouseAction.js";
import {
  addNewMainRawMatConsumption,
  deleteRawMatConsumption,
} from "#components/redux/actions/recipeAction.js";
import { useWarehouseContext } from "#components/contexts/WarehouseContext.js";
import { useModalContext } from "#components/contexts/ModalContext.js";
import { useProductsContext } from "#components/contexts/ProductContext.js";
import { addNewLotesList } from "#components/redux/actions/lotesListAction.js";
import Select from "react-select";
import "#components/Styles/table.css";

const RawMaterialsConsumptionModal = React.memo(
  ({ isOpen, toggle, selectedRow }) => {
    const { list_of_recipes = [], main_raw_mat_consumption } =
      useRecipeContext();
    const { latestProducts } = useProductsContext();
    const {
      raw_materials_warehouse = [],
      list_of_ordered_production,
      getWarehouseArticle,
    } = useWarehouseContext();

    const { setMainRawMaterialConsumptionMadal } = useModalContext();
    const dispatch = useDispatch();

    // -----------------------------
    // 1. Состояние для рецептов (то, чего не хватало)
    // -----------------------------
    const [availableRecipes, setAvailableRecipes] = useState([]);
    const [selectedRecipe, setSelectedRecipe] = useState(null);

    // когда модалка открылась или поменялась строка, готовим список рецептов под её продукт
    useEffect(() => {
      if (!isOpen) return;

      // по строке находим продукт
      const batchArticle = selectedRow?.batch_article;
      const product =
        batchArticle &&
        latestProducts?.find((p) => String(p.article) === String(batchArticle));

      let candidateRecipes = [];

      if (product) {
        // как в RawMaterialsPlan: по плотности и сертификату
        candidateRecipes = (list_of_recipes || []).filter(
          (r) =>
            r.density === product.density &&
            r.certificate === product.certificate
        );
      }

      // если по продукту ничего не нашли — подстраховка: все рецепты
      if (!candidateRecipes.length) {
        candidateRecipes = list_of_recipes || [];
      }

      setAvailableRecipes(candidateRecipes);
      setSelectedRecipe(candidateRecipes.length ? candidateRecipes[0] : null);
    }, [isOpen, selectedRow, latestProducts, list_of_recipes]);

    // -----------------------------
    // Дальше всё то же, что у тебя было, только завязано на selectedRecipe
    // -----------------------------

    const materialsMap = useMemo(
      () => [
        { label: "Sand", key: "sand_dry" },
        { label: "Sand slurry (dry)", key: "sand_slurry_dry" },
        { label: "Lime", key: "lime" },
        { label: "Cement", key: "cement" },
        { label: "Gypsum", key: "gypsum_dry" },
        { label: "Gypsum stone", key: "gypsum_stone" },
        { label: "Aluminum 1", key: "aluminum_paste" },
        { label: "Aluminum 2", key: "aluminum_paste_2" },
        { label: "Grinding Balls", key: "grinding_balls" },
        { label: "AAC", key: "aac" },
      ],
      []
    );

    const warehouseByType = React.useMemo(() => {
      const map = new Map();
      (raw_materials_warehouse || []).forEach((row) => {
        const type = String(row?.material_type ?? "").trim();
        const qty = Number(row?.remaining_quantity ?? 0) || 0;
        if (type) map.set(type, qty);
      });
      return map;
    }, [raw_materials_warehouse]);

    const ALWAYS_VISIBLE = useMemo(
      () => new Set(["Aluminum 1", "Aluminum 2", "Grinding Balls", "AAC"]),
      []
    );

    const [form, setForm] = useState({});
    const [productionVolume, setProductionVolume] = useState("");
    const [wastedMode, setWastedMode] = useState("default");
    const [confirmFlag, setConfirmFlag] = useState(false);

    const onHeaderFromActual = (e) =>
      setWastedMode(e.target.checked ? "from_actual" : "default");
    const onHeaderManual = (e) =>
      setWastedMode(e.target.checked ? "manual" : "default");

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
            r.density === product.density &&
            r.certificate === product.certificate
        );
      }

      if (!candidateRecipes.length) {
        candidateRecipes = list_of_recipes || [];
      }

      setAvailableRecipes(candidateRecipes);

      // 👉 пробуем найти именно тот рецепт, что в строке
      const fromRowArticle = selectedRow?.recipe_article;
      const matched =
        fromRowArticle &&
        candidateRecipes.find(
          (r) => String(r.article) === String(fromRowArticle)
        );

      if (matched) {
        setSelectedRecipe(matched);
      } else {
        // fallback на первый
        setSelectedRecipe(candidateRecipes.length ? candidateRecipes[0] : null);
      }
    }, [isOpen, selectedRow, latestProducts, list_of_recipes]);

    const handleChange = (key) => (e) => {
      const v = e.target.value;
      if (v === "" || /^-?\d*\.?\d*$/.test(v)) {
        setForm((p) => ({ ...p, [key]: v }));
      }
    };

    const handlePvChange = (e) => {
      const v = e.target.value;
      if (v === "" || /^-?\d*\.?\d*$/.test(v)) setProductionVolume(v);
    };

    const pvNumber = useMemo(
      () => (productionVolume === "" ? 0 : Number(productionVolume) || 0),
      [productionVolume]
    );

    // вот тут главная правка: берём данные из выбранного рецепта
    const baseByLabel = (label, key) => {
      if (!selectedRecipe || !key || !(key in selectedRecipe)) return "—";
      const v = selectedRecipe[key];
      return typeof v === "number" ? v : v ?? "—";
    };

    const logByKey = (key) => {
      const logs = selectedRow?.logs;
      if (!logs || !(key in logs)) return "";
      return logs[key];
    };

    const numOrNull = (v) => {
      if (v === "" || v === null || v === undefined) return null;
      const n = Number(v);
      return Number.isFinite(n) ? n : null;
    };

    const isEmptyOrZero = (v) => {
      if (v === "" || v === null || v === undefined || v === "—") return true;
      const n = Number(v);
      return !Number.isFinite(n) || n === 0;
    };

    const computeTotalByActual = useMemo(() => {
      const t = {};
      materialsMap.forEach(({ key }) => {
        const a = Number(form[`${key}_actual_reciepe`] || 0);
        t[`${key}_total`] = pvNumber ? +(a * pvNumber).toFixed(3) : "";
      });
      return t;
    }, [form, pvNumber, materialsMap]);

    const computeWasted = (key, label) => {
      const mode = wastedMode || "default";
      const aVal = Number(form[`${key}_actual_reciepe`] || 0);
      const baseNum = Number(baseByLabel(label, key));
      if (mode === "manual") {
        const raw = form[`${key}_Wasted`];
        return raw === "" ? "" : Number(raw);
      }
      if (pvNumber === 0) return "";
      if (mode === "from_actual") return +(aVal * pvNumber).toFixed(3);
      if (!Number.isFinite(baseNum)) return "";
      return +(baseNum * pvNumber).toFixed(3);
    };

    const shouldShowRow = (label, key) => {
      if (ALWAYS_VISIBLE.has(label)) return true;

      const base = baseByLabel(label, key);
      const log = logByKey(key);
      const aVal = numOrNull(form[`${key}_actual_reciepe`]);
      const wVal = numOrNull(form[`${key}_Wasted`]);
      const total = computeTotalByActual[`${key}_total`];
      const wastedCalc = computeWasted(key, label);

      const hasMeaningfulBase = !isEmptyOrZero(base);
      const hasMeaningfulLog = !isEmptyOrZero(log);
      const hasMeaningfulA = aVal !== null && aVal !== 0;
      const hasMeaningfulW = wVal !== null && wVal !== 0;
      const hasMeaningfulTotal = total !== "" && Number(total) !== 0;
      const hasMeaningfulWasted = wastedCalc !== "" && Number(wastedCalc) !== 0;

      return (
        hasMeaningfulBase ||
        hasMeaningfulLog ||
        hasMeaningfulA ||
        hasMeaningfulW ||
        hasMeaningfulTotal ||
        hasMeaningfulWasted
      );
    };

    const handleSave = () => {
      const materials = materialsMap
        .map(({ label, key }) => {
          const w = computeWasted(key, label);
          const wasted = w === "" ? null : Number(w);
          if (wasted === null || Number.isNaN(wasted) || wasted <= 0)
            return null;
          return { type: label, quantity: +wasted.toFixed(3) };
        })
        .filter(Boolean);

      if (!materials.length) {
        alert("Нет данных для списания материалов.");
        return;
      }

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

      if (shortages.length) {
        const msg =
          "Невозможно списать материалы — недостаточно на складе:\n\n" +
          shortages
            .map(
              (s) =>
                `${s.type}: нужно ${s.need}, на складе ${s.have} (не хватает ${s.lack})`
            )
            .join("\n");
        alert(msg);
        return;
      }

      const body = { materials };
      dispatch(
        addNewMainRawMatConsumption({
          ...selectedRow,
          consumed_volume: Number(productionVolume),
        })
      );

      const productDetails = latestProducts.find(
        (product) => product.article === selectedRow?.batch_article
      );

      const prodDescription = productDetails.description.match(
        /BAUBLOCK®\s+([^ ]+(?:\s+[^ ]+)?\s+\d*\.?\d+)/
      );

      const articleInfo = getWarehouseArticle(productDetails);

      addProductOrder();
      dispatch(updateRawMaterialConsumptionRawMaterialsWarehouse(body));
      dispatch(
        addNewLotesList({
          production_date: selectedRow?.date,
          product: prodDescription[1],
          recipe: selectedRow?.recipe_article,
          quantity_cakes: productionVolume,
          warehouse_id: articleInfo,
        })
      );
      if (confirmFlag)
        dispatch(deleteRawMatConsumption({ id: selectedRow?.id }));

      setMainRawMaterialConsumptionMadal(false);
      toggle();
    };

    const addProductOrder = async () => {
      const { batch_article } = selectedRow;

      const product = latestProducts.find(
        (item) => item.article == batch_article
      );

      const arraysPerPalletRaw = Math.floor(
        (product?.m3InArray ?? 0) / (product?.volumeBlockOnPallet ?? 1)
      );

      const free_quantity_remaining = productionVolume * arraysPerPalletRaw;
      const ordered_quantity = 0;

      let remainingFreeQty = parseInt(free_quantity_remaining);
      let summReserve = 0;

      const reservedProducts =
        list_of_ordered_production?.filter(
          (item) => item.product_article === batch_article
        ) || [];

      const updatedReserves = reservedProducts.map((reservedItem) => {
        if (reservedItem.product_article !== batch_article) {
          return reservedItem;
        }

        if (remainingFreeQty <= 0) {
          if (reservedItem.quantity == reservedItem.quantity_in_warehouse) {
            return reservedItem;
          } else if (
            reservedItem.quantity > reservedItem.quantity_in_warehouse
          ) {
            return {
              ...reservedItem,
              quantity_in_warehouse: Math.min(
                reservedItem.quantity_in_warehouse + parseInt(ordered_quantity),
                reservedItem.quantity
              ),
            };
          }
        }

        const deducted = Math.min(
          reservedItem.quantity -
            reservedItem.quantity_in_warehouse -
            parseInt(ordered_quantity),
          remainingFreeQty
        );

        remainingFreeQty -= deducted;
        summReserve += deducted;

        return {
          ...reservedItem,
          quantity_in_warehouse:
            reservedItem.quantity_in_warehouse +
            parseInt(ordered_quantity) +
            deducted,
        };
      });

      const articleInfo = getWarehouseArticle(product);

      dispatch(
        addNewWarehouse({
          product_article: batch_article,
          article: articleInfo,
          warehouse_loc: "local",
          type: "OK",
          free_quantity_remaining: remainingFreeQty,
          ordered_quantity: parseInt(ordered_quantity) + summReserve,
          total_quantity:
            parseInt(ordered_quantity) + summReserve + remainingFreeQty,
        })
      );

      for (const ordered_production of updatedReserves) {
        dispatch(updListOfOrderedProduction(ordered_production));
      }
    };

    // новый обработчик выбора рецепта
    const handleRecipeChange = (selectedOption) => {
      const found = availableRecipes.find((r) => r.id === selectedOption.value);

      setSelectedRecipe(found || null);

      selectedRow.recipe_article = found?.article || ""; // обновляем статью рецепта в выбранной строке
    };

    return (
      <div>
        <Modal isOpen={isOpen} toggle={toggle} size="xl">
          <ModalHeader toggle={toggle}>
            <div
              className="d-flex gap-3 w-100"
              style={{ alignItems: "flex-start" }}
            >
              {/* левая колонка: article + production volume */}
              <div style={{ minWidth: 240 }}>
                <span className="text-muted d-block" style={{ fontSize: 12 }}>
                  Recipe article:
                </span>
                <b className="d-block mb-2">
                  {selectedRow?.recipe_article ?? "—"}
                </b>

                <span
                  className="text-muted d-block mb-1"
                  style={{ fontSize: 12 }}
                >
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

              {/* правая колонка: селектор */}
              <div style={{ flex: 1, minWidth: 280 }}>
                <span
                  className="text-muted d-block mb-1"
                  style={{ fontSize: 12 }}
                >
                  Recipe:
                </span>
                {availableRecipes.length ? (
                  <Select
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
                      typeof document !== "undefined" ? document.body : null
                    }
                    styles={{
                      control: (provided) => ({
                        ...provided,
                        width: "40%",
                        minHeight: 36,
                        backgroundColor: "white",
                      }),
                      // сам выпадающий блок
                      menu: (provided) => ({
                        ...provided,
                        maxHeight: 360, // было ~200, делаем выше
                        zIndex: 9999,
                      }),
                      // внутренняя прокрутка
                      menuList: (provided) => ({
                        ...provided,
                        maxHeight: 360, // высота области со скроллом
                        overflowY: "auto",
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
            <ModalBody style={{ overflow: "auto", maxHeight: "70vh" }}>
              {/* Стили для этой таблицы в components/Styles/table.css */}
              <table className="table-waste">
                <thead>
                  <tr>
                    <th className="th-raw-first">Raw material</th>
                    <th className="th-mod-recipe">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          checked={wastedMode === "from_actual"}
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
                          checked={wastedMode === "manual"}
                          onChange={onHeaderManual}
                        />
                        <label className="form-check-label">
                          use manual input
                        </label>
                      </div>
                    </th>
                  </tr>
                  <tr>
                    <th className="th-raw-second">Raw material</th>
                    <th className="th-mod-recipe-sub">Modified recipe</th>
                    <th className="th-total-sub">total</th>
                    <th className="th-from-log-sub">from log</th>
                    <th className="th-wasted-sub">Wasted</th>
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
                            base: {isEmptyOrZero(base) ? "" : base}
                          </div>
                        </td>

                        <td>
                          <input
                            className="form-control"
                            inputMode="decimal"
                            placeholder="0"
                            value={form[aKey] ?? ""}
                            onChange={handleChange(aKey)}
                          />
                        </td>

                        <td style={{ minWidth: 120 }}>
                          {total === "" ? "" : total}
                        </td>
                        <td style={{ minWidth: 120 }}>
                          {isEmptyOrZero(log) ? "" : log}
                        </td>

                        <td>
                          <input
                            className="form-control"
                            inputMode="decimal"
                            placeholder="0"
                            value={
                              wastedMode === "manual"
                                ? form[wKey] ?? ""
                                : wastedVal === ""
                                ? ""
                                : String(wastedVal)
                            }
                            onChange={handleChange(wKey)}
                            disabled={wastedMode !== "manual"}
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
  }
);

export default RawMaterialsConsumptionModal;

// import React, { Fragment, useEffect, useMemo, useState } from 'react';
// import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
// import { useRecipeContext } from '#components/contexts/RecipeContext.js';
// import { useDispatch } from 'react-redux';
// import {
//   addNewWarehouse,
//   updateRawMaterialConsumptionRawMaterialsWarehouse,
//   updListOfOrderedProduction,
// } from '#components/redux/actions/warehouseAction.js';
// import {
//   addNewMainRawMatConsumption,
//   deleteRawMatConsumption,
// } from '#components/redux/actions/recipeAction.js';
// import { useWarehouseContext } from '#components/contexts/WarehouseContext.js';
// import { useModalContext } from '#components/contexts/ModalContext.js';
// import { useProductsContext } from '#components/contexts/ProductContext.js';
// import Select from 'react-select';

// const RawMaterialsConsumptionModal = React.memo(
//   ({ isOpen, toggle, selectedRow }) => {
//     const { list_of_recipes = [], main_raw_mat_consumption } = useRecipeContext();
//     const { latestProducts } = useProductsContext();
//     const {
//       raw_materials_warehouse = [],
//       list_of_ordered_production,
//       getWarehouseArticle,
//     } = useWarehouseContext();

//     const { setMainRawMaterialConsumptionMadal } = useModalContext();
//     const dispatch = useDispatch();

//     const recipe = useMemo(
//       () =>
//         Array.isArray(list_of_recipes) && list_of_recipes.length
//           ? list_of_recipes[0]
//           : null,
//       [list_of_recipes]
//     );

//     const materialsMap = useMemo(
//       () => [
//         { label: 'Sand', key: 'sand_dry' },
//         { label: 'Sand slurry (dry)', key: 'sand_slurry_dry' },
//         { label: 'Lime', key: 'lime' },
//         { label: 'Cement', key: 'cement' },
//         { label: 'Gypsum', key: 'gypsum_dry' },
//         { label: 'Gypsum stone', key: 'gypsum_stone' },
//         { label: 'Aluminum 1', key: 'aluminum_paste' },
//         { label: 'Aluminum 2', key: 'aluminum_paste_2' },
//         { label: 'Grinding Balls', key: 'grinding_balls' },
//         { label: 'AAC', key: 'aac' },
//       ],
//       [recipe]
//     );

//     const warehouseByType = React.useMemo(() => {
//       const map = new Map();
//       (raw_materials_warehouse || []).forEach((row) => {
//         const type = String(row?.material_type ?? '').trim();
//         const qty = Number(row?.remaining_quantity ?? 0) || 0;
//         if (type) map.set(type, qty);
//       });
//       return map;
//     }, [raw_materials_warehouse]);

//     const ALWAYS_VISIBLE = useMemo(
//       () => new Set(['Aluminum 1', 'Aluminum 2', 'Grinding Balls', 'AAC']),
//       []
//     );

//     // \- Form state
//     const [form, setForm] = useState({});
//     // production volume is now editable in the header
//     const [productionVolume, setProductionVolume] = useState('');

//     // Per-row mode: 'default' | 'from_actual' | 'manual'
//     // состояние
//     const [wastedMode, setWastedMode] = useState('default'); // 'default' | 'from_actual' | 'manual'

//     // обработчики для верхних чекбоксов
//     const onHeaderFromActual = (e) =>
//       setWastedMode(e.target.checked ? 'from_actual' : 'default');
//     const onHeaderManual = (e) =>
//       setWastedMode(e.target.checked ? 'manual' : 'default');

//     useEffect(() => {
//       if (!isOpen) return;
//       const initial = {};
//       const modeInit = {};
//       materialsMap.forEach(({ key }) => {
//         initial[`${key}_actual_reciepe`] = '';
//         initial[`${key}_Wasted`] = '';
//         modeInit[key] = 'default';
//       });
//       setForm(initial);
//       setWastedMode(modeInit);

//       const defaultVale =
//         selectedRow?.production_volume !== undefined &&
//         selectedRow?.production_volume !== null
//           ? String(selectedRow.production_volume)
//           : '';
//       const consumed_volume =
//         main_raw_mat_consumption?.find((item) => item.id === selectedRow?.id)
//           ?.consumed_volume || 0;

//       const prodValue = Number(defaultVale) - consumed_volume;

//       setProductionVolume(String(prodValue));
//     }, [isOpen, materialsMap, selectedRow]);

//     const handleChange = (key) => (e) => {
//       const v = e.target.value;
//       if (v === '' || /^-?\d*\.?\d*$/.test(v)) {
//         setForm((p) => ({ ...p, [key]: v }));
//       }
//     };

//     const handlePvChange = (e) => {
//       const v = e.target.value;
//       if (v === '' || /^-?\d*\.?\d*$/.test(v)) setProductionVolume(v);
//     };

//     const pvNumber = useMemo(
//       () => (productionVolume === '' ? 0 : Number(productionVolume) || 0),
//       [productionVolume]
//     );

//     // Helpers
//     const baseByLabel = (label, key) => {
//       if (!recipe || !key || !(key in recipe)) return '—';
//       const v = recipe[key];
//       return typeof v === 'number' ? v : v ?? '—';
//     };

//     const logByKey = (key) => {
//       const logs = selectedRow?.logs;
//       if (!logs || !(key in logs)) return '';
//       return logs[key];
//     };

//     const numOrNull = (v) => {
//       if (v === '' || v === null || v === undefined) return null;
//       const n = Number(v);
//       return Number.isFinite(n) ? n : null;
//     };

//     const isEmptyOrZero = (v) => {
//       if (v === '' || v === null || v === undefined || v === '—') return true;
//       const n = Number(v);
//       return !Number.isFinite(n) || n === 0;
//     };

//     const computeTotalByActual = useMemo(() => {
//       const t = {};
//       materialsMap.forEach(({ key }) => {
//         const a = Number(form[`${key}_actual_reciepe`] || 0);
//         t[`${key}_total`] = pvNumber ? +(a * pvNumber).toFixed(3) : '';
//       });
//       return t;
//     }, [form, pvNumber, materialsMap]);

//     // Compute Wasted value per row depending on mode
//     const computeWasted = (key, label) => {
//       const mode = wastedMode || 'default';
//       const aVal = Number(form[`${key}_actual_reciepe`] || 0);
//       const baseNum = Number(baseByLabel(label, key));
//       if (mode === 'manual') {
//         const raw = form[`${key}_Wasted`];
//         return raw === '' ? '' : Number(raw);
//       }
//       if (pvNumber === 0) return '';
//       if (mode === 'from_actual') return +(aVal * pvNumber).toFixed(3);
//       if (!Number.isFinite(baseNum)) return '';
//       return +(baseNum * pvNumber).toFixed(3);
//     };

//     const shouldShowRow = (label, key) => {
//       if (ALWAYS_VISIBLE.has(label)) return true;

//       const base = baseByLabel(label, key);
//       const log = logByKey(key);
//       const aVal = numOrNull(form[`${key}_actual_reciepe`]);
//       const wVal = numOrNull(form[`${key}_Wasted`]);
//       const total = computeTotalByActual[`${key}_total`];
//       const wastedCalc = computeWasted(key, label);

//       const hasMeaningfulBase = !isEmptyOrZero(base);
//       const hasMeaningfulLog = !isEmptyOrZero(log);
//       const hasMeaningfulA = aVal !== null && aVal !== 0;
//       const hasMeaningfulW = wVal !== null && wVal !== 0;
//       const hasMeaningfulTotal = total !== '' && Number(total) !== 0;
//       const hasMeaningfulWasted = wastedCalc !== '' && Number(wastedCalc) !== 0;

//       return (
//         hasMeaningfulBase ||
//         hasMeaningfulLog ||
//         hasMeaningfulA ||
//         hasMeaningfulW ||
//         hasMeaningfulTotal ||
//         hasMeaningfulWasted
//       );
//     };

//     const [confirmFlag, setConfirmFlag] = useState(false);

//     const handleSave = () => {
//       // Build materials using the computed Wasted according to mode
//       const materials = materialsMap
//         .map(({ label, key }) => {
//           const w = computeWasted(key, label);
//           const wasted = w === '' ? null : Number(w);
//           if (wasted === null || Number.isNaN(wasted) || wasted <= 0) return null;
//           return { type: label, quantity: +wasted.toFixed(3) };
//         })
//         .filter(Boolean);

//       if (!materials.length) {
//         alert('Нет данных для списания материалов.');
//         return;
//       }

//       // Stock check
//       const shortages = [];
//       for (const { type, quantity } of materials) {
//         const have = warehouseByType.get(type) ?? 0;
//         if (quantity > have) {
//           shortages.push({
//             type,
//             need: +Number(quantity).toFixed(3),
//             have: +Number(have).toFixed(3),
//             lack: +Number(quantity - have).toFixed(3),
//           });
//         }
//       }

//       if (shortages.length) {
//         const msg =
//           'Невозможно списать материалы — недостаточно на складе:\n\n' +
//           shortages
//             .map(
//               (s) =>
//                 `${s.type}: нужно ${s.need}, на складе ${s.have} (не хватает ${s.lack})`
//             )
//             .join('\n');
//         alert(msg);
//         return;
//       }

//       const body = { materials };
//       dispatch(
//         addNewMainRawMatConsumption({
//           ...selectedRow,
//           consumed_volume: Number(productionVolume),
//         })
//       );

//       addProductOrder();
//       dispatch(updateRawMaterialConsumptionRawMaterialsWarehouse(body));
//       if (confirmFlag) dispatch(deleteRawMatConsumption({ id: selectedRow?.id }));

//       setMainRawMaterialConsumptionMadal(false);
//       toggle();
//     };

//     const addProductOrder = async () => {
//       const { batch_article } = selectedRow;

//       const product = latestProducts.find((item) => item.article == batch_article);

//       const arraysPerPalletRaw = Math.floor(
//         (product?.m3InArray ?? 0) / (product?.volumeBlockOnPallet ?? 1)
//       );

//       const free_quantity_remaining = productionVolume * arraysPerPalletRaw;
//       const ordered_quantity = 0;

//       const reservedProducts =
//         list_of_ordered_production?.filter(
//           (item) => item.product_article === batch_article
//         ) || [];

//       let remainingFreeQty = parseInt(free_quantity_remaining);
//       let summReserve = 0;

//       const updatedReserves = reservedProducts.map((reservedItem) => {
//         if (reservedItem.product_article !== batch_article) {
//           return reservedItem;
//         }

//         if (remainingFreeQty <= 0) {
//           if (reservedItem.quantity == reservedItem.quantity_in_warehouse) {
//             return reservedItem;
//           } else if (reservedItem.quantity > reservedItem.quantity_in_warehouse) {
//             return {
//               ...reservedItem,
//               quantity_in_warehouse: Math.min(
//                 reservedItem.quantity_in_warehouse + parseInt(ordered_quantity),
//                 reservedItem.quantity
//               ),
//             };
//           }
//         }

//         const deducted = Math.min(
//           reservedItem.quantity -
//             reservedItem.quantity_in_warehouse -
//             parseInt(ordered_quantity),
//           remainingFreeQty
//         );

//         remainingFreeQty -= deducted;
//         summReserve += deducted;

//         return {
//           ...reservedItem,
//           quantity_in_warehouse:
//             reservedItem.quantity_in_warehouse +
//             parseInt(ordered_quantity) +
//             deducted,
//         };
//       });

//       const articleInfo = getWarehouseArticle(product);

//       dispatch(
//         addNewWarehouse({
//           product_article: batch_article,
//           article: articleInfo,
//           warehouse_loc: 'local',
//           type: 'OK',
//           free_quantity_remaining: remainingFreeQty,
//           ordered_quantity: parseInt(ordered_quantity) + summReserve,
//           total_quantity:
//             (parseInt(ordered_quantity) + summReserve + remainingFreeQty) *
//             arraysPerPalletRaw,
//         })
//       );

//       // for (const ordered_production of updatedReserves) {
//       //   dispatch(updListOfOrderedProduction(ordered_production));
//       // }
//     };

//     const handleRecipeChange = (index, selectedOption) => {
//       setProductsArray((prev) =>
//         prev.map((product, i) =>
//           i === index
//             ? {
//                 ...product,
//                 current_recipe: product.recipeArray.find(
//                   (recipe) => recipe.id === selectedOption.value
//                 ),
//               }
//             : product
//         )
//       );
//     };

//     return (
//       <div>
//         <Modal isOpen={isOpen} toggle={toggle} size="xl">
//           <ModalHeader toggle={toggle}>
//             <div className="d-flex flex-column gap-1">
//               <div>
//                 <span className="text-muted">Recipe article: </span>
//                 <b>{selectedRow?.recipe_article ?? '—'}</b>

//                 <div>
//                   Recipe:
//                   {product?.current_recipe ? (
//                     <Select
//                       onChange={(selectedOption) =>
//                         handleRecipeChange(index, selectedOption)
//                       }
//                       options={product.recipeOptions}
//                       value={{
//                         value: product.current_recipe?.id,
//                         label: product.current_recipe?.article,
//                       }}
//                       styles={{
//                         singleValue: (provided) => ({
//                           ...provided,
//                           color: 'black', // цвет текста выбранного значения
//                         }),
//                         option: (provided, state) => ({
//                           ...provided,
//                           color: state.isSelected ? 'white' : 'black', // выбранная белая, остальные чёрные
//                           backgroundColor: state.isSelected
//                             ? '#2684FF'
//                             : state.isFocused
//                             ? '#e6f0ff' // подсветка при наведении
//                             : 'white',
//                         }),
//                         control: (provided) => ({
//                           ...provided,
//                           backgroundColor: 'white',
//                           color: 'black',
//                         }),
//                       }}
//                     />
//                   ) : (
//                     <> No recipes</>
//                   )}
//                 </div>
//               </div>
//               <div className="text-muted d-flex align-items-center gap-2">
//                 <span>Production volume:</span>
//                 <input
//                   className="form-control"
//                   inputMode="decimal"
//                   placeholder="0"
//                   value={productionVolume}
//                   onChange={handlePvChange}
//                   style={{ maxWidth: 160 }}
//                 />
//               </div>
//             </div>
//           </ModalHeader>

//           <Fragment>
//             <ModalBody style={{ overflow: 'auto', maxHeight: '70vh' }}>
//               <table className="table w-100 align-middle">
//                 <thead
//                   style={{
//                     position: 'sticky',
//                     top: 0,
//                     background: '#fff',
//                     zIndex: 1,
//                   }}
//                 >
//                   <tr>
//                     <th style={{ minWidth: 220, background: '#fff59d' }}>
//                       By recipe
//                     </th>
//                     <th
//                       colSpan={2}
//                       style={{ background: '#ffe082', textAlign: 'center' }}
//                     >
//                       manual input
//                     </th>
//                     <th style={{ background: '#c8e6c9', textAlign: 'center' }}>
//                       Из лога
//                     </th>
//                     <th style={{ background: '#ffe082', textAlign: 'center' }}>
//                       manual input
//                     </th>
//                   </tr>
//                   {/* Checkboxes row */}
//                   <tr>
//                     <th style={{ background: '#fffef0' }}>Raw material</th>
//                     <th style={{ background: '#fff6d5', verticalAlign: 'top' }}>
//                       <div className="form-check">
//                         <input
//                           className="form-check-input"
//                           type="checkbox"
//                           checked={wastedMode === 'from_actual'}
//                           onChange={onHeaderFromActual}
//                         />
//                         <label className="form-check-label" style={{ fontSize: 12 }}>
//                           чекбокс над *_actual_reciepe (переключает расчёт Wasted)
//                         </label>
//                       </div>
//                       <div className="text-muted" style={{ fontSize: 12 }}>
//                         место для названия
//                       </div>
//                     </th>
//                     <th style={{ background: '#fff6d5' }}>*_total</th>
//                     <th style={{ background: '#e9f6ea' }}>*_log</th>
//                     <th style={{ background: '#fff6d5', verticalAlign: 'top' }}>
//                       <div className="form-check">
//                         <input
//                           className="form-check-input"
//                           type="checkbox"
//                           checked={wastedMode === 'manual'}
//                           onChange={onHeaderManual}
//                         />
//                         <label className="form-check-label" style={{ fontSize: 12 }}>
//                           чекбокс над Wasted (ручной ввод)
//                         </label>
//                       </div>
//                       <div className="text-muted" style={{ fontSize: 12 }}>
//                         место для названия
//                       </div>
//                     </th>
//                   </tr>

//                   {/* Labels row */}
//                   <tr>
//                     <th style={{ background: '#fff59d' }}>Raw material</th>
//                     <th style={{ background: '#ffe082' }}>*_actual_reciepe</th>
//                     <th style={{ background: '#ffe082' }}>*_total</th>
//                     <th style={{ background: '#c8e6c9' }}>*_log</th>
//                     <th style={{ background: '#ffe082' }}>Wasted</th>
//                   </tr>
//                 </thead>

//                 <tbody>
//                   {materialsMap.map(({ label, key }) => {
//                     if (!shouldShowRow(label, key)) return null;

//                     const aKey = `${key}_actual_reciepe`;
//                     const wKey = `${key}_Wasted`;
//                     const base = baseByLabel(label, key);
//                     const total = computeTotalByActual[`${key}_total`];
//                     const log = logByKey(key);
//                     const mode = wastedMode[key] || 'default';
//                     const wastedVal = computeWasted(key, label);

//                     return (
//                       <tr key={key}>
//                         <td>
//                           <div className="fw-semibold">{label}</div>
//                           <div className="text-muted" style={{ fontSize: 12 }}>
//                             base: {isEmptyOrZero(base) ? '' : base}
//                           </div>
//                         </td>

//                         {/* *_actual_reciepe with row-level checkbox above */}
//                         <td>
//                           <label
//                             className="form-label mb-1"
//                             style={{ fontSize: 12 }}
//                           >
//                             {aKey}
//                           </label>
//                           <input
//                             className="form-control"
//                             inputMode="decimal"
//                             placeholder="0"
//                             value={form[aKey] ?? ''}
//                             onChange={handleChange(aKey)}
//                             style={{ maxWidth: 160 }}
//                           />
//                         </td>

//                         <td style={{ minWidth: 120 }}>
//                           {total === '' ? '' : total}
//                         </td>

//                         <td style={{ minWidth: 120 }}>
//                           {isEmptyOrZero(log) ? '' : log}
//                         </td>

//                         {/* Wasted with row-level checkbox above for manual input */}
//                         <td>
//                           <label
//                             className="form-label mb-1"
//                             style={{ fontSize: 12 }}
//                           >
//                             Wasted
//                           </label>
//                           <input
//                             className="form-control"
//                             inputMode="decimal"
//                             placeholder="0"
//                             value={
//                               wastedMode === 'manual'
//                                 ? form[wKey] ?? ''
//                                 : computeWasted(key, label) === ''
//                                 ? ''
//                                 : String(computeWasted(key, label))
//                             }
//                             onChange={handleChange(wKey)}
//                             style={{ maxWidth: 140 }}
//                             disabled={wastedMode !== 'manual'}
//                           />
//                         </td>
//                       </tr>
//                     );
//                   })}
//                 </tbody>
//               </table>
//             </ModalBody>

//             <ModalFooter className="d-flex justify-content-between">
//               <div className="d-flex align-items-center gap-2">
//                 <input
//                   id="confirm-checkbox"
//                   className="form-check-input"
//                   type="checkbox"
//                   checked={confirmFlag}
//                   onChange={(e) => setConfirmFlag(e.target.checked)}
//                 />
//                 <label className="form-check-label" htmlFor="confirm-checkbox">
//                   Подтверждаю корректность данных (чекбокс у кнопки сохранения)
//                 </label>
//               </div>
//               <div className="d-flex gap-2">
//                 <button className="btn btn-outline-secondary" onClick={toggle}>
//                   Cancel
//                 </button>
//                 <button className="btn btn-success" onClick={handleSave}>
//                   Save
//                 </button>
//               </div>
//             </ModalFooter>
//           </Fragment>
//         </Modal>
//       </div>
//     );
//   }
// );

// export default RawMaterialsConsumptionModal;
