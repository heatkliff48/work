const { Router } = require('express');
const RecipeOrdersController = require('../controllers/RecipeOrders');

const router = Router();

router.get('/', RecipeOrdersController.getRecipeOrdersData);
router.post('/', RecipeOrdersController.saveMaterialPlan);
router.post('/delete', RecipeOrdersController.deleteMaterialPlan);
//--------------------------RAW MAT CONSUMPTION--------------------------
router.get(
  '/raw_mat_consumption',
  RecipeOrdersController.getAllRawMatConsumptionOrdersData,
);
router.post(
  '/raw_mat_consumption',
  RecipeOrdersController.addNewRawMatConsumptionOrdersData,
);
router.post(
  '/raw_mat_consumption/update',
  RecipeOrdersController.updateRawMatConsumptionOrdersData,
);
router.post(
  '/raw_mat_consumption/delete',
  RecipeOrdersController.deleteRawMatConsumptionOrdersData,
);

//--------------------------RAW MAT CONSUMPTION CURRENT MOLDS--------------------------
router.get(
  '/raw_mat_consumption_current_molds',
  RecipeOrdersController.getAllRawMatConsumptionCurrentMolds,
);
router.post(
  '/raw_mat_consumption_current_molds',
  RecipeOrdersController.addNewRawMatConsumptionCurrentMolds,
);
router.post(
  '/raw_mat_consumption_current_molds/update',
  RecipeOrdersController.updateRawMatConsumptionCurrentMolds,
);
router.post(
  '/raw_mat_consumption_current_molds/delete',
  RecipeOrdersController.deleteRawMatConsumptionCurrentMolds,
);
module.exports = router;
