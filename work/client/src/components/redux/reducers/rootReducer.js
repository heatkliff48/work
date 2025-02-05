import { recipeOrdersReducer } from './RecipeOrdersReducer';
import batchDesignerReducer from './batchDesignerReducer';
import { batchOutsideReducer } from './batchOutsideReducer';
import {
  clientsReducer,
  legalAddressReducer,
  deliveryAddressesReducer,
  contactInfoReducer,
} from './clientsReducer';
import { dataFetchedReducer } from './dataFetchedReducer';
import { filesOrderReducer } from './filesOrderReducer';
import { filesProductReducer } from './filesProductReducer';
import { filesWarehouseReducer } from './filesWarehouseReducer';
import { jwtReducer } from './jwtReducer';
import { listOfOrderedProductionOEMReducer } from './listOfOrderedProductionOEMReducer';
import { listOfOrderedProductionReducer } from './listOfOrderedProductionReducer';
import { ordersReducer } from './orderReducer';
import { pagesReducer } from './pagesReducer';
import { productionBatchLogReducer } from './productionBatchLogReducer';
import { productsOfOrdersReducer } from './productsOfOrdersReducer';
import { productsReducer } from './productsReducer';
import { recipeReducer } from './recipeReducer';
import { reservedProductsReducer } from './reservedProductsReducer';
import { rolesReducer } from './rolesReducer';
import { stockBalanceReducer } from './stockBalanceReducer';
import { userReducer } from './userReducer';
import { usersInfoReducer, usersMainInfoReducer } from './usersInfoReducer';
import { warehouseReducer } from './warehouseReducer';
import { combineReducers } from 'redux';

export const rootReducer = combineReducers({
  user: userReducer,
  dataFetched: dataFetchedReducer,
  products: productsReducer,
  jwt: jwtReducer,
  clients: clientsReducer,
  legalAddress: legalAddressReducer,
  deliveryAddresses: deliveryAddressesReducer,
  contactInfo: contactInfoReducer,
  roles: rolesReducer,
  pages: pagesReducer,
  orders: ordersReducer,
  productsOfOrders: productsOfOrdersReducer,
  warehouse: warehouseReducer,
  usersInfo: usersInfoReducer,
  usersMainInfo: usersMainInfoReducer,
  productionBatchLog: productionBatchLogReducer,
  reservedProducts: reservedProductsReducer,
  listOfOrderedProduction: listOfOrderedProductionReducer,
  listOfOrderedProductionOEM: listOfOrderedProductionOEMReducer,
  batchOutside: batchOutsideReducer,
  batchDesigner: batchDesignerReducer,
  recipe: recipeReducer,
  recipeOrders: recipeOrdersReducer,
  filesWarehouse: filesWarehouseReducer,
  filesOrder: filesOrderReducer,
  filesProduct: filesProductReducer,
  stockBalance: stockBalanceReducer,
});
