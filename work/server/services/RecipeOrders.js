const RecipeOrdersRepository = require("../repositories/RecipeOrders");

class RecipeOrdersServices {
  static async saveMaterialPlan(material_plan) {
    await RecipeOrdersRepository.saveMaterialPlan(material_plan);

    return;
  }
}

module.exports = RecipeOrdersServices;
