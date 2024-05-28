import { combineReducers } from 'redux';
import { userReducer } from './userReducer';
import { productsReducer } from './productsReducer';

export const rootReducer = combineReducers({
  user: userReducer,
  products: productsReducer,
});
