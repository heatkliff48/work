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
      // !!!!!!!!!!!!!!!!!!!!!!!!!
      // const newArray = productionBatchLog.map((logs) => {
      //   const { id, article, status, shipping_date } = order;
      //   const client = clients.find((client) => client.id === order.owner);
      //   const deliveryAddress = deliveryAddresses.find(
      //     (address) =>
      //       address.id === order.del_adr_id && address.client_id === order.owner
      //   );

      //   return {
      //     id,
      //     article,
      //     status,
      //     owner: client ? client.c_name : '',
      //     del_adr_id: deliveryAddress ? deliveryAddress.street : '',
      //     shipping_date,
      //   };
      // });

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
