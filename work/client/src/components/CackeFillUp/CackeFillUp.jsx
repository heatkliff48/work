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
import { addNewAutoclaveCalendar } from '#components/redux/actions/warehouseAction.js';
import RawMaterialsConsumptionModal from '#components/CackeFillUp/RawMatConsumptionModalUPD.jsx';
import { useModalContext } from '#components/contexts/ModalContext.js';

function CackeFillUp() {
  const dispatch = useDispatch();

  const { batchOutside, autoclave_calendar } = useWarehouseContext();
  const { cackeFillUp, setCackeFillUp, lotesListBatches, lotesListCakes } =
    useProjectContext();
  const { raw_mat_consumption } = useRecipeContext();
  const { latestProducts } = useProductsContext();
  const { rawMaterialConsumptionMadal, setRawMaterialConsumptionMadal } =
    useModalContext();

  const [activeBatchId, setActiveBatchId] = useState(null);
  const [currentProduct, setCurrentProduct] = useState(null);
  const [activeSubBatchKey, setActiveSubBatchKey] = useState(null);
  const [subBatchNotes, setSubBatchNotes] = useState({});

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
            (p) => p.article === item.product_article,
          );
          const m3InArray = Number(product?.m3InArray) || 0;
          const volumeBlockOnPallet = Number(product?.volumeBlockOnPallet) || 0;
          const palletsPerArray = Math.max(
            1,
            Math.floor(m3InArray / volumeBlockOnPallet) || 1,
          );
          const quantity_arrays = Math.ceil(item.quantity_pallets / palletsPerArray);
          return { ...item, quantity_arrays };
        });
      setProductionPlanDataList(results);
    }
  }, [batchOutside, latestProducts]);

  const handleProductionPlanRowClick = (row) => {
    const prodPlanEntry = batchOutside.find((el) => el.id === row.original.id);
    if (!prodPlanEntry) return;

    setActiveBatchId(nextBatchId);

    dispatch(
      updateBatchOutside({
        id: prodPlanEntry.id,
        is_prodused: 1,
      }),
    );
  };

  const currentProductName = (() => {
    if (!currentProduct?.description) return null;

    const match = currentProduct.description.match(
      /BAUBLOCK®\s+([^ ]+(?:\s+[^ ]+)?\s+\d*\.?\d+)/,
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
            String(item.product) === String(currentProductName),
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
    setCackeFillUp({});
    setCurrentProduct(null);
    setActiveSubBatchKey(null);
    setSubBatchNotes({});
  }, []);

  useEffect(() => {
    const batch_in_produce = batchOutside.find((el) => el.is_prodused == 1);

    if (batch_in_produce) {
      const product = latestProducts.find(
        (el) => el.article === batch_in_produce?.product_article,
      );
      setCurrentProduct(product);

      const widthInArray = Math.floor(
        product?.m3InArray / product?.volumeBlockOnPallet,
      );
      const accd = autoclave_calendar.find(
        (el) => el.date === batch_in_produce.date,
      );

      const total_cacke =
        batch_in_produce.quantity_pallets / widthInArray -
        (Number(accd?.total_arrays_cacke_fill_up) || 0);

      setCackeFillUp({ ...batch_in_produce, total_cacke });
    } else {
      setCurrentProduct(null);
    }
  }, [batchOutside, autoclave_calendar, latestProducts, setCackeFillUp]);

  const totalCake =
    Number(cackeFillUp?.total_cacke ?? cackeFillUp?.total_quantity_plan ?? 0) || 0;

  const batchCalDate = cackeFillUp?.date ?? cackeFillUp?.batch_cal_date ?? '';

  const allocated = useMemo(() => {
    if (activeBatchId == null) return 0;

    const list = Array.isArray(lotesListBatches) ? lotesListBatches : [];

    return list.reduce((total, item) => {
      if (String(item?.batch_id) !== String(activeBatchId)) return total;

      const quantity = Number(item?.quantity_cakes);
      return Number.isFinite(quantity) ? total + quantity : total;
    }, 0);
  }, [activeBatchId, lotesListBatches]);

  const subBatches = useMemo(() => {
    if (activeBatchId == null) return [];

    const batches = Array.isArray(lotesListBatches) ? lotesListBatches : [];
    const cakes = Array.isArray(lotesListCakes) ? lotesListCakes : [];

    return batches
      .filter((record) => String(record?.batch_id) === String(activeBatchId))
      .map((record, index) => {
        const batchId = record?.batch_id;
        const subBatchId = record?.sub_batch_id;
        const productionVolume = Number(record?.quantity_cakes) || 0;
        const cakeIdStart = Number(record?.cake_id_start);
        const cakeIdFinish = Number(record?.cake_id_finish);
        const cakeIds = [];

        if (
          Number.isFinite(cakeIdStart) &&
          Number.isFinite(cakeIdFinish) &&
          cakeIdFinish >= cakeIdStart
        ) {
          for (let id = cakeIdStart; id <= cakeIdFinish; id += 1) {
            cakeIds.push(id);
          }
        }

        const savedNote = cakeIds.reduce((note, id) => {
          if (note) return note;

          const cake = cakes.find((item) => Number(item?.id) === id);
          return cake?.note || '';
        }, '');

        return {
          key: record?.id ?? `${batchId}-${subBatchId}-${index}`,
          batchId,
          subBatchId,
          batchArticle: record?.product || cackeFillUp?.product_article,
          recipeArticle: record?.recipe_article || null,
          productionVolume,
          cakeIds,
          note: savedNote,
        };
      })
      .sort((a, b) => Number(a.subBatchId) - Number(b.subBatchId));
  }, [
    activeBatchId,
    cackeFillUp?.product_article,
    lotesListBatches,
    lotesListCakes,
  ]);

  const handleSaveSubBatchNote = async (group) => {
    if (!group.cakeIds.length) {
      console.error('Cake ids not found for Sub-batch:', group.subBatchId);
      return;
    }

    const note = subBatchNotes[group.key] ?? group.note ?? '';
    const notes = group.cakeIds.reduce((result, cakeId) => {
      result[cakeId] = note;
      return result;
    }, {});

    try {
      await dispatch(
        addNewLotesListCakes({
          num: group.cakeIds,
          note: notes,
        }),
      );

      setSubBatchNotes((previousNotes) => ({
        ...previousNotes,
        [group.key]: note,
      }));
      setActiveSubBatchKey(null);
    } catch (error) {
      console.error('Failed to save Sub-batch note:', error);
    }
  };

  const handleNewBatch = () => {
    setRawMaterialConsumptionMadal(true);
  };

  const handleSave = async ({ productionVolume, recipeArticle }) => {
    const currentAllocated = Number(productionVolume) || 0;
    if (currentAllocated <= 0) return;

    const {
      id,
      product_article = null,
      date,
      id_ordered_product_to_warehouse = null,
    } = cackeFillUp;

    const batch = batchOutside.find((el) => el.id == id);
    if (!batch) {
      console.error('Batch not found:', id);
      return;
    }

    const { quantity_pallets, quantity_free } = batch;

    await dispatch(
      addNewRawMatConsumption({
        batch_id: activeBatchId,
        production_volume: currentAllocated,
        recipe_article: recipeArticle || null,
        batch_article: product_article,
        cacke_id_start: null,
        date,
        id_ordered_product_to_warehouse,
        consumption_calculated: true,
        batch_quantity_pallets: quantity_pallets - quantity_free || 0,
      }),
    );

    dispatch(
      addNewProductionQuality({
        batch_id: activeBatchId,
        date,
        product_article,
        quantity: currentAllocated,
      }),
    );

    const accd = autoclave_calendar.find((el) => el.date === date);
    if (!accd) {
      console.error('Autoclave calendar entry not found for date:', date);
      return;
    }

    const prevTotalArrays = Number(accd.total_arrays) || 0;
    const prevTotalCackeFillUp = Number(accd.total_arrays_cacke_fill_up) || 0;

    const result = [
      {
        ...accd,
        total_arrays: prevTotalArrays + currentAllocated,
        total_arrays_cacke_fill_up: prevTotalCackeFillUp + currentAllocated,
      },
    ];

    dispatch(addNewAutoclaveCalendar(result));
  };

  const handleFinish = async () => {
    if (!window.confirm('Do you want to continue?')) {
      return;
    }
    const { id, date } = cackeFillUp;

    const accd = autoclave_calendar.find((el) => el.date === date);
    if (!accd) {
      console.error('Autoclave calendar entry not found for date:', date);
      return;
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
        total_arrays_cacke_fill_up: 0,
      },
    ];

    dispatch(addNewAutoclaveCalendar(result));
    await dispatch(deleteBatchOutside(id));

    setCackeFillUp({});
    setCurrentProduct(null);
    setActiveBatchId(null);
    setActiveSubBatchKey(null);
    setSubBatchNotes({});
  };

  const hasCackeFillUp = cackeFillUp && Object.keys(cackeFillUp).length > 0;

  const selectedRowForNewBatch = hasCackeFillUp
    ? {
        batch_id: activeBatchId,
        batch_article: cackeFillUp.product_article,
        date: cackeFillUp.date,
        production_volume: totalCake,
        recipe_article: 'No recipe',
        id_ordered_product_to_warehouse:
          cackeFillUp.id_ordered_product_to_warehouse ?? null,
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
        />
      )}

      {!hasCackeFillUp && (
        <div className="mt-3">
          <Table
            COLUMN_DATA={production_plan_table}
            dataOfTable={productionPlanDataList}
            onClickButton={() => {}}
            buttonText={''}
            tableName={'Casting'}
            handleRowClick={(e) => {
              if (cackeFillUp && Object.keys(cackeFillUp).length > 0) {
                alert('Please finish the current batch before selecting a new one.');
                return;
              }
              handleProductionPlanRowClick(e);
            }}
          />
        </div>
      )}

      {hasCackeFillUp && (
        <div className="mt-3" style={{ maxWidth: 900 }}>
          <div
            className="cacke-fill-up-product"
            style={{
              width: '50%',
              border: '1px solid #dee2e6',
              borderRadius: '8px',
              padding: '16px',
              marginBottom: '20px',
              backgroundColor: '#f8f9fa',
              display: 'flex',
              gap: '32px',
              flexWrap: 'wrap',
              justifyContent: 'space-evenly',
            }}
          >
            <div>
              <div style={{ fontWeight: 600, fontSize: '0.9rem', color: '#6c757d' }}>
                Product article
              </div>
              <div style={{ marginTop: 4, fontSize: '1.1rem' }}>
                {currentProduct?.article || '—'}
              </div>
            </div>

            <div>
              <div style={{ fontWeight: 600, fontSize: '0.9rem', color: '#6c757d' }}>
                Product Mark
              </div>
              <div style={{ marginTop: 4, fontSize: '1.1rem' }}>
                {currentProduct?.tradingMark || '—'}
              </div>
            </div>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1.2fr 1.2fr 1.6fr 1.2fr',
              gap: 8,
              alignItems: 'center',
            }}
          >
            <div>
              <div style={{ fontWeight: 600 }}>Batch id</div>
              <div style={{ marginTop: 6, fontSize: 18 }}>{activeBatchId}</div>
            </div>
            <div>
              <div style={{ fontWeight: 600 }}>Date</div>
              <div style={{ marginTop: 6, fontSize: 18 }}>{batchCalDate}</div>
            </div>
            <div>
              <div style={{ fontWeight: 600 }}>Planned cacke</div>
              <div style={{ marginTop: 6, fontSize: 18 }}>{totalCake}</div>
            </div>
            <div>
              <div style={{ fontWeight: 600 }}>Cackes allocated</div>
              <div style={{ marginTop: 6, fontSize: 18 }}>{allocated}</div>
            </div>
          </div>

          <div
            className="mt-2"
            style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}
          >
            <Button color="success" onClick={handleNewBatch}>
              New cacke
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
            <h6>Sub-batches (raw material consumptions)</h6>
            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '24px',
                alignItems: 'flex-start',
              }}
            >
              {subBatches.length === 0 && (
                <div style={{ color: '#6c757d' }}>
                  No raw material consumptions yet.
                </div>
              )}

              {subBatches.map((group) => {
                const isActive = activeSubBatchKey === group.key;

                return (
                  <div
                    key={group.key}
                    style={{
                      border: isActive ? '2px solid #28a745' : '1px solid #dee2e6',
                      borderRadius: '8px',
                      padding: '12px',
                      minWidth: '200px',
                      backgroundColor: isActive ? 'rgba(40,167,69,0.05)' : '#f8f9fa',
                    }}
                  >
                    <div
                      onClick={() =>
                        setActiveSubBatchKey(isActive ? null : group.key)
                      }
                      role="button"
                      tabIndex={0}
                      onKeyDown={(event) => {
                        if (event.key === 'Enter' || event.key === ' ') {
                          event.preventDefault();
                          setActiveSubBatchKey(isActive ? null : group.key);
                        }
                      }}
                      style={{
                        fontWeight: 600,
                        marginBottom: 8,
                        cursor: 'pointer',
                        userSelect: 'none',
                      }}
                    >
                      <div>
                        Sub-batch #{group.subBatchId}
                        {group.batchArticle && (
                          <span
                            style={{
                              fontWeight: 400,
                              fontSize: '0.8rem',
                              color: '#6c757d',
                              marginLeft: 8,
                            }}
                          >
                            ({group.batchArticle})
                          </span>
                        )}
                        <span
                          style={{
                            marginLeft: 8,
                            opacity: 0.65,
                            fontWeight: 400,
                            fontSize: '0.8rem',
                          }}
                        >
                          {isActive ? '▲ note' : '▼ note'}
                        </span>
                      </div>
                      {group.recipeArticle && (
                        <span
                          style={{
                            display: 'block',
                            fontWeight: 400,
                            fontSize: '0.75rem',
                            color: '#6c757d',
                            marginTop: 4,
                          }}
                        >
                          recipe: {group.recipeArticle}
                        </span>
                      )}
                    </div>

                    <div>Cackes: {group.productionVolume}</div>

                    {isActive && (
                      <div style={{ marginTop: 6 }}>
                        <textarea
                          rows={3}
                          placeholder={`Note for Sub-batch #${group.subBatchId}... Enter to save, Shift+Enter for a new line`}
                          value={subBatchNotes[group.key] ?? group.note ?? ''}
                          onChange={(event) =>
                            setSubBatchNotes((previousNotes) => ({
                              ...previousNotes,
                              [group.key]: event.target.value,
                            }))
                          }
                          onKeyDown={(event) => {
                            if (
                              event.key === 'Enter' &&
                              !event.shiftKey &&
                              !event.nativeEvent.isComposing
                            ) {
                              event.preventDefault();
                              handleSaveSubBatchNote(group);
                            }
                          }}
                          title="Enter — save, Shift+Enter — new line"
                          style={{
                            width: '100%',
                            maxWidth: 520,
                            borderRadius: 10,
                            padding: 10,
                            border: '1px solid rgba(0,0,0,0.25)',
                            outline: 'none',
                            display: 'block',
                          }}
                        />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default CackeFillUp;
