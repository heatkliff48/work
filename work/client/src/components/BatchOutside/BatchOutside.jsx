import React, { Fragment, useEffect, useState, createContext } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { getBatchOutside } from '#components/redux/actions/batchOutsideAction.js';
import Table from '#components/Table/Table';
import { TextSearchFilter } from '#components/Table/filters.js';
import { useUsersContext } from '#components/contexts/UserContext.js';
import { useWarehouseContext } from '#components/contexts/WarehouseContext.js';
import BatchOutsideModal from './BatchOutsideModal';

const BatchOutside = () => {
  const [modalShow, setModalShow] = useState(false);
  const { roles, checkUserAccess, userAccess, setUserAccess } = useUsersContext();
  const {
    currentOrderedProducts,
    setCurrentOrderedProducts,
    currentBatchId,
    setCurrentBatchId,
  } = useWarehouseContext();

  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const batchOutside = useSelector((state) => state.batchOutside);

  const [batchOutsideDataList, setBatchOutsideDataList] = useState([]);

  const list_of_ordered_production = useSelector(
    (state) => state.listOfOrderedProduction
  );

  const batch_outside_table = [
    {
      Header: 'id_warehouse_batch',
      accessor: 'id_warehouse_batch',
      Filter: TextSearchFilter,
    },
    {
      Header: 'list_of_ordered_production product',
      accessor: 'product_article',
      Filter: TextSearchFilter,
    },
    {
      Header: 'quantity_pallets',
      accessor: 'quantity_pallets',
      Filter: TextSearchFilter,
    },
    {
      Header: 'quantity_ordered',
      accessor: 'quantity_ordered',
      Filter: TextSearchFilter,
    },
    {
      Header: 'quantity_free',
      accessor: 'quantity_free',
      Filter: TextSearchFilter,
    },
    {
      Header: 'on_check',
      accessor: 'on_check',
      Filter: TextSearchFilter,
    },
  ];

  useEffect(() => {
    if (batchOutside) {
      const newData = batchOutside.map((batch) => {
        const product_article_batch =
          list_of_ordered_production.find(
            (el) => el.id === batch.id_list_of_ordered_production
          )?.product_article ?? '';
        return { ...batch, product_article: product_article_batch };
      });
      setBatchOutsideDataList(newData);
    }
  }, [batchOutside]);

  const batchOutsideHandler = (id) => {
    const currBatch = batchOutside.find((el) => el.id === id);
    setCurrentBatchId(currBatch.id);
    const currOrderedProduction = list_of_ordered_production.find(
      (el) => el.id === currBatch.id_list_of_ordered_production
    );
    setCurrentOrderedProducts(currOrderedProduction);
    setModalShow(true);
  };

  useEffect(() => {
    if (user && roles.length > 0) {
      const access = checkUserAccess(user, roles, 'batch_outside');
      setUserAccess(access);

      if (!access.canRead) {
        navigate('/');
      }
    }
  }, [user, roles]);

  useEffect(() => {
    if (userAccess?.canRead) {
      dispatch(getBatchOutside());
    }
  }, []);

  return (
    <Fragment>
      {' '}
      <Table
        COLUMN_DATA={batch_outside_table}
        dataOfTable={batchOutsideDataList}
        tableName={'Таблица'}
        userAccess={userAccess}
        handleRowClick={(row) => {
          batchOutsideHandler(row.original.id);
        }}
      />
      {userAccess?.canWrite && (
        <BatchOutsideModal show={modalShow} onHide={() => setModalShow(false)} />
      )}
    </Fragment>
  );
};

export default BatchOutside;
