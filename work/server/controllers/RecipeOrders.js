const RecipeOrdersServices = require('../services/RecipeOrders');
const {
  SAVE_MATERIAL_PLAN_SOCKET,
  DELETE_MATERIAL_PLAN_SOCKET,
  ADD_NEW_RAW_MAT_CONSUMPTION_SOCKET,
  UPDATE_RAW_MAT_CONSUMPTION_SOCKET,
  DELETE_OLD_RAW_MAT_CONSUMPTION_SOCKET,
  ADD_NEW_RAW_MAT_CONSUMPTION_CURRENT_MOLDS_SOCKET,
  UPDATE_RAW_MAT_CONSUMPTION_CURRENT_MOLDS_SOCKET,
  DELETE_OLD_RAW_MAT_CONSUMPTION_CURRENT_MOLDS_SOCKET,
} = require('../src/constants/event');
const myEmitter = require('../src/ee');

class RecipeOrdersController {
  static async getRecipeOrdersData(req, res) {
    const data = await RecipeOrdersServices.getRecipeOrdersData();

    return res.json(data).status(200);
  }

  static async saveMaterialPlan(req, res) {
    try {
      const material_plan = req.body;
      const recipeOrders = await RecipeOrdersServices.saveMaterialPlan(
        material_plan,
      );
      myEmitter.emit(SAVE_MATERIAL_PLAN_SOCKET, recipeOrders);

      return res.status(200);
    } catch (error) {
      console.error(
        '>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>..err.message',
        error.message,
      );
      res.json({ error: 'Internal Server Error' }).status(500);
    }
  }

  static async deleteMaterialPlan(req, res) {
    const { material_plan_id } = req.body;
    await RecipeOrdersServices.deleteMaterialPlan(material_plan_id);

    myEmitter.emit(DELETE_MATERIAL_PLAN_SOCKET, material_plan_id);

    return res.json(material_plan_id).status(200);
  }

  //--------------------------RAW MAT CONSUMPTION--------------------------

  static async getAllRawMatConsumptionOrdersData(req, res) {
    const allRawMatConsumptions =
      await RecipeOrdersServices.getAllRawMatConsumptionOrdersData();

    return res.status(200).json(allRawMatConsumptions);
  }

  static async addNewRawMatConsumptionOrdersData(req, res) {
    const rawMatConsumption = req.body;

    const rawMat = await RecipeOrdersServices.addNewRawMatConsumptionOrdersData(
      rawMatConsumption,
    );

    myEmitter.emit(ADD_NEW_RAW_MAT_CONSUMPTION_SOCKET, rawMat);

    return res.status(200).json(rawMat);
  }

  static async updateRawMatConsumptionOrdersData(req, res) {
    const rawMatConsumption = req.body;

    const rawMat = await RecipeOrdersServices.updateRawMatConsumptionOrdersData(
      rawMatConsumption,
    );

    myEmitter.emit(UPDATE_RAW_MAT_CONSUMPTION_SOCKET, rawMat);

    return res.status(200).json(rawMat);
  }

  static async deleteRawMatConsumptionOrdersData(req, res) {
    console.log(
      '>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>deleteRawMatConsumptionOrdersData',
      req.body,
    );
    const { id } = req.body;

    await RecipeOrdersServices.deleteRawMatConsumptionOrdersData(id);

    myEmitter.emit(DELETE_OLD_RAW_MAT_CONSUMPTION_SOCKET, id);

    return res.status(200).json(id);
  }

  //--------------------------RAW MAT CONSUMPTION CURRENT MOLDS--------------------------

  static async getAllRawMatConsumptionCurrentMolds(req, res) {
    const allRawMatConsumptionsCurrentMolds =
      await RecipeOrdersServices.getAllRawMatConsumptionCurrentMolds();

    return res.status(200).json(allRawMatConsumptionsCurrentMolds);
  }

  static async addNewRawMatConsumptionCurrentMolds(req, res) {
    const rawMatConsumption = req.body;

    const rawMatCurMolds =
      await RecipeOrdersServices.addNewRawMatConsumptionCurrentMolds(
        rawMatConsumption,
      );

    myEmitter.emit(ADD_NEW_RAW_MAT_CONSUMPTION_CURRENT_MOLDS_SOCKET, rawMatCurMolds);

    return res.status(200).json(rawMatCurMolds);
  }

  static async updateRawMatConsumptionCurrentMolds(req, res) {
    const rawMatConsumption = req.body;

    const rawMatCurMolds =
      await RecipeOrdersServices.updateRawMatConsumptionCurrentMolds(
        rawMatConsumption,
      );

    myEmitter.emit(UPDATE_RAW_MAT_CONSUMPTION_CURRENT_MOLDS_SOCKET, rawMatCurMolds);

    return res.status(200).json(rawMatCurMolds);
  }

  static async deleteRawMatConsumptionCurrentMolds(req, res) {
    console.log(
      '>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>deleteRawMatConsumptionCurrentMolds',
      req.body,
    );
    const { batch_id } = req.body;

    await RecipeOrdersServices.deleteRawMatConsumptionCurrentMolds(batch_id);

    myEmitter.emit(DELETE_OLD_RAW_MAT_CONSUMPTION_CURRENT_MOLDS_SOCKET, batch_id);

    return res.status(200).json(batch_id);
  }
}

module.exports = RecipeOrdersController;
