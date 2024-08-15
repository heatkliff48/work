const { Router } = require('express');
const WarehouseController = require('../controllers/Warehouse');

const router = Router();

router.get('/', WarehouseController.getAllWarehouse);
router.post('/add', WarehouseController.addNewWarehouse);

module.exports = router;
