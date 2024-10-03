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
import { useUsersContext } from '#components/contexts/UserContext.js';

export const ClientContext = createContext();

const UsersInfo = () => {
  const [modalShow, setModalShow] = useState(false);
  const {
    setCurrentUsersInfo,
    users_info_table,
    usersInfoDataList,
    setUsersInfoDataList,
  } = useProjectContext();
  const { roles, checkUserAccess, userAccess, setUserAccess } = useUsersContext();

  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const usersInfo = useSelector((state) => state.usersInfo);
  const usersMainInfo = useSelector((state) => state.usersMainInfo);

  useEffect(() => {
    dispatch(getAllUsersInfo());
    dispatch(getAllUsersMainInfo());
  }, []);

  const clientHandler = (id) => {
    const user = usersInfoDataList.find((el) => el.id === id);
    setCurrentUsersInfo(user);
    setModalShow(true);
  };

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

  useEffect(() => {
    if (user && roles.length > 0) {
      const access = checkUserAccess(user, roles, 'Users_info');
      setUserAccess(access);
    }
  }, [user, roles]);

  return (
    <Fragment>
      {' '}
      {userAccess?.canWrite && <ShowUsersInfoModal />}
      <Table
        COLUMN_DATA={users_info_table}
        dataOfTable={usersInfoDataList}
        userAccess={userAccess}
        tableName={'Users'}
        handleRowClick={(row) => {
          clientHandler(row.original.id);
        }}
      />
      <UsersInfoFullModal show={modalShow} onHide={() => setModalShow(false)} />
    </Fragment>
  );
};

export default UsersInfo;
