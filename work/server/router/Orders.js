const { Router } = require('express');
const OrdersController = require('../controllers/Orders');

const router = Router();

router.get('/', OrdersController.getOrdersList);
router.get('/products', OrdersController.getProductsOfOrder);
router.get('/dry_mixed_products', OrdersController.getDryMixedProductsOfOrder);
router.get('/anchor_products', OrdersController.getAnchorProductsOfOrder);
router.get('/tool_products', OrdersController.getToolProductsOfOrder);
router.post('/add', OrdersController.addNewOrder);
router.post('/date', OrdersController.addShippingDateOrder);
router.post('/current/products', OrdersController.getCurrentProductsOfOrder);
router.post('/delete', OrdersController.getDeleteOrder);
router.post('/delete/product', OrdersController.getDeleteProductOfOrder);
router.post('/delete/dry_mixed_products', OrdersController.getDeleteDryMixedProductOfOrder);
router.post('/delete/anchor_product', OrdersController.getDeleteAnchorProductOfOrder);
router.post('/delete/tool_product', OrdersController.getDeleteToolProductOfOrder);
router.post('/products/add', OrdersController.getUpdateProductsOfOrder);
router.post(
  '/dry_mixed_products/add',
  OrdersController.getUpdateDryMixedProductsOfOrder
);
router.post('/anchor_products/add', OrdersController.getUpdateAnchorProductsOfOrder);
router.post('/tool_products/add', OrdersController.getUpdateToolProductsOfOrder);
router.post('/product/update/info', OrdersController.getUpdateProductInfoOfOrder);
router.post('/update/contact', OrdersController.getUpdateContactInfoOfOrder);
router.post(
  '/update/delivery_address',
  OrdersController.getUpdateDeliveryAddressOrder
);
router.post('/update/status', OrdersController.getUpdateStatusOrder);
router.post('/update/in_charge', OrdersController.getUpdateInChargeOrder);

module.exports = router;
