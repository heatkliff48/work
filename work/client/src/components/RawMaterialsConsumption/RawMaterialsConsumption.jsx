import Table from '../Table/Table';
import { useRecipeContext } from '#components/contexts/RecipeContext.js';
import { useState } from 'react';
import { useModalContext } from '#components/contexts/ModalContext.js';
import RawMaterialsConsumptionModalAdd from './RawMaterialsConsumptionModalAdd';
import RawMaterialsConsumptionModal from './RawMaterialsConsumptionModal';
import { useDispatch } from 'react-redux';
import { clearMainRawMatConsumption } from '#components/redux/actions/recipeAction.js';

function RawMaterialsConsumption() {
  const { COLUMNS_MAIN_RAW_MAT_CONSUMPTION, main_raw_mat_consumption } =
    useRecipeContext();
  const {
    mainRawMaterialConsumptionMadal,
    setMainRawMaterialConsumptionMadal,
    rawMaterialConsumptionMadal,
    setRawMaterialConsumptionMadal,
  } = useModalContext();

  const [selectedRow, setSelectedRow] = useState(null);
  const dispatch = useDispatch();

  return (
    <>
      <button onClick={() => setMainRawMaterialConsumptionMadal(true)}>
        Add Raw Materal Consmption
      </button>
      <button onClick={() => dispatch(clearMainRawMatConsumption([]))}>
        Clear Raw Materal Consmption
      </button>
      <Table
        COLUMN_DATA={COLUMNS_MAIN_RAW_MAT_CONSUMPTION}
        dataOfTable={main_raw_mat_consumption}
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
