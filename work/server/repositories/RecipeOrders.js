const { RecipeOrders, RawMatConsumptions, sequelize } = require('../db/models');

class RecipeOrdersRepository {
  static async getRecipeOrdersData() {
    console.log('>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>getRecipeOrdersData');
    try {
      const allRecipeOrdersInDB = await RecipeOrders.findAll();

      return allRecipeOrdersInDB;
    } catch (error) {
      console.log(
        '>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>.error',
        error,
      );
      return error;
    }
  }

  static async saveMaterialPlan(material_plan) {
    console.log('>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>saveMaterialPlan');

    const transaction = await sequelize.transaction();

    try {
      const allRecipeOrdersInDB = await RecipeOrders.findAll({ transaction });

      const existingOrdersByBatch = {};
      allRecipeOrdersInDB.forEach((order) => {
        existingOrdersByBatch[order.id_batch] = order;
      });

      const batchIdsInPlan = new Set();

      for (let i = 0; i < material_plan.length; i++) {
        const { current_recipe, id_batch, quantity } = material_plan[i];
        batchIdsInPlan.add(id_batch);

        const obj = {
          id_recipe: current_recipe?.id,
          id_batch,
          production_volume: quantity,
        };

        if (existingOrdersByBatch[id_batch]) {
          await existingOrdersByBatch[id_batch].update(obj, { transaction });
        } else {
          await RecipeOrders.create(obj, { transaction });
        }
      }

      await transaction.commit();
      const allRecipeOrders = await RecipeOrders.findAll();

      return allRecipeOrders;
    } catch (error) {
      await transaction.rollback();
      console.log('Error saving material plan:', error);
      throw error;
    }
  }

  static async deleteMaterialPlan(material_plan_id) {
    console.log('>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>deleteMaterialPlan');
    try {
      await RecipeOrders.destroy({ where: { id_batch: material_plan_id } });

      return;
    } catch (error) {
      console.log(
        '>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>error',
        error,
      );
      return error;
    }
  }

  //--------------------------RAW MAT CONSUMPTION--------------------------

  static async getAllRawMatConsumptionOrdersData() {
    console.log(
      '>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>getAllRawMatConsumptionOrdersData',
    );
    try {
      const allRawMatConsumptions = await RawMatConsumptions.findAll();

      return allRawMatConsumptions;
    } catch (error) {
      console.log(
        '>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>.error',
        error,
      );
      return error;
    }
  }

  static async addNewRawMatConsumptionOrdersData(newRawMatConsumption) {
    console.log(
      '>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>addNewRawMatConsumptionOrdersData',
    );
    try {
      const rawMat = await RawMatConsumptions.create(newRawMatConsumption);

      return rawMat;
    } catch (error) {
      console.log(
        '>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>.error',
        error,
      );
      return error;
    }
  }

  static async updateRawMatConsumptionOrdersData(newRawMatConsumption) {
    console.log(
      '>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>updateRawMatConsumptionOrdersData',
    );

    const { id, used } = newRawMatConsumption;

    try {
      const rawMat = await RawMatConsumptions.update(
        { used },
        {
          where: {
            id: id,
          },
          returning: true,
          plain: true,
        },
      );

      return rawMat;
    } catch (error) {
      console.log(
        '>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>.error',
        error,
      );
      return error;
    }
  }

  static async deleteRawMatConsumptionOrdersData(rawMatConsumption) {
    console.log(
      '>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>deleteRawMatConsumptionOrdersData',
    );
    try {
      await RawMatConsumptions.destroy({ where: { id: rawMatConsumption } });
    } catch (error) {
      console.log(
        '>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>.error',
        error,
      );
      return error;
    }
  }
}

module.exports = RecipeOrdersRepository;
