const recipeRouter = require('express').Router();
const { Recipe } = require('../db/models/index.js');
const myEmitter = require('../src/ee.js');
const {
  ADD_NEW_RECIPE_SOCKET,
  DELETE_RECIPE_SOCKET,
} = require('../src/constants/event.js');

recipeRouter.get('/', async (req, res) => {
  try {
    const recipe = await Recipe.findAll({
      order: [['id', 'ASC']],
    });

    return res.status(200).json({ recipe });
  } catch (err) {
    console.error(err.message);
    return res.json({ err });
  }
});

recipeRouter.post('/', async (req, res) => {
  const {
    article,
    certificate,
    cake_height,
    lime,
    cement,
    sand_dry,
    sand_slurry_dry,
    gypsum_dry,
    return_dry,
    aluminum_paste,
    aluminum_paste_2,
    water_solids,
    solids,
    volume,
    density,
    density_recipe,
    produced_return_dry,
    water_total,
    description,
  } = req.body;

  try {
    const recipe = await Recipe.create({
      article,
      certificate,
      cake_height,
      lime,
      cement,
      sand_dry,
      sand_slurry_dry,
      gypsum_dry,
      return_dry,
      aluminum_paste,
      aluminum_paste_2,
      water_solids,
      solids,
      volume,
      density,
      density_recipe,
      produced_return_dry,
      water_total,
      description,
    });

    myEmitter.emit(ADD_NEW_RECIPE_SOCKET, recipe);
    return res.status(200);
  } catch (err) {
    console.error('>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>', err.message);
    return res.status(500).json(err);
  }
});

recipeRouter.post('/delete', async (req, res) => {
  const { recipe_id } = req.body;

  try {
    await Recipe.destroy({ where: { id: recipe_id } });

    myEmitter.emit(DELETE_RECIPE_SOCKET, recipe_id);
    return res.status(200);
  } catch (err) {
    return ErrorUtils.catchError(res, err);
  }
});

module.exports = recipeRouter;
