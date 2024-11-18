const { Router } = require('express');
const RecipeOrdersController = require('../controllers/RecipeOrders');

const router = Router();

router.get('/', RecipeOrdersController.getRecipeOrdersData);
router.post('/', RecipeOrdersController.saveMaterialPlan);
module.exports = router;
