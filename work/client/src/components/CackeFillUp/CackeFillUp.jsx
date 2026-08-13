import { useEffect, useState } from 'react';
import { Button } from 'reactstrap';
import Table from '#components/Table/Table';
import { TextSearchFilter } from '#components/Table/filters.js';
import { useWarehouseContext } from '#components/contexts/WarehouseContext.js';
import { useProjectContext } from '#components/contexts/Context.js';
import { useDispatch } from 'react-redux';
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
import { use } from 'react';

function CackeFillUp() {
  const dispatch = useDispatch();

  const { batchOutside, autoclave_calendar } = useWarehouseContext();
  const { cackeFillUp, setCackeFillUp, lotesListBatches } = useProjectContext();
  const { raw_mat_consumption } = useRecipeContext();
  const { latestProducts } = useProductsContext();
  const { rawMaterialConsumptionMadal, setRawMaterialConsumptionMadal } =
    useModalContext();

  const [activeBatchId, setActiveBatchId] = useState(null);
  const [allocated, setAllocated] = useState(0);
  const [currentProduct, setCurrentProduct] = useState(null);

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

    const list = Array.isArray(lotesListBatches) ? lotesListBatches : [];

    const maxBatchId = list.reduce((max, item) => {
      const value = Number(item?.batch_id);

      return Number.isFinite(value) ? Math.max(max, value) : max;
    }, 0);

    setActiveBatchId(maxBatchId + 1);

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
    if (!currentProductName) return;

    const batchInProduce = batchOutside.find((item) => item.is_prodused == 1);

    if (!batchInProduce) {
      setActiveBatchId(null);
      return;
    }

    const list = Array.isArray(lotesListBatches) ? lotesListBatches : [];

    const existingRecords = list.filter(
      (item) => String(item.product) === String(currentProductName),
    );

    if (existingRecords.length) {
      const lastRecord = existingRecords.reduce((latest, item) => {
        if (!latest) return item;

        return Number(item.id) > Number(latest.id) ? item : latest;
      }, null);

      setActiveBatchId(Number(lastRecord.batch_id));

      return;
    }

    const maxBatchId = list.reduce((max, item) => {
      const value = Number(item?.batch_id);

      return Number.isFinite(value) ? Math.max(max, value) : max;
    }, 0);

    setActiveBatchId(maxBatchId + 1);
  }, [batchOutside, lotesListBatches, currentProductName]);

  useEffect(() => {
    setCackeFillUp({});
    setAllocated(0);
    setCurrentProduct(null);
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
    setAllocated((prev) => prev + currentAllocated);
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
    setAllocated(0);
    setCurrentProduct(null);
    setActiveBatchId(null);
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
        </div>
      )}
    </>
  );
}

export default CackeFillUp;
