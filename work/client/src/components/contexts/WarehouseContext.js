import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

const WarehouseContext = createContext();

const WarehouseContextProvider = ({ children }) => {
  const COLUMNS_WAREHOUSE = [
    {
      Header: 'Article of warehouse',
      accessor: 'warehouse_article',
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
  const warehouse_data = useSelector((state) => state.warehouse);

  return (
    <WarehouseContext.Provider
      value={{
        COLUMNS_WAREHOUSE,
        warehouse_data,
        warehouseModal,
        setWarehouseModal,
      }}
    >
      {children}
    </WarehouseContext.Provider>
  );
};

export default WarehouseContextProvider;

const useWarehouseContext = () => useContext(WarehouseContext);
export { useWarehouseContext };
