import React, { Fragment, useEffect, useMemo, useRef, useState } from 'react';
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { useRecipeContext } from '#components/contexts/RecipeContext.js';
import { useDispatch, useSelector } from 'react-redux';
import {
  createRawMaterialConsumptionRequest,
  updateRemainingStock,
} from '#components/redux/actions/warehouseAction.js';
import {
  addNewRawMatConsumptionCurrentMolds,
  deleteRawMatConsumption,
  deleteRawMatConsumptionCurrentMolds,
  updateRawMatConsumption,
} from '#components/redux/actions/recipeAction.js';
import { useWarehouseContext } from '#components/contexts/WarehouseContext.js';
import { useProductsContext } from '#components/contexts/ProductContext.js';
import { addNewLotesList } from '#components/redux/actions/lotesListAction.js';
import Select from 'react-select';
import '#components/Styles/table.css';

const RawMaterialsConsumptionModal = React.memo(
  ({
    isOpen,
    toggle,
    selectedRow,
    onSave,
    newBatchMode = false,
    lotesListBatches = [],
  }) => {
    const {
      list_of_recipes = [],
      rawMatConsumptionCurrentMolds,
      raw_mat_consumption,
      // lotesListBatchesCheck,
      // setLotesListCheck,
    } = useRecipeContext();
    const { latestProducts } = useProductsContext();

    const {
      raw_materials_warehouse = [],
      warehouse_data,
      batchOutside,
    } = useWarehouseContext();

    const dispatch = useDispatch();

    const [form, setForm] = useState({});
    const [availableRecipes, setAvailableRecipes] = useState([]);
    const [govno, setGovno] = useState(false);
    const [confirmFlag, setConfirmFlag] = useState(false);
    const [recipeArticle, setRecipeArticle] = useState('');
    const [selectedRecipe, setSelectedRecipe] = useState(null);
    const [selectedAlu1Type, setSelectedAlu1Type] = useState(null);
    const [selectedAlu2Type, setSelectedAlu2Type] = useState(null);
    const [isSaving, setIsSaving] = useState(false);
    const savingRef = useRef(false);

    const warehouseAluminum1 = useSelector((state) => state.warehouseAluminum1);

    useEffect(() => {
      setAvailableRecipes([]);
      setSelectedRecipe(null);
      setForm({});
      setConfirmFlag(false);
      // setLotesListCheck(true);
      setGovno(false);
    }, []);

    useEffect(() => {
      if (!isOpen) return;
      setRecipeArticle(selectedRow?.recipe_article ?? '');
    }, [selectedRow, isOpen]);

    const materialsMap = useMemo(
      () => [
        { label: 'Sand powder (dry)', key: 'sand_powder_dry' },
        { label: 'Sand slurry (dry)', key: 'sand_slurry_dry' },
        { label: 'Lime', key: 'lime' },
        { label: 'Cement', key: 'cement' },
        { label: 'Gypsum', key: 'gypsum_dry' },
        { label: 'Return slurry (dry)', key: 'return_dry' },
        { label: 'Gypsum stone', key: 'gypsum_stone' },
        { label: 'Aluminum 1', key: 'aluminum_paste' },
        { label: 'Aluminum 2', key: 'aluminum_paste_2' },
      ],
      [],
    );

    const aluminum1TypeOptions = useMemo(() => {
      if (!warehouseAluminum1) return [];
      const uniqueTypes = [
        ...new Set(warehouseAluminum1.map((item) => item.type).filter(Boolean)),
      ];
      return uniqueTypes.map((type) => ({ value: type, label: type }));
    }, [warehouseAluminum1]);

    const warehouseByType = React.useMemo(() => {
      const map = new Map();

      (raw_materials_warehouse || []).forEach((row) => {
        const materialType = String(row?.material_type ?? '').trim();
        if (materialType === 'Aluminum') return;
        const qty = Number(row?.remaining_quantity ?? 0) || 0;
        if (materialType && qty) {
          map.set(materialType, (map.get(materialType) || 0) + qty);
        }
      });

      const processAluminum = (data, baseName) => {
        if (!data || !Array.isArray(data)) return;
        data.forEach((item) => {
          const subtype = item?.type ? String(item.type).trim() : null;
          const available =
            (Number(item?.quantity) || 0) - (Number(item?.consumed_quantity) || 0);
          if (subtype && available > 0) {
            const key = `${baseName}|${subtype}`;
            map.set(key, (map.get(key) || 0) + available);
          }
        });
      };

      processAluminum(warehouseAluminum1, 'Aluminum');
      const totalAlu = (warehouseAluminum1 || []).reduce((sum, item) => {
        return (
          sum +
          (Number(item?.quantity) || 0) -
          (Number(item?.consumed_quantity) || 0)
        );
      }, 0);
      if (totalAlu > 0) {
        map.set('Aluminum', totalAlu);
        map.set('Aluminum 1', totalAlu);
      }

      return map;
    }, [raw_materials_warehouse, warehouseAluminum1]);

    const ALWAYS_VISIBLE = useMemo(() => new Set(['Aluminum 1', 'Aluminum 2']), []);

    const recipeForUI = useMemo(() => selectedRecipe || null, [selectedRecipe]);

    const currentProductName = useMemo(() => {
      const productDetails = latestProducts.find(
        (product) => String(product.article) === String(selectedRow?.batch_article),
      );

      if (!productDetails?.description) return null;

      const match = productDetails.description.match(
        /BAUBLOCK®\s+([^ ]+(?:\s+[^ ]+)?\s+\d*\.?\d+)/,
      );

      return match?.[1] || null;
    }, [latestProducts, selectedRow?.batch_article]);

    const previousLotesRecord = useMemo(() => {
      if (!Array.isArray(lotesListBatches)) return null;
      if (!selectedRow?.batch_id) return null;
      if (!currentProductName) return null;

      const records = lotesListBatches.filter((item) => {
        const batch_article = batchOutside.find(
          (b) => b.id === item.batch_id,
        )?.product_article;

        if (
          batch_article === selectedRow.batch_article &&
          String(item.product) === String(currentProductName)
        ) {
          return true;
        }
        return false;
      });

      if (!records.length) return null;

      return records.reduce((latest, item) => {
        if (!latest) return item;

        return Number(item.id) > Number(latest.id) ? item : latest;
      }, null);
    }, [lotesListBatches, selectedRow?.batch_id, currentProductName]);

    useEffect(() => {
      if (!isOpen) return;
      setForm((prev) => {
        const next = { ...prev };
        materialsMap.forEach(({ key }) => {
          const baseVal = Number(recipeForUI?.[key]);
          next[`${key}_actual_reciepe`] = Number.isFinite(baseVal) ? baseVal : '';
        });
        return next;
      });
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isOpen, selectedRecipe?.id, materialsMap]);

    const resetToDef = (key) => {
      const baseVal = Number(recipeForUI?.[key]);
      setForm((p) => ({
        ...p,
        [`${key}_actual_reciepe`]: Number.isFinite(baseVal) ? baseVal : '',
      }));
    };

    const resetToPrev = (key) => {
      if (!previousLotesRecord) return;

      const prevVal = Number(previousLotesRecord?.[key]);

      if (!Number.isFinite(prevVal)) return;

      setForm((prev) => ({
        ...prev,
        [`${key}_actual_reciepe`]: prevVal,
      }));
    };

    const hasPrevValue = (key) => {
      if (!previousLotesRecord) return false;

      const value = Number(previousLotesRecord?.[key]);

      return Number.isFinite(value);
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
        fromRowArticle !== 'No recipe' &&
        candidateRecipes.find((r) => String(r.article) === String(fromRowArticle));

      const recipe = matched || candidateRecipes[0] || null;

      setSelectedRecipe(recipe);
      setRecipeArticle(recipe?.article || '');

      if (recipe?.aluminum_type) {
        setSelectedAlu1Type({
          value: recipe.aluminum_type,
          label: recipe.aluminum_type,
        });
      } else {
        setSelectedAlu1Type(null);
      }

      if (recipe?.aluminum_2_type) {
        setSelectedAlu2Type({
          value: recipe.aluminum_2_type,
          label: recipe.aluminum_2_type,
        });
      } else {
        setSelectedAlu2Type(null);
      }
    }, [isOpen, selectedRow, latestProducts, list_of_recipes]);

    const handleChange = (key) => (e) => {
      let processedValue = e.target.value;
      if (typeof e.target.value === 'string') {
        processedValue = e.target.value.replace(/(\d+),(\d*)/g, '$1.$2');
      }
      if (processedValue === '' || /^-?\d*\.?\d*$/.test(processedValue)) {
        setForm((p) => ({ ...p, [key]: processedValue }));
      }
    };
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

    const computeConsumed = (key) => {
      const raw = form[`${key}_actual_reciepe`];

      if (raw === '' || raw === null || raw === undefined) {
        return null;
      }

      const value = Number(raw);

      if (!Number.isFinite(value)) {
        return null;
      }

      return +value.toFixed(2);
    };

    const shouldShowRow = (label, key) => {
      if (ALWAYS_VISIBLE.has(label)) return true;

      const base = Number(recipeForUI?.[key]);
      const log = logByKey(key);
      const aVal = numOrNull(form[`${key}_actual_reciepe`]);

      const hasMeaningfulBase = !isEmptyOrZero(base);
      const hasMeaningfulLog = !isEmptyOrZero(log);
      const hasMeaningfulA = aVal !== null && aVal !== 0;

      const hasAnyRecipeLocal =
        Boolean(selectedRecipe) || (availableRecipes?.length ?? 0) > 0;

      if (!hasAnyRecipeLocal) {
        return hasMeaningfulLog || hasMeaningfulA;
      }

      const consumed = computeConsumed(key);
      const hasMeaningfulConsumed = consumed !== null && Number(consumed) !== 0;

      return (
        hasMeaningfulBase ||
        hasMeaningfulLog ||
        hasMeaningfulA ||
        hasMeaningfulConsumed
      );
    };

    const isRecipeModified = (key) => {
      const actual = numOrNull(form[`${key}_actual_reciepe`]);
      const base = Number(recipeForUI?.[key]);
      if (actual === null || !Number.isFinite(base)) return false;
      return Math.abs(actual - base) > 1e-9;
    };

    const buildRecipeSnapshot = () => {
      const snapshot = {};

      materialsMap.forEach(({ key }) => {
        const actual = Number(form[`${key}_actual_reciepe`]);

        if (Number.isFinite(actual) && actual > 0) {
          snapshot[key] = +actual.toFixed(5);
        } else {
          const base = Number(recipeForUI?.[key]);
          snapshot[key] = Number.isFinite(base) ? +base.toFixed(5) : 0;
        }
      });

      return snapshot;
    };

    const writeOffMaterials = (body) => {
      const request = createRawMaterialConsumptionRequest(body);

      dispatch(request.action);

      return request.promise;
    };

    const getWriteOffErrorMessage = (error) => {
      const message = error?.message || 'Failed to write off raw materials.';
      const shortageDetails = Array.isArray(error?.shortageDetails)
        ? error.shortageDetails
        : [];

      if (shortageDetails.length === 0) {
        return message;
      }

      const details = shortageDetails
        .map((item) => {
          const material = item.material || item.subtype || 'Unknown material';
          const available = Number(item.available) || 0;
          const required = Number(item.required) || 0;
          const shortage = Number(item.shortage) || 0;

          return (
            `${material}: required ${required}, available ${available}` +
            `, shortage ${shortage}`
          );
        })
        .join('\n');

      return `${message}\n\n${details}`;
    };

    const handleSave = async () => {
      if (savingRef.current) return;

      if (newBatchMode && !selectedRecipe) {
        alert('Please select a recipe.');
        return;
      }

      const aluminum1Consumed = computeConsumed('aluminum_paste');
      const aluminum2Consumed = computeConsumed('aluminum_paste_2');

      if (Number(aluminum1Consumed) > 0 && !selectedAlu1Type?.value) {
        alert('Select Aluminum 1 type.');
        return;
      }

      if (Number(aluminum2Consumed) > 0 && !selectedAlu2Type?.value) {
        alert('Select Aluminum 2 type.');
        return;
      }

      const materials = materialsMap.map(({ label, key }) => {
        const w = computeConsumed(key);

        if (w === null) {
          return { type: label, quantity: null };
        }

        const wasted = Number(w);

        if (Number.isNaN(wasted)) {
          return { type: label, quantity: null };
        }

        let actualType = label;

        if (label === 'Aluminum 1' && selectedAlu1Type?.value) {
          actualType = `Aluminum|${selectedAlu1Type.value}`;
        } else if (label === 'Aluminum 2' && selectedAlu2Type?.value) {
          actualType = `Aluminum|${selectedAlu2Type.value}`;
        }

        return {
          type: actualType,
          quantity: +wasted.toFixed(2),
        };
      });

      if (!materials.length) {
        alert('No data to write off materials.');
        return;
      }
      let result_materials = [...materials];

      if (govno) {
        const totalConsumedRaw = result_materials
          .filter(
            (m) => m.type !== 'Return slurry (dry)' && m.type !== 'Return (dry)',
          )
          .reduce((sum, m) => sum + (Number(m.quantity) || 0), 0);

        if (Number.isFinite(totalConsumedRaw) && totalConsumedRaw > 0) {
          const idx = result_materials.findIndex(
            (m) => m.type === 'Return slurry (dry)' || m.type === 'Return (dry)',
          );

          if (idx >= 0) {
            result_materials[idx] = {
              ...result_materials[idx],
              type: 'Return slurry (dry)',
              quantity: -totalConsumedRaw.toFixed(2),
            };
          } else {
            result_materials.push({
              type: 'Return slurry (dry)',
              quantity: -totalConsumedRaw.toFixed(2),
            });
          }
        }
      } else if (selectedRecipe?.produced_return_dry) {
        const producedReturn = Number(selectedRecipe.produced_return_dry);

        if (Number.isFinite(Number(producedReturn)) && producedReturn > 0) {
          result_materials = materials.map((el) => {
            if (el.type == 'Return slurry (dry)') {
              return {
                ...el,
                quantity: (el.quantity - producedReturn.toFixed(2)).toFixed(2),
              };
            }
            return el;
          });
        }
      }

      const shortages = [];
      if (
        (materials.some((m) => m.type === 'Aluminum 1') &&
          !selectedAlu1Type?.value) ||
        (materials.some((m) => m.type === 'Aluminum 2') && !selectedAlu2Type?.value)
      ) {
        alert(
          'For aluminum, a type must be selected (7040-10/70WB28, 8040-10/70WB28, etc.)',
        );
        return;
      }

      for (const { type, quantity } of materials) {
        if (type.includes('Return')) continue;

        let have;
        if (type.startsWith('Aluminum|') && selectedAlu1Type?.value) {
          have = warehouseByType.get(type) ?? 0;
        } else if (type.startsWith('Aluminum 2|') && selectedAlu2Type?.value) {
          have = warehouseByType.get(type) ?? 0;
        } else {
          have = warehouseByType.get(type) ?? 0;
        }

        if (quantity > have) {
          shortages.push({
            type,
            need: +quantity.toFixed(2),
            have: +have.toFixed(2),
            lack: +(quantity - have).toFixed(2),
          });
        }
      }

      // const shortages = [];
      // for (const { type, quantity } of materials) {
      //   if (type === 'Return slurry (dry)' || type === 'Return (dry)') continue;

      //   let have;
      //   if (type === 'Aluminum 1' && selectedAlu1Type?.value) {
      //     have = warehouseByType.get(`Aluminum 1 (${selectedAlu1Type.value})`) ?? 0;
      //   } else if (type === 'Aluminum 2' && selectedAlu2Type?.value) {
      //     have = warehouseByType.get(`Aluminum 2 (${selectedAlu2Type.value})`) ?? 0;
      //   } else {
      //     have = warehouseByType.get(type) ?? 0;
      //   }

      //   if (quantity > have) {
      //     shortages.push({
      //       type,
      //       need: +Number(quantity).toFixed(2),
      //       have: +Number(have).toFixed(2),
      //       lack: +Number(quantity - have).toFixed(2),
      //     });
      //   }
      // }

      if (shortages.length) {
        const msg =
          'Cannot write off materials — insufficient stock:\n\n' +
          shortages
            .map(
              (s) =>
                `${s.type}: need ${s.need}, in stock ${s.have} (short by ${s.lack})`,
            )
            .join('\n');
        alert(msg);
        return;
      }

      const visibleMaterials = materialsMap
        .map((m) => (shouldShowRow(m.label, m.key) ? m.label : null))
        .filter(Boolean);

      const null_arr = [];
      result_materials.forEach((el) => {
        if (visibleMaterials.includes(el.type) && el.quantity === null) {
          null_arr.push(el);
        }
      });

      if (null_arr.length) {
        const msg =
          'All material quantity fields must be filled in:\n\n' +
          null_arr.map((s) => `${s.type}: value not specified`).join('\n');
        alert(msg);
        return;
      }

      const fixed_materials = result_materials
        .map((el) => {
          return {
            ...el,
            quantity: Number(el.quantity).toFixed(2),
          };
        })
        .filter((el) => el.quantity != 0);

      const normMaterials = fixed_materials.filter(
        (m) => m.type && Number.isFinite(Number(m.quantity)),
      );

      if (normMaterials.length === 0) {
        alert('There are no materials to write off.');
        return;
      }

      const body = { materials: normMaterials };

      savingRef.current = true;
      setIsSaving(true);

      try {
        await writeOffMaterials(body);

        const recipeSnapshot = buildRecipeSnapshot();

        const new_lotestList = {
          production_date: selectedRow?.date,
          product: currentProductName,
          quantity_cakes: 1,
          custom_recipe: materialsMap.some(({ key }) => isRecipeModified(key)),
          slurried: govno,
          recipe:
            selectedRecipe?.article || recipeArticle || selectedRow?.recipe_article,
          batch_id: selectedRow?.batch_id,
          aluminum_type: selectedAlu1Type?.value || null,
          aluminum_2_type: selectedAlu2Type?.value || null,
          ...recipeSnapshot,
        };

        if (!newBatchMode) {
          addProductOrder();
        }

        dispatch(
          addNewLotesList({
            new_lotestList,
            new_batch: newBatchMode,
          }),
        );

        if (!newBatchMode) {
          const rawRecord = raw_mat_consumption?.find(
            (r) => String(r.batch_id) === String(selectedRow?.batch_id),
          );

          if (rawRecord) {
            const bd_volume = Number(rawRecord.production_volume || 0);

            const alreadyUsed = (rawMatConsumptionCurrentMolds || [])
              .filter((r) => String(r.batch_id) === String(selectedRow?.batch_id))
              .reduce((sum, r) => sum + Number(r.consumed_volume || 0), 0);

            const { id, ...newRawMatConsumptionCurrentMold } = selectedRow;

            if (rawRecord.used) {
              dispatch(deleteRawMatConsumption({ id: selectedRow?.id }));
            }

            if (alreadyUsed == bd_volume) {
              dispatch(
                updateRawMatConsumption({
                  id: selectedRow?.id,
                  consumption_calculated: true,
                }),
              );

              if (
                rawMatConsumptionCurrentMolds.find(
                  (r) => String(r.batch_id) === String(selectedRow?.batch_id),
                )
              ) {
                dispatch(
                  deleteRawMatConsumptionCurrentMolds({
                    batch_id: selectedRow?.batch_id,
                  }),
                );
              }
            } else {
              dispatch(
                addNewRawMatConsumptionCurrentMolds({
                  ...newRawMatConsumptionCurrentMold,
                  consumed_volume: 1,
                }),
              );
            }
          }
        }

        if (onSave) {
          await onSave({
            productionVolume: 1,
            recipeArticle: selectedRecipe?.article || recipeArticle || null,
            selectedRecipe,
          });
        }

        toggle();
        setSelectedAlu1Type(null);
        setSelectedAlu2Type(null);
      } catch (error) {
        alert(getWriteOffErrorMessage(error));
      } finally {
        savingRef.current = false;
        setIsSaving(false);
      }
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

      const widthInArray = Math.floor(
        product?.m3InArray / product?.volumeBlockOnPallet,
      );

      const need = Math.floor(widthInArray);

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
        console.warn('Warehouse row not found for:', {
          batch_article,
          targetDate6,
        });
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

      dispatch(updateRemainingStock(updatedRow));
    };

    const handleRecipeChange = (selectedOption) => {
      const found = availableRecipes.find((r) => r.id === selectedOption.value);

      setSelectedRecipe(found || null);
      setRecipeArticle(found?.article || '');

      if (!found) {
        setSelectedAlu1Type(null);
        setSelectedAlu2Type(null);
        return;
      }

      if (found.aluminum_type) {
        setSelectedAlu1Type({
          value: found.aluminum_type,
          label: found.aluminum_type,
        });
      } else {
        setSelectedAlu1Type(null);
      }

      if (found.aluminum_2_type) {
        setSelectedAlu2Type({
          value: found.aluminum_2_type,
          label: found.aluminum_2_type,
        });
      } else {
        setSelectedAlu2Type(null);
      }
    };

    return (
      <div>
        <Modal isOpen={isOpen} toggle={toggle} size="xl">
          <ModalHeader toggle={toggle} className="rmc-modal-header">
            <div className="rmc-header">
              <div className="rmc-header-field" style={{ minWidth: 220 }}>
                <span className="rmc-header-label">Recipe article</span>
                {recipeArticle ? (
                  <b className="rmc-header-value">{recipeArticle || '—'}</b>
                ) : (
                  <span className="text-muted">No recipes</span>
                )}
              </div>

              <div className="rmc-header-field" style={{ flex: 1, minWidth: 260 }}>
                <span className="rmc-header-label">Recipe</span>
                <Select
                  onChange={handleRecipeChange}
                  options={availableRecipes.map((r) => ({
                    value: r.id,
                    label: r.description,
                  }))}
                  value={
                    selectedRecipe
                      ? {
                          value: selectedRecipe.id,
                          label: selectedRecipe.description,
                        }
                      : null
                  }
                  menuPortalTarget={
                    typeof document !== 'undefined' ? document.body : null
                  }
                  styles={{
                    control: (provided) => ({
                      ...provided,
                      minHeight: 38,
                      borderRadius: 8,
                      borderColor: '#dcdfe4',
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
              </div>
            </div>
          </ModalHeader>

          <Fragment>
            <ModalBody
              className="rmc-modal-body"
              style={{ overflow: 'auto', maxHeight: '70vh' }}
            >
              <table className="table-waste">
                <thead>
                  <tr>
                    <th className="th-raw">Raw material</th>
                    <th className="th-mod-recipe">Modified recipe</th>
                    <th className="th-consumed">Consumed</th>
                  </tr>
                </thead>

                <tbody>
                  {materialsMap.map(({ label, key }) => {
                    if (!shouldShowRow(label, key)) return null;

                    const aKey = `${key}_actual_reciepe`;
                    const base = baseByLabel(label, key);
                    const consumed = computeConsumed(key);
                    const modified = isRecipeModified(key);

                    return (
                      <tr key={key}>
                        <td>
                          <div className="fw-semibold">{label}</div>
                          {key === 'aluminum_paste' && (
                            <div style={{ marginTop: '4px', minWidth: '150px' }}>
                              <Select
                                options={aluminum1TypeOptions}
                                value={selectedAlu1Type}
                                onChange={setSelectedAlu1Type}
                                placeholder="Select type..."
                                isClearable
                                styles={{
                                  control: (base) => ({
                                    ...base,
                                    minHeight: '32px',
                                  }),
                                  menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                                }}
                                menuPortalTarget={document.body}
                              />
                            </div>
                          )}
                          {key === 'aluminum_paste_2' && (
                            <div style={{ marginTop: '4px', minWidth: '150px' }}>
                              <Select
                                options={aluminum1TypeOptions}
                                value={selectedAlu2Type}
                                onChange={setSelectedAlu2Type}
                                placeholder="Select type..."
                                isClearable
                                styles={{
                                  control: (base) => ({
                                    ...base,
                                    minHeight: '32px',
                                  }),
                                  menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                                }}
                                menuPortalTarget={document.body}
                              />
                            </div>
                          )}
                          <div className="text-muted-small">
                            def: {isEmptyOrZero(base) ? '—' : base}
                          </div>
                        </td>

                        <td>
                          <div className="modified-recipe-cell">
                            <input
                              className={
                                'form-control' + (modified ? ' is-modified' : '')
                              }
                              inputMode="decimal"
                              placeholder="0"
                              value={form[aKey] ?? ''}
                              onChange={handleChange(aKey)}
                            />

                            <button
                              type="button"
                              className="btn-set-def"
                              onClick={() => resetToDef(key)}
                              disabled={!modified}
                              title="Set default recipe value"
                            >
                              set def
                            </button>

                            {hasPrevValue(key) && (
                              <button
                                type="button"
                                className="btn-set-def"
                                onClick={() => resetToPrev(key)}
                                title={`Set previous value: ${previousLotesRecord[key]}`}
                              >
                                set prev
                              </button>
                            )}
                          </div>
                        </td>

                        <td className="td-consumed">
                          {consumed === null ? '—' : consumed}
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
                  id="warehouse-checkbox"
                  className="form-check-input"
                  type="checkbox"
                  checked={govno}
                  onChange={(e) => setGovno(e.target.checked)}
                />
                <label className="form-check-label" htmlFor="warehouse-checkbox">
                  All to return slurry
                </label>
              </div>

              <div className="d-flex gap-2">
                <button
                  className="btn btn-outline-secondary"
                  onClick={toggle}
                  disabled={isSaving}
                >
                  Cancel
                </button>
                <button
                  className="btn btn-success"
                  onClick={handleSave}
                  disabled={isSaving}
                >
                  {isSaving ? 'Saving...' : 'Save'}
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
