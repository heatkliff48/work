import { createContext, useContext, useState } from 'react';
import { useSelector } from 'react-redux';

const RecipeContext = createContext();

const RecipeContextProvider = ({ children }) => {
  const recipe_info = [
    {
      Header: 'Article',
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

  const [selectedProduct, setSelectedProduct] = useState(null);
  const [productOfRecipe, setProductOfRecipe] = useState({});
  const [selectedRecipe, setSelectedRecipe] = useState(null);

  const list_of_recipes = useSelector((state) => state.recipe);

  return (
    <RecipeContext.Provider
      value={{
        recipe_info,
        selectedProduct,
        setSelectedProduct,
        productOfRecipe,
        setProductOfRecipe,
        list_of_recipes,
        selectedRecipe,
        setSelectedRecipe,
      }}
    >
      {children}
    </RecipeContext.Provider>
  );
};

export default RecipeContextProvider;

const useRecipeContext = () => useContext(RecipeContext);
export { useRecipeContext };
