const { Router } = require('express');
const AldabaranController = require('../controllers/Aldabaran');

const router = Router();

router.get('/all', AldabaranController.getAldabaran);
router.post('/add', AldabaranController.createAldabaran);

module.exports = router;
