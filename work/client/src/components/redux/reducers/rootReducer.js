import { combineReducers } from 'redux';
import { userReducer } from './userReducer';
import { productsReducer } from './productsReducer';
import { jwtReducer } from './jwtReducer';
import { modalReducer } from './modalReducer';
import { modalUpdateReducer } from './modalUpdateReducer';

export const rootReducer = combineReducers({
  user: userReducer,
  products: productsReducer,
  jwt: jwtReducer,
  modal: modalReducer,
  modalUpdate: modalUpdateReducer,
});
