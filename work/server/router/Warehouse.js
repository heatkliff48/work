const { Router } = require('express');
const WarehouseController = require('../controllers/Warehouse');

const router = Router();

router.get('/', WarehouseController.getAllWarehouse);
router.get('/reserved/product', WarehouseController.getListOfReservedProducts);
router.get('/ordered_production', WarehouseController.getListOfOrderedProduction);
router.get(
  '/ordered_production_oem',
  WarehouseController.getListOfReservedProductsOEM
);
router.post('/add', WarehouseController.addNewWarehouse);
router.post('/upd/remaining_stock', WarehouseController.updateRemainingStock);
router.post('/reserved/product/add', WarehouseController.addNewReservedProducts);
router.post('/reserved/product/delete', WarehouseController.deleteReservedProducts);
router.post(
  '/ordered_production/add',
  WarehouseController.addNewListOfOrderedProduction
);
router.post(
  '/ordered_production_oem/add',
  WarehouseController.addNewListOfOrderedProductionOEM
);
router.post(
  '/ordered_production_oem/update',
  WarehouseController.updateListOfOrderedProductionOEM
);

module.exports = router;
