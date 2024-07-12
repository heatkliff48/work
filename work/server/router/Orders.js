const { Router } = require('express');
const OrdersController = require('../controllers/Orders');

const router = Router();

router.get('/', OrdersController.getOrdersList);
router.post('/add', OrdersController.addNewOrder);

module.exports = router;
