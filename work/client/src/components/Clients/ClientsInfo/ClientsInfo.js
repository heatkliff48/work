import React, { Fragment, useEffect, useState, createContext } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import MydModalWithGrid from './ClientFullModal.js';
import ShowClientsModal from './ClientsInfoModal.js';
import { getAllClients } from '#components/redux/actions/clientAction';
import { useProjectContext } from '#components/contexts/Context.js';
import {
  getAllDeliveryAddresses,
  getAllContactInfo,
} from '#components/redux/actions/clientAction';
import Table from '#components/Table/Table';

export const ClientContext = createContext();

const ClientsInfo = () => {
  const [modalShow, setModalShow] = useState(false);
  const {
    currentClient,
    setCurrentClient,
    clients_info_table,
    clientsDataList,
    setClientsDataList,
    roles,
    checkUserAccess,
    userAccess,
    setUserAccess,
  } = useProjectContext();

  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const clients = useSelector((state) => state.clients);

  const [searchFilter, setSearchFilter] = useState('');

  useEffect(() => {
    if (userAccess.canRead) {
      dispatch(getAllClients());
      dispatch(getAllDeliveryAddresses());
      dispatch(getAllContactInfo());
    }
  }, [userAccess.canRead]);

  const clientHandler = (id) => {
    const client = clients.find((el) => el.id === id);
    setCurrentClient(client);
    setModalShow(true);
  };

  useEffect(() => {
    let filtered = clients.filter((el) =>
      el.c_name?.toLowerCase().includes(searchFilter.toLowerCase())
    );
    setClientsDataList(filtered);
  }, [clients]);

  useEffect(() => {
    if (user && roles.length > 0) {
      const access = checkUserAccess(user, roles, 'Clients');
      setUserAccess(access);

      if (!access.canRead) {
        navigate('/'); // Перенаправление на главную страницу, если нет прав на чтение
      }
    }
  }, [user, roles]);

  return (
    <Fragment>
      {' '}
      {userAccess.canWrite && <ShowClientsModal />}
      <Table
        COLUMN_DATA={clients_info_table}
        dataOfTable={clientsDataList}
        tableName={'Clients'}
        userAccess={userAccess}
        handleRowClick={(row) => {
          clientHandler(row.original.id);
        }}
      />
      <MydModalWithGrid show={modalShow} onHide={() => setModalShow(false)} />
    </Fragment>
  );
};

export default ClientsInfo;
