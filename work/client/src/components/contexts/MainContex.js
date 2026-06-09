import { AutoclaveContextProvider } from './AutoclaveContext';
import ProjectContextProvider from './Context';
import { FileContextProvider } from './FileContext';
import { ModalContextProvider } from './ModalContext';
import OrderContextProvider from './OrderContext';
import { ProductsContextProvider } from './ProductContext';
import ProductsTypeJournalContextProvider from './ProductsTypeJournalContext';
import RecipeContextProvider from './RecipeContext';
import StatisticContextProvider from './StatisticContext';
import { UsersContextProvider } from './UserContext';
// import { ClientsContextProvider } from './ClientsContext';
import WarehouseContextProvider from './WarehouseContext';

const MainContextProvider = ({ children }) => {
  return (
    <ProjectContextProvider>
      <StatisticContextProvider>
        <ProductsTypeJournalContextProvider>
          <ProductsContextProvider>
            <ModalContextProvider>
              <RecipeContextProvider>
                <UsersContextProvider>
                  {/* <ClientsContextProvider> */}
                  <OrderContextProvider>
                    <AutoclaveContextProvider>
                      <WarehouseContextProvider>
                        <FileContextProvider>{children}</FileContextProvider>
                      </WarehouseContextProvider>
                    </AutoclaveContextProvider>
                  </OrderContextProvider>
                  {/* </ClientsContextProvider>*/}
                </UsersContextProvider>
              </RecipeContextProvider>
            </ModalContextProvider>
          </ProductsContextProvider>
        </ProductsTypeJournalContextProvider>
      </StatisticContextProvider>
    </ProjectContextProvider>
  );
};

export default MainContextProvider;
