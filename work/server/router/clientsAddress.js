const clientsAddress = require('express').Router();
const { ClientLegalAddress } = require('../db/models');
const TokenService = require('../services/Token.js');
const { ACCESS_TOKEN_EXPIRATION } = require('../constants.js');
const RefreshSessionsRepository = require('../repositories/RefreshSession.js');
const { COOKIE_SETTINGS } = require('../constants.js');

clientsAddress.post('/', async (req, res) => {
  const fingerprint = req.fingerprint.hash;
  const { id, username, email } = req.user;

  try {
    const {
      street,
      additional_info,
      city,
      zip_code,
      province,
      country,
      phone_number,
      email,
    } = req.body;

    const legalAddress = await ClientLegalAddress.create({
      street,
      additional_info,
      city,
      zip_code,
      province,
      country,
      phone_number,
      email,
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
        legalAddress,
        accessToken,
        accessTokenExpiration: ACCESS_TOKEN_EXPIRATION,
      });

  } catch (err) {
    console.error(err.message);
  }
});

clientsAddress.get('/', async (req, res) => {
  const fingerprint = req.fingerprint.hash;
  const { id, username, email } = req.user;

  try {
    const legalAddress = await ClientLegalAddress.findAll();

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
        legalAddress,
        accessToken,
        accessTokenExpiration: ACCESS_TOKEN_EXPIRATION,
      });

  } catch (err) {
    console.error(err.message);
  }
});

clientsAddress.get('/:c_id', async (req, res) => {
  const fingerprint = req.fingerprint.hash;
  const { id, username, email } = req.user;

  try {
    const { c_id } = req.params;
    const legalAddress = await ClientLegalAddress.findOne({
      where: {
        id: c_id,
      },
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
        legalAddress,
        accessToken,
        accessTokenExpiration: ACCESS_TOKEN_EXPIRATION,
      });

  } catch (err) {
    console.error(err.message);
  }
});

clientsAddress.post('/update/:c_id', async (req, res) => {
  const fingerprint = req.fingerprint.hash;
  const { id, username, email } = req.user;

  try {
    const {
      c_id,
      street,
      additional_info,
      city,
      zip_code,
      province,
      country,
      phone_number,
      c_email,
    } = req.body.legalAddress;

    const legalAddress = await ClientLegalAddress.update(
      {
        street,
        additional_info,
        city,
        zip_code,
        province,
        country,
        phone_number,
        email: c_email,
      },
      {
        where: {
          id: c_id,
        },
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
        legalAddress,
        accessToken,
        accessTokenExpiration: ACCESS_TOKEN_EXPIRATION,
      });
  } catch (err) {
    console.error(err.message);
  }
});

module.exports = clientsAddress;
