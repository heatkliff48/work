import { useUsersContext } from '#components/contexts/UserContext.js';
import Table from '../Table/Table';
import { useOrderContext } from '../contexts/OrderContext';
import AccountngOrderCard from './AccountngOrderCard';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Accounting() {
  const navigate = useNavigate();

  const {
    COLUMNS_ACCOUNTING,
    ordersDataList,
    storedData,
    setStoredData,
    accountingDataList,
    accountingStatusList,
    setAccountingDataList,
    getCurrentOrderInfoHandler,
  } = useOrderContext();
  // const { user, roles, checkUserAccess, userAccess, setUserAccess } =
  //   useUsersContext();

  // useEffect(() => {
  //   if (user && roles.length > 0) {
  //     const access = checkUserAccess(user, roles, 'Orders');
  //     setUserAccess(access);

  //     if (!access?.canRead) {
  //       navigate('/');
  //     }
  //   }
  // }, [user, roles]);

  useEffect(() => {
    setStoredData(null);
    setAccountingDataList((prevData) => {
      return prevData.map((item) => {
        const status = accountingStatusList.find((el) => {
          return el.accessor == item.orders_status;
        });
        return {
          ...item,
          orders_status: status ? status.Header : item.orders_status,
        };
      });
    });
  }, []);

  return (
    <>
      {storedData === null ? (
        <Table
          COLUMN_DATA={COLUMNS_ACCOUNTING}
          dataOfTable={accountingDataList}
          // userAccess={userAccess}
          onClickButton={() => {}}
          buttonText={''}
          tableName={'Accounting'}
          handleRowClick={(row) => {
            const order = ordersDataList.find(
              (el) => el.article === row.original.orders_article
            );
            getCurrentOrderInfoHandler(order);
            setStoredData(row.original);
          }}
        />
      ) : (
        <AccountngOrderCard />
      )}
    </>
  );
}
export default Accounting;
