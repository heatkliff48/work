import {
  mainRawMatConsumptionReducer,
  rawMatConsumptionReducer,
  recipeOrdersReducer,
} from './RecipeOrdersReducer';
import { accountingReducer } from './accoutingReducer';
import { aldabaranReducer } from './aldabaranReducer';
import batchDesignerReducer from './batchDesignerReducer';
import { batchOutsideReducer } from './batchOutsideReducer';
import {
  clientsReducer,
  legalAddressReducer,
  deliveryAddressesReducer,
  contactInfoReducer,
  contactPriceInfoReducer,
} from './clientsReducer';
import { dataFetchedReducer } from './dataFetchedReducer';
import { filesLotesListReducer } from './filesLotesListReducer';
import { filesOrderReducer } from './filesOrderReducer';
import { filesProductReducer } from './filesProductReducer';
import { filesWarehouseReducer } from './filesWarehouseReducer';
import { jwtReducer } from './jwtReducer';
import { listOfOrderedProductionOEMReducer } from './listOfOrderedProductionOEMReducer';
import {
  autoclaveCalendarReducer,
  listOfOrderedProductionReducer,
} from './listOfOrderedProductionReducer';
import {
  lotesListBatchesReducer,
  lotesListCakesReducer,
} from './lotesListReducer';
import { ordersReducer } from './orderReducer';
import { orderToWarehouseReducer } from './orderToWarehouseReducer';
import { pagesReducer } from './pagesReducer';
import { productionBatchLogReducer } from './productionBatchLogReducer';
import {
  anchorProductsOfOrdersReducer,
  dryMixedProductsOfOrdersReducer,
  productsOfOrdersReducer,
  relMatProductsOfOrdersReducer,
  toolProductsOfOrdersReducer,
} from './productsOfOrdersReducer';
import { productsReducer } from './productsReducer';
import {
  anchorReducer,
  dryMixesJournalReducer,
  productCodeReducer,
  relatedMaterialsJournalReducer,
  toolReducer,
} from './productsTypeJournalReducer';
import {
  anchorsWarehouseReducer,
  dryMixesWarehouseReducer,
  relatedMaterialsWarehouseReducer,
  toolsWarehouseReducer,
} from './productsTypeWarehouseReducer';
import { qualityManagementReducer } from './qualityManagementReducer';
import { recipeReducer } from './recipeReducer';
import { relatedMaterialsBackorderListReducer } from './relatedMaterialsBackorderListReducer';
import {
  reservedAnchorProductsReducer,
  reservedDryMixedProductsReducer,
  reservedProductsReducer,
  reservedRelMatProductsReducer,
  reservedToolProductsReducer,
} from './reservedProductsReducer';
import { rolesReducer } from './rolesReducer';
import { stockBalanceReducer } from './stockBalanceReducer';
import { userReducer } from './userReducer';
import { usersInfoReducer, usersMainInfoReducer } from './usersInfoReducer';
import {
  warehouseAACReducer,
  warehouseAluminum1Reducer,
  warehouseAluminum2Reducer,
  warehouseCementReducer,
  warehouseGrindingBallsReducer,
  warehouseGypsumReducer,
  warehouseGypsumStoneReducer,
  warehouseLimeReducer,
  warehouseSandReducer,
  warehouseSandSlurryReducer,
} from './warehouseRawMaterialsReducer';
import {
  warehouseReducer,
  rawMaterialsWarehouseReducer,
} from './warehouseReducer';
import { combineReducers } from 'redux';

export const rootReducer = combineReducers({
  user: userReducer,
  dataFetched: dataFetchedReducer,
  products: productsReducer,
  jwt: jwtReducer,
  clients: clientsReducer,
  legalAddress: legalAddressReducer,
  deliveryAddresses: deliveryAddressesReducer,
  contactInfo: contactInfoReducer,
  roles: rolesReducer,
  pages: pagesReducer,
  orders: ordersReducer,
  productsOfOrders: productsOfOrdersReducer,
  dryMixedProductsOfOrders: dryMixedProductsOfOrdersReducer,
  anchorProductsOfOrders: anchorProductsOfOrdersReducer,
  toolProductsOfOrders: toolProductsOfOrdersReducer,
  relMatProductsOfOrders: relMatProductsOfOrdersReducer,
  warehouse: warehouseReducer,
  usersInfo: usersInfoReducer,
  usersMainInfo: usersMainInfoReducer,
  productionBatchLog: productionBatchLogReducer,
  reservedProducts: reservedProductsReducer,
  reservedDryMixedProducts: reservedDryMixedProductsReducer,
  reservedAnchorProducts: reservedAnchorProductsReducer,
  reservedToolProducts: reservedToolProductsReducer,
  reservedRelMatProducts: reservedRelMatProductsReducer,
  listOfOrderedProduction: listOfOrderedProductionReducer,
  listOfOrderedProductionOEM: listOfOrderedProductionOEMReducer,
  batchOutside: batchOutsideReducer,
  batchDesigner: batchDesignerReducer,
  recipe: recipeReducer,
  recipeOrders: recipeOrdersReducer,
  filesWarehouse: filesWarehouseReducer,
  filesOrder: filesOrderReducer,
  filesLotesList: filesLotesListReducer,
  filesProduct: filesProductReducer,
  stockBalance: stockBalanceReducer,
  dryMixesJournal: dryMixesJournalReducer,
  relatedMaterialsJournal: relatedMaterialsJournalReducer,
  accountingDataList: accountingReducer,
  anchor: anchorReducer,
  tool: toolReducer,
  dryMixesWarehouse: dryMixesWarehouseReducer,
  relatedMaterialsWarehouse: relatedMaterialsWarehouseReducer,
  anchorsWarehouse: anchorsWarehouseReducer,
  toolsWarehouse: toolsWarehouseReducer,
  qualityManagementData: qualityManagementReducer,
  relatedMaterialsBackorderList: relatedMaterialsBackorderListReducer,
  aldabaran: aldabaranReducer,
  productCode: productCodeReducer,
  autoclave_calendar: autoclaveCalendarReducer,
  rawMatConsumption: rawMatConsumptionReducer,
  mainRawMatConsumption: mainRawMatConsumptionReducer,
  rawMaterialsWarehouse: rawMaterialsWarehouseReducer,
  warehouseSand: warehouseSandReducer,
  warehouseLime: warehouseLimeReducer,
  warehouseCement: warehouseCementReducer,
  warehouseGypsum: warehouseGypsumReducer,
  warehouseGypsumStone: warehouseGypsumStoneReducer,
  warehouseAluminum1: warehouseAluminum1Reducer,
  warehouseAluminum2: warehouseAluminum2Reducer,
  warehouseGrindingBalls: warehouseGrindingBallsReducer,
  warehouseAAC: warehouseAACReducer,
  warehouseSandSlurry: warehouseSandSlurryReducer,
  lotesListBatches: lotesListBatchesReducer,
  lotesListCakes: lotesListCakesReducer,
  contactPriceInfo: contactPriceInfoReducer,
  orderToWarehouse: orderToWarehouseReducer,
});
