const rawMaterialsWarehouseRouter = require("express").Router();
const { RawMaterialsWarehouse } = require("../db/models/index.js");
const {
  WarehouseSand,
  WarehouseLime,
  WarehouseCement,
  WarehouseGypsum,
  WarehouseGypsumStone,
  WarehouseAluminum1,
  WarehouseAluminum2,
  WarehouseGrindingBalls,
  WarehouseAAC,
} = require("../db/models/index.js");
const TokenService = require("../services/Token.js");
const { ACCESS_TOKEN_EXPIRATION } = require("../constants.js");
const { COOKIE_SETTINGS } = require("../constants.js");
const myEmitter = require("../src/ee.js");
const {
  UPDATE_RAW_MATERIALS_WAREHOUSE_SOCKET,
  ADD_NEW_WAREHOUSE_SAND_SOCKET,
  UPDATE_WAREHOUSE_SAND_SOCKET,
  DELETE_WAREHOUSE_SAND_SOCKET,
  ADD_NEW_WAREHOUSE_LIME_SOCKET,
  UPDATE_WAREHOUSE_LIME_SOCKET,
  DELETE_WAREHOUSE_LIME_SOCKET,
  ADD_NEW_WAREHOUSE_CEMENT_SOCKET,
  UPDATE_WAREHOUSE_CEMENT_SOCKET,
  DELETE_WAREHOUSE_CEMENT_SOCKET,
  ADD_NEW_WAREHOUSE_GYPSUM_SOCKET,
  UPDATE_WAREHOUSE_GYPSUM_SOCKET,
  DELETE_WAREHOUSE_GYPSUM_SOCKET,
  ADD_NEW_WAREHOUSE_GYPSUM_STONE_SOCKET,
  UPDATE_WAREHOUSE_GYPSUM_STONE_SOCKET,
  DELETE_WAREHOUSE_GYPSUM_STONE_SOCKET,
  ADD_NEW_WAREHOUSE_ALUMINUM1_SOCKET,
  UPDATE_WAREHOUSE_ALUMINUM1_SOCKET,
  DELETE_WAREHOUSE_ALUMINUM1_SOCKET,
  ADD_NEW_WAREHOUSE_ALUMINUM2_SOCKET,
  UPDATE_WAREHOUSE_ALUMINUM2_SOCKET,
  DELETE_WAREHOUSE_ALUMINUM2_SOCKET,
  ADD_NEW_WAREHOUSE_GRINDING_BALLS_SOCKET,
  UPDATE_WAREHOUSE_GRINDING_BALLS_SOCKET,
  DELETE_WAREHOUSE_GRINDING_BALLS_SOCKET,
  ADD_NEW_WAREHOUSE_AAC_SOCKET,
  UPDATE_WAREHOUSE_AAC_SOCKET,
  DELETE_WAREHOUSE_AAC_SOCKET,
} = require("../src/constants/event.js");
const { ErrorUtils } = require("../utils/Errors.js");

rawMaterialsWarehouseRouter.get("/", async (req, res) => {
  try {
    const rawMaterialsWarehouse = await RawMaterialsWarehouse.findAll({
      order: [["id", "ASC"]],
    });

    return res.status(200).json({ rawMaterialsWarehouse });
  } catch (err) {
    console.error(err.message);
  }
});

rawMaterialsWarehouseRouter.post("/update", async (req, res) => {
  const { material_type, remaining_quantity, last_updated } = req.body;

  try {
    const rawMaterialsWarehouse = await RawMaterialsWarehouse.update(
      {
        remaining_quantity,
        last_updated,
      },
      {
        where: {
          material_type,
        },
        returning: true,
        plain: true,
      }
    );

    const updatedRecord = await RawMaterialsWarehouse.findOne({
      where: { material_type },
    });

    myEmitter.emit(UPDATE_RAW_MATERIALS_WAREHOUSE_SOCKET, updatedRecord);
    return res.json(updatedRecord).status(200);
  } catch (err) {
    console.error(err.message);
    return res.status(500).json(err);
  }
});

// Sand

rawMaterialsWarehouseRouter.get("/sand", async (req, res) => {
  try {
    const warehouseSand = await WarehouseSand.findAll({
      order: [["id", "ASC"]],
    });

    return res.status(200).json({ warehouseSand });
  } catch (err) {
    console.error(err.message);
  }
});

