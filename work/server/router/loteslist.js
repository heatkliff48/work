const lotesListRouter = require("express").Router();
const { LotesList } = require("../db/models/index.js");
const myEmitter = require("../src/ee.js");
const { ADD_NEW_LOTES_LIST_SOCKET } = require("../src/constants/event.js");
const { ErrorUtils } = require("../utils/Errors.js");

lotesListRouter.get("/", async (req, res) => {
  try {
    const lotesList = await LotesList.findAll({
      order: [["id", "ASC"]],
    });

    return res.status(200).json({ lotesList });
  } catch (err) {
    console.error(err.message);
  }
});

lotesListRouter.post("/", async (req, res) => {
  const { production_date, product, recipe, quantity_cakes, warehouse_id } =
    req.body;

  try {
    const quantityCakesInt = Math.floor(parseFloat(quantity_cakes));

    if (isNaN(quantityCakesInt) || quantityCakesInt <= 0) {
      return res
        .status(400)
        .json({ error: "quantity_cakes must be a positive number" });
    }

    const lastLote = await LotesList.findOne({
      order: [["id", "DESC"]],
    });

    let cake_id, cake_id_finish;

    if (lastLote) {
      cake_id = lastLote.cake_id + lastLote.quantity_cakes;
    } else {
      cake_id = 1;
    }

    cake_id_finish = cake_id + quantityCakesInt - 1;

    const lotesList = await LotesList.create({
      cake_id,
      cake_id_finish,
      production_date,
      product,
      recipe,
      quantity_cakes: quantityCakesInt,
      warehouse_id,
    });

    myEmitter.emit(ADD_NEW_LOTES_LIST_SOCKET, lotesList);
    return res.status(200).json(lotesList);
  } catch (err) {
    console.error(err.message);
    return res.status(500).json({ error: err.message });
  }
});

module.exports = lotesListRouter;
