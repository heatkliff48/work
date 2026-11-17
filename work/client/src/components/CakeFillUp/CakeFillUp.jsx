import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from 'reactstrap';
import Table from '#components/Table/Table';
import { TextSearchFilter } from '#components/Table/filters.js';
import { useWarehouseContext } from '#components/contexts/WarehouseContext.js';
import { useProjectContext } from '#components/contexts/Context.js';
import { useDispatch, useSelector } from 'react-redux';
import Select from 'react-select';
import axios from 'axios';
import { getApiUrl } from '#utils/getApiUrl.js';
import { addNewLotesListCakes } from '#components/redux/actions/lotesListAction.js';
import {
  deleteBatchOutside,
  updateBatchOutside,
} from '#components/redux/actions/batchOutsideAction.js';
import { addNewRawMatConsumption } from '#components/redux/actions/recipeAction.js';
import { useProductsContext } from '#components/contexts/ProductContext.js';
import { useRecipeContext } from '#components/contexts/RecipeContext.js';
import { addNewProductionQuality } from '#components/redux/actions/productionQualityAction.js';
import {
  addNewAutoclaveCalendar,
  getRawMaterialsWarehouse,
} from '#components/redux/actions/warehouseAction.js';
import RawMaterialsConsumptionModal from '#components/CakeFillUp/RawMatConsumptionModalUPD.jsx';
import { useModalContext } from '#components/contexts/ModalContext.js';
import {
  getWarehouseAluminum1,
  getWarehouseAluminum2,
} from '#components/redux/actions/warehouseRawMaterialsAction.js';

const MAX_WHOLE_DIGITS = 2;

// Casting temperature and flowability keep at most two digits before the
// decimal separator, so typing "295" turns into "29.5".
const limitWholeDigits = (rawValue) => {
  const cleanedValue = String(rawValue ?? '')
    .replace(',', '.')
    .replace(/[^\d.]/g, '');

  if (!cleanedValue) return '';

  const [wholePart = '', ...restParts] = cleanedValue.split('.');
  const fractionPart = restParts.join('');

  if (wholePart.length <= MAX_WHOLE_DIGITS) {
    return fractionPart ? `${wholePart}.${fractionPart}` : wholePart;
  }

  return `${wholePart.slice(0, MAX_WHOLE_DIGITS)}.${wholePart.slice(
    MAX_WHOLE_DIGITS
  )}${fractionPart}`;
};

