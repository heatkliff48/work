import { combineReducers } from 'redux';
import { userReducer } from './userReducer';
import { productsReducer } from './productsReducer';
import { jwtReducer } from './jwtReducer';
import { 
  clientsReducer,
  legalAddressReducer, 
  deliveryAddressesReducer,
  contactInfoReducer
} from './clientsReducer';
import { rolesReducer } from './rolesReducer';
import { pagesReducer } from './pagesReducer';
import { ordersReducer } from './orderReducer';

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
});
