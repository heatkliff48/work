import { getBatchOutside } from '#components/redux/actions/batchOutsideAction.js';
import {
  getAllClients,
  getAllContactInfo,
  getAllDeliveryAddresses,
  getClientPriceInfo,
} from '#components/redux/actions/clientAction.js';
import {
  getAnchorProductsOfOrders,
  getDryMixedProductsOfOrders,
  getOrders,
  getProductsOfOrders,
  getToolProductsOfOrders,
  getRelMatProductsOfOrders,
} from '#components/redux/actions/ordersAction.js';
import { getAllProducts } from '#components/redux/actions/productsAction.js';
import {
  getAnchor,
  getDryMixesJournal,
  getProductCode,
  getRelatedMaterialsJournal,
  getTool,
} from '#components/redux/actions/productsTypeJournalAction.js';
import {
  getAnchorsWarehouse,
  getDryMixesWarehouse,
  getRelatedMaterialsWarehouse,
  getToolsWarehouse,
} from '#components/redux/actions/productsTypeWarehouseAction.js';
import {
  getRawMatConsumption,
  getRawMatConsumptionCurrentMolds,
  getRecipe,
  getRecipeOrdersData,
} from '#components/redux/actions/recipeAction.js';
import { getRelatedMaterialsBackorder } from '#components/redux/actions/relatedMaterialsBackorderListAction.js';
import { getAllRoles } from '#components/redux/actions/rolesAction.js';
import { getAllStockBalance } from '#components/redux/actions/stockBalanceAction.js';
import {
  getAllWarehouse,
  getAutoclaveCalendar,
  getListOfAnchorReservedProducts,
  getListOfDryMixedReservedProducts,
  getListOfOrderedProduction,
  getListOfOrderedProductionOEM,
  getListOfRelMatReservedProducts,
  getListOfReservedProducts,
  getListOfToolReservedProducts,
  getRawMaterialsWarehouse,
  getWarehouseManagerTrailer,
} from '#components/redux/actions/warehouseAction.js';
import { getFilesWarehouse } from '#components/redux/actions/filesWarehouseAction.js';
import { getFilesProduct } from '#components/redux/actions/filesProductAction.js';
import { getFilesOrder } from '#components/redux/actions/filesOrderAction.js';
import { getAllProductionBatchLogs } from '#components/redux/actions/productionBatchLogAction.js';
import { getQualityManagement } from '#components/redux/actions/qualityManagementAction.js';
import { getPagesList } from '#components/redux/actions/pagesAction';
import {
  getAllUsersInfo,
  getAllUsersMainInfo,
} from '#components/redux/actions/usersInfoAction';
import { getAldabaran } from '#components/redux/actions/aldabaranAction.js';
import {
  getLotesList,
  getLotesListCakes,
} from '#components/redux/actions/lotesListAction.js';
import { getFilesLotesList } from '#components/redux/actions/filesLotesListAction.js';
import {
  getCompressionsQuality,
  getDimensionsQuality,
  getProductionQuality,
} from '#components/redux/actions/productionQualityAction.js';

// Загрузка всех общих данных системы. Вызывается при входе, при загрузке
// страницы (с любого адреса, не только с главной) и после переподключения
// WebSocket — изменения, пришедшие без соединения, иначе были бы потеряны.
export default function loadAppData(dispatch) {
  dispatch(getAldabaran());
  dispatch(getAutoclaveCalendar());
  dispatch(getAllDeliveryAddresses());
  dispatch(getAllClients());
  dispatch(getAllContactInfo());
  dispatch(getAllProducts());
  dispatch(getAllProductionBatchLogs());
  dispatch(getAllRoles());
  dispatch(getAllStockBalance());
  dispatch(getAllUsersInfo());
  dispatch(getAllUsersMainInfo());
  dispatch(getAllWarehouse());
  dispatch(getAnchor());
  dispatch(getAnchorProductsOfOrders());
  dispatch(getAnchorsWarehouse());
  dispatch(getBatchOutside());
  dispatch(getClientPriceInfo());
  dispatch(getDryMixesJournal());
  dispatch(getDryMixedProductsOfOrders());
  dispatch(getDryMixesWarehouse());
  dispatch(getFilesOrder());
  dispatch(getFilesLotesList());
  dispatch(getFilesProduct());
  dispatch(getFilesWarehouse());
  dispatch(getRelMatProductsOfOrders());
  dispatch(getListOfReservedProducts());
  dispatch(getListOfDryMixedReservedProducts());
  dispatch(getListOfAnchorReservedProducts());
  dispatch(getListOfToolReservedProducts());
  dispatch(getListOfRelMatReservedProducts());
  dispatch(getListOfOrderedProduction());
  dispatch(getListOfOrderedProductionOEM());
  dispatch(getOrders());
  dispatch(getPagesList());
  dispatch(getProductsOfOrders());
  dispatch(getRecipeOrdersData());
  dispatch(getRecipe());
  dispatch(getRelatedMaterialsBackorder());
  dispatch(getRelatedMaterialsJournal());
  dispatch(getRelatedMaterialsWarehouse());
  dispatch(getTool());
  dispatch(getToolProductsOfOrders());
  dispatch(getToolsWarehouse());
  dispatch(getProductCode());
  dispatch(getRawMatConsumption());
  dispatch(getRawMatConsumptionCurrentMolds());
  dispatch(getQualityManagement());
  dispatch(getLotesList());
  dispatch(getLotesListCakes());
  dispatch(getRawMaterialsWarehouse());
  dispatch(getProductionQuality());
  dispatch(getDimensionsQuality());
  dispatch(getCompressionsQuality());
  dispatch(getWarehouseManagerTrailer());
}
