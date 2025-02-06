const { Router } = require('express');
const StockBalanceController = require('../controllers/StockBalance');

const router = Router();

router.get('/', StockBalanceController.getAllStockBalanceData);
router.post('/add', StockBalanceController.addNewStockBalanceData);

module.exports = router;
