import React, { useCallback, useEffect, useState } from 'react';
import Table from '#components/Table/Table.jsx';
import { useDispatch, useSelector } from 'react-redux';
import { useProductsContext } from '#components/contexts/ProductContext.js';
import { useNavigate } from 'react-router-dom';
import { useUsersContext } from '#components/contexts/UserContext.js';

const ProductsListForRecipes = () => {
  const { roles, checkUserAccess, userAccess, setUserAccess } = useUsersContext();
  const { COLUMNS, latestProducts } = useProductsContext();

  const user = useSelector((state) => state.user);

  const [productsDataList, setCProductsDataList] = useState(latestProducts);

  // const dispatch = useDispatch(); // for recepie later
  const navigate = useNavigate();

  const handlerAddProductRecipe = useCallback((row) => {
    console.log('Click');
    // const product = latestProducts.filter((el) => el.id === row.original.id)[0];

    // setSelectedProduct(product);
    // setProductOfOrder((prev) => ({ ...prev, product_id: product?.id }));
  }, []);

  useEffect(() => {
    let filtered = latestProducts.filter((el) =>
      el.placeOfProduction?.includes('Spain')
    );
    setCProductsDataList(filtered);
  }, [latestProducts]);

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

  return (
    <div>
      <>
        <Table
          COLUMN_DATA={COLUMNS}
          dataOfTable={productsDataList}
          // userAccess={userAccess}
          onClickButton={() => {}}
          buttonText={''}
          tableName={'Table of products in Spain'}
          handleRowClick={(row) => {
            handlerAddProductRecipe(row);
          }}
        />
      </>
    </div>
  );
};
export default ProductsListForRecipes;
