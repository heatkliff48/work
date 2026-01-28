import React, { useCallback, useEffect, useState } from 'react';
import Button from 'react-bootstrap/Button';
import Table from '#components/Table/Table.jsx';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useUsersContext } from '#components/contexts/UserContext.js';
import RecipeInfoModal from './RecipeInfoModal';
import { useRecipeContext } from '#components/contexts/RecipeContext.js';
import AddNewRecipeModal from './AddNewRecipeModal';

const ProductsListForRecipes = () => {
  const [modalShow, setModalShow] = useState(false);
  const { roles, checkUserAccess, userAccess, setUserAccess } =
    useUsersContext();
  const { recipe_info, list_of_recipes } = useRecipeContext();

  const user = useSelector((state) => state.user);
  const [newRecipeModalShow, setNewRecipeModalShow] = useState(false);
  const [selectedRecipe, setSelectedRecipe] = useState(null);

  const navigate = useNavigate();

  const handlerRecipeInfo = useCallback((row) => {
    setSelectedRecipe(row.original);
    setModalShow(true);
  }, []);

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
        tableName={'Recipe catalog'}
        handleRowClick={(row) => {
          handlerRecipeInfo(row);
        }}
      />
      <RecipeInfoModal
        show={modalShow}
        onHide={() => setModalShow(false)}
        needDeleteButton={userAccess?.canWrite ?? false}
        selectedRecipe={selectedRecipe}
        setSelectedRecipe={setSelectedRecipe}
      />
    </div>
  );
};
export default ProductsListForRecipes;
