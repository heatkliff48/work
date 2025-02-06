import batchOutsideWatcher from './batchOutsideSagas';
import clientsWatcher from './clientsSagas';
import filesOrderWatcher from './filesOrderSagas';
import filesProductWatcher from './filesProductSagas';
import filesWarehouseWatcher from './filesWarehouseSagas';
import ordersWatcher from './ordersSagas';
import pagesWatcher from './pagesSagas';
import productionBatchLogWatcher from './productionBatchLogSagas';
import productsWatcher from './productsSagas';
import recipeWatcher from './recipeSagas';
import rolesWatcher from './rolesSagas';
import stockBalanceWatcher from './stockBalanceSagas';
import userWatcher from './userSagas';
import usersInfoWatcher from './usersInfoSagas';
import warehouseWatcher from './warehouseSagas';
import { all } from 'redux-saga/effects';

export default function* rootSaga() {
  yield all([
    userWatcher(),
    productsWatcher(),
    clientsWatcher(),
    rolesWatcher(),
    pagesWatcher(),
    ordersWatcher(),
    warehouseWatcher(),
    usersInfoWatcher(),
    productionBatchLogWatcher(),
    batchOutsideWatcher(),
    recipeWatcher(),
    filesWarehouseWatcher(),
    filesOrderWatcher(),
    filesProductWatcher(),
    stockBalanceWatcher(),
  ]);
}
