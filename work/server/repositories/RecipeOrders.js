const { RecipeOrders } = require('../db/models');

class RecipeOrdersRepository {
  static async saveMaterialPlan(material_plan) {
    const allRecipeOrdersыInDB = await RecipeOrders.findAll();
    const idsToReset = allRecipeOrdersыInDB.filter(
      (dbRecord) =>
        material_plan.id_batch != dbRecord.id_batch &&
        material_plan.id_recipe != dbRecord.id_recipe
    );

    console.log('idsToReset', idsToReset);
    if (idsToReset.length != 0) {
      await RecipeOrders.create(idsToReset);
    }
    return;
  }
}

module.exports = RecipeOrdersRepository;
