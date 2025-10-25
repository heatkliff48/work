const { Router } = require('express');
const RecipeOrdersController = require('../controllers/RecipeOrders');

const router = Router();

router.get('/', RecipeOrdersController.getRecipeOrdersData);
router.post('/', RecipeOrdersController.saveMaterialPlan);
router.post('/delete', RecipeOrdersController.deleteMaterialPlan);
//--------------------------RAW MAT CONSUMPTION--------------------------
router.get(
  '/raw_mat_consumption',
  RecipeOrdersController.getAllRawMatConsumptionOrdersData
);
router.post(
  '/raw_mat_consumption',
  RecipeOrdersController.addNewRawMatConsumptionOrdersData
);
router.post(
  '/raw_mat_consumption/delete',
  RecipeOrdersController.deleteRawMatConsumptionOrdersData
);
module.exports = router;
