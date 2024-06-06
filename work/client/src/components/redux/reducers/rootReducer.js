import { combineReducers } from 'redux';
import { userReducer } from './userReducer';
import { productsReducer } from './productsReducer';
import { jwtReducer } from './jwtReducer';

export const rootReducer = combineReducers({
  user: userReducer,
  products: productsReducer,
  jwt: jwtReducer,
});
