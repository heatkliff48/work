import React, { Fragment, useEffect, useState, createContext } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { getBatchOutside } from '#components/redux/actions/batchOutsideAction.js';
import Table from '#components/Table/Table';
import { TextSearchFilter } from '#components/Table/filters.js';
import { useUsersContext } from '#components/contexts/UserContext.js';
import BatchOutsideModal from './BatchOutsideModal';

const BatchOutside = () => {
  const [modalShow, setModalShow] = useState(false);
  const { roles, checkUserAccess, userAccess, setUserAccess } = useUsersContext();

  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const batchOutside = useSelector((state) => state.batchOutside);

  const [batchOutsideDataList, setBatchOutsideDataList] = useState([]);

  const batch_outside_table = [
    {
      Header: 'id_warehouse_batch',
      accessor: 'id_warehouse_batch',
      Filter: TextSearchFilter,
    },
    {
      Header: 'id_list_of_ordered_production',
      accessor: 'id_list_of_ordered_production',
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
      setBatchOutsideDataList(batchOutside);
    }
  }, [batchOutside]);

  const batchOutsideHandler = (id) => {
    setModalShow(true);
  };

  useEffect(() => {
    if (user && roles.length > 0) {
      const access = checkUserAccess(user, roles, 'Clients');
      setUserAccess(access);

      if (!access.canRead) {
        navigate('/');
      }
    }
  }, [user, roles]);

  useEffect(() => {
    if (userAccess.canRead) {
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
      <BatchOutsideModal show={modalShow} onHide={() => setModalShow(false)} />
    </Fragment>
  );
};

export default BatchOutside;
