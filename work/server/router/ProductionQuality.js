const { Router } = require('express');
const ProductController = require('../controllers/Product.js');

const router = Router();

//PRODUCTION QUALITY
router.get('/', ProductController.getAllProductionQuality);
router.post('/add', ProductController.addNewProductionQuality);

//DIMENSION QUALITY
router.get('/dimensions', ProductController.getAllDimensionsQuality);
router.post('/dimensions/add', ProductController.addNewDimensionsQuality);
router.post('/dimensions/upd', ProductController.updateDimensionsQuality);

//COMPRESSIONS QUALITY
router.get('/compressions', ProductController.getAllCompressionsQuality);
router.post('/compressions/add', ProductController.addNewCompressionsQuality);
router.post('/compressions/upd', ProductController.updateCompressionsQuality);

module.exports = router;
