const { Router } = require('express');
const ClientsController = require('../controllers/Clients.js');

const router = Router();

router.post('/all/price_info', ClientsController.getClientsPriceInfo);
router.post('/upd/price_info', ClientsController.updClientsPriceInfo);

module.exports = router;