rawMaterialsWarehouseRouter.post("/sand", async (req, res) => {
  const { supplier, quantity } = req.body;

  const today = new Date();
  const day = today.getDate().toString().padStart(2, "0");
  const month = (today.getMonth() + 1).toString().padStart(2, "0");
  const year = today.getFullYear();

  const date = `${day}.${month}.${year}`;

  try {
    const warehouseSand = await WarehouseSand.create({
      supplier,
      quantity,
      date,
    });

    const totalSandQuantity = await WarehouseSand.sum("quantity");

    const latestRecord = await WarehouseSand.findOne({
      order: [["date", "DESC"]],
      attributes: ["date"],
    });

    // Используем дату из последней записи или текущую дату, если записей нет
    const lastUpdated = latestRecord ? latestRecord.date : new Date();

    await RawMaterialsWarehouse.update(
      {
        remaining_quantity: totalSandQuantity,
        last_updated: lastUpdated,
      },
      {
        where: {
          material_type: "Sand",
        },
      }
    );

    myEmitter.emit(ADD_NEW_WAREHOUSE_SAND_SOCKET, warehouseSand);
    const updatedWarehouse = await RawMaterialsWarehouse.findOne({
      where: { material_type: "Sand" },
    });
    myEmitter.emit(UPDATE_RAW_MATERIALS_WAREHOUSE_SOCKET, updatedWarehouse);
    return res.json(warehouseSand).status(200);
  } catch (err) {
    console.error(err.message);
    return res.status(500).json(err);
  }
});

rawMaterialsWarehouseRouter.post("/sand/update", async (req, res) => {
  const { supplier, ...updateFields } = req.body;

  try {
    if (!supplier) {
      return res.status(400).json({ message: "Supplier is required" });
    }

    const updateData = Object.fromEntries(
      Object.entries(updateFields).filter(
        ([_, value]) => value !== undefined && value !== null
      )
    );

    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({ message: "No valid fields to update" });
    }

    const warehouseSand = await WarehouseSand.update(updateData, {
      where: { supplier },
      returning: true,
      plain: true,
    });

    myEmitter.emit(UPDATE_WAREHOUSE_SAND_SOCKET, warehouseSand);
    return res.json(warehouseSand).status(200);
  } catch (err) {
    console.error(err.message);
    return res.status(500).json(err);
  }
});

rawMaterialsWarehouseRouter.post("/sand/delete", async (req, res) => {
  const { sand_warehouse_id } = req.body;

  try {
    await WarehouseSand.destroy({ where: { id: sand_warehouse_id } });

    myEmitter.emit(DELETE_WAREHOUSE_SAND_SOCKET, sand_warehouse_id);
    return res.json(sand_warehouse_id).status(200);
  } catch (err) {
    return ErrorUtils.catchError(res, err);
  }
});

// Lime
rawMaterialsWarehouseRouter.get("/lime", async (req, res) => {
  try {
    const warehouseLime = await WarehouseLime.findAll({
      order: [["id", "ASC"]],
    });

    return res.status(200).json({ warehouseLime });
  } catch (err) {
    console.error(err.message);
  }
});

rawMaterialsWarehouseRouter.post("/lime", async (req, res) => {
  const { supplier, quantity } = req.body;

  const today = new Date();
  const day = today.getDate().toString().padStart(2, "0");
  const month = (today.getMonth() + 1).toString().padStart(2, "0");
  const year = today.getFullYear();

  const date = `${day}.${month}.${year}`;

  try {
    const warehouseLime = await WarehouseLime.create({
      supplier,
      quantity,
      date,
    });

    const totalLimeQuantity = await WarehouseLime.sum("quantity");

    const latestRecord = await WarehouseLime.findOne({
      order: [["date", "DESC"]],
      attributes: ["date"],
    });

    // Используем дату из последней записи или текущую дату, если записей нет
    const lastUpdated = latestRecord ? latestRecord.date : new Date();

    await RawMaterialsWarehouse.update(
      {
        remaining_quantity: totalLimeQuantity,
        last_updated: lastUpdated,
      },
      {
        where: {
          material_type: "Lime",
        },
      }
    );

    myEmitter.emit(ADD_NEW_WAREHOUSE_LIME_SOCKET, warehouseLime);
    const updatedWarehouse = await RawMaterialsWarehouse.findOne({
      where: { material_type: "Lime" },
    });
    myEmitter.emit(UPDATE_RAW_MATERIALS_WAREHOUSE_SOCKET, updatedWarehouse);
    return res.json(warehouseLime).status(200);
  } catch (err) {
    console.error(err.message);
    return res.status(500).json(err);
  }
});

