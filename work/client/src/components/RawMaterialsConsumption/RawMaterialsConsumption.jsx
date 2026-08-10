import Table from '../Table/Table';
import { useRecipeContext } from '#components/contexts/RecipeContext.js';
import { useEffect, useMemo, useState } from 'react';
import { useModalContext } from '#components/contexts/ModalContext.js';
import RawMaterialsConsumptionModal from './RawMaterialsConsumptionModal';

function RawMaterialsConsumption() {
  const { raw_mat_consumption, rawMatConsumptionCurrentMolds } = useRecipeContext();
  const { rawMaterialConsumptionMadal, setRawMaterialConsumptionMadal } =
    useModalContext();

  const [selectedRow, setSelectedRow] = useState(null);
  const [filteredRawMatConsumption, setFilteredRawMatConsumption] = useState();

  // batch_id -> volume already recorded in rawMatConsumptionCurrentMolds
  const consumedByBatch = useMemo(() => {
    const sumMap = new Map();

    (rawMatConsumptionCurrentMolds || []).forEach((item) => {
      const key = `${item.batch_id}`;
      sumMap.set(key, (sumMap.get(key) || 0) + Number(item.consumed_volume || 0));
    });

    return sumMap;
  }, [rawMatConsumptionCurrentMolds]);

  useEffect(() => {
    if (!raw_mat_consumption || !rawMatConsumptionCurrentMolds) {
      setFilteredRawMatConsumption([]);
      return;
    }

    const filtered = raw_mat_consumption
      ?.map((el) => {
        if (!el.recipe_article) return { ...el, recipe_article: 'No recipe' };
        return el;
      })
      ?.filter((item) => {
        if (item.consumption_calculated) return false;

        const totalFromMain = consumedByBatch.get(`${item.batch_id}`) || 0;

        return Number(item.production_volume) !== totalFromMain;
      });

    setFilteredRawMatConsumption(filtered);
  }, [raw_mat_consumption, rawMatConsumptionCurrentMolds, consumedByBatch]);

  // Local to this page so the shared COLUMNS_RAW_MAT_CONSUMPTION (also used
  // by QualityManagementAddModal) stays untouched.
  const columns = useMemo(
    () => [
      { Header: 'Date', accessor: 'date' },
      { Header: 'Product article', accessor: 'batch_article' },
      {
        Header: 'Cakes left, qty',
        id: 'cakes_left_qty',
        accessor: (row) => {
          const consumed = consumedByBatch.get(`${row.batch_id}`) || 0;
          return Math.max(Number(row.production_volume || 0) - consumed, 0);
        },
      },
      { Header: 'Recipe', accessor: 'recipe_article' },
      { Header: 'Batch id', accessor: 'id' },
    ],
    [consumedByBatch],
  );

  return (
    <>
      <Table
        COLUMN_DATA={columns}
        dataOfTable={filteredRawMatConsumption}
        tableName={'Raw materials consumption'}
        handleRowClick={(row) => {
          setSelectedRow(row.original);
          setRawMaterialConsumptionMadal(true);
        }}
      />

      <RawMaterialsConsumptionModal
        isOpen={rawMaterialConsumptionMadal}
        toggle={() => setRawMaterialConsumptionMadal(false)}
        selectedRow={selectedRow}
        onSave={(payload) => console.log(payload)}
      />
    </>
  );
}

export default RawMaterialsConsumption;
