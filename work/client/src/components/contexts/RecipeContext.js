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
      accessor: 'density',
    },
    {
      Header: 'Produced amount of return (dry)',
      accessor: 'produced_return_dry',
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
