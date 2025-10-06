import Table from '../Table/Table';
import { useRecipeContext } from '#components/contexts/RecipeContext.js';

function RawMaterialsConsumption() {
  const { raw_mat_consumption, COLUMNS_RAW_MAT_CONSUMPTION } = useRecipeContext();

  return (
    <>
      <Table
        COLUMN_DATA={COLUMNS_RAW_MAT_CONSUMPTION}
        dataOfTable={raw_mat_consumption}
        tableName={'Raw materials consumption'}
        handleRowClick={(row) => console.log(row)}
      />
    </>
  );
}

export default RawMaterialsConsumption;
