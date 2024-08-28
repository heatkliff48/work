import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Table from '../Table/Table';
import { useCallback, useEffect } from 'react';
import { useProjectContext } from '#components/contexts/Context.js';
import { getAllProductionBatchLogs } from '#components/redux/actions/productionBatchLogAction.js';
import AddProductToProductionBatchLogModal from './ProductionBatchLogModal.jsx';

function ProductionBatchLog() {
  const {
    production_batch_log,
    productionBatchLogData,
    setProductionBatchLogData,
    roles,
    checkUserAccess,
    userAccess,
    setUserAccess,
  } = useProjectContext();
  const productionBatchLog = useSelector((state) => state.productionBatchLog);

  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (productionBatchLog) {
      setProductionBatchLogData(productionBatchLog);
    }
  }, [productionBatchLog]);

  useEffect(() => {
    dispatch(getAllProductionBatchLogs());
  }, []);

  useEffect(() => {
    if (user && roles.length > 0) {
      const access = checkUserAccess(user, roles, 'Production_batch_log');
      setUserAccess(access);

      console.log('userAccess', userAccess);

      if (!access.canRead) {
        navigate('/'); // Перенаправление на главную страницу, если нет прав на чтение
      }
    }
  }, [user, roles]);

  return (
    <>
      {userAccess.canWrite && <AddProductToProductionBatchLogModal />}
      <Table
        COLUMN_DATA={production_batch_log}
        dataOfTable={productionBatchLogData}
        userAccess={userAccess}
        tableName={'Журнал производственных партий'}
      />
    </>
  );
}
export default ProductionBatchLog;
