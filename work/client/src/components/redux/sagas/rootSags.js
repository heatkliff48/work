import { all } from 'redux-saga/effects';
import userWatcher from './userSagas';
import productsWatcher from './productsSagas';
import clientsWatcher from './clientsSagas';
import rolesWatcher from './rolesSagas';
import pagesWatcher from './pagesSagas';
import ordersWatcher from './ordersSagas';
export default function* rootSaga() {
  yield all([
    userWatcher(),
    productsWatcher(),
    clientsWatcher(),
    rolesWatcher(),
    pagesWatcher(),
    ordersWatcher(),
  ]);
}
