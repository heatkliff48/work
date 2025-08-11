import Table from '#components/Table/Table';
import { TextSearchFilter } from '#components/Table/filters.js';
import { useUsersContext } from '#components/contexts/UserContext.js';
import React, { Fragment, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

const BatchOutside = () => {
  const { roles, checkUserAccess, userAccess, setUserAccess } = useUsersContext();
  const user = useSelector((state) => state.user);
  const navigate = useNavigate();
  const batchOutside = useSelector((state) => state.batchOutside);

  const batch_outside_table = [
    {
      Header: 'Product ID',
      accessor: 'product_article',
      Filter: TextSearchFilter,
    },
    {
      Header: 'Quantity: pallets',
      accessor: 'quantity_pallets',
      Filter: TextSearchFilter,
    },
    {
      Header: 'Quantity: free',
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

  return (
    <Fragment>
      {' '}
      <Table
        COLUMN_DATA={batch_outside_table}
        dataOfTable={batchOutside}
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
