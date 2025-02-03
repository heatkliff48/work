import { all } from 'redux-saga/effects';
import userWatcher from './userSagas';
import productsWatcher from './productsSagas';
import clientsWatcher from './clientsSagas';
import rolesWatcher from './rolesSagas';
import pagesWatcher from './pagesSagas';
import ordersWatcher from './ordersSagas';
import warehouseWatcher from './warehouseSagas';
import usersInfoWatcher from './usersInfoSagas';
import productionBatchLogWatcher from './productionBatchLogSagas';
import batchOutsideWatcher from './batchOutsideSagas';
import recipeWatcher from './recipeSagas';
import filesWarehouseWatcher from './filesWarehouseSagas';
import filesOrderWatcher from './filesOrderSagas';
import filesProductWatcher from './filesProductSagas';

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
  ]);
}
