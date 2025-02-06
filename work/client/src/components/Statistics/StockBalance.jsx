import { useModalContext } from '#components/contexts/ModalContext.js';
import { useStatisticContext } from '#components/contexts/StatisticContext.js';
import { useUsersContext } from '#components/contexts/UserContext.js';
import Table from '../Table/Table';
import StockBalanceModal from './modal/StockBalanceModal';
import { useCallback, useEffect } from 'react';
import { useSelector } from 'react-redux';

function StockBalance() {
  const { roles, checkUserAccess, userAccess, setUserAccess } = useUsersContext();
  const { stockBalanceModal, setStockBalanceModal } = useModalContext();
  const { COLUMNS_STOCK_BALANCE, stock_balance } =
    useStatisticContext();

  const user = useSelector((state) => state.user);

  const handleRowClick = useCallback((row) => {
    console.log('row', row);
  }, []);

  // !!!!!!!! ДОБАВИТЬ НОВЫЙ РОЛЬ И АКСЕС
  useEffect(() => {
    if (user && roles.length > 0) {
      const access = checkUserAccess(user, roles, 'Warehouse');

      if (JSON.stringify(access) !== JSON.stringify(userAccess)) {
        setUserAccess(access);
      }
    }
  }, [user, roles, checkUserAccess, userAccess, setUserAccess]);

  return (
    <>
      {stockBalanceModal && (
        <StockBalanceModal
          isOpen={stockBalanceModal}
          toggle={() => {
            setStockBalanceModal(!stockBalanceModal);
          }}
        />
      )}
      <Table
        COLUMN_DATA={COLUMNS_STOCK_BALANCE}
        dataOfTable={stock_balance}
        userAccess={userAccess}
        onClickButton={() => {
          setStockBalanceModal(!stockBalanceModal);
        }}
        buttonText={'Add new product on Stock Balance'}
        tableName={'Stock Balance'}
        handleRowClick={handleRowClick}
      />
    </>
  );
}
export default StockBalance;
