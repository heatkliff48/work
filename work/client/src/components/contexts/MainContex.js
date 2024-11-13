import { ProductsContextProvider } from './ProductContext';
import { ModalContextProvider } from './ModalContext';
import { UsersContextProvider } from './UserContext';
// import { ClientsContextProvider } from './ClientsContext';
import WarehouseContextProvider from './WarehouseContext';
import OrderContextProvider from './OrderContext';
import ProjectContextProvider from './Context';
import RecipeContextProvider from './RecipeContext';

const MainContextProvider = ({ children }) => {
  return (
    <ProjectContextProvider>
      <ProductsContextProvider>
        <ModalContextProvider>
          <RecipeContextProvider>
            <UsersContextProvider>
              {/* <ClientsContextProvider> */}
              <OrderContextProvider>
                <WarehouseContextProvider>{children}</WarehouseContextProvider>
              </OrderContextProvider>
              {/* </ClientsContextProvider>*/}
            </UsersContextProvider>
          </RecipeContextProvider>
        </ModalContextProvider>
      </ProductsContextProvider>
    </ProjectContextProvider>
  );
};

export default MainContextProvider;