rawMaterialsWarehouseRouter.post("/lime/update", async (req, res) => {
  const { supplier, ...updateFields } = req.body;

  try {
    if (!supplier) {
      return res.status(400).json({ message: "Supplier is required" });
    }

    const updateData = Object.fromEntries(
      Object.entries(updateFields).filter(
        ([_, value]) => value !== undefined && value !== null
      )
    );

    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({ message: "No valid fields to update" });
    }

    const warehouseLime = await WarehouseLime.update(updateData, {
      where: { supplier },
      returning: true,
      plain: true,
    });

    myEmitter.emit(UPDATE_WAREHOUSE_LIME_SOCKET, warehouseLime);
    return res.json(warehouseLime).status(200);
  } catch (err) {
    console.error(err.message);
    return res.status(500).json(err);
  }
});

rawMaterialsWarehouseRouter.post("/lime/delete", async (req, res) => {
  const { lime_warehouse_id } = req.body;

  try {
    await WarehouseLime.destroy({ where: { id: lime_warehouse_id } });

    myEmitter.emit(DELETE_WAREHOUSE_LIME_SOCKET, lime_warehouse_id);
    return res.json(lime_warehouse_id).status(200);
  } catch (err) {
    return ErrorUtils.catchError(res, err);
  }
});

// Cement
rawMaterialsWarehouseRouter.get("/cement", async (req, res) => {
  try {
    const warehouseCement = await WarehouseCement.findAll({
      order: [["id", "ASC"]],
    });

    return res.status(200).json({ warehouseCement });
  } catch (err) {
    console.error(err.message);
  }
});

rawMaterialsWarehouseRouter.post("/cement", async (req, res) => {
  const { supplier, quantity } = req.body;

  const today = new Date();
  const day = today.getDate().toString().padStart(2, "0");
  const month = (today.getMonth() + 1).toString().padStart(2, "0");
  const year = today.getFullYear();

  const date = `${day}.${month}.${year}`;

  try {
    const warehouseCement = await WarehouseCement.create({
      supplier,
      quantity,
      date,
    });

    const totalCementQuantity = await WarehouseCement.sum("quantity");

    const latestRecord = await WarehouseCement.findOne({
      order: [["date", "DESC"]],
      attributes: ["date"],
    });

    // Используем дату из последней записи или текущую дату, если записей нет
    const lastUpdated = latestRecord ? latestRecord.date : new Date();

    await RawMaterialsWarehouse.update(
      {
        remaining_quantity: totalCementQuantity,
        last_updated: lastUpdated,
      },
      {
        where: {
          material_type: "Cement",
        },
      }
    );

    myEmitter.emit(ADD_NEW_WAREHOUSE_CEMENT_SOCKET, warehouseCement);
    const updatedWarehouse = await RawMaterialsWarehouse.findOne({
      where: { material_type: "Cement" },
    });
    myEmitter.emit(UPDATE_RAW_MATERIALS_WAREHOUSE_SOCKET, updatedWarehouse);
    return res.json(warehouseCement).status(200);
  } catch (err) {
    console.error(err.message);
    return res.status(500).json(err);
  }
});

rawMaterialsWarehouseRouter.post("/cement/update", async (req, res) => {
  const { supplier, ...updateFields } = req.body;

  try {
    if (!supplier) {
      return res.status(400).json({ message: "Supplier is required" });
    }

    const updateData = Object.fromEntries(
      Object.entries(updateFields).filter(
        ([_, value]) => value !== undefined && value !== null
      )
    );

    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({ message: "No valid fields to update" });
    }

    const warehouseCement = await WarehouseCement.update(updateData, {
      where: { supplier },
      returning: true,
      plain: true,
    });

    myEmitter.emit(UPDATE_WAREHOUSE_CEMENT_SOCKET, warehouseCement);
    return res.json(warehouseCement).status(200);
  } catch (err) {
    console.error(err.message);
    return res.status(500).json(err);
  }
});

