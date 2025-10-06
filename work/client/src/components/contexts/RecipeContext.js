import { clearAccountingDataList } from '#components/redux/actions/ordersAction.js';
import { addNewRawMatConsumption } from '#components/redux/actions/recipeAction.js';
import { createContext, useContext, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

const RecipeContext = createContext();

const RecipeContextProvider = ({ children }) => {
  const recipe_info = [
    {
      Header: 'Recipe ID',
      accessor: 'article',
    },
    {
      Header: 'Sand',
      accessor: 'sand',
    },
    {
      Header: 'Lime Lhoist',
      accessor: 'lime_lhoist',
    },
    {
      Header: 'Lime Barcelona',
      accessor: 'lime_barcelona',
    },
    {
      Header: 'Cement',
      accessor: 'cement',
    },
    {
      Header: 'Gypsum',
      accessor: 'gypsum',
    },
    {
      Header: 'Alu 1',
      accessor: 'alu_1',
    },
    {
      Header: 'Alu 2',
      accessor: 'alu_2',
    },
    {
      Header: 'Return slurry - solids',
      accessor: 'return_slurry_solids',
    },
    {
      Header: 'Return slurry - water',
      accessor: 'return_slurry_water',
    },
    {
      Header: 'Water',
      accessor: 'water',
    },
    {
      Header: 'Water cold',
      accessor: 'water_cold',
    },
    {
      Header: 'Water hot',
      accessor: 'water_hot',
    },
    {
      Header: 'Condensate',
      accessor: 'condensate',
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

  const dispatch = useDispatch();

  const [selectedProduct, setSelectedProduct] = useState(null);
  const [productOfRecipe, setProductOfRecipe] = useState({});
  const [selectedRecipe, setSelectedRecipe] = useState(null);

  const list_of_recipes = useSelector((state) => state.recipe);
  const batchOutside = useSelector((state) => state.batchOutside);
  const recipeOrders = useSelector((state) => state.recipeOrders);
  const raw_mat_consumption = useSelector((state) => state.rawMatConsumption);

  return (
    <RecipeContext.Provider
      value={{
        COLUMNS_RAW_MAT_CONSUMPTION,
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
      }}
    >
      {children}
    </RecipeContext.Provider>
  );
};

export default RecipeContextProvider;

const useRecipeContext = () => useContext(RecipeContext);
export { useRecipeContext };
