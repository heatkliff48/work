import Table from '#components/Table/Table';
import { TextSearchFilter } from '#components/Table/filters.js';
import { useOrderContext } from '#components/contexts/OrderContext.js';
import { useProductsContext } from '#components/contexts/ProductContext.js';
import { useUsersContext } from '#components/contexts/UserContext.js';
import React, { Fragment, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

const BatchOutside = () => {
  const { latestProducts } = useProductsContext();
  const { roles, checkUserAccess, userAccess, setUserAccess } = useUsersContext();

  const user = useSelector((state) => state.user);
  const batchOutside = useSelector((state) => state.batchOutside);

  const navigate = useNavigate();

  const [newBatchOutside, setNewBatchOutside] = useState([]);

  const batch_outside_table = [
    {
      Header: 'Product ID',
      accessor: 'product_article',
      Filter: TextSearchFilter,
    },
    {
      Header: 'Quantity, arrays',
      accessor: 'quantity_arrays',
      Filter: TextSearchFilter,
    },
    {
      Header: 'Quantity, pallets',
      accessor: 'quantity_pallets',
      Filter: TextSearchFilter,
    },
    {
      Header: 'Quantity free, pallets',
      accessor: 'quantity_free',
      Filter: TextSearchFilter,
    },
    {
      Header: 'Position in autoclave',
      accessor: 'position_in_autoclave',
      Filter: TextSearchFilter,
    },
    {
      Header: 'Date',
      accessor: 'date',
    },
  ];

  // const batchOutsideHandler = (id) => {
  //   const currBatch = batchOutside.find((el) => el.id === id);
  //   setCurrentBatchId(currBatch.id);
  //   setCurrentBatch(currBatch);
  //   const currOrderedProduction = currBatch?.id_list_of_ordered_production
  //     ? list_of_ordered_production.find(
  //         (el) => el.id === currBatch.id_list_of_ordered_production
  //       )
  //     : latestProducts.find((el) => el.article === currBatch.product_article);

  //   setCurrentOrderedProducts(currOrderedProduction);
  //   setModalShow(true);
  // };

  useEffect(() => {
    if (user && roles.length > 0) {
      const access = checkUserAccess(user, roles, 'production_plan');
      setUserAccess(access);

      if (!access.canRead) {
        navigate('/');
      }
    }
  }, [user, roles]);

  useEffect(() => {
    if (!latestProducts?.length) return;

    const results = batchOutside.map((item) => {
      const product = latestProducts.find((p) => p.article === item.product_article);
      if (!product) {
        return { ...item, quantity_arrays: 0 };
      }

      const m3InArray = Number(product.m3InArray) || 0;
      const volumeBlockOnPallet = Number(product.volumeBlockOnPallet) || 0;

      const palletsPerArray = Math.max(
        1,
        Math.floor(m3InArray / volumeBlockOnPallet) || 1,
      );

      const quantity_arrays = Math.ceil(item.quantity_pallets / palletsPerArray);

      return {
        ...item,
        quantity_arrays,
      };
    });

    setNewBatchOutside(results);
  }, [batchOutside, latestProducts]);

  return (
    <Fragment>
      {' '}
      <Table
        COLUMN_DATA={batch_outside_table}
        dataOfTable={newBatchOutside}
        tableName={'Batch calendar'}
        userAccess={userAccess}
        handleRowClick={(row) => {
          // batchOutsideHandler(row.original.id);
        }}
      />
    </Fragment>
  );
};

export default BatchOutside;
