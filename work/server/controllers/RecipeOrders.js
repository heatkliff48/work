const RecipeOrdersServices = require('../services/RecipeOrders');

class RecipeOrdersController {
  static async getRecipeOrdersData(req, res) {
    const data = await RecipeOrdersServices.getRecipeOrdersData();

    return res.status(200).json(data);
  }

  static async saveMaterialPlan(req, res) {
    const material_plan = req.body;
    await RecipeOrdersServices.saveMaterialPlan(material_plan);

    return res.status(200);
  }

  static async deleteMaterialPlan(req, res) {
    const material_plan_id = req.body;
    await RecipeOrdersServices.deleteMaterialPlan(material_plan_id);

    return res.status(200);
  }
}

module.exports = RecipeOrdersController;
