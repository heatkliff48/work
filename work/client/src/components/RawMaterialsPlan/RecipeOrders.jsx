import { useSelector } from 'react-redux';
import Table from '../Table/Table';
import { useEffect, useState } from 'react';
import RecipeInfoModal from '#components/Recipe/RecipeInfoModal.jsx';
import { useRecipeContext } from '#components/contexts/RecipeContext.js';

function RecipeOrders() {
  const { setSelectedRecipe, list_of_recipes } = useRecipeContext();

  const recipeOrders = useSelector((state) => state.recipeOrders);
  const batchOutside = useSelector((state) => state.batchOutside);

  const [recipeModalShow, setRecipeModalShow] = useState(false);
  const [recipeDataList, setRecipeDataList] = useState([]);

  const COLUMNS_RECIPE_ORDERS = [
    {
      Header: 'ID',
      accessor: 'id',
    },
    {
      Header: 'Recipe',
      accessor: 'recipe_article',
    },
    {
      Header: 'Batch production',
      accessor: 'batch_article',
    },
    {
      Header: 'Production volume',
      accessor: 'production_volume',
    },
  ];

  const handlerRecipeInfo = (row) => {
    const recipe = list_of_recipes?.find((el) => el.article === row.original.recipe_article);

    if (!recipe) {
      console.error('Recipe not found');
      return;
    }

    setSelectedRecipe(recipe);
    setRecipeModalShow((prev) => !prev);
  };

  useEffect(() => {
    const updatedData = recipeOrders
      .map((el) => {
        const batch = batchOutside.find((batch) => batch.id === el.id_batch);
        const recipe = list_of_recipes.find((recipe) => recipe.id === el.id_recipe);

        if (!batch || !recipe) return { id: null };

        return {
          id: el.id,
          recipe_article: recipe?.article || 'Unknown Recipe',
          batch_article: batch?.id_warehouse_batch || 'Unknown Batch',
          production_volume: el.production_volume || 0,
        };
      })
      .filter((el) => el.id);

    setRecipeDataList(updatedData);
  }, [recipeOrders, batchOutside, list_of_recipes]);

  return (
    <>
      {recipeModalShow && (
        <RecipeInfoModal
          show={recipeModalShow}
          onHide={() => setRecipeModalShow((prev) => !prev)}
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
