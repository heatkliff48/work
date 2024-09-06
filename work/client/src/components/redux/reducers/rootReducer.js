import { combineReducers } from 'redux';
import { userReducer } from './userReducer';
import { productsReducer } from './productsReducer';
import { jwtReducer } from './jwtReducer';
import {
  clientsReducer,
  legalAddressReducer,
  deliveryAddressesReducer,
  contactInfoReducer,
} from './clientsReducer';
import { rolesReducer } from './rolesReducer';
import { pagesReducer } from './pagesReducer';
import { ordersReducer } from './orderReducer';
import { productsOfOrdersReducer } from './productsOfOrdersReducer';
import { warehouseReducer } from './warehouseReducer';
import { usersInfoReducer, usersMainInfoReducer } from './usersInfoReducer';
import { productionBatchLogReducer } from './productionBatchLogReducer';
import { reservedProductsReducer } from './reservedProductsReducer';
import { listOfOrderedProductionReducer } from './listOfOrderedProductionReducer';
import { listOfOrderedProductionOEMReducer } from './listOfOrderedProductionOEMReducer';

export const rootReducer = combineReducers({
  user: userReducer,
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
});
