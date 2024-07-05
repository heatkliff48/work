const { Router } = require('express');
const RolesController = require('../controllers/Roles.js');

const router = Router();

router.get('/', RolesController.getAllRoles);
router.get('/pages', RolesController.getPagesList);
router.post('/upd', RolesController.updateRoles);

module.exports = router;