rawMaterialsWarehouseRouter.post("/cement/delete", async (req, res) => {
  const { cement_warehouse_id } = req.body;

  try {
    await WarehouseCement.destroy({ where: { id: cement_warehouse_id } });

    myEmitter.emit(DELETE_WAREHOUSE_CEMENT_SOCKET, cement_warehouse_id);
    return res.json(cement_warehouse_id).status(200);
  } catch (err) {
    return ErrorUtils.catchError(res, err);
  }
});

// Gypsum
rawMaterialsWarehouseRouter.get("/gypsum", async (req, res) => {
  try {
    const warehouseGypsum = await WarehouseGypsum.findAll({
      order: [["id", "ASC"]],
    });

    return res.status(200).json({ warehouseGypsum });
  } catch (err) {
    console.error(err.message);
  }
});

rawMaterialsWarehouseRouter.post("/gypsum", async (req, res) => {
  const { supplier, quantity } = req.body;

  const today = new Date();
  const day = today.getDate().toString().padStart(2, "0");
  const month = (today.getMonth() + 1).toString().padStart(2, "0");
  const year = today.getFullYear();

  const date = `${day}.${month}.${year}`;

  try {
    const warehouseGypsum = await WarehouseGypsum.create({
      supplier,
      quantity,
      date,
    });

    const totalGypsumQuantity = await WarehouseGypsum.sum("quantity");

    const latestRecord = await WarehouseGypsum.findOne({
      order: [["date", "DESC"]],
      attributes: ["date"],
    });

    // Используем дату из последней записи или текущую дату, если записей нет
    const lastUpdated = latestRecord ? latestRecord.date : new Date();

    await RawMaterialsWarehouse.update(
      {
        remaining_quantity: totalGypsumQuantity,
        last_updated: lastUpdated,
      },
      {
        where: {
          material_type: "Gypsum",
        },
      }
    );

    myEmitter.emit(ADD_NEW_WAREHOUSE_GYPSUM_SOCKET, warehouseGypsum);
    const updatedWarehouse = await RawMaterialsWarehouse.findOne({
      where: { material_type: "Gypsum" },
    });
    myEmitter.emit(UPDATE_RAW_MATERIALS_WAREHOUSE_SOCKET, updatedWarehouse);
    return res.json(warehouseGypsum).status(200);
  } catch (err) {
    console.error(err.message);
    return res.status(500).json(err);
  }
});

rawMaterialsWarehouseRouter.post("/gypsum/update", async (req, res) => {
  const { supplier, ...updateFields } = req.body;

  try {
    if (!supplier) {
      return res.status(400).json({ message: "Supplier is required" });
    }

    const updateData = Object.fromEntries(
      Object.entries(updateFields).filter(
        ([_, value]) => value !== undefined && value !== null
      )
    );

    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({ message: "No valid fields to update" });
    }

    const warehouseGypsum = await WarehouseGypsum.update(updateData, {
      where: { supplier },
      returning: true,
      plain: true,
    });

    myEmitter.emit(UPDATE_WAREHOUSE_GYPSUM_SOCKET, warehouseGypsum);
    return res.json(warehouseGypsum).status(200);
  } catch (err) {
    console.error(err.message);
    return res.status(500).json(err);
  }
});

rawMaterialsWarehouseRouter.post("/gypsum/delete", async (req, res) => {
  const { gypsum_warehouse_id } = req.body;

  try {
    await WarehouseGypsum.destroy({ where: { id: gypsum_warehouse_id } });

    myEmitter.emit(DELETE_WAREHOUSE_GYPSUM_SOCKET, gypsum_warehouse_id);
    return res.json(gypsum_warehouse_id).status(200);
  } catch (err) {
    return ErrorUtils.catchError(res, err);
  }
});

