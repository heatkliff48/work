const deliveryAddress = require('express').Router();
const { DeliveryAddresses } = require('../db/models');
const TokenService = require('../services/Token.js');
const { ACCESS_TOKEN_EXPIRATION } = require('../constants.js');
const { COOKIE_SETTINGS } = require('../constants.js');
const myEmitter = require('../src/ee.js');
const { ADD_DELIVERY_ADDRESSES_SOCKET } = require('../src/constants/event.js');

deliveryAddress.post('/', async (req, res) => {
  try {
    const {
      currentClientID,
      street,
      additional_info,
      city,
      zip_code,
      province,
      country,
      phone_number,
      email,
    } = req.body.deliveryAddress;

    const deliveryAddress = await DeliveryAddresses.create({
      client_id: currentClientID,
      street,
      additional_info,
      city,
      zip_code,
      province,
      country,
      phone_number,
      email,
    });

    myEmitter.emit(ADD_DELIVERY_ADDRESSES_SOCKET, deliveryAddress);
    return res.status(200).json({ deliveryAddress });
    // .cookie('refreshToken', refreshToken, COOKIE_SETTINGS.REFRESH_TOKEN)
    // .json({
    //   deliveryAddress,
    //   accessToken,
    //   accessTokenExpiration: ACCESS_TOKEN_EXPIRATION,
    // });
  } catch (err) {
    console.error(err.message);
  }
});

deliveryAddress.get('/', async (req, res) => {
  try {
    const deliveryAddresses = await DeliveryAddresses.findAll();

    return res.status(200).json({ deliveryAddresses });
    // .cookie('refreshToken', refreshToken, COOKIE_SETTINGS.REFRESH_TOKEN)
    // .json({
    //   deliveryAddresses,
    //   accessToken,
    //   accessTokenExpiration: ACCESS_TOKEN_EXPIRATION,
    // });
  } catch (err) {
    console.error(err.message);
  }
});

module.exports = deliveryAddress;
