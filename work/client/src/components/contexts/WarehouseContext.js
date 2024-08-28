import { getProductsOfOrders } from '#components/redux/actions/ordersAction.js';
import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

const WarehouseContext = createContext();

const WarehouseContextProvider = ({ children }) => {
  const COLUMNS_WAREHOUSE = [
    {
      Header: 'Article of warehouse',
      accessor: 'article',
      sortType: 'string',
    },
    {
      Header: 'Article of product',
      accessor: 'product_article',
      sortType: 'string',
    },
    {
      Header: 'Remaining stock',
      accessor: 'remaining_stock',
      sortType: 'number',
    },
    {
      Header: 'Warehouse location',
      accessor: 'warehouse_loc',
      sortType: 'string',
    },
  ];

  const dispatch = useDispatch();

  const [warehouseModal, setWarehouseModal] = useState(false);
  const [reserveProductModal, setReserveProductModal] = useState(false);
  const [warehouseInfoModal, setWarehouseInfoModal] = useState(false);
  const [warehouseInfoCurIdModal, setWarehouseInfoCurIdModal] = useState(null);
  const warehouse_data = useSelector((state) => state.warehouse);
  const list_of_reserved_products = useSelector((state) => state.reservedProducts);

  useEffect(() => {
    dispatch(getProductsOfOrders());
  }, [dispatch]);

  return (
    <WarehouseContext.Provider
      value={{
        COLUMNS_WAREHOUSE,
        warehouse_data,
        list_of_reserved_products,
        warehouseModal,
        setWarehouseModal,
        reserveProductModal,
        setReserveProductModal,
        warehouseInfoModal,
        setWarehouseInfoModal,
        warehouseInfoCurIdModal,
        setWarehouseInfoCurIdModal,
      }}
    >
      {children}
    </WarehouseContext.Provider>
  );
};

export default WarehouseContextProvider;

const useWarehouseContext = () => useContext(WarehouseContext);
export { useWarehouseContext };
