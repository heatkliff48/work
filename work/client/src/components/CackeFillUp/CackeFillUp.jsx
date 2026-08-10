import { useEffect, useMemo, useState } from 'react';
import { Button } from 'reactstrap';
import Table from '#components/Table/Table';
import { TextSearchFilter } from '#components/Table/filters.js';
import { useWarehouseContext } from '#components/contexts/WarehouseContext.js';
import { useProjectContext } from '#components/contexts/Context.js';
import { useDispatch, useSelector } from 'react-redux';
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

function CackeFillUp() {
  const dispatch = useDispatch();

  const { batchOutside, autoclave_calendar } = useWarehouseContext();
  const { cackeFillUp, setCackeFillUp, lotesListBatches, lotesListCakes } =
    useProjectContext();
  const { list_of_recipes, recipeOrders } = useRecipeContext();
  const { latestProducts } = useProductsContext();

  const raw_mat_consumption = useSelector((state) => state?.rawMatConsumption);

  const [nextBatchId, setNextBatchId] = useState(0);
  const [allocated, setAllocated] = useState(0);
  const [cakeIds, setCakeIds] = useState([]);
  const [cakeNotes, setCakeNotes] = useState({});
  const [closedCakeIds, setClosedCakeIds] = useState([]);
  const [subBatches, setSubBatches] = useState([]);
  const [activeCakeId, setActiveCakeId] = useState(null);
  const [currentProduct, setCurrentProduct] = useState(null);
  const [autoclave_calendar_update, set_autoclave_calendar_update] = useState(null);

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

  const handleProductionPlanRowClick = (row) => {
    const prodPlanEntry = batchOutside.find((el) => el.id === row.original.id);
    if (!prodPlanEntry) return;
    dispatch(
      updateBatchOutside({
        id: prodPlanEntry.id,
        is_prodused: 1,
      })
    );
  };

  useEffect(() => {
    setCackeFillUp({});
    setAllocated(0);
    setCakeIds([]);
    setClosedCakeIds([]);
    setActiveCakeId(null);
    setCakeNotes({});
    setCurrentProduct(null);
  }, []);

  useEffect(() => {
    const batch_in_produce = batchOutside.find((el) => el.is_prodused == 1);
    if (batch_in_produce) {
      const product = latestProducts.find(
        (el) => el.article === batch_in_produce?.product_article
      );
      setCurrentProduct(product);

      const widthInArray = Math.floor(
        product?.m3InArray / product?.volumeBlockOnPallet
      );
      const accd = autoclave_calendar.find(
        (el) => el.date === batch_in_produce.date
      );
      set_autoclave_calendar_update(accd);

      const total_cacke =
        batch_in_produce.quantity_pallets / widthInArray -
        accd?.total_arrays_cacke_fill_up;

      setCackeFillUp({ ...batch_in_produce, total_cacke });
    } else {
      setCurrentProduct(null);
    }
  }, [batchOutside, autoclave_calendar]);

  useEffect(() => {
    const list = Array.isArray(lotesListBatches) ? lotesListBatches : [];
    const maxIdLotes = list.reduce((acc, it) => {
      const v = Number(it?.batch_id);
      return Number.isFinite(v) ? Math.max(acc, v) : acc;
    }, 0);

    const listOfRawMat = Array.isArray(raw_mat_consumption)
      ? raw_mat_consumption
      : [];
    const maxIdRawMat = listOfRawMat.reduce((acc, it) => {
      const v = Number(it?.batch_id);
      return Number.isFinite(v) ? Math.max(acc, v) : acc;
    }, 0);

    const maxId = Math.max(maxIdLotes, maxIdRawMat);
    setNextBatchId(maxId + 1);
  }, [lotesListBatches, raw_mat_consumption]);

  const lastCakeId = useMemo(() => {
    const list = Array.isArray(lotesListCakes) ? lotesListCakes : [];
    const maxId = list.reduce((acc, it) => {
      const v = Number(it?.id);
      return Number.isFinite(v) ? Math.max(acc, v) : acc;
    }, 0);
    return maxId;
  }, [lotesListCakes]);

  const totalCake =
    Number(cackeFillUp?.total_cacke ?? cackeFillUp?.total_quantity_plan ?? 0) || 0;

  const batchCalDate = cackeFillUp?.date ?? cackeFillUp?.batch_cal_date ?? '';

  const handlePlus = () => {
    const newId = lastCakeId + closedCakeIds.length + cakeIds.length + 1;
    setCakeIds((prev) => [...prev, newId]);
    setAllocated((prev) => prev + 1);
  };

  const handleMinus = () => {
    setCakeIds((prev) => {
      if (!prev.length) return prev;
      return prev.slice(0, -1);
    });
    setAllocated((prev) => Math.max(0, prev - 1));
  };

  const handleSave = async (isFinished) => {
    const {
      id,
      product_article = null,
      date,
      id_ordered_product_to_warehouse = null,
    } = cackeFillUp;

    if (!cakeIds.length) return;

    const notes = cakeNotes;
    const batch = batchOutside.find((el) => el.id == id);
    if (!batch) {
      console.error('Batch not found:', id);
      return;
    }
    const { quantity_pallets, quantity_free } = batch;

    await dispatch(addNewLotesListCakes({ num: cakeIds, note: notes }));

    const currentAllocated = cakeIds.length;
    const cacke_id_start = cakeIds[cakeIds.length - 1];

    const recipe = recipeOrders.find((r) => r.id_batch === id);
    const recipeDetails = list_of_recipes.find((r) => r.id === recipe?.id_recipe);

    await dispatch(
      addNewRawMatConsumption({
        batch_id: nextBatchId,
        production_volume: currentAllocated,
        recipe_article: recipeDetails?.article,
        batch_article: product_article,
        cacke_id_start,
        date,
        id_ordered_product_to_warehouse,
        consumption_calculated: false,
        batch_quantity_pallets: quantity_pallets - quantity_free || 0,
      })
    );

    dispatch(
      addNewProductionQuality({
        batch_id: nextBatchId,
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

    const prevTotalArrays = accd.total_arrays || 0;
    const newTotalArrays = prevTotalArrays + currentAllocated;
    const prevTotalCackeFillUp = Number(accd.total_arrays_cacke_fill_up) || 0;
    const newTotalCackeFillUp = prevTotalCackeFillUp + currentAllocated;

    if (isFinished) {
      const totalAutoclaves = Math.ceil(newTotalArrays / 21);
      const residual = newTotalArrays % 21;
      const result = [
        {
          ...accd,
          total_arrays: newTotalArrays,
          filled_autoclaves: totalAutoclaves,
          produced_autoclave: totalAutoclaves,
          residual_arrays: residual,
          total_arrays_cacke_fill_up: 0,
        },
      ];
      dispatch(addNewAutoclaveCalendar(result));
      await dispatch(deleteBatchOutside(id));

      setCackeFillUp({});
      setAllocated(0);
      setCakeIds([]);
      setClosedCakeIds([]);
      setActiveCakeId(null);
      setCakeNotes({});
      setCurrentProduct(null);
      setSubBatches([]);
      return;
    }

    const result = [
      {
        ...accd,
        total_arrays: newTotalArrays,
        total_arrays_cacke_fill_up: newTotalCackeFillUp,
      },
    ];
    dispatch(addNewAutoclaveCalendar(result));

    setClosedCakeIds((prev) => [...prev, ...cakeIds]);
    setCakeIds([]);
    setAllocated(0);
    setActiveCakeId(null);
    setCakeNotes({});
  };

  const hasCackeFillUp = cackeFillUp && Object.keys(cackeFillUp).length > 0;

  const buildGroups = (rawConsumption, cakes) => {
    const groups = [];
    rawConsumption.forEach((record) => {
      const batchId = record.batch_id;
      const batchArticle = record.batch_article;
      const recipeArticle = record.recipe_article || null;
      const startId = record.cacke_id_start;
      const volume = record.production_volume || 0;
      const savedIds = [];
      for (let i = startId - volume + 1; i <= startId; i++) {
        if (i > 0) savedIds.push(i);
      }
      const notes = {};
      savedIds.forEach((id) => {
        const cake = cakes.find((c) => c.id === id);
        if (cake && cake.note) notes[id] = cake.note;
      });
      groups.push({
        batchId,
        batchArticle,
        recipeArticle,
        startId,
        volume,
        savedIds,
        notes,
      });
    });
    groups.sort((a, b) => a.batchId - b.batchId);
    return groups;
  };

  const allGroups = useMemo(() => {
    const consumption = Array.isArray(raw_mat_consumption)
      ? raw_mat_consumption
      : [];
    const cakes = Array.isArray(lotesListCakes) ? lotesListCakes : [];
    return buildGroups(consumption, cakes);
  }, [raw_mat_consumption, lotesListCakes]);

  const activeBatchId = useMemo(() => {
    if (!hasCackeFillUp) return null;
    const targetId = cackeFillUp.id_ordered_product_to_warehouse;
    if (!targetId) return null;
    const related = allGroups.filter((g) => {
      return g.id_ordered_product_to_warehouse === targetId;
    });
    if (related.length === 0) return null;
    const maxBatch = Math.max(...related.map((g) => g.batchId));
    return maxBatch;
  }, [allGroups, hasCackeFillUp, cackeFillUp]);

  const groupsWithId = useMemo(() => {
    const consumption = Array.isArray(raw_mat_consumption)
      ? raw_mat_consumption.filter(
          (record) => record?.batch_article == currentProduct?.article
        )
      : [];
    const cakes = Array.isArray(lotesListCakes) ? lotesListCakes : [];
    const groups = [];
    consumption.forEach((record) => {
      const batchId = record.batch_id;
      const batchArticle = record.batch_article;
      const recipeArticle = record.recipe_article || null;
      const startId = record.cacke_id_start;
      const volume = record.production_volume || 0;
      const idOrdered = record.id_ordered_product_to_warehouse || null;
      const savedIds = [];
      for (let i = startId - volume + 1; i <= startId; i++) {
        if (i > 0) savedIds.push(i);
      }
      const notes = {};
      savedIds.forEach((id) => {
        const cake = cakes.find((c) => c.id === id);
        if (cake && cake.note) notes[id] = cake.note;
      });
      groups.push({
        batchId,
        batchArticle,
        recipeArticle,
        startId,
        volume,
        savedIds,
        notes,
        id_ordered_product_to_warehouse: idOrdered,
      });
    });
    groups.sort((a, b) => a.batchId - b.batchId);
    return groups;
  }, [raw_mat_consumption, lotesListCakes]);

  const activeBatchIdFinal = useMemo(() => {
    if (!hasCackeFillUp) return null;
    const targetId = cackeFillUp.id_ordered_product_to_warehouse;
    if (!targetId) return null;
    const related = groupsWithId.filter(
      (g) => g.id_ordered_product_to_warehouse === targetId
    );
    if (related.length === 0) return null;
    return Math.max(...related.map((g) => g.batchId));
  }, [groupsWithId, hasCackeFillUp, cackeFillUp]);

  const groupEntries = useMemo(() => {
    const sub = groupsWithId.map((group) => {
      const isActive = group.batchId === activeBatchIdFinal;
      const pending = isActive ? cakeIds : [];
      const allIds = [...group.savedIds, ...pending];
      const notes = { ...group.notes, ...(isActive ? cakeNotes : {}) };
      return {
        key: group.batchId,
        batchArticle: group.batchArticle,
        recipeArticle: group.recipeArticle,
        savedIds: group.savedIds,
        pendingIds: pending,
        allIds,
        notes,
        isActive,
        batchId: group.batchId,
      };
    });

    setSubBatches(sub);
  }, [groupsWithId, activeBatchIdFinal, cakeIds, cakeNotes]);

  return (
    <>
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
                alert(
                  'Please finish or close the current batch before selecting a new one.'
                );
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
              <div style={{ marginTop: 6, fontSize: 18 }}>{nextBatchId}</div>
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
            <Button color="success" onClick={handlePlus} style={{ minWidth: 60 }}>
              +
            </Button>
            <Button color="success" onClick={handleMinus} style={{ minWidth: 60 }}>
              -
            </Button>
            <div
              className="ms-auto"
              style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}
            >
              <Button color="warning" onClick={() => handleSave(false)}>
                Close sub-batch and open new
              </Button>
              <Button color="success" onClick={() => handleSave(true)}>
                Finish batch
              </Button>
            </div>
          </div>

          <div className="mt-3">
            <div style={{ fontWeight: 600 }}>Cacke id</div>
            <div
              style={{
                marginTop: 8,
                display: 'flex',
                alignItems: 'flex-start',
                gap: 32,
              }}
            >
              {/* {closedCakeIds.length > 0 && (
                <div style={{ display: 'grid', gap: 4 }}>
                  {closedCakeIds.map((id) => (
                    <div
                      key={`closed-${id}`}
                      style={{
                        border: '1px solid #28a745',
                        borderRadius: 10,
                        padding: '6px 10px',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 8,
                        width: 'fit-content',
                        background: 'rgba(40, 167, 69, 0.08)',
                        color: '#218838',
                        fontWeight: 600,
                      }}
                    >
                      <span style={{ opacity: 0.7 }}>#</span>
                      <span>{id}</span>
                      <span style={{ marginLeft: 6, opacity: 0.7, fontWeight: 400 }}>
                        ✓
                      </span>
                    </div>
                  ))}
                </div>
              )} */}
              <div style={{ display: 'grid', gap: 4 }}>
                {cakeIds.map((id) => {
                  const isActive = activeCakeId === id;
                  return (
                    <div key={`current-${id}`}>
                      <div
                        onClick={() => setActiveCakeId(isActive ? null : id)}
                        role="button"
                        tabIndex={0}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            setActiveCakeId(isActive ? null : id);
                          }
                        }}
                        style={{
                          border: isActive
                            ? '2px solid #28a745'
                            : '1px solid rgba(0,0,0,0.25)',
                          borderRadius: 10,
                          padding: '6px 10px',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: 8,
                          cursor: 'pointer',
                          userSelect: 'none',
                          background: isActive
                            ? 'rgba(40,167,69,0.08)'
                            : 'transparent',
                          fontWeight: 600,
                          width: 'fit-content',
                        }}
                      >
                        <span style={{ opacity: 0.7 }}>#</span>
                        <span>{id}</span>
                        <span
                          style={{ marginLeft: 6, opacity: 0.6, fontWeight: 400 }}
                        >
                          {isActive ? '▲ note' : '▼ note'}
                        </span>
                      </div>
                      {isActive && (
                        <div style={{ marginTop: 6 }}>
                          <textarea
                            rows={3}
                            placeholder={`Note for cake id ${id}...`}
                            value={cakeNotes[id] ?? ''}
                            onChange={(e) =>
                              setCakeNotes((prev) => ({
                                ...prev,
                                [id]: e.target.value,
                              }))
                            }
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
              {subBatches.map((group) => (
                <div
                  key={group.key}
                  style={{
                    border: group.isActive
                      ? '2px solid #28a745'
                      : '1px solid #dee2e6',
                    borderRadius: '8px',
                    padding: '12px',
                    minWidth: '200px',
                    backgroundColor: group.isActive
                      ? 'rgba(40,167,69,0.05)'
                      : '#f8f9fa',
                  }}
                >
                  <div style={{ fontWeight: 600, marginBottom: 8 }}>
                    Sub-batch #{group.batchId}
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
                    {group.recipeArticle && (
                      <span
                        style={{
                          fontWeight: 400,
                          fontSize: '0.7rem',
                          color: '#6c757d',
                          marginLeft: 4,
                        }}
                      >
                        recipe: {group.recipeArticle}
                      </span>
                    )}
                    {group.isActive && (
                      <span
                        style={{
                          marginLeft: 8,
                          color: '#28a745',
                          fontSize: '0.8rem',
                        }}
                      >
                        ● active
                      </span>
                    )}
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                    {group.allIds.map((id) => {
                      const isSaved = group.savedIds.includes(id);
                      const isPending = group.pendingIds.includes(id);
                      const note = group.notes[id] || '';
                      return (
                        <div
                          key={id}
                          style={{
                            border: isSaved
                              ? '1px solid #28a745'
                              : isPending
                              ? '1px solid #007bff'
                              : '1px solid #ced4da',
                            borderRadius: '10px',
                            padding: '4px 8px',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: 4,
                            backgroundColor: isSaved
                              ? 'rgba(40,167,69,0.1)'
                              : isPending
                              ? 'rgba(0,123,255,0.05)'
                              : 'transparent',
                            fontSize: '0.9rem',
                          }}
                          title={note || 'no note'}
                        >
                          <span style={{ opacity: 0.6 }}>#</span>
                          {id}
                          {isSaved && (
                            <span style={{ color: '#28a745', marginLeft: 4 }}>
                              ✓
                            </span>
                          )}
                          {isPending && (
                            <span
                              style={{
                                marginLeft: 4,
                                fontSize: '0.7rem',
                                color: '#007bff',
                                cursor: 'pointer',
                              }}
                              onClick={(e) => {
                                e.stopPropagation();
                                const newNote = prompt(`Note for cake ${id}:`, note);
                                if (newNote !== null) {
                                  setCakeNotes((prev) => ({
                                    ...prev,
                                    [id]: newNote,
                                  }));
                                }
                              }}
                            >
                              ✎
                            </span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default CackeFillUp;
