const RecipeOrdersRepository = require('../repositories/RecipeOrders');

class RecipeOrdersServices {
  static async getRecipeOrdersData() {
    const data = await RecipeOrdersRepository.getRecipeOrdersData();

    return data;
  }

  static async saveMaterialPlan(material_plan) {
    const recipeOrders = await RecipeOrdersRepository.saveMaterialPlan(
      material_plan
    );

    return recipeOrders;
  }

  static async deleteMaterialPlan(material_plan_id) {
    await RecipeOrdersRepository.deleteMaterialPlan(material_plan_id);

    return;
  }

  //--------------------------RAW MAT CONSUMPTION--------------------------

  static async getAllRawMatConsumptionOrdersData() {
    const allRawMatConsumptions = await RecipeOrdersRepository.getAllRawMatConsumptionOrdersData();

    return allRawMatConsumptions;
  }

  static async addNewRawMatConsumptionOrdersData(newRawMatConsumption) {
   const rawMat = await RecipeOrdersRepository.addNewRawMatConsumptionOrdersData(newRawMatConsumption);
    return rawMat;
  }

  static async deleteRawMatConsumptionOrdersData(rawMatConsumption) {
    await RecipeOrdersRepository.deleteRawMatConsumptionOrdersData(rawMatConsumption);
    return;
  }
}

module.exports = RecipeOrdersServices;
