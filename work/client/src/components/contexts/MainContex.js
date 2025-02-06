import ProjectContextProvider from './Context';
import { ModalContextProvider } from './ModalContext';
import OrderContextProvider from './OrderContext';
import { ProductsContextProvider } from './ProductContext';
import RecipeContextProvider from './RecipeContext';
import StatisticContextProvider from './StatisticContext';
import { UsersContextProvider } from './UserContext';
// import { ClientsContextProvider } from './ClientsContext';
import WarehouseContextProvider from './WarehouseContext';

const MainContextProvider = ({ children }) => {
  return (
    <ProjectContextProvider>
      <StatisticContextProvider>
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
      </StatisticContextProvider>
    </ProjectContextProvider>
  );
};

export default MainContextProvider;