// Gypsum stone
rawMaterialsWarehouseRouter.get("/gypsum-stone", async (req, res) => {
  try {
    const warehouseGypsumStone = await WarehouseGypsumStone.findAll({
      order: [["id", "ASC"]],
    });

    return res.status(200).json({ warehouseGypsumStone });
  } catch (err) {
    console.error(err.message);
  }
});

rawMaterialsWarehouseRouter.post("/gypsum-stone", async (req, res) => {
  const { supplier, quantity } = req.body;

  const today = new Date();
  const day = today.getDate().toString().padStart(2, "0");
  const month = (today.getMonth() + 1).toString().padStart(2, "0");
  const year = today.getFullYear();

  const date = `${day}.${month}.${year}`;

  try {
    const warehouseGypsumStone = await WarehouseGypsumStone.create({
      supplier,
      quantity,
      date,
    });

    const totalGypsumStoneQuantity = await WarehouseGypsumStone.sum("quantity");

    const latestRecord = await WarehouseGypsumStone.findOne({
      order: [["date", "DESC"]],
      attributes: ["date"],
    });

    // Используем дату из последней записи или текущую дату, если записей нет
    const lastUpdated = latestRecord ? latestRecord.date : new Date();

    await RawMaterialsWarehouse.update(
      {
        remaining_quantity: totalGypsumStoneQuantity,
        last_updated: lastUpdated,
      },
      {
        where: {
          material_type: "Gypsum stone",
        },
      }
    );

    myEmitter.emit(ADD_NEW_WAREHOUSE_GYPSUM_STONE_SOCKET, warehouseGypsumStone);
    const updatedWarehouse = await RawMaterialsWarehouse.findOne({
      where: { material_type: "Gypsum stone" },
    });
    myEmitter.emit(UPDATE_RAW_MATERIALS_WAREHOUSE_SOCKET, updatedWarehouse);
    return res.json(warehouseGypsumStone).status(200);
  } catch (err) {
    console.error(err.message);
    return res.status(500).json(err);
  }
});

rawMaterialsWarehouseRouter.post("/gypsum-stone/update", async (req, res) => {
  const { supplier, ...updateFields } = req.body;

  try {
    if (!supplier) {
      return res.status(400).json({ message: "Supplier is required" });
    }

    const updateData = Object.fromEntries(
      Object.entries(updateFields).filter(
        ([_, value]) => value !== undefined && value !== null
      )
    );

    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({ message: "No valid fields to update" });
    }

    const warehouseGypsumStone = await WarehouseGypsumStone.update(updateData, {
      where: { supplier },
      returning: true,
      plain: true,
    });

    myEmitter.emit(UPDATE_WAREHOUSE_GYPSUM_STONE_SOCKET, warehouseGypsumStone);
    return res.json(warehouseGypsumStone).status(200);
  } catch (err) {
    console.error(err.message);
    return res.status(500).json(err);
  }
});

rawMaterialsWarehouseRouter.post("/gypsum-stone/delete", async (req, res) => {
  const { gypsum_stone_warehouse_id } = req.body;

  try {
    await WarehouseGypsumStone.destroy({
      where: { id: gypsum_stone_warehouse_id },
    });

    myEmitter.emit(
      DELETE_WAREHOUSE_GYPSUM_STONE_SOCKET,
      gypsum_stone_warehouse_id
    );
    return res.json(gypsum_stone_warehouse_id).status(200);
  } catch (err) {
    return ErrorUtils.catchError(res, err);
  }
});

// Aluminum1
rawMaterialsWarehouseRouter.get("/aluminum1", async (req, res) => {
  try {
    const warehouseAluminum1 = await WarehouseAluminum1.findAll({
      order: [["id", "ASC"]],
    });

    return res.status(200).json({ warehouseAluminum1 });
  } catch (err) {
    console.error(err.message);
  }
});

