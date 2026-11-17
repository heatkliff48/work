const { Router } = require('express');
const ClientProductPricesController = require('../controllers/ClientProductPrices.js');

const router = Router();

router.get('/', ClientProductPricesController.getAll);
router.post('/', ClientProductPricesController.create);
router.delete('/:id', ClientProductPricesController.remove);

module.exports = router;
