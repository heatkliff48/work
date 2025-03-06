import { useUsersContext } from '#components/contexts/UserContext.js';
import { getCurrentProductsOfOrders } from '#components/redux/actions/ordersAction.js';
import Table from '../Table/Table';
import { useOrderContext } from '../contexts/OrderContext';
import AccountngOrderCard from './AccountngOrderCard';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';

function Accounting() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const {
    COLUMNS_ACCOUNTING,
    ordersDataList,
    storedData,
    status_list,
    setStoredData,
    accountingDataList,
    accDataList,
    setAccDataList,
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
    const result = accountingDataList
      .filter((el) => !el.aproved)
      .map((item) => {
        const status = status_list.find((el) => {
          return el.accessor == item.orders_status;
        });

        return {
          ...item,
          orders_status: status ? status.Header : item.orders_status,
        };
      });
    setAccDataList(result);
  }, [accountingDataList]);

  return (
    <>
      {storedData === null ? (
        <Table
          COLUMN_DATA={COLUMNS_ACCOUNTING}
          dataOfTable={accDataList ?? []}
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
            dispatch(getCurrentProductsOfOrders(order.id));
          }}
        />
      ) : (
        <AccountngOrderCard />
      )}
    </>
  );
}
export default Accounting;
