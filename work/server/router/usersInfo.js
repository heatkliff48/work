const usersInfoRouter = require('express').Router();
const { UsersInfo } = require('../db/models/index.js');
const TokenService = require('../services/Token.js');
const RefreshSessionsRepository = require('../repositories/RefreshSession.js');
const { ACCESS_TOKEN_EXPIRATION } = require('../constants.js');
const { COOKIE_SETTINGS } = require('../constants.js');

usersInfoRouter.get('/', async (req, res) => {
  const fingerprint = req.fingerprint.hash;
  const { id, username, email } = req.user;

  try {
    const allUsersInfo = await UsersInfo.findAll({
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
        allUsersInfo,
        accessToken,
        accessTokenExpiration: ACCESS_TOKEN_EXPIRATION,
      });
  } catch (err) {
    console.error(err.message);
  }
});

usersInfoRouter.post('/', async (req, res) => {
  const fingerprint = req.fingerprint.hash;
  const { id, username, email } = req.user;

  try {
    const { fullName, group, shift, subdivision, phone } = req.body.usersInfo;

    const usersInfo = await UsersInfo.create({
      fullName,
      group,
      shift,
      subdivision,
      phone,
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
        usersInfo,
        accessToken,
        accessTokenExpiration: ACCESS_TOKEN_EXPIRATION,
      });
  } catch (err) {
    console.error(err.message);
    return res.status(500).json(err);
  }
});

usersInfoRouter.post('/update/:u_id', async (req, res) => {
  const fingerprint = req.fingerprint.hash;
  const { id, username, email } = req.user;

  const { u_id, fullName, group, shift, subdivision, phone } = req.body.usersInfo;

  try {
    //const {c_id} = req.params;
    const usersInfo = await UsersInfo.update(
      {
        fullName,
        group,
        shift,
        subdivision,
        phone,
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
        usersInfo,
        accessToken,
        accessTokenExpiration: ACCESS_TOKEN_EXPIRATION,
      });
  } catch (err) {
    console.error(err.message);
    return res.status(500).json(err);
  }
});

module.exports = usersInfoRouter;
