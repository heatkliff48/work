const RecipeOrdersRepository = require("../repositories/RecipeOrders");

class RecipeOrdersServices {
  static async getRecipeOrdersData() {
    const data = await RecipeOrdersRepository.getRecipeOrdersData();

    return data;
  }

  static async saveMaterialPlan(material_plan) {
    await RecipeOrdersRepository.saveMaterialPlan(material_plan);

    return;
  }

  static async deleteMaterialPlan(material_plan_id) {
    await RecipeOrdersRepository.deleteMaterialPlan(material_plan_id);

    return;
  }
}

module.exports = RecipeOrdersServices;
