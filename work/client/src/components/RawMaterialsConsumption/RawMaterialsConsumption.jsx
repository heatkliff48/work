// import Table from '../Table/Table';
// import { useRecipeContext } from '#components/contexts/RecipeContext.js';

// function RawMaterialsConsumption() {
//   const { raw_mat_consumption, COLUMNS_RAW_MAT_CONSUMPTION } = useRecipeContext();

//   return (
//     <>
//       <Table
//         COLUMN_DATA={COLUMNS_RAW_MAT_CONSUMPTION}
//         dataOfTable={raw_mat_consumption}
//         tableName={'Raw materials consumption'}
//         handleRowClick={(row) => console.log(row)}
//       />
//     </>
//   );
// }

// export default RawMaterialsConsumption;

import Table from '../Table/Table';
import { useRecipeContext } from '#components/contexts/RecipeContext.js';
import { useState } from 'react';
import RawMaterialsConsumptionModal from './RawMaterialsConsumptionModal';
import { useWarehouseContext } from '#components/contexts/WarehouseContext.js';
import { useModalContext } from '#components/contexts/ModalContext.js';

function RawMaterialsConsumption() {
  const { raw_mat_consumption, COLUMNS_RAW_MAT_CONSUMPTION } = useRecipeContext();
  const { raw_materials_warehouse = [] } = useWarehouseContext();
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