rawMaterialsWarehouseRouter.post("/aluminum1", async (req, res) => {
  const { supplier, quantity } = req.body;

  const today = new Date();
  const day = today.getDate().toString().padStart(2, "0");
  const month = (today.getMonth() + 1).toString().padStart(2, "0");
  const year = today.getFullYear();

  const date = `${day}.${month}.${year}`;

  try {
    const warehouseAluminum1 = await WarehouseAluminum1.create({
      supplier,
      quantity,
      date,
    });

    const totalAluminum1Quantity = await WarehouseAluminum1.sum("quantity");

    const latestRecord = await WarehouseAluminum1.findOne({
      order: [["date", "DESC"]],
      attributes: ["date"],
    });

    // Используем дату из последней записи или текущую дату, если записей нет
    const lastUpdated = latestRecord ? latestRecord.date : new Date();

    await RawMaterialsWarehouse.update(
      {
        remaining_quantity: totalAluminum1Quantity,
        last_updated: lastUpdated,
      },
      {
        where: {
          material_type: "Aluminum 1",
        },
      }
    );

    myEmitter.emit(ADD_NEW_WAREHOUSE_ALUMINUM1_SOCKET, warehouseAluminum1);
    const updatedWarehouse = await RawMaterialsWarehouse.findOne({
      where: { material_type: "Aluminum 1" },
    });
    myEmitter.emit(UPDATE_RAW_MATERIALS_WAREHOUSE_SOCKET, updatedWarehouse);
    return res.json(warehouseAluminum1).status(200);
  } catch (err) {
    console.error(err.message);
    return res.status(500).json(err);
  }
});

rawMaterialsWarehouseRouter.post("/aluminum1/update", async (req, res) => {
  const { supplier, ...updateFields } = req.body;

  try {
    if (!supplier) {
      return res.status(400).json({ message: "Supplier is required" });
    }

    const updateData = Object.fromEntries(
      Object.entries(updateFields).filter(
        ([_, value]) => value !== undefined && value !== null
      )
    );

    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({ message: "No valid fields to update" });
    }

    const warehouseAluminum1 = await WarehouseAluminum1.update(updateData, {
      where: { supplier },
      returning: true,
      plain: true,
    });

    myEmitter.emit(UPDATE_WAREHOUSE_ALUMINUM1_SOCKET, warehouseAluminum1);
    return res.json(warehouseAluminum1).status(200);
  } catch (err) {
    console.error(err.message);
    return res.status(500).json(err);
  }
});

rawMaterialsWarehouseRouter.post("/aluminum1/delete", async (req, res) => {
  const { aluminum1_warehouse_id } = req.body;

  try {
    await WarehouseAluminum1.destroy({ where: { id: aluminum1_warehouse_id } });

    myEmitter.emit(DELETE_WAREHOUSE_ALUMINUM1_SOCKET, aluminum1_warehouse_id);
    return res.json(aluminum1_warehouse_id).status(200);
  } catch (err) {
    return ErrorUtils.catchError(res, err);
  }
});

// Aluminum2
rawMaterialsWarehouseRouter.get("/aluminum2", async (req, res) => {
  try {
    const warehouseAluminum2 = await WarehouseAluminum2.findAll({
      order: [["id", "ASC"]],
    });

    return res.status(200).json({ warehouseAluminum2 });
  } catch (err) {
    console.error(err.message);
  }
});

rawMaterialsWarehouseRouter.post("/aluminum2", async (req, res) => {
  const { supplier, quantity } = req.body;

  const today = new Date();
  const day = today.getDate().toString().padStart(2, "0");
  const month = (today.getMonth() + 1).toString().padStart(2, "0");
  const year = today.getFullYear();

  const date = `${day}.${month}.${year}`;

  try {
    const warehouseAluminum2 = await WarehouseAluminum2.create({
      supplier,
      quantity,
      date,
    });

    const totalAluminum2Quantity = await WarehouseAluminum2.sum("quantity");

    const latestRecord = await WarehouseAluminum2.findOne({
      order: [["date", "DESC"]],
      attributes: ["date"],
    });

    // Используем дату из последней записи или текущую дату, если записей нет
    const lastUpdated = latestRecord ? latestRecord.date : new Date();

    await RawMaterialsWarehouse.update(
      {
        remaining_quantity: totalAluminum2Quantity,
        last_updated: lastUpdated,
      },
      {
        where: {
          material_type: "Aluminum 2",
        },
      }
    );

    myEmitter.emit(ADD_NEW_WAREHOUSE_ALUMINUM2_SOCKET, warehouseAluminum2);
    const updatedWarehouse = await RawMaterialsWarehouse.findOne({
      where: { material_type: "Aluminum 2" },
    });
    myEmitter.emit(UPDATE_RAW_MATERIALS_WAREHOUSE_SOCKET, updatedWarehouse);
    return res.json(warehouseAluminum2).status(200);
  } catch (err) {
    console.error(err.message);
    return res.status(500).json(err);
  }
});

