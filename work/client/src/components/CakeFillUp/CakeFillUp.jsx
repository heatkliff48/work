import { useEffect, useMemo, useState } from 'react';
import { Button } from 'reactstrap';
import Table from '#components/Table/Table';
import { TextSearchFilter } from '#components/Table/filters.js';
import { useWarehouseContext } from '#components/contexts/WarehouseContext.js';
import { useProjectContext } from '#components/contexts/Context.js';
import { useDispatch } from 'react-redux';
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

function CakeFillUp() {
  const dispatch = useDispatch();

  const { batchOutside, autoclave_calendar, raw_materials_warehouse } =
    useWarehouseContext();
  const { cakeFillUp, setCakeFillUp, lotesListBatches, lotesListCakes } =
    useProjectContext();
  const { raw_mat_consumption } = useRecipeContext();
  const { latestProducts, extractProductTitle } = useProductsContext();
  const { rawMaterialConsumptionMadal, setRawMaterialConsumptionMadal } =
    useModalContext();

  const [activeBatchId, setActiveBatchId] = useState(null);
  const [currentProduct, setCurrentProduct] = useState(null);
  const [activeCakeId, setActiveCakeId] = useState(null);
  const [activeRecipeArticle, setActiveRecipeArticle] = useState(null);
  const [total_cake, setTotalCake] = useState(0);
  const [cakeNotes, setCakeNotes] = useState({});
  const [cakeCastingTemperatures, setCakeCastingTemperatures] = useState({});
  const [cakeFlowabilities, setCakeFlowabilities] = useState({});

  const production_plan_table = [
    { Header: 'Date', accessor: 'date', Filter: TextSearchFilter },
    {
      Header: 'Product article',
      accessor: 'product_article',
      Filter: TextSearchFilter,
    },
    { Header: 'Cakes, qty', accessor: 'quantity_arrays', Filter: TextSearchFilter },
    {
      Header: 'Position in autoclave',
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

  const handleProductionPlanRowClick = (row) => {
    const prodPlanEntry = batchOutside.find((el) => el.id === row.original.id);
    if (!prodPlanEntry) return;

    setActiveBatchId(nextBatchId);

    dispatch(
      updateBatchOutside({
        id: prodPlanEntry.id,
        is_prodused: 1,
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
      setActiveCakeId(null);
    } catch (error) {
      console.error('Failed to save cake note:', error);
    }
  };

  const isFullyAllocated = total_cake > 0 && allocated >= total_cake;

  const handleNewBatch = () => {
    if (isFullyAllocated) {
      const shouldContinue = window.confirm(
        'Все массивы залиты, желаете продолжить?'
      );

      if (!shouldContinue) return;

      const isConfirmed = window.confirm('Вы уверены, что хотите продолжить?');

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
    if (!window.confirm('Do you want to continue?')) {
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

    setCakeFillUp({});
    setCurrentProduct(null);
    setActiveBatchId(null);
    setActiveCakeId(null);
    setActiveRecipeArticle(null);
    setCakeNotes({});
    setCakeCastingTemperatures({});
    setCakeFlowabilities({});
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
        />
      )}

      {!hasCakeFillUp && (
        <div className="mt-3">
          <Table
            COLUMN_DATA={production_plan_table}
            dataOfTable={productionPlanDataList}
            onClickButton={() => {}}
            buttonText={''}
            tableName={'Casting'}
            handleRowClick={(e) => {
              if (cakeFillUp && Object.keys(cakeFillUp).length > 0) {
                alert('Please finish the current batch before selecting a new one.');
                return;
              }
              handleProductionPlanRowClick(e);
            }}
          />
        </div>
      )}

      {hasCakeFillUp && (
        <div className="mt-3" style={{ maxWidth: nextProductSummary ? 1500 : 900 }}>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: nextProductSummary
                ? 'repeat(2, minmax(0, 1fr))'
                : 'minmax(0, 1fr)',
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
                <span style={{ opacity: 0.75 }}>Date</span>
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
                    Product article
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
                    Product Mark
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
                    Cakes casted / Total qty
                  </div>
                  <div style={{ marginTop: 4, fontSize: '1.1rem' }}>
                    {allocated} / {total_cake}
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
                  Next
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
                      Product article
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
                      Product Mark
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
                      Cakes casted / Total qty
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
              width: nextProductSummary ? 'calc(50% - 8px)' : '100%',
            }}
          >
            <div>
              <div>
                <div style={{ fontWeight: 600 }}>Batch id</div>
                <div style={{ marginTop: 6, fontSize: 18 }}>{activeBatchId}</div>
              </div>
            </div>

            <div
              className="mt-2"
              style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}
            >
              <Button
                color={isFullyAllocated ? 'danger' : 'success'}
                onClick={handleNewBatch}
              >
                New cake
              </Button>

              <div
                className="ms-auto"
                style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}
              >
                <Button color="success" onClick={handleFinish}>
                  Finish batch
                </Button>
              </div>
            </div>

            <div className="mt-4">
              <div style={{ fontWeight: 600 }}>Cake id</div>

              {productionCakes.length === 0 && (
                <div style={{ marginTop: 8, color: '#6c757d' }}>
                  No cakes allocated yet.
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
                                  cake.moldId ? `Mold id ${cake.moldId}` : 'Note'
                                }
                              >
                                {isActive ? '▲' : '▼'} {cake.moldId || 'note'}
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
                                Casting temperature, C
                              </span>
                              <input
                                type="number"
                                step="0.01"
                                value={
                                  cakeCastingTemperatures[activeCake.id] ??
                                  activeCake.castingTemperature ??
                                  ''
                                }
                                onChange={(event) =>
                                  setCakeCastingTemperatures((previousValues) => ({
                                    ...previousValues,
                                    [activeCake.id]: event.target.value,
                                  }))
                                }
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
                                Flowability, cm
                              </span>
                              <input
                                type="number"
                                step="0.1"
                                value={
                                  cakeFlowabilities[activeCake.id] ??
                                  activeCake.flowability ??
                                  ''
                                }
                                onChange={(event) =>
                                  setCakeFlowabilities((previousValues) => ({
                                    ...previousValues,
                                    [activeCake.id]: event.target.value,
                                  }))
                                }
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

                          <textarea
                            rows={3}
                            placeholder={`Note for cake id ${activeCake.id}... Enter to save, Shift+Enter for a new line`}
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
                            title="Enter — save, Shift+Enter — new line"
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
                            Save note
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
