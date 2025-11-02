import aldabaranWatcher from "./aldabaranSagas";
import batchOutsideWatcher from "./batchOutsideSagas";
import clientsWatcher from "./clientsSagas";
import filesOrderWatcher from "./filesOrderSagas";
import filesProductWatcher from "./filesProductSagas";
import filesWarehouseWatcher from "./filesWarehouseSagas";
import lotesListWatcher from "./lotesListSagas";
import ordersWatcher from "./ordersSagas";
import pagesWatcher from "./pagesSagas";
import productionBatchLogWatcher from "./productionBatchLogSagas";
import productsWatcher from "./productsSagas";
import productsTypeJournalWatcher from "./productsTypeJournalSagas";
import productsTypeWarehouseWatcher from "./productsTypeWarehouseSagas";
import qualityManagementWatcher from "./qualityManagementSagas";
import recipeWatcher from "./recipeSagas";
import relatedMaterialsBackorderListWatcher from "./relatedMaterialsBackorderListSagas";
import rolesWatcher from "./rolesSagas";
import stockBalanceWatcher from "./stockBalanceSagas";
import userWatcher from "./userSagas";
import usersInfoWatcher from "./usersInfoSagas";
import warehouseRawMaterialsWatcher from "./warehouseRawMaterialsSagas";
import warehouseWatcher from "./warehouseSagas";
import { all } from "redux-saga/effects";

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
    productsTypeJournalWatcher(),
    productsTypeWarehouseWatcher(),
    qualityManagementWatcher(),
    relatedMaterialsBackorderListWatcher(),
    aldabaranWatcher(),
    warehouseRawMaterialsWatcher(),
    lotesListWatcher(),
  ]);
}
