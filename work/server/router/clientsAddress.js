const clientsAddress = require('express').Router();
const { ClientLegalAddresses } = require('../db/models');
const TokenService = require('../services/Token.js');
const { ACCESS_TOKEN_EXPIRATION } = require('../constants.js');
const { COOKIE_SETTINGS } = require('../constants.js');
const myEmitter = require('../src/ee.js');
const {
  ADD_CLIENTS_LEGAL_ADDRESS_SOCKET,
  UPDATE_LEGAL_ADDRESS_SOCKET,
} = require('../src/constants/event.js');

clientsAddress.post('/', async (req, res) => {
  const fingerprint = req.fingerprint.hash;
  const { id, username, email } = req.session.user;

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
    } = req.body.legalAddress;

    const legalAddress = await ClientLegalAddresses.create({
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

    const { accessToken, refreshToken } = await TokenService.getTokens(
      payload,
      fingerprint
    );

    myEmitter.emit(ADD_CLIENTS_LEGAL_ADDRESS_SOCKET, legalAddress);
    return res.status(200).json({ legalAddress });
    // .cookie('refreshToken', refreshToken, COOKIE_SETTINGS.REFRESH_TOKEN)
    // .json({
    //   legalAddress,
    //   accessToken,
    //   accessTokenExpiration: ACCESS_TOKEN_EXPIRATION,
    // });
  } catch (err) {
    console.error(err.message);
  }
});

clientsAddress.get('/', async (req, res) => {
  const fingerprint = req.fingerprint.hash;
  const { id, username, email } = req.session.user;

  try {
    const legalAddress = await ClientLegalAddresses.findAll();

    const payload = { id, username, email };

    const { accessToken, refreshToken } = await TokenService.getTokens(
      payload,
      fingerprint
    );

    return res.status(200).json({ legalAddress });
    // .cookie('refreshToken', refreshToken, COOKIE_SETTINGS.REFRESH_TOKEN)
    // .json({
    //   legalAddress,
    //   accessToken,
    //   accessTokenExpiration: ACCESS_TOKEN_EXPIRATION,
    // });
  } catch (err) {
    console.error(err.message);
  }
});

clientsAddress.get('/:c_id', async (req, res) => {
  const fingerprint = req.fingerprint.hash;
  const { id, username, email } = req.session.user;

  try {
    const { c_id } = req.params;
    const legalAddress = await ClientLegalAddresses.findOne({
      where: {
        id: c_id,
      },
    });

    const payload = { id, username, email };

    const { accessToken, refreshToken } = await TokenService.getTokens(
      payload,
      fingerprint
    );

    return res.status(200).json({ legalAddress });
    // .cookie('refreshToken', refreshToken, COOKIE_SETTINGS.REFRESH_TOKEN)
    // .json({
    //   legalAddress,
    //   accessToken,
    //   accessTokenExpiration: ACCESS_TOKEN_EXPIRATION,
    // });
  } catch (err) {
    console.error(err.message);
  }
});

clientsAddress.post('/update/:c_id', async (req, res) => {
  const fingerprint = req.fingerprint.hash;
  const { id, username, email } = req.session.user;

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

    const legalAddress = await ClientLegalAddresses.update(
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
        returning: true,
        plain: true,
      }
    );

    const payload = { id, username, email };

    const { accessToken, refreshToken } = await TokenService.getTokens(
      payload,
      fingerprint
    );

    myEmitter.emit(UPDATE_LEGAL_ADDRESS_SOCKET, legalAddress);
    return res.status(200).json({ legalAddress });
    // .cookie('refreshToken', refreshToken, COOKIE_SETTINGS.REFRESH_TOKEN)
    // .json({
    //   legalAddress,
    //   accessToken,
    //   accessTokenExpiration: ACCESS_TOKEN_EXPIRATION,
    // });
  } catch (err) {
    console.error(err.message);
  }
});

module.exports = clientsAddress;
