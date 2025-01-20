const { Router } = require('express');
const OrdersController = require('../controllers/Orders');

const router = Router();

router.get('/', OrdersController.getOrdersList);
router.post('/add', OrdersController.addNewOrder);
router.post('/date', OrdersController.addShippingDateOrder);
router.get('/products', OrdersController.getProductsOfOrder);
router.post('/current/products', OrdersController.getCurrentProductsOfOrder);
router.post('/delete', OrdersController.getDeleteOrder);
router.post('/delete/product', OrdersController.getDeleteProductOfOrder);
router.post('/products/add', OrdersController.getUpdateProductsOfOrder);
router.post('/product/update/info', OrdersController.getUpdateProductInfoOfOrder);
router.post('/update/contact', OrdersController.getUpdateContactInfoOfOrder);
router.post(
  '/update/delivery_address',
  OrdersController.getUpdateDeliveryAddressOrder
);
router.post('/update/status', OrdersController.getUpdateStatusOrder);
router.post('/update/in_charge', OrdersController.getUpdateInChargeOrder);

module.exports = router;
