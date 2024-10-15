const { Router } = require('express');
const AutoclaveController = require('../controllers/Autoclave');

const router = Router();

router.get('/', AutoclaveController.getAutoclave);
router.post('/save', AutoclaveController.saveAutoclave);

module.exports = router;
