import { all } from 'redux-saga/effects';
import userWatcher from './userSagas';
import productsWatcher from './productsSagas';
import clientsWatcher from './clientsSagas';
export default function* rootSaga() {
  yield all([userWatcher(), productsWatcher(), clientsWatcher()]);
}
