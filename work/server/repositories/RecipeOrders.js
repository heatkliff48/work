const { RecipeOrders } = require('../db/models');

class RecipeOrdersRepository {
  static async getRecipeOrdersData() {
    console.log('>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>getRecipeOrdersData');
    try {
      const allRecipeOrdersInDB = await RecipeOrders.findAll();

      return allRecipeOrdersInDB;
    } catch (error) {
      console.log('>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>.error', error);
      return error;
    }
  }

  static async saveMaterialPlan(material_plan) {
    console.log('>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>saveMaterialPlan');

    try {
      const allRecipeOrdersInDB = await RecipeOrders.findAll();

      if (allRecipeOrdersInDB.length === 0) {
        for (let i = 0; i < material_plan.length; i++) {
          const { current_recipe, id_batch, quantity } = material_plan[i];
          const obj = {
            id_recipe: current_recipe?.id,
            id_batch,
            production_volume: quantity,
          };

          await RecipeOrders.create(obj);
        }
      } else {
        const newRecipes = material_plan.filter((newRecipe) => {
          return !allRecipeOrdersInDB.some(
            (existingRecipe) =>
              existingRecipe.id_batch === newRecipe.id_batch &&
              existingRecipe.id_recipe === newRecipe.current_recipe.id
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
        }
      }
      const allRecipeOrders = await RecipeOrders.findAll();

      return allRecipeOrders;
    } catch (error) {
      console.log(
        '>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>...error',
        error
      );
      return error;
    }
  }

  static async deleteMaterialPlan(material_plan_id) {
    console.log('>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>deleteMaterialPlan');
    try {
      await RecipeOrders.destroy({ where: { id_batch: material_plan_id } });

      return;
    } catch (error) {
      console.log('>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>error', error);
      return error;
    }
  }
}

module.exports = RecipeOrdersRepository;
