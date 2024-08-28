const { Router } = require('express');
const WarehouseController = require('../controllers/Warehouse');

const router = Router();

router.get('/', WarehouseController.getAllWarehouse);
router.get('/reserved/product', WarehouseController.getListOfReservedProducts);
router.post('/add', WarehouseController.addNewWarehouse);
router.post('/upd/remaining_stock', WarehouseController.updateRemainingStock);
router.post('/reserved/product/add', WarehouseController.addNewReservedProducts);
router.post('/reserved/product/delete', WarehouseController.deleteReservedProducts);

module.exports = router;
