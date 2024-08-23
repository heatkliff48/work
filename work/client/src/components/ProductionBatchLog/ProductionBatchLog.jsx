import { useDispatch, useSelector } from 'react-redux';
import Table from '../Table/Table';
import { useCallback, useEffect } from 'react';
import { useProjectContext } from '#components/contexts/Context.js';
import { getAllProductionBatchLogs } from '#components/redux/actions/productionBatchLogAction.js';
import AddProductToProductionBatchLogModal from './ProductionBatchLogModal.jsx';

function ProductionBatchLog() {
  const { production_batch_log, productionBatchLogData, setProductionBatchLogData } =
    useProjectContext();
  const productionBatchLog = useSelector((state) => state.productionBatchLog);

  const dispatch = useDispatch();

  useEffect(() => {
    if (productionBatchLog) {
      setProductionBatchLogData(productionBatchLog);
    }
  }, [productionBatchLog]);

  useEffect(() => {
    dispatch(getAllProductionBatchLogs());
  }, []);

  return (
    <>
      <AddProductToProductionBatchLogModal />
      <Table
        COLUMN_DATA={production_batch_log}
        dataOfTable={productionBatchLogData}
        tableName={'Журнал производственных партий'}
      />
    </>
  );
}
export default ProductionBatchLog;
