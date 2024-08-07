const clientsRouter = require('express').Router();
const { Clients } = require('../db/models');
const TokenService = require('../services/Token.js');
const RefreshSessionsRepository = require('../repositories/RefreshSession.js');
const { ACCESS_TOKEN_EXPIRATION } = require('../constants.js');
const { COOKIE_SETTINGS } = require('../constants.js');

clientsRouter.get('/', async (req, res) => {
  const fingerprint = req.fingerprint.hash;
  const { id, username, email } = req.user;

  try {
    const allClients = await Clients.findAll({
      order: [['id', 'ASC']],
    });

    const payload = { id, username, email };
    const accessToken = await TokenService.generateAccessToken(payload);
    const refreshToken = await TokenService.generateRefreshToken(payload);

    await RefreshSessionsRepository.createRefreshSession({
      user_id: id,
      refresh_token: refreshToken,
      finger_print: fingerprint,
    });

    return res
      .cookie('refreshToken', refreshToken, COOKIE_SETTINGS.REFRESH_TOKEN)
      .status(200)
      .json({
        allClients,
        accessToken,
        accessTokenExpiration: ACCESS_TOKEN_EXPIRATION,
      });
  } catch (err) {
    console.error(err.message);
  }
});

clientsRouter.post('/', async (req, res) => {
  const fingerprint = req.fingerprint.hash;
  const { id, username, email } = req.user;
  const { c_name, tin, category } = req.body.client;

  try {
    const client = await Clients.create({
      c_name,
      tin,
      category,
    });

    const payload = { id, username, email };
    const accessToken = await TokenService.generateAccessToken(payload);
    const refreshToken = await TokenService.generateRefreshToken(payload);

    await RefreshSessionsRepository.createRefreshSession({
      user_id: id,
      refresh_token: refreshToken,
      finger_print: fingerprint,
    });

    return res
      .cookie('refreshToken', refreshToken, COOKIE_SETTINGS.REFRESH_TOKEN)
      .status(200)
      .json({ client, accessToken, accessTokenExpiration: ACCESS_TOKEN_EXPIRATION });
  } catch (err) {
    console.error(err.message);
    return res.status(500).json(err);
  }
});

clientsRouter.get('/:id', async (req, res) => {
  const fingerprint = req.fingerprint.hash;
  const { id, username, email } = req.user;

  try {
    const lastID = await Clients.findOne({
      attributes: ['id'],
      order: [['id', 'DESC']],
    });

    const payload = { id, username, email };
    const accessToken = await TokenService.generateAccessToken(payload);
    const refreshToken = await TokenService.generateRefreshToken(payload);

    await RefreshSessionsRepository.createRefreshSession({
      user_id: id,
      refresh_token: refreshToken,
      finger_print: fingerprint,
    });

    return res
      .cookie('refreshToken', refreshToken, COOKIE_SETTINGS.REFRESH_TOKEN)
      .status(200)
      .json({ lastID, accessToken, accessTokenExpiration: ACCESS_TOKEN_EXPIRATION });

    // res.json(lastID);
  } catch (err) {
    console.error(err.message);
  }
});

clientsRouter.post('/update/:c_id', async (req, res) => {
  const fingerprint = req.fingerprint.hash;
  const { id, username, email } = req.user;

  const { c_id, c_name, tin, category } = req.body.client;

  try {
    //const {c_id} = req.params;
    const client = await Clients.update(
      {
        c_name,
        tin,
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

    const payload = { id, username, email };
    const accessToken = await TokenService.generateAccessToken(payload);
    const refreshToken = await TokenService.generateRefreshToken(payload);

    await RefreshSessionsRepository.createRefreshSession({
      user_id: id,
      refresh_token: refreshToken,
      finger_print: fingerprint,
    });

    return res
      .cookie('refreshToken', refreshToken, COOKIE_SETTINGS.REFRESH_TOKEN)
      .status(200)
      .json({ client, accessToken, accessTokenExpiration: ACCESS_TOKEN_EXPIRATION });
  } catch (err) {
    console.error(err.message);
    return res.status(500).json(err);
  }
});

module.exports = clientsRouter;
