import React, { useCallback, useEffect, useState } from 'react';
import Button from 'react-bootstrap/Button';
import Table from '#components/Table/Table.jsx';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useUsersContext } from '#components/contexts/UserContext.js';
import RecipeInfoModal from './RecipeInfoModal';
import { useRecipeContext } from '#components/contexts/RecipeContext.js';
import AddNewRecipeModal from './AddNewRecipeModal';
import { getRecipe } from '#components/redux/actions/recipeAction.js';

const ProductsListForRecipes = () => {
  const [modalShow, setModalShow] = useState(false);
  const { roles, checkUserAccess, userAccess, setUserAccess } = useUsersContext();
  const { recipe_info, list_of_recipes, setSelectedRecipe } = useRecipeContext();

  const user = useSelector((state) => state.user);
  const [newRecipeModalShow, setNewRecipeModalShow] = useState(false);

  // const dispatch = useDispatch(); // for recepie later
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handlerRecipeInfo = useCallback((row) => {
    const recipe = list_of_recipes.filter((el) => el.id === row.original.id)[0];

    setSelectedRecipe(recipe);
    // setProductOfOrder((prev) => ({ ...prev, product_id: product?.id }));

    setModalShow(true);
  }, []);

  // useEffect(() => {
  //   let filtered = latestProducts.filter((el) =>
  //     el.placeOfProduction?.includes('Spain')
  //   );
  //   setCProductsDataList(filtered);
  // }, [latestProducts]);

  useEffect(() => {
    if (user && roles.length > 0) {
      const access = checkUserAccess(user, roles, 'recipe_products');
      setUserAccess(access);

      console.log('access', access);

      if (!access?.canRead) {
        navigate('/'); // Перенаправление на главную страницу, если нет прав на чтение
      }
    }
  }, [user, roles]);

  useEffect(() => {
    if (userAccess?.canRead) {
      dispatch(getRecipe());
    }
  }, []);

  return (
    <div>
      {userAccess?.canWrite && (
        <Button
          onClick={() => {
            setNewRecipeModalShow(!newRecipeModalShow);
          }}
        >
          Create new recipe
        </Button>
      )}
      {newRecipeModalShow && userAccess?.canWrite && (
        <AddNewRecipeModal
          show={newRecipeModalShow}
          onHide={() => setNewRecipeModalShow(!newRecipeModalShow)}
        />
      )}

      <Table
        COLUMN_DATA={recipe_info}
        dataOfTable={list_of_recipes}
        userAccess={userAccess}
        onClickButton={() => {}}
        buttonText={''}
        tableName={'Table of recipes'}
        handleRowClick={(row) => {
          handlerRecipeInfo(row);
        }}
      />
      <RecipeInfoModal
        show={modalShow}
        onHide={() => setModalShow(false)}
        needDeleteButton={userAccess?.canWrite ?? false}
      />
    </div>
  );
};
export default ProductsListForRecipes;
