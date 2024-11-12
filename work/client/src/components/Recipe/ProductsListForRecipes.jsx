import React, { useCallback, useEffect, useState } from 'react';
import Button from 'react-bootstrap/Button';
import Table from '#components/Table/Table.jsx';
import { useDispatch, useSelector } from 'react-redux';
import { useProductsContext } from '#components/contexts/ProductContext.js';
import { useNavigate } from 'react-router-dom';
import { useUsersContext } from '#components/contexts/UserContext.js';
import RecipeChoiceModal from './RecipeChoiceModal';
import { useRecipeContext } from '#components/contexts/RecipeContext.js';
import AddNewRecipeModal from './AddNewRecipeModal';
import { getRecipe } from '#components/redux/actions/recipeAction.js';

const ProductsListForRecipes = () => {
  const [modalShow, setModalShow] = useState(false);
  const { roles, checkUserAccess, userAccess, setUserAccess } = useUsersContext();
  const { COLUMNS, latestProducts } = useProductsContext();
  const { recipe_info, list_of_recipes, selectedProduct, setSelectedProduct } =
    useRecipeContext();

  const user = useSelector((state) => state.user);

  const [productsDataList, setCProductsDataList] = useState(latestProducts);
  const [newRecipeModalShow, setNewRecipeModalShow] = useState(false);

  // const dispatch = useDispatch(); // for recepie later
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // const handlerAddProductRecipe = useCallback((row) => {
  //   const product = productsDataList.filter((el) => el.id === row.original.id)[0];

  //   setSelectedProduct(product);
  //   // setProductOfOrder((prev) => ({ ...prev, product_id: product?.id }));

  //   setModalShow(true);
  // }, []);

  // useEffect(() => {
  //   let filtered = latestProducts.filter((el) =>
  //     el.placeOfProduction?.includes('Spain')
  //   );
  //   setCProductsDataList(filtered);
  // }, [latestProducts]);

  useEffect(() => {
    if (user && roles.length > 0) {
      const access = checkUserAccess(user, roles, 'Products');
      setUserAccess(access);

      console.log('access', access);

      if (!access?.canRead) {
        navigate('/'); // Перенаправление на главную страницу, если нет прав на чтение
      }
    }
  }, [user, roles]);

  useEffect(() => {
    dispatch(getRecipe());
  }, []);

  return (
    <div>
      <Button
        onClick={() => {
          setNewRecipeModalShow(!newRecipeModalShow);
        }}
      >
        Создать новый
      </Button>
      {newRecipeModalShow && (
        <AddNewRecipeModal
          show={newRecipeModalShow}
          onHide={() => setNewRecipeModalShow(!newRecipeModalShow)}
        />
      )}

      <Table
        COLUMN_DATA={recipe_info}
        dataOfTable={list_of_recipes}
        // userAccess={userAccess}
        onClickButton={() => {}}
        buttonText={''}
        tableName={'Table of recipes'}
        // handleRowClick={(row) => {
        //   handlerAddProductRecipe(row);
        // }}
      />
      <RecipeChoiceModal show={modalShow} onHide={() => setModalShow(false)} />
    </div>
  );
};
export default ProductsListForRecipes;