function CakeFillUp() {
  const dispatch = useDispatch();
  const { t } = useTranslation('casting');

  const { batchOutside, autoclave_calendar, raw_materials_warehouse } =
    useWarehouseContext();
  const { cakeFillUp, setCakeFillUp, lotesListBatches, lotesListCakes } =
    useProjectContext();
  const { raw_mat_consumption, list_of_recipes = [] } = useRecipeContext();
  const { latestProducts, extractProductTitle } = useProductsContext();
  const { rawMaterialConsumptionMadal, setRawMaterialConsumptionMadal } =
    useModalContext();

  const warehouseAluminum1 = useSelector((state) => state.warehouseAluminum1);

  const [activeBatchId, setActiveBatchId] = useState(null);
  const [currentProduct, setCurrentProduct] = useState(null);
  const [activeCakeId, setActiveCakeId] = useState(null);
  const [activeRecipeArticle, setActiveRecipeArticle] = useState(null);
  const [total_cake, setTotalCake] = useState(0);
  const [cakeNotes, setCakeNotes] = useState({});
  const [cakeCastingTemperatures, setCakeCastingTemperatures] = useState({});
  const [cakeFlowabilities, setCakeFlowabilities] = useState({});
  const [cakeSlurried, setCakeSlurried] = useState({});

  const [alu1Type, setAlu1Type] = useState(null);
  const [alu1Qty, setAlu1Qty] = useState('');
  const [alu2Type, setAlu2Type] = useState(null);
  const [alu2Qty, setAlu2Qty] = useState('');
  const [isWritingOffAlu, setIsWritingOffAlu] = useState(false);
  const [batchAluminumConsumptions, setBatchAluminumConsumptions] = useState([]);

  const production_plan_table = [
    { Header: t('columns.date'), accessor: 'date', Filter: TextSearchFilter },
    {
      Header: t('columns.productArticle'),
      accessor: 'product_article',
      Filter: TextSearchFilter,
    },
    {
      Header: t('columns.cakesQty'),
      accessor: 'quantity_arrays',
      Filter: TextSearchFilter,
    },
    {
      Header: t('columns.positionInAutoclave'),
      accessor: 'position_in_autoclave',
      Filter: TextSearchFilter,
    },
  ];

  const [productionPlanDataList, setProductionPlanDataList] = useState([]);

  const nextBatchId = useMemo(() => {
    const lotes = Array.isArray(lotesListBatches) ? lotesListBatches : [];
    const consumptions = Array.isArray(raw_mat_consumption)
      ? raw_mat_consumption
      : [];

    const maxLotesBatchId = lotes.reduce((max, item) => {
      const value = Number(item?.batch_id);
      return Number.isFinite(value) ? Math.max(max, value) : max;
    }, 0);

    const maxConsumptionBatchId = consumptions.reduce((max, item) => {
      const value = Number(item?.batch_id);
      return Number.isFinite(value) ? Math.max(max, value) : max;
    }, 0);

    return Math.max(maxLotesBatchId, maxConsumptionBatchId) + 1;
  }, [lotesListBatches, raw_mat_consumption]);

  useEffect(() => {
    if (batchOutside) {
      const results = batchOutside
        .filter((el) => el.is_prodused == 0 || el.is_prodused == null)
        .map((item) => {
          const product = latestProducts.find(
            (p) => p.article === item.product_article
          );
          const m3InArray = Number(product?.m3InArray) || 0;
          const volumeBlockOnPallet = Number(product?.volumeBlockOnPallet) || 0;
          const palletsPerArray = Math.max(
            1,
            Math.floor(m3InArray / volumeBlockOnPallet) || 1
          );
          const quantity_arrays = Math.ceil(item.quantity_pallets / palletsPerArray);
          return { ...item, quantity_arrays };
        });
      setProductionPlanDataList(results);
    }
  }, [batchOutside, latestProducts]);

  useEffect(() => {
    dispatch(getRawMaterialsWarehouse());
    dispatch(getWarehouseAluminum1());
    dispatch(getWarehouseAluminum2());
  }, [dispatch]);

  // Stock is checked when the consumption modal opens. Receipt edits do not
  // always push a new summary over the socket, so read the warehouse again.
  useEffect(() => {
    if (!rawMaterialConsumptionMadal) return;

    dispatch(getRawMaterialsWarehouse());
    dispatch(getWarehouseAluminum1());
    dispatch(getWarehouseAluminum2());
  }, [dispatch, rawMaterialConsumptionMadal]);

  const handleProductionPlanRowClick = (row) => {
    const prodPlanEntry = batchOutside.find((el) => el.id === row.original.id);
    if (!prodPlanEntry) return;

    // партия, из которой вернулись кнопкой «Назад», сохраняет свой номер
    const batchId =
      prodPlanEntry.batch_id != null ? Number(prodPlanEntry.batch_id) : nextBatchId;

    setActiveBatchId(batchId);

    // номер партии сохраняем в строке плана, по нему партия и восстанавливается
    dispatch(
      updateBatchOutside({
        id: prodPlanEntry.id,
        is_prodused: 1,
        batch_id: batchId,
      })
    );
  };

  const currentProductName = (() => {
    if (!currentProduct?.description) return null;

    const match = currentProduct.description.match(
      /BAUBLOCK®\s+([^ ]+(?:\s+[^ ]+)?\s+\d*\.?\d+)/
    );

    return match?.[1] || null;
  })();

  useEffect(() => {
    if (!batchOutside?.length) return;

    const batchInProduce = batchOutside.find((item) => item.is_prodused == 1);

    if (!batchInProduce) {
      setActiveBatchId(null);
      return;
    }

    if (batchInProduce.batch_id != null) {
      setActiveBatchId(Number(batchInProduce.batch_id));
      return;
    }

    // Ниже — прежний подбор партии для строк, открытых до появления
    // BatchOutsides.batch_id. Он угадывает партию по заказу или продукту и
    // может подхватить уже закрытую партию, поэтому для новых строк не нужен.
    const list = Array.isArray(lotesListBatches) ? lotesListBatches : [];
    const consumptions = Array.isArray(raw_mat_consumption)
      ? raw_mat_consumption
      : [];
    const orderId = batchInProduce.id_ordered_product_to_warehouse;

    const relatedConsumptions = consumptions.filter((item) => {
      if (orderId == null || item?.id_ordered_product_to_warehouse == null) {
        return false;
      }

      return String(item.id_ordered_product_to_warehouse) === String(orderId);
    });

    if (relatedConsumptions.length) {
      const lastBatchId = relatedConsumptions.reduce((max, item) => {
        const value = Number(item?.batch_id);
        return Number.isFinite(value) ? Math.max(max, value) : max;
      }, 0);

      if (lastBatchId > 0) {
        setActiveBatchId(lastBatchId);
        return;
      }
    }

    const relatedLotes = list.filter((item) => {
      if (orderId == null || item?.id_ordered_product_to_warehouse == null) {
        return false;
      }

      return String(item.id_ordered_product_to_warehouse) === String(orderId);
    });

    const existingRecords = relatedLotes.length
      ? relatedLotes
      : list.filter(
          (item) =>
            currentProductName != null &&
            String(item.product) === String(currentProductName)
        );

    if (existingRecords.length) {
      const lastRecord = existingRecords.reduce((latest, item) => {
        if (!latest) return item;

        return Number(item.id) > Number(latest.id) ? item : latest;
      }, null);

      setActiveBatchId(Number(lastRecord.batch_id));

      return;
    }

    setActiveBatchId(nextBatchId);
  }, [
    batchOutside,
    lotesListBatches,
    raw_mat_consumption,
    currentProductName,
    nextBatchId,
  ]);

  useEffect(() => {
    setCakeFillUp({});
    setCurrentProduct(null);
    setActiveCakeId(null);
    setActiveRecipeArticle(null);
    setCakeNotes({});
    setCakeCastingTemperatures({});
    setCakeFlowabilities({});
    setCakeSlurried({});
    setAlu1Qty('');
    setAlu2Qty('');
    setBatchAluminumConsumptions([]);
  }, []);

  useEffect(() => {
    const batch_in_produce = batchOutside.find((el) => el.is_prodused == 1);
    console.log('batch_in_produce CakeFillUp.jsx line 204', batch_in_produce);
    if (batch_in_produce) {
      const product = latestProducts.find(
        (el) => el.article === batch_in_produce?.product_article
      );
      const fullMark = extractProductTitle(product?.description);
      setCurrentProduct({ ...product, tradingMark: fullMark });

      const widthInArray = Math.floor(
        product?.m3InArray / product?.volumeBlockOnPallet
      );
      const accd = autoclave_calendar.find(
        (el) => el.date === batch_in_produce.date
      );

      const total_cake =
        batch_in_produce.quantity_pallets / widthInArray -
        (Number(accd?.total_arrays_cake_fill_up) || 0);

      const full_total_cake = batch_in_produce.quantity_pallets / widthInArray;

      setTotalCake(Number.isFinite(full_total_cake) ? full_total_cake : 0);
      setCakeFillUp({ ...batch_in_produce, total_cake });
    } else {
      setCakeFillUp({});
      setCurrentProduct(null);
      setTotalCake(0);
    }
  }, [batchOutside, autoclave_calendar, latestProducts, setCakeFillUp]);

  const totalCake =
    Number(cakeFillUp?.total_cake ?? cakeFillUp?.total_quantity_plan ?? 0) || 0;

  const batchCalDate = cakeFillUp?.date ?? cakeFillUp?.batch_cal_date ?? '';

  const allocated = useMemo(() => {
    if (activeBatchId == null) return 0;

    const list = Array.isArray(lotesListBatches) ? lotesListBatches : [];

    return list.reduce((total, item) => {
      if (String(item?.batch_id) !== String(activeBatchId)) return total;

      const quantity = Number(item?.quantity_cakes);
      return Number.isFinite(quantity) ? total + quantity : total;
    }, 0);
  }, [activeBatchId, lotesListBatches]);

  const nextProductSummary = useMemo(() => {
    if (!batchCalDate) return null;

    const nextBatch = (Array.isArray(batchOutside) ? batchOutside : []).find(
      (item) =>
        String(item?.id) !== String(cakeFillUp?.id) &&
        item?.date === batchCalDate &&
        (item?.is_prodused == 0 || item?.is_prodused == null)
    );

    if (!nextBatch) return null;

    const product = latestProducts.find(
      (item) => item.article === nextBatch.product_article
    );
    const widthInArray = Math.max(
      1,
      Math.floor(
        (Number(product?.m3InArray) || 0) /
          (Number(product?.volumeBlockOnPallet) || 1)
      ) || 1
    );
    const nextTotalQuantity =
      (Number(nextBatch.quantity_pallets) || 0) / widthInArray;

    return {
      article: nextBatch.product_article || product?.article || '—',
      mark: extractProductTitle(product?.description) || '—',
      totalQuantity: nextTotalQuantity,
    };
  }, [
    batchCalDate,
    batchOutside,
    cakeFillUp?.id,
    extractProductTitle,
    latestProducts,
  ]);

  const productionCakes = useMemo(() => {
    if (activeBatchId == null) return [];

    const batches = Array.isArray(lotesListBatches) ? lotesListBatches : [];
    const cakes = Array.isArray(lotesListCakes) ? lotesListCakes : [];

    return batches
      .filter((record) => String(record?.batch_id) === String(activeBatchId))
      .flatMap((record) => {
        const cakeIdStart = Number(record?.cake_id_start);
        const cakeIdFinish = Number(record?.cake_id_finish);

        if (
          !Number.isFinite(cakeIdStart) ||
          !Number.isFinite(cakeIdFinish) ||
          cakeIdFinish < cakeIdStart
        ) {
          return [];
        }

        return Array.from({ length: cakeIdFinish - cakeIdStart + 1 }, (_, index) => {
          const id = cakeIdStart + index;
          const savedCake = cakes.find((item) => Number(item?.id) === id);

          return {
            id,
            note: savedCake?.note || '',
            moldId:
              savedCake?.mold_id != null && String(savedCake.mold_id).trim()
                ? String(savedCake.mold_id).trim()
                : '',
            castingTemperature: record?.casting_temp_c ?? '',
            flowability: savedCake?.flowability ?? '',
            slurried: Boolean(savedCake?.slurried),
          };
        });
      })
      .sort((a, b) => a.id - b.id);
  }, [activeBatchId, lotesListBatches, lotesListCakes]);

  const productionCakeRows = useMemo(() => {
    const rows = [];

    for (let index = 0; index < productionCakes.length; index += 8) {
      rows.push(productionCakes.slice(index, index + 8));
    }

    return rows;
  }, [productionCakes]);

  const handleSaveCakeNote = async (cake) => {
    const note = cakeNotes[cake.id] ?? cake.note ?? '';
    const castingTemperature =
      cakeCastingTemperatures[cake.id] ?? cake.castingTemperature ?? '';
    const flowability = cakeFlowabilities[cake.id] ?? cake.flowability ?? '';
    const slurried = cakeSlurried[cake.id] ?? cake.slurried;

    const normalizeOptionalNumber = (value) => {
      if (value === '' || value == null) return null;

      const numericValue = Number(value);
      return Number.isFinite(numericValue) ? numericValue : null;
    };

    try {
      await dispatch(
        addNewLotesListCakes({
          id: cake.id,
          note,
          casting_temp_c: normalizeOptionalNumber(castingTemperature),
          flowability: normalizeOptionalNumber(flowability),
          slurried,
        })
      );

      setCakeNotes((previousNotes) => ({
        ...previousNotes,
        [cake.id]: note,
      }));
      setCakeCastingTemperatures((previousValues) => ({
        ...previousValues,
        [cake.id]: castingTemperature,
      }));
      setCakeFlowabilities((previousValues) => ({
        ...previousValues,
        [cake.id]: flowability,
      }));
      // The server may refuse the warehouse correction, so show the stored
      // flag instead of keeping the local one
      setCakeSlurried((previousValues) => {
        const nextValues = { ...previousValues };
        delete nextValues[cake.id];
        return nextValues;
      });
      setActiveCakeId(null);
    } catch (error) {
      console.error('Failed to save cake note:', error);
    }
  };

  const aluminumOptions = useMemo(() => {
    if (!Array.isArray(warehouseAluminum1)) return [];
    const types = [
      ...new Set(warehouseAluminum1.map((item) => item?.type).filter(Boolean)),
    ];
    return types.map((type) => ({ value: type, label: type }));
  }, [warehouseAluminum1]);

  useEffect(() => {
    if (!activeBatchId) {
      setBatchAluminumConsumptions([]);
      return;
    }

    let isMounted = true;
    const fetchConsumptions = async () => {
      try {
        const res = await axios.get(
          `${getApiUrl()}/rawMaterialsWarehouse/batch_aluminum_consumption/${activeBatchId}`,
          { withCredentials: true }
        );
        if (isMounted && Array.isArray(res.data)) {
          setBatchAluminumConsumptions(res.data);
        }
      } catch (err) {
        console.error('Failed to fetch batch aluminum consumptions:', err);
      }
    };

    fetchConsumptions();
    return () => {
      isMounted = false;
    };
  }, [activeBatchId]);

  useEffect(() => {
    if (!cakeFillUp?.product_article) return;
    const product = latestProducts.find(
      (p) => p.article === cakeFillUp.product_article
    );
    const recipe = list_of_recipes.find(
      (r) =>
        r.article === product?.recipe ||
        r.article === cakeFillUp?.recipe_article ||
        r.product === product?.description
    );

    if (recipe) {
      if (recipe.aluminum_type && !alu1Type) {
        setAlu1Type({ value: recipe.aluminum_type, label: recipe.aluminum_type });
      }
      if (recipe.aluminum_2_type && !alu2Type) {
        setAlu2Type({ value: recipe.aluminum_2_type, label: recipe.aluminum_2_type });
      }
    }
  }, [cakeFillUp?.product_article, latestProducts, list_of_recipes]);

  const totalAluWrittenOff = useMemo(() => {
    return batchAluminumConsumptions.reduce(
      (sum, c) => sum + (Number(c.quantity) || 0),
      0
    );
  }, [batchAluminumConsumptions]);

  const handleWriteOffAluminum = async () => {
    if (!activeBatchId) return;

    const q1 = Number(alu1Qty) || 0;
    const q2 = Number(alu2Qty) || 0;

    if (q1 <= 0 && q2 <= 0) {
      alert(t('enterQuantityAlert'));
      return;
    }

    if (q1 > 0 && !alu1Type?.value) {
      alert(t('selectAluTypeAlert'));
      return;
    }

    if (q2 > 0 && !alu2Type?.value) {
      alert(t('selectAluTypeAlert'));
      return;
    }

    const items = [];
    if (q1 > 0 && alu1Type?.value) {
      items.push({ type: alu1Type.value, quantity: q1 });
    }
    if (q2 > 0 && alu2Type?.value) {
      items.push({ type: alu2Type.value, quantity: q2 });
    }

    setIsWritingOffAlu(true);
    try {
      const res = await axios.post(
        `${getApiUrl()}/rawMaterialsWarehouse/batch_aluminum_consumption`,
        {
          batch_id: activeBatchId,
          date: batchCalDate || undefined,
          items,
        },
        { withCredentials: true }
      );

      if (res.data?.newConsumptions) {
        setBatchAluminumConsumptions((prev) => [
          ...prev,
          ...res.data.newConsumptions,
        ]);
      }

      dispatch(getWarehouseAluminum1());
      dispatch(getRawMaterialsWarehouse());

      setAlu1Qty('');
      setAlu2Qty('');
      alert(t('writeOffSuccess'));
    } catch (err) {
      console.error('Write off error:', err);
      const message =
        err.response?.data?.message ||
        t('alerts.writeOffFailed');
      const shortageDetails = err.response?.data?.shortageDetails;
      if (Array.isArray(shortageDetails) && shortageDetails.length) {
        const details = shortageDetails
          .map(
            (s) =>
              `${s.subtype}: need ${s.required}, available ${s.available}, shortage ${s.shortage}`
          )
          .join('\n');
        alert(`${message}\n\n${details}`);
      } else {
        alert(message);
      }
    } finally {
      setIsWritingOffAlu(false);
    }
  };

  const isFullyAllocated = total_cake > 0 && allocated >= total_cake;

  const handleNewBatch = () => {
    if (isFullyAllocated) {
      const shouldContinue = window.confirm(t('confirm.allCakesFilled'));

      if (!shouldContinue) return;

      const isConfirmed = window.confirm(t('confirm.areYouSure'));

      if (!isConfirmed) return;
    }

    setRawMaterialConsumptionMadal(true);
  };

  const handleSave = async ({ productionVolume, recipeArticle }) => {
    const currentAllocated = Number(productionVolume) || 0;
    if (currentAllocated <= 0) return;

    const { product_article = null, date } = cakeFillUp;

    setActiveRecipeArticle(recipeArticle || null);

    dispatch(
      addNewProductionQuality({
        batch_id: activeBatchId,
        date,
        product_article,
        quantity: currentAllocated,
      })
    );

    const accd = autoclave_calendar.find((el) => el.date === date);
    if (!accd) {
      console.error('Autoclave calendar entry not found for date:', date);
      return;
    }

    const prevTotalArrays = Number(accd.total_arrays) || 0;
    const prevTotalCakeFillUp = Number(accd.total_arrays_cake_fill_up) || 0;

    const result = [
      {
        ...accd,
        total_arrays: prevTotalArrays + currentAllocated,
        total_arrays_cake_fill_up: prevTotalCakeFillUp + currentAllocated,
      },
    ];

    dispatch(addNewAutoclaveCalendar(result));
  };

  const handleFinish = async () => {
    if (!window.confirm(t('confirm.finishBatch'))) {
      return;
    }
    const {
      id,
      product_article = null,
      date,
      id_ordered_product_to_warehouse = null,
    } = cakeFillUp;

    const batch = batchOutside.find((item) => item.id == id);
    if (!batch) {
      console.error('Batch not found:', id);
      return;
    }

    const currentAllocated = Number(allocated) || 0;
    const { quantity_pallets, quantity_free } = batch;

    const cakeIdStart = (Array.isArray(lotesListBatches) ? lotesListBatches : [])
      .filter((item) => String(item?.batch_id) === String(activeBatchId))
      .reduce((minimumId, item) => {
        const cakeIdStart = Number(item?.cake_id_start);

        if (!Number.isFinite(cakeIdStart)) return minimumId;
        return minimumId == null ? cakeIdStart : Math.min(minimumId, cakeIdStart);
      }, null);

    const accd = autoclave_calendar.find((el) => el.date === date);
    if (!accd) {
      console.error('Autoclave calendar entry not found for date:', date);
      return;
    }

    if (currentAllocated > 0) {
      if (cakeIdStart == null) {
        console.error('Cake start id not found for batch:', activeBatchId);
        return;
      }

      await dispatch(
        addNewRawMatConsumption({
          batch_id: activeBatchId,
          production_volume: currentAllocated,
          recipe_article: activeRecipeArticle,
          batch_article: product_article,
          cake_id_start: cakeIdStart,
          date,
          id_ordered_product_to_warehouse,
          consumption_calculated: true,
          batch_quantity_pallets: quantity_pallets - quantity_free || 0,
        })
      );
    }

    const totalArrays = Number(accd.total_arrays) || 0;
    const totalAutoclaves = Math.ceil(totalArrays / 21);
    const residual = totalArrays % 21;

    const result = [
      {
        ...accd,
        total_arrays: totalArrays,
        filled_autoclaves: totalAutoclaves,
        produced_autoclave: totalAutoclaves,
        residual_arrays: residual,
        total_arrays_cake_fill_up: 0,
      },
    ];

    dispatch(addNewAutoclaveCalendar(result));
    await dispatch(deleteBatchOutside(id));

    resetActiveBatch();
  };

  const resetActiveBatch = () => {
    setCakeFillUp({});
    setCurrentProduct(null);
    setActiveBatchId(null);
    setActiveCakeId(null);
    setActiveRecipeArticle(null);
    setCakeNotes({});
    setCakeCastingTemperatures({});
    setCakeFlowabilities({});
    setCakeSlurried({});
    setAlu1Qty('');
    setAlu2Qty('');
    setBatchAluminumConsumptions([]);
  };

  // Возвращает партию в план (is_prodused = 0), чтобы она больше не
  // открывалась при заходе на страницу. Если торты уже отлиты, номер партии
  // остаётся в строке плана, чтобы при повторном выборе продолжить ту же партию.
  const handleBack = () => {
    const { id } = cakeFillUp;
    if (id == null) return;

    dispatch(
      updateBatchOutside({
        id,
        is_prodused: 0,
        batch_id: allocated > 0 ? activeBatchId : null,
      })
    );

    resetActiveBatch();
  };

  const hasCakeFillUp = cakeFillUp && Object.keys(cakeFillUp).length > 0;

  const selectedRowForNewBatch = hasCakeFillUp
    ? {
        batch_id: activeBatchId,
        batch_article: cakeFillUp.product_article,
        date: cakeFillUp.date,
        production_volume: totalCake,
        recipe_article: 'No recipe',
        id_ordered_product_to_warehouse:
          cakeFillUp.id_ordered_product_to_warehouse ?? null,
      }
    : null;

  return (
    <>
      {rawMaterialConsumptionMadal && selectedRowForNewBatch && (
        <RawMaterialsConsumptionModal
          isOpen={rawMaterialConsumptionMadal}
          toggle={() => setRawMaterialConsumptionMadal(false)}
          selectedRow={selectedRowForNewBatch}
          newBatchMode
          onSave={handleSave}
          lotesListBatches={lotesListBatches}
          lotesListCakes={lotesListCakes}
          defaultAlu1Type={alu1Type?.value}
          defaultAlu2Type={alu2Type?.value}
        />
      )}

      {!hasCakeFillUp && (
        <div className="mt-3">
          <Table
            COLUMN_DATA={production_plan_table}
            dataOfTable={productionPlanDataList}
            onClickButton={() => {}}
            buttonText={''}
            tableName={t('title')}
            handleRowClick={(e) => {
              if (cakeFillUp && Object.keys(cakeFillUp).length > 0) {
                alert(t('finishCurrentBatchFirst'));
                return;
              }
              handleProductionPlanRowClick(e);
            }}
          />
        </div>
      )}

      {hasCakeFillUp && (
        <div className="mt-3" style={{ maxWidth: nextProductSummary ? 1600 : 1200 }}>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: nextProductSummary
                ? 'repeat(3, minmax(0, 1fr))'
                : 'repeat(2, minmax(0, 1fr))',
              gap: 16,
              marginBottom: '20px',
            }}
          >
            <div
              style={{
                padding: 16,
                borderRadius: 14,
                backgroundColor: '#e9ecef',
              }}
            >
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 8,
                  padding: '8px 14px',
                  marginBottom: 10,
                  borderRadius: 8,
                  backgroundColor: '#495057',
                  color: '#fff',
                  fontWeight: 600,
                  boxShadow: '0 2px 5px rgba(0,0,0,0.16)',
                }}
              >
                <span style={{ opacity: 0.75 }}>{t('date')}</span>
                <span>{batchCalDate}</span>
              </div>

              <div
                className="cake-fill-up-product"
                style={{
                  width: '100%',
                  border: '1px solid #ced4da',
                  borderRadius: '10px',
                  padding: '16px',
                  backgroundColor: '#fff',
                  display: 'grid',
                  gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
                  gap: '24px',
                  minHeight: 94,
                }}
              >
                <div>
                  <div
                    style={{
                      fontWeight: 600,
                      fontSize: '0.9rem',
                      color: '#6c757d',
                    }}
                  >
                    {t('productArticle')}
                  </div>
                  <div style={{ marginTop: 4, fontSize: '1.1rem' }}>
                    {currentProduct?.article || '—'}
                  </div>
                </div>

                <div>
                  <div
                    style={{
                      fontWeight: 600,
                      fontSize: '0.9rem',
                      color: '#6c757d',
                    }}
                  >
                    {t('productMark')}
                  </div>
                  <div style={{ marginTop: 4, fontSize: '1.1rem' }}>
                    {currentProduct?.tradingMark || '—'}
                  </div>
                </div>

                <div>
                  <div
                    style={{
                      fontWeight: 600,
                      fontSize: '0.9rem',
                      color: '#6c757d',
                    }}
                  >
                    {t('cakesCastedTotal')}
                  </div>
                  <div style={{ marginTop: 4, fontSize: '1.1rem' }}>
                    {allocated} / {total_cake}
                  </div>
                </div>
              </div>
            </div>

            <div
              style={{
                padding: 16,
                borderRadius: 14,
                backgroundColor: '#e9ecef',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
              }}
            >
              <div>
                <div
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 8,
                    padding: '8px 14px',
                    marginBottom: 10,
                    borderRadius: 8,
                    backgroundColor: '#495057',
                    color: '#fff',
                    fontWeight: 600,
                    boxShadow: '0 2px 5px rgba(0,0,0,0.16)',
                  }}
                >
                  <span>{t('aluminumSuspensionTitle')}</span>
                </div>

                <div
                  style={{
                    width: '100%',
                    border: '1px solid #ced4da',
                    borderRadius: '10px',
                    padding: '12px 14px',
                    backgroundColor: '#fff',
                  }}
                >
                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: '1.2fr 1fr',
                      gap: 10,
                      marginBottom: 8,
                    }}
                  >
                    <div>
                      <label
                        style={{
                          fontSize: '0.8rem',
                          fontWeight: 600,
                          color: '#6c757d',
                          marginBottom: 2,
                          display: 'block',
                        }}
                      >
                        {t('aluminum1')}
                      </label>
                      <Select
                        placeholder={t('modal.selectType')}
                        options={aluminumOptions}
                        value={alu1Type}
                        onChange={setAlu1Type}
                        isClearable
                        styles={{
                          control: (base) => ({ ...base, minHeight: '32px' }),
                          menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                        }}
                        menuPortalTarget={document.body}
                      />
                    </div>
                    <div>
                      <label
                        style={{
                          fontSize: '0.8rem',
                          fontWeight: 600,
                          color: '#6c757d',
                          marginBottom: 2,
                          display: 'block',
                        }}
                      >
                        {t('qtyKg')}
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        min="0"
                        className="form-control form-control-sm"
                        placeholder="0.00"
                        value={alu1Qty}
                        onChange={(e) => setAlu1Qty(e.target.value)}
                        style={{ height: '38px' }}
                      />
                    </div>
                  </div>

                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: '1.2fr 1fr',
                      gap: 10,
                      marginBottom: 10,
                    }}
                  >
                    <div>
                      <label
                        style={{
                          fontSize: '0.8rem',
                          fontWeight: 600,
                          color: '#6c757d',
                          marginBottom: 2,
                          display: 'block',
                        }}
                      >
                        {t('aluminum2')}
                      </label>
                      <Select
                        placeholder={t('modal.selectType')}
                        options={aluminumOptions}
                        value={alu2Type}
                        onChange={setAlu2Type}
                        isClearable
                        styles={{
                          control: (base) => ({ ...base, minHeight: '32px' }),
                          menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                        }}
                        menuPortalTarget={document.body}
                      />
                    </div>
                    <div>
                      <label
                        style={{
                          fontSize: '0.8rem',
                          fontWeight: 600,
                          color: '#6c757d',
                          marginBottom: 2,
                          display: 'block',
                        }}
                      >
                        {t('qtyKg')}
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        min="0"
                        className="form-control form-control-sm"
                        placeholder="0.00"
                        value={alu2Qty}
                        onChange={(e) => setAlu2Qty(e.target.value)}
                        style={{ height: '38px' }}
                      />
                    </div>
                  </div>

                  <Button
                    color="success"
                    size="sm"
                    className="w-100"
                    style={{ fontWeight: 600 }}
                    onClick={handleWriteOffAluminum}
                    disabled={isWritingOffAlu}
                  >
                    {isWritingOffAlu ? t('modal.saving') : t('writeOffButton')}
                  </Button>
                </div>

                <div style={{ marginTop: 10 }}>
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      marginBottom: 4,
                    }}
                  >
                    <span
                      style={{
                        fontSize: '0.85rem',
                        fontWeight: 600,
                        color: '#495057',
                      }}
                    >
                      {t('batchWrittenOffTotal')}
                    </span>
                    <span
                      style={{
                        fontSize: '0.95rem',
                        fontWeight: 700,
                        color: '#28a745',
                      }}
                    >
                      {totalAluWrittenOff.toFixed(2)} {t('kg')}
                    </span>
                  </div>

                  <div
                    style={{
                      maxHeight: 80,
                      overflowY: 'auto',
                      fontSize: '0.8rem',
                      backgroundColor: '#fff',
                      border: '1px solid #ced4da',
                      borderRadius: 8,
                      padding: '6px 10px',
                    }}
                  >
                    {batchAluminumConsumptions.length === 0 ? (
                      <div
                        style={{
                          color: '#6c757d',
                          fontStyle: 'italic',
                          padding: '2px 0',
                        }}
                      >
                        {t('noAluminumWrittenOffYet')}
                      </div>
                    ) : (
                      batchAluminumConsumptions.map((item, idx) => (
                        <div
                          key={item.id || idx}
                          style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            padding: '3px 0',
                            borderBottom:
                              idx < batchAluminumConsumptions.length - 1
                                ? '1px dashed #dee2e6'
                                : 'none',
                          }}
                        >
                          <span>
                            <strong>{item.aluminum_type}</strong>
                            {item.date ? ` (${item.date})` : ''}
                          </span>
                          <span style={{ fontWeight: 600 }}>
                            {Number(item.quantity).toFixed(2)} {t('kg')}
                          </span>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            </div>

            {nextProductSummary && (
              <div
                style={{
                  padding: 16,
                  borderRadius: 14,
                  backgroundColor: '#5d5d5d',
                  alignSelf: 'start',
                }}
              >
                <div
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    padding: '8px 14px',
                    marginBottom: 10,
                    borderRadius: 8,
                    backgroundColor: '#6c757d',
                    color: '#fff',
                    fontWeight: 600,
                    textTransform: 'uppercase',
                    letterSpacing: '0.04em',
                  }}
                >
                  {t('next')}
                </div>

                <div
                  style={{
                    width: '100%',
                    border: '1px solid #adb5bd',
                    borderRadius: '10px',
                    padding: '16px',
                    backgroundColor: '#eef0f2',
                    display: 'grid',
                    gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
                    gap: '24px',
                    minHeight: 94,
                  }}
                >
                  <div>
                    <div
                      style={{
                        fontWeight: 600,
                        fontSize: '0.9rem',
                        color: '#5c636a',
                      }}
                    >
                      {t('productArticle')}
                    </div>
                    <div style={{ marginTop: 4, fontSize: '1.1rem' }}>
                      {nextProductSummary.article}
                    </div>
                  </div>

                  <div>
                    <div
                      style={{
                        fontWeight: 600,
                        fontSize: '0.9rem',
                        color: '#5c636a',
                      }}
                    >
                      {t('productMark')}
                    </div>
                    <div style={{ marginTop: 4, fontSize: '1.1rem' }}>
                      {nextProductSummary.mark}
                    </div>
                  </div>

                  <div>
                    <div
                      style={{
                        fontWeight: 600,
                        fontSize: '0.9rem',
                        color: '#5c636a',
                      }}
                    >
                      {t('cakesCastedTotal')}
                    </div>
                    <div style={{ marginTop: 4, fontSize: '1.1rem' }}>
                      0 / {nextProductSummary.totalQuantity}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div
            style={{
              width: '100%',
              maxWidth: nextProductSummary ? 1600 : 1200,
            }}
          >
            <div>
              <div>
                <div style={{ fontWeight: 600 }}>{t('batchId')}</div>
                <div style={{ marginTop: 6, fontSize: 18 }}>{activeBatchId}</div>
              </div>
            </div>

            <div
              className="mt-2"
              style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}
            >
              <Button color="secondary" onClick={handleBack}>
                {t('back')}
              </Button>

              <Button
                color={isFullyAllocated ? 'danger' : 'success'}
                onClick={handleNewBatch}
              >
                {t('newCake')}
              </Button>

              <div
                className="ms-auto"
                style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}
              >
                <Button color="success" onClick={handleFinish}>
                  {t('finishBatch')}
                </Button>
              </div>
            </div>

            <div className="mt-4">
              <div style={{ fontWeight: 600 }}>{t('cakeId')}</div>

              {productionCakes.length === 0 && (
                <div style={{ marginTop: 8, color: '#6c757d' }}>
                  {t('noCakes')}
                </div>
              )}

              <div style={{ display: 'grid', gap: 8, marginTop: 8 }}>
                {productionCakeRows.map((cakeRow) => {
                  const activeCake = cakeRow.find(
                    (cake) => activeCakeId === cake.id
                  );

                  return (
                    <div key={cakeRow[0].id}>
                      <div
                        style={{
                          display: 'grid',
                          gridTemplateColumns: 'repeat(8, minmax(0, 1fr))',
                          gap: 8,
                        }}
                      >
                        {cakeRow.map((cake) => {
                          const isActive = activeCakeId === cake.id;

                          return (
                            <div
                              key={cake.id}
                              onClick={() =>
                                setActiveCakeId(isActive ? null : cake.id)
                              }
                              role="button"
                              tabIndex={0}
                              onKeyDown={(event) => {
                                if (event.key === 'Enter' || event.key === ' ') {
                                  event.preventDefault();
                                  setActiveCakeId(isActive ? null : cake.id);
                                }
                              }}
                              style={{
                                border: isActive
                                  ? '2px solid #28a745'
                                  : '1px solid rgba(0,0,0,0.25)',
                                borderRadius: 10,
                                padding: '6px 10px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: 6,
                                cursor: 'pointer',
                                userSelect: 'none',
                                background: isActive
                                  ? 'rgba(40,167,69,0.08)'
                                  : 'transparent',
                                fontWeight: 600,
                                minWidth: 0,
                              }}
                            >
                              <span style={{ opacity: 0.7 }}>#</span>
                              <span>{cake.id}</span>
                              <span
                                style={{
                                  opacity: 0.6,
                                  fontWeight: 400,
                                  whiteSpace: 'nowrap',
                                }}
                                title={
                                  cake.moldId
                                    ? t('moldIdTitle', { id: cake.moldId })
                                    : t('noteTitle')
                                }
                              >
                                {isActive ? '▲' : '▼'}{' '}
                                {cake.moldId || t('noteShort')}
                              </span>
                            </div>
                          );
                        })}
                      </div>

                      {activeCake && (
                        <div style={{ marginTop: 6, maxWidth: 520 }}>
                          <div
                            style={{
                              display: 'grid',
                              gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
                              gap: 8,
                              marginBottom: 8,
                            }}
                          >
                            <label style={{ margin: 0 }}>
                              <span
                                style={{
                                  display: 'block',
                                  marginBottom: 4,
                                  fontSize: '0.8rem',
                                  fontWeight: 600,
                                }}
                              >
                                {t('castingTemperature')}
                              </span>
                              <input
                                type="number"
                                step="0.1"
                                min="0"
                                max="99.9"
                                value={
                                  cakeCastingTemperatures[activeCake.id] ??
                                  activeCake.castingTemperature ??
                                  ''
                                }
                                onChange={(event) => {
                                  const nextValue = limitWholeDigits(
                                    event.target.value
                                  );

                                  setCakeCastingTemperatures((previousValues) => ({
                                    ...previousValues,
                                    [activeCake.id]: nextValue,
                                  }));
                                }}
                                onKeyDown={(event) => {
                                  if (event.key === 'Enter') {
                                    event.preventDefault();
                                    handleSaveCakeNote(activeCake);
                                  }
                                }}
                                style={{
                                  width: '100%',
                                  borderRadius: 6,
                                  padding: '6px 8px',
                                  border: '1px solid rgba(0,0,0,0.25)',
                                }}
                              />
                            </label>

                            <label style={{ margin: 0 }}>
                              <span
                                style={{
                                  display: 'block',
                                  marginBottom: 4,
                                  fontSize: '0.8rem',
                                  fontWeight: 600,
                                }}
                              >
                                {t('flowability')}
                              </span>
                              <input
                                type="number"
                                step="0.1"
                                min="0"
                                max="99.9"
                                value={
                                  cakeFlowabilities[activeCake.id] ??
                                  activeCake.flowability ??
                                  ''
                                }
                                onChange={(event) => {
                                  const nextValue = limitWholeDigits(
                                    event.target.value
                                  );

                                  setCakeFlowabilities((previousValues) => ({
                                    ...previousValues,
                                    [activeCake.id]: nextValue,
                                  }));
                                }}
                                onKeyDown={(event) => {
                                  if (event.key === 'Enter') {
                                    event.preventDefault();
                                    handleSaveCakeNote(activeCake);
                                  }
                                }}
                                style={{
                                  width: '100%',
                                  borderRadius: 6,
                                  padding: '6px 8px',
                                  border: '1px solid rgba(0,0,0,0.25)',
                                }}
                              />
                            </label>
                          </div>

                          <div className="form-check" style={{ marginBottom: 8 }}>
                            <input
                              id={`cake-slurried-${activeCake.id}`}
                              className="form-check-input"
                              type="checkbox"
                              checked={
                                cakeSlurried[activeCake.id] ?? activeCake.slurried
                              }
                              onChange={(event) =>
                                setCakeSlurried((previousValues) => ({
                                  ...previousValues,
                                  [activeCake.id]: event.target.checked,
                                }))
                              }
                            />
                            <label
                              className="form-check-label"
                              htmlFor={`cake-slurried-${activeCake.id}`}
                            >
                              {t('slurried')}
                            </label>
                          </div>

                          <textarea
                            rows={3}
                            placeholder={t('notePlaceholder', { id: activeCake.id })}
                            value={cakeNotes[activeCake.id] ?? activeCake.note ?? ''}
                            onChange={(event) =>
                              setCakeNotes((previousNotes) => ({
                                ...previousNotes,
                                [activeCake.id]: event.target.value,
                              }))
                            }
                            onKeyDown={(event) => {
                              if (
                                event.key === 'Enter' &&
                                !event.shiftKey &&
                                !event.nativeEvent.isComposing
                              ) {
                                event.preventDefault();
                                handleSaveCakeNote(activeCake);
                              }
                            }}
                            title={t('noteHint')}
                            style={{
                              width: '100%',
                              borderRadius: 10,
                              padding: 10,
                              border: '1px solid rgba(0,0,0,0.25)',
                              outline: 'none',
                              display: 'block',
                            }}
                          />

                          <Button
                            color="success"
                            size="sm"
                            onClick={() => handleSaveCakeNote(activeCake)}
                            style={{ marginTop: 8 }}
                          >
                            {t('saveNote')}
                          </Button>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default CakeFillUp;
