const recipeRouter = require('express').Router();
const { Recipe } = require('../db/models/index.js');
const myEmitter = require('../src/ee.js');
const {
  ADD_NEW_RECIPE_SOCKET,
  DELETE_RECIPE_SOCKET,
} = require('../src/constants/event.js');

recipeRouter.get('/', async (req, res) => {
  console.log('>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>recipeRouter get');

  try {
    const recipe = await Recipe.findAll({
      order: [['id', 'ASC']],
    });

    return res.status(200).json({ recipe });
  } catch (err) {
    console.error(err.message);
    return res.json({err})
  }
});

recipeRouter.post('/', async (req, res) => {
  console.log('>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>recipeRouter post');

  const {
    article,
    density,
    certificate,
    form_volume_m3,
    dry_total,
    sand,
    lime_lhoist,
    lime_barcelona,
    cement,
    gypsum,
    alu_1,
    alu_2,
    return_slurry_solids,
    return_slurry_water,
    water,
    water_cold,
    water_hot,
    condensate,
  } = req.body;

  try {
    const recipe = await Recipe.create({
      article,
      density,
      certificate,
      form_volume_m3,
      dry_total,
      sand,
      lime_lhoist,
      lime_barcelona,
      cement,
      gypsum,
      alu_1,
      alu_2,
      return_slurry_solids,
      return_slurry_water,
      water,
      water_cold,
      water_hot,
      condensate,
    });

    myEmitter.emit(ADD_NEW_RECIPE_SOCKET, recipe);
    return res.status(200)
  } catch (err) {
    console.error('>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>',err.message);
    return res.status(500).json(err);
  }
});

recipeRouter.post('/delete', async (req, res) => {
  console.log('>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>recipeRouter delete');

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
