const { Router } = require('express');
const ProductController = require('../controllers/Product.js');

const router = Router();

router.get('/', ProductController.getAllProductionQuality);
router.post('/add', ProductController.addNewProductionQuality);

module.exports = router;
