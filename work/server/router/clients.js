const clientsRouter = require('express').Router();
const { Clients } = require('../db/models');
const TokenService = require('../services/Token.js');
const { ACCESS_TOKEN_EXPIRATION } = require('../constants.js');
const { COOKIE_SETTINGS } = require('../constants.js');
const myEmitter = require('../src/ee.js');
const {
  ADD_NEW_CLIENT_SOCKET,
  UPDATE_CLIENT_SOCKET,
} = require('../src/constants/event.js');

clientsRouter.get('/', async (req, res) => {
  // const fingerprint = req.fingerprint.hash;
  // const { id, username, email } = req.session.user;

  try {
    const allClients = await Clients.findAll({
      order: [['id', 'ASC']],
    });

    // const payload = { id, username, email };

    // const { accessToken, refreshToken } = await TokenService.getTokens(
    //   payload,
    //   fingerprint
    // );

    return res.status(200).json({ allClients });
    // .cookie('refreshToken', refreshToken, COOKIE_SETTINGS.REFRESH_TOKEN)
    // .json({
    //   allClients,
    //   accessToken,
    //   accessTokenExpiration: ACCESS_TOKEN_EXPIRATION,
    // });
  } catch (err) {
    console.error(err.message);
  }
});

clientsRouter.post('/', async (req, res) => {
  const { c_name, cif_vat, category } = req.body.client;

  try {
    const client = await Clients.create({
      c_name,
      cif_vat,
      category,
    });

    myEmitter.emit(ADD_NEW_CLIENT_SOCKET, client);
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

clientsRouter.get('/:id', async (req, res) => {
  try {
    const lastID = await Clients.findOne({
      attributes: ['id'],
      order: [['id', 'DESC']],
    });

    return res.status(200).json({ lastID });
    // .cookie('refreshToken', refreshToken, COOKIE_SETTINGS.REFRESH_TOKEN)
    // .json({
    //   lastID,
    //   accessToken,
    //   accessTokenExpiration: ACCESS_TOKEN_EXPIRATION,
    // })

    // res.json(lastID);
  } catch (err) {
    console.error(err.message);
  }
});

clientsRouter.post('/update/:c_id', async (req, res) => {
  const { c_id, c_name, cif_vat, category } = req.body.client;

  try {
    //const {c_id} = req.params;
    const client = await Clients.update(
      {
        c_name,
        cif_vat,
        category,
      },
      {
        where: {
          id: c_id,
        },
        returning: true,
        plain: true,
      }
    );

    myEmitter.emit(UPDATE_CLIENT_SOCKET, client);
    return res.status(200); //.json({ client });

    // return (
    //   res
    //     // .cookie('refreshToken', refreshToken, COOKIE_SETTINGS.REFRESH_TOKEN)
    //     .status(200)
    //     .json({
    //       client,
    //       accessToken,
    //       accessTokenExpiration: ACCESS_TOKEN_EXPIRATION,
    //     })
    // );
  } catch (err) {
    console.error(err.message);
    return res.status(500).json(err);
  }
});

module.exports = clientsRouter;
