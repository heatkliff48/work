import WarehouseContextProvider from './WarehouseContext';
import ProjectContextProvider from './Context';
import OrderContextProvider from './OrderContext';
// const { default: ProjectContextProvider } = require('./Context');
// const { default: OrderContextProvider } = require('./OrderContext');

const MainContextProvider = ({ children }) => {
  return (
    <ProjectContextProvider>
      {' '}
      <OrderContextProvider>
        {' '}
        <WarehouseContextProvider>{children}</WarehouseContextProvider>{' '}
      </OrderContextProvider>{' '}
    </ProjectContextProvider>
  );
};
export default MainContextProvider;
