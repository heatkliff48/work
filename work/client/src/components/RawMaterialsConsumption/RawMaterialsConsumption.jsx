import Table from '../Table/Table';
import { useRecipeContext } from '#components/contexts/RecipeContext.js';
import { useState } from 'react';
import RawMaterialsConsumptionModal from './RawMaterialsConsumptionModal';
import { useModalContext } from '#components/contexts/ModalContext.js';

function RawMaterialsConsumption() {
  const { raw_mat_consumption, COLUMNS_RAW_MAT_CONSUMPTION } = useRecipeContext();
  const { rawMaterialConsumptionMadal, setRawMaterialConsumptionMadal } =
    useModalContext();

  const [selectedRow, setSelectedRow] = useState(null);

  return (
    <>
      <Table
        COLUMN_DATA={COLUMNS_RAW_MAT_CONSUMPTION}
        dataOfTable={raw_mat_consumption}
        tableName={'Raw materials consumption'}
        handleRowClick={(row) => {
          setSelectedRow(row.original ?? row);
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
