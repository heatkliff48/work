const { Router } = require('express');
const ProductController = require('../controllers/Product.js');
// const { ProductValidator } = require('../validators/Product.js');

const router = Router();

router.post('/all', ProductController.getAllProduct);

// router.post('/add', ProductController.addProduct);
// router.post('/del', ProductController.delProduct);

// router.get('/', ProductValidator.getProduct, ProductController.getProduct);
// router.post('/add', ProductValidator.addProduct, ProductController.addProduct);
// router.post('/del', ProductValidator.delProduct, ProductController.delProduct);

module.exports = router;
