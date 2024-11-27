const { where } = require('sequelize');
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

    const idsToReset = allRecipeOrdersInDB.find(
      (dbRecord) =>
        material_plan.id_batch === dbRecord.id_batch &&
        material_plan.id_recipe === dbRecord.id_recipe
    );

    if (!idsToReset) {
      await RecipeOrders.create(material_plan);
    }
    return;
  }

  static async deleteMaterialPlan(material_plan_id) {
    await RecipeOrders.destroy({ where: { id: material_plan_id } });
    return;
  }
}

module.exports = RecipeOrdersRepository;
