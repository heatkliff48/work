const recipeRouter = require('express').Router();
const { Recipe } = require('../db/models/index.js');
const myEmitter = require('../src/ee.js');
const {
  ADD_NEW_RECIPE_SOCKET,
  UPDATE_RECIPE_SOCKET,
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
    sand_powder_dry,
    sand_slurry_dry,
    gypsum_dry,
    return_dry,
    aluminum_paste,
    aluminum_type,
    aluminum_paste_2,
    aluminum_2_type,
    water_solids,
    solids,
    volume,
    density,
    density_recipe,
    produced_return_dry,
    water_total,
    description,
  } = req.body;

  const trimmedDescription =
    typeof description === 'string' ? description.trim() : '';

  if (!trimmedDescription) {
    return res.status(400).json({ error: 'Description is required' });
  }

  try {
    const existingRecipe = await Recipe.findOne({
      where: { description: trimmedDescription },
    });

    if (existingRecipe) {
      return res
        .status(400)
        .json({ error: 'Recipe with this description already exists' });
    }

    const recipe = await Recipe.create({
      article,
      certificate,
      cake_height,
      lime,
      cement,
      sand_powder_dry,
      sand_slurry_dry,
      gypsum_dry,
      return_dry,
      aluminum_paste,
      aluminum_type,
      aluminum_paste_2,
      aluminum_2_type,
      water_solids,
      solids,
      volume,
      density,
      density_recipe,
      produced_return_dry,
      water_total,
      description: trimmedDescription,
    });

    myEmitter.emit(ADD_NEW_RECIPE_SOCKET, recipe);
    return res.status(200).json({ success: true, recipe });
  } catch (err) {
    console.error('>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>', err.message);
    return res.status(500).json(err);
  }
});

recipeRouter.post('/update', async (req, res) => {
  const {
    id,
    description,
    solids,
    volume,
    density_recipe,
    produced_return_dry,
    water_total,
    cake_height,
    lime,
    cement,
    sand_powder_dry,
    sand_slurry_dry,
    gypsum_dry,
    return_dry,
    aluminum_paste,
    aluminum_type,
    aluminum_paste_2,
    aluminum_2_type,
    water_solids,
  } = req.body;

  try {
    const updateData = {};
    if (description !== undefined) updateData.description = description;
    if (solids !== undefined) updateData.solids = solids;
    if (volume !== undefined) updateData.volume = volume;
    if (density_recipe !== undefined) updateData.density_recipe = density_recipe;
    if (produced_return_dry !== undefined)
      updateData.produced_return_dry = produced_return_dry;
    if (water_total !== undefined) updateData.water_total = water_total;
    if (cake_height !== undefined) updateData.cake_height = cake_height;
    if (lime !== undefined) updateData.lime = lime;
    if (cement !== undefined) updateData.cement = cement;
    if (sand_powder_dry !== undefined)
      updateData.sand_powder_dry = sand_powder_dry;
    if (sand_slurry_dry !== undefined)
      updateData.sand_slurry_dry = sand_slurry_dry;
    if (gypsum_dry !== undefined) updateData.gypsum_dry = gypsum_dry;
    if (return_dry !== undefined) updateData.return_dry = return_dry;
    if (aluminum_paste !== undefined)
      updateData.aluminum_paste = aluminum_paste;
    if (aluminum_type !== undefined) updateData.aluminum_type = aluminum_type;
    if (aluminum_paste_2 !== undefined)
      updateData.aluminum_paste_2 = aluminum_paste_2;
    if (aluminum_2_type !== undefined)
      updateData.aluminum_2_type = aluminum_2_type;
    if (water_solids !== undefined) updateData.water_solids = water_solids;

    const recipe = await Recipe.update(updateData, {
      where: {
        id,
      },
      returning: true,
      plain: true,
    });

    myEmitter.emit(UPDATE_RECIPE_SOCKET, recipe);
    return res.status(200).json({ success: true, recipe });
  } catch (err) {
    console.error('>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>', err.message);
    return res.status(500).json(err);
  }
});

recipeRouter.post('/recalculate', async (req, res) => {
  const { recipes } = req.body;

  if (!Array.isArray(recipes) || recipes.length === 0) {
    return res
      .status(400)
      .json({ error: 'No recipes provided for recalculation' });
  }

  try {
    const updatedRecipes = [];

    for (const item of recipes) {
      const {
        id,
        solids,
        volume,
        density_recipe,
        produced_return_dry,
        water_total,
      } = item;

      if (!id) continue;

      const updateData = {};
      if (solids !== undefined) updateData.solids = solids;
      if (volume !== undefined) updateData.volume = volume;
      if (density_recipe !== undefined)
        updateData.density_recipe = density_recipe;
      if (produced_return_dry !== undefined)
        updateData.produced_return_dry = produced_return_dry;
      if (water_total !== undefined) updateData.water_total = water_total;

      const [affectedCount, affectedRows] = await Recipe.update(updateData, {
        where: { id },
        returning: true,
        plain: true,
      });

      if (affectedRows) {
        myEmitter.emit(UPDATE_RECIPE_SOCKET, [affectedCount, affectedRows]);
        updatedRecipes.push(affectedRows);
      }
    }

    return res
      .status(200)
      .json({ success: true, count: updatedRecipes.length, updatedRecipes });
  } catch (err) {
    console.error('Error recalculating recipes:', err);
    return res.status(500).json({ error: err.message });
  }
});

recipeRouter.post('/delete', async (req, res) => {
  const { recipe_id } = req.body;

  try {
    await Recipe.destroy({ where: { id: recipe_id } });

    myEmitter.emit(DELETE_RECIPE_SOCKET, recipe_id);
    return res.status(200).json({ success: true, recipe_id });
  } catch (err) {
    console.error('Error deleting recipe:', err);
    return res.status(500).json({ error: err.message });
  }
});

module.exports = recipeRouter;
