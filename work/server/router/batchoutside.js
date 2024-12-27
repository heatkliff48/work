const batchOutsideRouter = require('express').Router();
const { BatchOutside } = require('../db/models/index.js');
const TokenService = require('../services/Token.js');
const { ACCESS_TOKEN_EXPIRATION } = require('../constants.js');
const { COOKIE_SETTINGS } = require('../constants.js');
const myEmitter = require('../src/ee.js');
const {
  ADD_NEW_BATCH_OUTSIDE_SOCKET,
  UPDATE_BATCH_OUTSIDE_SOCKET,
  DELETE_BATCH_OUTSIDE_SOCKET,
} = require('../src/constants/event.js');
const { ErrorUtils } = require('../utils/Errors.js');

batchOutsideRouter.get('/', async (req, res) => {
  console.log('>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>batchOutsideRouter get');

  try {
    const batchOutside = await BatchOutside.findAll({
      order: [['id', 'ASC']],
    });

    return res.status(200).json({ batchOutside });
  } catch (err) {
    console.error(err.message);
  }
});

batchOutsideRouter.post('/', async (req, res) => {
  console.log('>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>batchOutsideRouter post');

  const {
    id_warehouse_batch,
    id_list_of_ordered_production,
    quantity_pallets,
    quantity_ordered,
    quantity_free,
    on_check,
  } = req.body;

  try {
    const batchOutside = await BatchOutside.create({
      id_warehouse_batch,
      id_list_of_ordered_production,
      quantity_pallets,
      quantity_ordered,
      quantity_free,
      on_check,
    });

    myEmitter.emit(ADD_NEW_BATCH_OUTSIDE_SOCKET, batchOutside);
    return res.json(batchOutside).status(200); //.json({ client });
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

// get одной записи

// batchOutsideRouter.get('/:id', async (req, res) => {
//   const fingerprint = req.fingerprint.hash;
//   const { id, username, email } = req.session.user;

//   try {
//     const lastID = await BatchOutside.findOne({
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

batchOutsideRouter.post('/update/:id', async (req, res) => {
  console.log('>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>batchOutsideRouter /update/:id');

  const {
    id,
    id_warehouse_batch,
    id_list_of_ordered_production,
    quantity_pallets,
    quantity_ordered,
    quantity_free,
    on_check,
  } = req.body;

  try {
    const batchOutside = await BatchOutside.update(
      {
        id_warehouse_batch,
        id_list_of_ordered_production,
        quantity_pallets,
        quantity_ordered,
        quantity_free,
        on_check,
      },
      {
        where: {
          id,
        },
        returning: true,
        plain: true,
      }
    );

    myEmitter.emit(UPDATE_BATCH_OUTSIDE_SOCKET, batchOutside);
    return res.json(batchOutside).status(200);
  } catch (err) {
    console.error(err.message);
    return res.status(500).json(err);
  }
});

batchOutsideRouter.post('/delete', async (req, res) => {
  console.log('>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>batchOutsideRouter delete');

  const { batch_id } = req.body;

  try {
    await BatchOutside.destroy({ where: { id: batch_id } });

    myEmitter.emit(DELETE_BATCH_OUTSIDE_SOCKET, batch_id);
    return res.json(batch_id).status(200);
  } catch (err) {
    return ErrorUtils.catchError(res, err);
  }
});

module.exports = batchOutsideRouter;
