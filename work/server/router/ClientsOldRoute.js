const { Router } = require('express');
const ClientsController = require('../controllers/Clients.js');

const router = Router();

router.get('/', ClientsController.getClientsPriceInfo);
router.post('/upd', ClientsController.updClientsPriceInfo);

module.exports = router;
