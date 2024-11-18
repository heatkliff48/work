const { RecipeOrders } = require('../db/models');

class RecipeOrdersRepository {
  static async getRecipeOrdersData() {
    const allRecipeOrdersInDB = await RecipeOrders.findAll();

    return allRecipeOrdersInDB;
  }

  static async saveMaterialPlan(material_plan) {
    const allRecipeOrdersInDB = await RecipeOrders.findAll();

    if (allRecipeOrdersInDB.length === 0) {
      await RecipeOrders.create(material_plan);
    }

    const idsToReset = allRecipeOrdersInDB.filter(
      (dbRecord) =>
        material_plan.id_batch != dbRecord.id_batch &&
        material_plan.id_recipe != dbRecord.id_recipe
    );

    if (idsToReset.length != 0) {
      await RecipeOrders.create(idsToReset);
    }
    return;
  }
}

module.exports = RecipeOrdersRepository;
