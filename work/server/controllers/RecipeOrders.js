const RecipeOrdersServices = require('../services/RecipeOrders');
const { SAVE_MATERIAL_PLAN_SOCKET, DELETE_MATERIAL_PLAN_SOCKET } = require('../src/constants/event');
const myEmitter = require('../src/ee');

class RecipeOrdersController {
  static async getRecipeOrdersData(req, res) {
    const data = await RecipeOrdersServices.getRecipeOrdersData();

    return res.status(200).json(data);
  }

  static async saveMaterialPlan(req, res) {
    const material_plan = req.body;
    const recipeOrders = await RecipeOrdersServices.saveMaterialPlan(material_plan);
    myEmitter.emit(SAVE_MATERIAL_PLAN_SOCKET, recipeOrders)

    return res.status(200);
  }

  static async deleteMaterialPlan(req, res) {
    const { material_plan_id } = req.body;
    await RecipeOrdersServices.deleteMaterialPlan(material_plan_id);

    myEmitter.emit(DELETE_MATERIAL_PLAN_SOCKET, material_plan_id)

    return res.status(200);
  }
}

module.exports = RecipeOrdersController;
