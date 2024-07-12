const { Router } = require('express');
const ClientsController = require('../controllers/Clients.js');

const router = Router();

router.post('/all', ClientsController.getAllClients);
router.post('/add', ClientsController.addClient);

module.exports = router;
