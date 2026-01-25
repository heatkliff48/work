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
      Header: 'Cake height, meter',
      accessor: 'cake_height',
    },
    {
      Header: 'Lime, kg',
      accessor: 'lime',
    },
    {
      Header: 'Cement, kg',
      accessor: 'cement',
    },
    {
      Header: 'Sand powder (dry), kg',
      accessor: 'sand_powder_dry',
    },
    {
      Header: 'Sand slurry (dry), kg',
      accessor: 'sand_slurry_dry',
    },
    {
      Header: 'Gypsum (dry), kg',
      accessor: 'gypsum_dry',
    },
    {
      Header: 'Return slurry (dry), kg',
      accessor: 'return_dry',
    },
    {
      Header: 'Aluminum 1',
      accessor: 'aluminum_paste',
    },
    {
      Header: 'Aluminum 2',
      accessor: 'aluminum_paste_2',
    },
    {
      Header: 'Water solids',
      accessor: 'water_solids',
    },
    {
      Header: 'Solids, kg',
      accessor: 'solids',
    },
    {
      Header: 'Volume, m3',
      accessor: 'volume',
    },
    {
      Header: 'Density, kg/m3',
      accessor: 'density_recipe',
    },
    {
      Header: 'Produced amount of return (dry), kg',
      accessor: 'produced_return_dry',
    },
    {
      Header: 'Description',
      accessor: 'description',
    },
    // {
    //   Header: 'Sand powder (dry)',
    //   accessor: 'sand_powder_dry',
    // },
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
      Header: 'Cake amount',
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
      Header: 'Cake amount',
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

  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [productOfRecipe, setProductOfRecipe] = useState({});
  const [selectedProduct, setSelectedProduct] = useState(null);
  //lotes list
  const [lotesListBatchesCheck, setLotesListCheck] = useState(true);
  const [selectedLotesRecipe, setSelectedLotesRecipe] = useState(null);

  const list_of_recipes = useSelector((state) => state.recipe);
  const recipeOrders = useSelector((state) => state.recipeOrders);
  const raw_mat_consumption = useSelector((state) => state.rawMatConsumption);
  const main_raw_mat_consumption = useSelector(
    (state) => state.mainRawMatConsumption,
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
        selectedLotesRecipe,
        setSelectedLotesRecipe,
        lotesListBatchesCheck,
        setLotesListCheck,
      }}
    >
      {children}
    </RecipeContext.Provider>
  );
};

export default RecipeContextProvider;

const useRecipeContext = () => useContext(RecipeContext);
export { useRecipeContext };
