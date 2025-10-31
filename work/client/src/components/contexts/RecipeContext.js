import { createContext, useContext, useState } from 'react';
import { useSelector } from 'react-redux';

const RecipeContext = createContext();

const RecipeContextProvider = ({ children }) => {
  const recipe_info = [
    {
      Header: 'Recipe ID',
      accessor: 'article',
    },
    {
      Header: 'Cake height',
      accessor: 'cake_height',
    },
    {
      Header: 'Lime',
      accessor: 'lime',
    },
    {
      Header: 'Cement',
      accessor: 'cement',
    },
    {
      Header: 'Sand (dry)',
      accessor: 'sand_dry',
    },
    {
      Header: 'Sand slurry (dry)',
      accessor: 'sand_slurry_dry',
    },
    {
      Header: 'Gypsum (dry)',
      accessor: 'gypsum_dry',
    },
    {
      Header: 'Return (dry)',
      accessor: 'return_dry',
    },
    {
      Header: 'Aluminium paste',
      accessor: 'aluminum_paste',
    },
    {
      Header: 'Water solids',
      accessor: 'water_solids',
    },
    {
      Header: 'Solids',
      accessor: 'solids',
    },
    {
      Header: 'Volume',
      accessor: 'volume',
    },
    {
      Header: 'Density',
      accessor: 'density_recipe',
    },
    {
      Header: 'Produced amount of return (dry)',
      accessor: 'produced_return_dry',
    },
    {
      Header: 'Water total',
      accessor: 'water_total',
    },
  ];

  const COLUMNS_RAW_MAT_CONSUMPTION = [
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
    {
      Header: 'Date',
      accessor: 'date',
    },
  ];

  const COLUMNS_MAIN_RAW_MAT_CONSUMPTION = [
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
    {
      Header: 'Consumed volume',
      accessor: 'consumed_volume',
    },
    {
      Header: 'Date',
      accessor: 'date',
    },
  ];

  const [selectedProduct, setSelectedProduct] = useState(null);
  const [productOfRecipe, setProductOfRecipe] = useState({});
  const [selectedRecipe, setSelectedRecipe] = useState(null);

  const list_of_recipes = useSelector((state) => state.recipe);
  const recipeOrders = useSelector((state) => state.recipeOrders);
  const raw_mat_consumption = useSelector((state) => state.rawMatConsumption);
  const main_raw_mat_consumption = useSelector(
    (state) => state.mainRawMatConsumption
  );

  return (
    <RecipeContext.Provider
      value={{
        COLUMNS_RAW_MAT_CONSUMPTION,
        COLUMNS_MAIN_RAW_MAT_CONSUMPTION,
        recipe_info,
        selectedProduct,
        setSelectedProduct,
        productOfRecipe,
        setProductOfRecipe,
        list_of_recipes,
        selectedRecipe,
        setSelectedRecipe,
        raw_mat_consumption,
        recipeOrders,
        main_raw_mat_consumption,
      }}
    >
      {children}
    </RecipeContext.Provider>
  );
};

export default RecipeContextProvider;

const useRecipeContext = () => useContext(RecipeContext);
export { useRecipeContext };
