const { RecipeOrders } = require('../db/models');

class RecipeOrdersRepository {
  static async saveMaterialPlan(material_plan) {
    await RecipeOrders.create(material_plan);
    return;
  }
}

module.exports = RecipeOrdersRepository;
