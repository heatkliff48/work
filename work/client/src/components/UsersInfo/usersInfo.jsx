import React, { Fragment, useEffect, useState, createContext } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import UsersInfoFullModal from './usersInfoFullModal.jsx';
import ShowUsersInfoModal from './usersInfoModal.jsx';
import {
  getAllUsersInfo,
  getAllUsersMainInfo,
} from '#components/redux/actions/usersInfoAction';
import { useProjectContext } from '#components/contexts/Context.js';
import Table from '#components/Table/Table';

export const ClientContext = createContext();

const UsersInfo = () => {
  const [modalShow, setModalShow] = useState(false);
  const {
    currentUsersInfo,
    setCurrentUsersInfo,
    users_info_table,
    usersInfoDataList,
    setUsersInfoDataList,
  } = useProjectContext();

  const dispatch = useDispatch();
  const usersInfo = useSelector((state) => state.usersInfo);
  const usersMainInfo = useSelector((state) => state.usersMainInfo);

  const [searchFilter, setSearchFilter] = useState('');
  // const [listOfClientsFiltered, setListOfClientsFiltered] = useState(clients);

  useEffect(() => {
    dispatch(getAllUsersInfo());
    dispatch(getAllUsersMainInfo());
  }, []);

  const clientHandler = (id) => {
    const user = usersInfoDataList.find((el) => el.id === id);
    setCurrentUsersInfo(user);
    setModalShow(true);
  };

  // const filterListOfClientsHandler = (e) => {
  //   setSearchFilter(e.target.value);
  //   let filtered = clients.filter((el) =>
  //     el.c_name?.toLowerCase().includes(e.target.value.toLowerCase())
  //   );
  //   setListOfClientsFiltered(filtered);
  // };

  const combine = (a, b, prop) =>
    Object.values(
      [...a, ...b].reduce((acc, v) => {
        if (v[prop])
          acc[v[prop]] = acc[v[prop]] ? { ...acc[v[prop]], ...v } : { ...v };
        return acc;
      }, {})
    );

  useEffect(() => {
    const combined = combine(usersInfo, usersMainInfo, 'id');
    setUsersInfoDataList(combined);
  }, [usersInfo, usersMainInfo]);

  return (
    <Fragment>
      {' '}
      {/* <ClientContext.Provider value={[currentClient, setCurrentClient]}> */}
      <ShowUsersInfoModal />
      <Table
        COLUMN_DATA={users_info_table}
        dataOfTable={usersInfoDataList}
        // userAccess={userAccess}
        // onClickButton={() => {
        //   setClientModalOrder(!clientModalOrder);
        // }}
        // buttonText={'Add new order'}
        tableName={'Users'}
        handleRowClick={(row) => {
          clientHandler(row.original.id);
        }}
      />
      {/* <div>
        <h4>Search clients</h4>
        <input
          value={searchFilter}
          onChange={(e) => {
            filterListOfClientsHandler(e);
          }}
        />
      </div>
      <table
        className="table mt-5 table-bordered text-center table-striped table-hover"
        align="left"
      >
        <thead>
          <tr>
            <th>id</th>
            <th>c_name</th>
            <th>tin</th>
            <th>category</th>
          </tr>
        </thead>
        <tbody>
          {listOfClientsFiltered?.map((entrie) => {
            if (!entrie) return;
            return (
              <tr
                key={entrie.id}
                onClick={(e) => {
                  clientHandler(entrie.id);
                }}
              >
                <td>{entrie?.id}</td>
                <td>{entrie?.c_name}</td>
                <td>{entrie?.tin}</td>
                <td>{entrie?.category}</td>
              </tr>
            );
          })}
        </tbody>
      </table> */}
      <UsersInfoFullModal show={modalShow} onHide={() => setModalShow(false)} />
      {/* </ClientContext.Provider> */}
    </Fragment>
  );
};

export default UsersInfo;
