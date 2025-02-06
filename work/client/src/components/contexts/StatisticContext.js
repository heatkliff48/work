import { createContext, useContext, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

const StatisticContext = createContext();

const StatisticContextProvider = ({ children }) => {
  const dispatch = useDispatch();

  const COLUMNS_STOCK_BALANCE = [
    {
      Header: 'Product type',
      accessor: 'product_article',
      sortType: 'string',
    },
    {
      Header: 'Stock requirements',
      accessor: 'stock_requirements',
      sortType: 'number',
    },
    {
      Header: 'In stock',
      accessor: 'in_stock',
      sortType: 'number',
    },
    {
      Header: 'Diff',
      accessor: 'diff',
      sortType: 'number',
    },
  ];

  const stock_balance = useSelector((state) => state.stockBalance);
  return (
    <StatisticContext.Provider
      value={{
        COLUMNS_STOCK_BALANCE,
        stock_balance,
      }}
    >
      {children}
    </StatisticContext.Provider>
  );
};

export default StatisticContextProvider;

const useStatisticContext = () => useContext(StatisticContext);
export { useStatisticContext };
