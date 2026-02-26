import Table from '../Table/Table';
import { useRecipeContext } from '#components/contexts/RecipeContext.js';
import { useState } from 'react';
import { useModalContext } from '#components/contexts/ModalContext.js';
import RawMaterialsConsumptionModalAdd from './RawMaterialsConsumptionModalAdd';
import RawMaterialsConsumptionModal from './RawMaterialsConsumptionModal';

function RawMaterialsConsumption() {
  const { COLUMNS_MAIN_RAW_MAT_CONSUMPTION, rawMatConsumptionCurrentMolds } =
    useRecipeContext();
  const {
    mainRawMaterialConsumptionMadal,
    setMainRawMaterialConsumptionMadal,
    rawMaterialConsumptionMadal,
    setRawMaterialConsumptionMadal,
  } = useModalContext();

  const [selectedRow, setSelectedRow] = useState(null);

  return (
    <>
      <button onClick={() => setMainRawMaterialConsumptionMadal(true)}>
        Add Raw Materal Consmption
      </button>
      <Table
        COLUMN_DATA={COLUMNS_MAIN_RAW_MAT_CONSUMPTION}
        dataOfTable={rawMatConsumptionCurrentMolds}
        tableName={'Raw materials consumption'}
        handleRowClick={(row) => {
          // setSelectedRow(row.original);
          // setRawMaterialConsumptionMadal(true);
        }}
      />

      <RawMaterialsConsumptionModalAdd
        isOpen={mainRawMaterialConsumptionMadal}
        toggle={() => setMainRawMaterialConsumptionMadal(false)}
        func={setSelectedRow}
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
