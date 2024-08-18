const usersMainInfoRouter = require('express').Router();
const { Users } = require('../db/models/index.js');
const TokenService = require('../services/Token.js');
const RefreshSessionsRepository = require('../repositories/RefreshSession.js');
const { ACCESS_TOKEN_EXPIRATION } = require('../constants.js');
const { COOKIE_SETTINGS } = require('../constants.js');

usersMainInfoRouter.get('/', async (req, res) => {
  const fingerprint = req.fingerprint.hash;
  const { id, username, email } = req.user;

  try {
    const allUsersMainInfo = await Users.findAll({
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
        allUsersMainInfo,
        accessToken,
        accessTokenExpiration: ACCESS_TOKEN_EXPIRATION,
      });
  } catch (err) {
    console.error(err.message);
  }
});

usersMainInfoRouter.post('/', async (req, res) => {
  const fingerprint = req.fingerprint.hash;
  const { id, username, email } = req.user;

  try {
    const { u_username, u_email, password, role } = req.body.usersMainInfo;

    const usersMainInfo = await Users.create({
      username: u_username,
      email: u_email,
      password,
      role,
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
        usersMainInfo,
        accessToken,
        accessTokenExpiration: ACCESS_TOKEN_EXPIRATION,
      });
  } catch (err) {
    console.error(err.message);
    return res.status(500).json(err);
  }
});

usersMainInfoRouter.post('/update/:u_id', async (req, res) => {
  const fingerprint = req.fingerprint.hash;
  const { id, username, email } = req.user;

  const { u_id, u_username, u_email, password, role } = req.body.usersMainInfo;

  try {
    //const {c_id} = req.params;
    const usersMainInfo = await Users.update(
      {
        username: u_username,
        email: u_email,
        password,
        role,
      },
      {
        where: {
          id: u_id,
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
      .json({
        usersMainInfo,
        accessToken,
        accessTokenExpiration: ACCESS_TOKEN_EXPIRATION,
      });
  } catch (err) {
    console.error(err.message);
    return res.status(500).json(err);
  }
});

module.exports = usersMainInfoRouter;
