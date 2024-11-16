const RecipeOrdersServices = require('../services/RecipeOrders');

class RecipeOrdersController {
  static async saveMaterialPlan(req, res) {
    const material_plan = req.body;
    await RecipeOrdersServices.saveMaterialPlan(material_plan);

    return res.status(200);
  }
}

module.exports = RecipeOrdersController;
