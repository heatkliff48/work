const { where } = require('sequelize');
const { RecipeOrders } = require('../db/models');

class RecipeOrdersRepository {
  static async getRecipeOrdersData() {
    const allRecipeOrdersInDB = await RecipeOrders.findAll();

    return allRecipeOrdersInDB;
  }

  static async saveMaterialPlan(material_plan) {
    const allRecipeOrdersInDB = await RecipeOrders.findAll();
    const recipeOrders = [];

    if (allRecipeOrdersInDB.length === 0) {
      for (let i = 0; i < material_plan.length; i++) {
        const { current_recipe, id_batch, quantity } = material_plan[i];
        const obj = {
          id_recipe: current_recipe?.id,
          id_batch,
          production_volume: quantity,
        };
        await RecipeOrders.create(obj);
        recipeOrders.push(obj);
      }

      return recipeOrders;
    }

    const newRecipes = material_plan.filter((newRecipe) => {
      return !allRecipeOrdersInDB.some(
        (existingRecipe) =>
          existingRecipe.id_batch === newRecipe.id_batch &&
          existingRecipe.id_recipe === newRecipe.id_recipe
      );
    });

    if (newRecipes.length != 0) {
      for (let i = 0; i < newRecipes.length; i++) {
        const { current_recipe, id_batch, quantity } = newRecipes[i];
        const obj = {
          id_recipe: current_recipe?.id,
          id_batch,
          production_volume: quantity,
        };
        await RecipeOrders.create(obj);
      }
      return newRecipes;
    }

    return;
  }

  static async deleteMaterialPlan(material_plan_id) {
    await RecipeOrders.destroy({ where: { id_batch: material_plan_id } });

    return;
  }
}

module.exports = RecipeOrdersRepository;
