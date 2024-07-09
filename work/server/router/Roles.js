const { Router } = require('express');
const RolesController = require('../controllers/Roles.js');

const router = Router();

router.get('/', RolesController.getAllRoles);
router.get('/pages', RolesController.getPagesList);
router.post('/upd', RolesController.updateRoles);
router.post('/upd/active', RolesController.updateActiveRoles);

module.exports = router;
