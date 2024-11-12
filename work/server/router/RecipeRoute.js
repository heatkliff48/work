const recipeRouter = require('express').Router();
const { Recipe } = require('../db/models/index.js');
const TokenService = require('../services/Token.js');
const { ACCESS_TOKEN_EXPIRATION } = require('../constants.js');
const { COOKIE_SETTINGS } = require('../constants.js');
const myEmitter = require('../src/ee.js');
const { ADD_NEW_RECIPE_SOCKET } = require('../src/constants/event.js');
const { ErrorUtils } = require('../utils/Errors.js');

recipeRouter.get('/', async (req, res) => {
  const fingerprint = req.fingerprint.hash;
  const { id, username, email } = req.session.user;

  try {
    const recipe = await Recipe.findAll({
      order: [['id', 'ASC']],
    });

    const payload = { id, username, email };

    const { accessToken, refreshToken } = await TokenService.getTokens(
      payload,
      fingerprint
    );

    return res.status(200).json({ recipe });
    // .cookie('refreshToken', refreshToken, COOKIE_SETTINGS.REFRESH_TOKEN)
    // .json({
    //   fullBatchOutside,
    //   accessToken,
    //   accessTokenExpiration: ACCESS_TOKEN_EXPIRATION,
    // });
  } catch (err) {
    console.error(err.message);
  }
});

recipeRouter.post('/', async (req, res) => {
  const fingerprint = req.fingerprint.hash;
  const { id, username, email } = req.session.user;
  const {
    article,
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

    const payload = { id, username, email };

    const { accessToken, refreshToken } = await TokenService.getTokens(
      payload,
      fingerprint
    );

    myEmitter.emit(ADD_NEW_RECIPE_SOCKET, recipe);
    return res.status(200); //.json({ client });
    // .cookie('refreshToken', refreshToken, COOKIE_SETTINGS.REFRESH_TOKEN)
    // .json({
    //   client,
    //   accessToken,
    //   accessTokenExpiration: ACCESS_TOKEN_EXPIRATION,
    // })
  } catch (err) {
    console.error(err.message);
    return res.status(500).json(err);
  }
});

// ----------- наверно на будущее, хз пока что

// get одной записи

// recipeRouter.get('/:id', async (req, res) => {
//   const fingerprint = req.fingerprint.hash;
//   const { id, username, email } = req.session.user;

//   try {
//     const lastID = await Recipe.findOne({
//       attributes: ['id'],
//       order: [['id', 'DESC']],
//     });

//     const payload = { id, username, email };

//     const { accessToken, refreshToken } = await TokenService.getTokens(
//       payload,
//       fingerprint
//     );

//     return res.status(200).json({ lastID });
//     // .cookie('refreshToken', refreshToken, COOKIE_SETTINGS.REFRESH_TOKEN)
//     // .json({
//     //   lastID,
//     //   accessToken,
//     //   accessTokenExpiration: ACCESS_TOKEN_EXPIRATION,
//     // })

//     // res.json(lastID);
//   } catch (err) {
//     console.error(err.message);
//   }
// });

// recipeRouter.post('/update/:c_id', async (req, res) => {
//   const fingerprint = req.fingerprint.hash;
//   const { id, username, email } = req.session.user;

//   const {
//     c_id,
//     id_warehouse_batch,
//     id_list_of_ordered_production,
//     quantity_pallets,
//     quantity_ordered,
//     quantity_free,
//     on_check,
//   } = req.body.recipe;

//   try {
//     const recipe = await Recipe.update(
//       {
//         id_warehouse_batch,
//         id_list_of_ordered_production,
//         quantity_pallets,
//         quantity_ordered,
//         quantity_free,
//         on_check,
//       },
//       {
//         where: {
//           id: c_id,
//         },
//         returning: true,
//         plain: true,
//       }
//     );

//     const payload = { id, username, email };

//     const { accessToken, refreshToken } = await TokenService.getTokens(
//       payload,
//       fingerprint
//     );

//     myEmitter.emit(UPDATE_BATCH_OUTSIDE_SOCKET, recipe);
//     return res.status(200); //.json({ client });

//     // return (
//     //   res
//     //     // .cookie('refreshToken', refreshToken, COOKIE_SETTINGS.REFRESH_TOKEN)
//     //     .status(200)
//     //     .json({
//     //       client,
//     //       accessToken,
//     //       accessTokenExpiration: ACCESS_TOKEN_EXPIRATION,
//     //     })
//     // );
//   } catch (err) {
//     console.error(err.message);
//     return res.status(500).json(err);
//   }
// });

// recipeRouter.post('/delete', async (req, res) => {
//   const { batch_id } = req.body;

//   try {
//     await Recipe.destroy({ where: { id: batch_id } });

//     myEmitter.emit(DELETE_BATCH_OUTSIDE_SOCKET, batch_id);
//     return res.status(200);
//   } catch (err) {
//     return ErrorUtils.catchError(res, err);
//   }
// });

module.exports = recipeRouter;
