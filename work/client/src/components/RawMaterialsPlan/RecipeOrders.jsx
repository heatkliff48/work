import { useSelector } from 'react-redux';
import Table from '../Table/Table';
import { useState } from 'react';
import RecipeInfoModal from '#components/Recipe/RecipeInfoModal.jsx';
import { useRecipeContext } from '#components/contexts/RecipeContext.js';

function RecipeOrders() {
  const { setSelectedRecipe, list_of_recipes } = useRecipeContext();
  const [recipeModalShow, setRecipeModalShow] = useState(false);
  const recipeDataList = useSelector((state) => state.recipeOrders);

  const COLUMNS_RECIPE_ORDERS = [
    {
      Header: 'ID',
      accessor: 'id',
    },
    {
      Header: 'Recipe',
      accessor: 'id_recipe',
    },
    {
      Header: 'Batch production',
      accessor: 'id_batch',
    },
    {
      Header: 'Production volume',
      accessor: 'production_volume',
    },
  ];

  const handlerRecipeInfo = (row) => {
    const recipe = list_of_recipes?.find((el) => el.id === row.original.id_recipe);

    if (!recipe) {
      console.error('Recipe not found');
      return;
    }

    setSelectedRecipe(recipe);
    setRecipeModalShow((prev) => !prev);
  };

  return (
    <>
      {recipeModalShow && (
        <RecipeInfoModal
          isOpen={recipeModalShow}
          onHide={() => setRecipeModalShow((prev) => !prev)}
          toggle={() => setRecipeModalShow((prev) => !prev)}
          needDeleteButton={false}
        />
      )}
      <Table
        COLUMN_DATA={COLUMNS_RECIPE_ORDERS}
        dataOfTable={recipeDataList}
        tableName={'Recipe Orders'}
        handleRowClick={(row) => handlerRecipeInfo(row)}
      />
    </>
  );
}

export default RecipeOrders;
