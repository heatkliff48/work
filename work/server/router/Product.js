const { Router } = require('express');
const ProductController = require('../controllers/Product.js');

const router = Router();

router.get('/all', ProductController.getAllProduct);
router.post('/add', ProductController.addProduct);
router.post('/upd', ProductController.updateProduct);

module.exports = router;