rawMaterialsWarehouseRouter.post("/aluminum2/update", async (req, res) => {
  const { supplier, ...updateFields } = req.body;

  try {
    if (!supplier) {
      return res.status(400).json({ message: "Supplier is required" });
    }

    const updateData = Object.fromEntries(
      Object.entries(updateFields).filter(
        ([_, value]) => value !== undefined && value !== null
      )
    );

    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({ message: "No valid fields to update" });
    }

    const warehouseAluminum2 = await WarehouseAluminum2.update(updateData, {
      where: { supplier },
      returning: true,
      plain: true,
    });

    myEmitter.emit(UPDATE_WAREHOUSE_ALUMINUM2_SOCKET, warehouseAluminum2);
    return res.json(warehouseAluminum2).status(200);
  } catch (err) {
    console.error(err.message);
    return res.status(500).json(err);
  }
});

rawMaterialsWarehouseRouter.post("/aluminum2/delete", async (req, res) => {
  const { aluminum2_warehouse_id } = req.body;

  try {
    await WarehouseAluminum2.destroy({ where: { id: aluminum2_warehouse_id } });

    myEmitter.emit(DELETE_WAREHOUSE_ALUMINUM2_SOCKET, aluminum2_warehouse_id);
    return res.json(aluminum2_warehouse_id).status(200);
  } catch (err) {
    return ErrorUtils.catchError(res, err);
  }
});

// Grinding Balls
rawMaterialsWarehouseRouter.get("/grinding-balls", async (req, res) => {
  try {
    const warehouseGrindingBalls = await WarehouseGrindingBalls.findAll({
      order: [["id", "ASC"]],
    });

    return res.status(200).json({ warehouseGrindingBalls });
  } catch (err) {
    console.error(err.message);
  }
});

rawMaterialsWarehouseRouter.post("/grinding-balls", async (req, res) => {
  const { supplier, quantity } = req.body;

  const today = new Date();
  const day = today.getDate().toString().padStart(2, "0");
  const month = (today.getMonth() + 1).toString().padStart(2, "0");
  const year = today.getFullYear();

  const date = `${day}.${month}.${year}`;

  try {
    const warehouseGrindingBalls = await WarehouseGrindingBalls.create({
      supplier,
      quantity,
      date,
    });

    const totalGrindingBallsQuantity = await WarehouseGrindingBalls.sum(
      "quantity"
    );

    const latestRecord = await WarehouseGrindingBalls.findOne({
      order: [["date", "DESC"]],
      attributes: ["date"],
    });

    // Используем дату из последней записи или текущую дату, если записей нет
    const lastUpdated = latestRecord ? latestRecord.date : new Date();

    await RawMaterialsWarehouse.update(
      {
        remaining_quantity: totalGrindingBallsQuantity,
        last_updated: lastUpdated,
      },
      {
        where: {
          material_type: "Grinding Balls",
        },
      }
    );

    myEmitter.emit(
      ADD_NEW_WAREHOUSE_GRINDING_BALLS_SOCKET,
      warehouseGrindingBalls
    );
    const updatedWarehouse = await RawMaterialsWarehouse.findOne({
      where: { material_type: "Grinding Balls" },
    });
    myEmitter.emit(UPDATE_RAW_MATERIALS_WAREHOUSE_SOCKET, updatedWarehouse);
    return res.json(warehouseGrindingBalls).status(200);
  } catch (err) {
    console.error(err.message);
    return res.status(500).json(err);
  }
});

rawMaterialsWarehouseRouter.post("/grinding-balls/update", async (req, res) => {
  const { supplier, ...updateFields } = req.body;

  try {
    if (!supplier) {
      return res.status(400).json({ message: "Supplier is required" });
    }

    const updateData = Object.fromEntries(
      Object.entries(updateFields).filter(
        ([_, value]) => value !== undefined && value !== null
      )
    );

    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({ message: "No valid fields to update" });
    }

    const warehouseGrindingBalls = await WarehouseGrindingBalls.update(
      updateData,
      {
        where: { supplier },
        returning: true,
        plain: true,
      }
    );

    myEmitter.emit(
      UPDATE_WAREHOUSE_GRINDING_BALLS_SOCKET,
      warehouseGrindingBalls
    );
    return res.json(warehouseGrindingBalls).status(200);
  } catch (err) {
    console.error(err.message);
    return res.status(500).json(err);
  }
});

