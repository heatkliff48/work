const { Router } = require('express');
const OrdersController = require('../controllers/Orders');

const router = Router();

router.get('/', OrdersController.getOrdersList);
router.post('/add', OrdersController.addNewOrder);
router.post('/products', OrdersController.getProductsOfOrder);
router.post('/delete', OrdersController.getDeleteOrder);
router.post('/delete/product', OrdersController.getDeleteProductOfOrder);
router.post('/products/add', OrdersController.getUpdateProductsOfOrder);
router.post('/update/contact', OrdersController.getUpdateContactInfoOfOrder);
router.post(
  '/update/delivery_address',
  OrdersController.getUpdateDeliveryAddressOrder
);

module.exports = router;
