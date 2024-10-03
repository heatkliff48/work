import { ProductsContextProvider } from './ProductContext';
import { ModalContextProvider } from './ModalContext';
import { UsersContextProvider } from './UserContext';
// import { ClientsContextProvider } from './ClientsContext';
import WarehouseContextProvider from './WarehouseContext';
import OrderContextProvider from './OrderContext';
import ProjectContextProvider from './Context';

const MainContextProvider = ({ children }) => {
  return (
    <ProjectContextProvider>
      <ProductsContextProvider>
        <ModalContextProvider>
          <UsersContextProvider>
            {/* <ClientsContextProvider> */}
            <OrderContextProvider>
              <WarehouseContextProvider>{children}</WarehouseContextProvider>
            </OrderContextProvider>
            {/* </ClientsContextProvider>*/}
          </UsersContextProvider>
        </ModalContextProvider>
      </ProductsContextProvider>
    </ProjectContextProvider>
  );
};

export default MainContextProvider;