rawMaterialsWarehouseRouter.post("/grinding-balls/delete", async (req, res) => {
  const { grinding_balls_warehouse_id } = req.body;

  try {
    await WarehouseGrindingBalls.destroy({
      where: { id: grinding_balls_warehouse_id },
    });

    myEmitter.emit(
      DELETE_WAREHOUSE_GRINDING_BALLS_SOCKET,
      grinding_balls_warehouse_id
    );
    return res.json(grinding_balls_warehouse_id).status(200);
  } catch (err) {
    return ErrorUtils.catchError(res, err);
  }
});

// AAC
rawMaterialsWarehouseRouter.get("/aac", async (req, res) => {
  try {
    const warehouseAAC = await WarehouseAAC.findAll({
      order: [["id", "ASC"]],
    });

    return res.status(200).json({ warehouseAAC });
  } catch (err) {
    console.error(err.message);
  }
});

rawMaterialsWarehouseRouter.post("/aac", async (req, res) => {
  const { supplier, quantity } = req.body;

  const today = new Date();
  const day = today.getDate().toString().padStart(2, "0");
  const month = (today.getMonth() + 1).toString().padStart(2, "0");
  const year = today.getFullYear();

  const date = `${day}.${month}.${year}`;

  try {
    const warehouseAAC = await WarehouseAAC.create({
      supplier,
      quantity,
      date,
    });

    const totalAACQuantity = await WarehouseAAC.sum("quantity");

    const latestRecord = await WarehouseAAC.findOne({
      order: [["date", "DESC"]],
      attributes: ["date"],
    });

    // Используем дату из последней записи или текущую дату, если записей нет
    const lastUpdated = latestRecord ? latestRecord.date : new Date();

    await RawMaterialsWarehouse.update(
      {
        remaining_quantity: totalAACQuantity,
        last_updated: lastUpdated,
      },
      {
        where: {
          material_type: "AAC",
        },
      }
    );

    myEmitter.emit(ADD_NEW_WAREHOUSE_AAC_SOCKET, warehouseAAC);
    const updatedWarehouse = await RawMaterialsWarehouse.findOne({
      where: { material_type: "AAC" },
    });
    myEmitter.emit(UPDATE_RAW_MATERIALS_WAREHOUSE_SOCKET, updatedWarehouse);
    return res.json(warehouseAAC).status(200);
  } catch (err) {
    console.error(err.message);
    return res.status(500).json(err);
  }
});

rawMaterialsWarehouseRouter.post("/aac/update", async (req, res) => {
  const { supplier, ...updateFields } = req.body;

  try {
    if (!supplier) {
      return res.status(400).json({ message: "Supplier is required" });
    }

    const updateData = Object.fromEntries(
      Object.entries(updateFields).filter(
        ([_, value]) => value !== undefined && value !== null
      )
    );

    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({ message: "No valid fields to update" });
    }

    const warehouseAAC = await WarehouseAAC.update(updateData, {
      where: { supplier },
      returning: true,
      plain: true,
    });

    myEmitter.emit(UPDATE_WAREHOUSE_AAC_SOCKET, warehouseAAC);
    return res.json(warehouseAAC).status(200);
  } catch (err) {
    console.error(err.message);
    return res.status(500).json(err);
  }
});

rawMaterialsWarehouseRouter.post("/aac/delete", async (req, res) => {
  const { aac_warehouse_id } = req.body;

  try {
    await WarehouseAAC.destroy({ where: { id: aac_warehouse_id } });

    myEmitter.emit(DELETE_WAREHOUSE_AAC_SOCKET, aac_warehouse_id);
    return res.json(aac_warehouse_id).status(200);
  } catch (err) {
    return ErrorUtils.catchError(res, err);
  }
});

module.exports = rawMaterialsWarehouseRouter;
