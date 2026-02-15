const deliveryAddress = require('express').Router();
const { DeliveryAddresses } = require('../db/models');
const { Clients } = require('../db/models');
const TokenService = require('../services/Token.js');
const { ACCESS_TOKEN_EXPIRATION } = require('../constants.js');
const { COOKIE_SETTINGS } = require('../constants.js');
const myEmitter = require('../src/ee.js');
const {
  ADD_DELIVERY_ADDRESSES_SOCKET,
  UPDATE_DELIVERY_ADDRESSES_SOCKET,
} = require('../src/constants/event.js');

deliveryAddress.post('/', async (req, res) => {
  try {
    const {
      currentClientID,
      project_name,
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
      project_name,
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

deliveryAddress.post('/bitrix-new-delivery-address', async (req, res) => {
  try {
    const {
      bitrix_id,
      bitrix_client_id,
      project_name,
      street,
      additional_info,
      city,
      zip_code,
      province,
      country,
      phone_number,
      email,
    } = req.body;

    console.log(
      req.body,
      'req.body Post Bitrix ------------- deliveryAddress.js line 70',
    );

    const client = await Clients.findOne({
      where: {
        bitrix_id: bitrix_client_id,
      },
    });

    const deliveryAddress = await DeliveryAddresses.create({
      client_id: client.id,
      bitrix_id,
      bitrix_client_id,
      project_name,
      street,
      additional_info,
      city,
      zip_code,
      province,
      country,
      phone_number,
      email,
    });

    console.log('---');
    console.log(deliveryAddress, 'contactInfo clientsContactInfo.js line 97');
    console.log('---');

    myEmitter.emit(ADD_DELIVERY_ADDRESSES_SOCKET, deliveryAddress);
    return res.status(200).json({
      delivery_address: deliveryAddress,
      id: deliveryAddress.id,
      bitrix_id,
      bitrix_client_id,
    });
  } catch (err) {
    console.error('Ошибка при добавлении клиента из Bitrix:', err.message);

    return res.status(500).json({
      error: 'Внутренняя ошибка сервера',
      details: process.env.NODE_ENV === 'development' ? err.message : undefined,
    });
  }
});

deliveryAddress.post('/bitrix-update-delivery-address', async (req, res) => {
  try {
    const {
      bitrix_id,
      bitrix_client_id,
      project_name,
      street,
      additional_info,
      city,
      zip_code,
      province,
      country,
      phone_number,
      email,
    } = req.body;

    console.log(
      req.body,
      'req.body Update Bitrix ------------- deliveryAddress.js line 131',
    );

    const deliveryAddress = await DeliveryAddresses.update(
      {
        project_name,
        street,
        additional_info,
        city,
        zip_code,
        province,
        country,
        phone_number,
        email,
      },
      {
        where: {
          bitrix_id,
          bitrix_client_id,
        },
        returning: true,
        plain: true,
      },
    );

    console.log('---');
    console.log(deliveryAddress, 'contactInfo clientsContactInfo.js line 161');
    console.log('---');

    myEmitter.emit(UPDATE_DELIVERY_ADDRESSES_SOCKET, deliveryAddress);
    return res.status(200).json({
      delivery_address: deliveryAddress,
      id: deliveryAddress[1].id,
      bitrix_id,
      bitrix_client_id,
    });
  } catch (err) {
    console.error('Ошибка при обновлении клиента из Bitrix:', err.message);

    return res.status(500).json({
      error: 'Внутренняя ошибка сервера',
      details: process.env.NODE_ENV === 'development' ? err.message : undefined,
    });
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
