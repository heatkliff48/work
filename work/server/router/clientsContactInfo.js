const clientsContactInfo = require('express').Router();
const { ContactInfos } = require('../db/models');
const TokenService = require('../services/Token.js');
const { ACCESS_TOKEN_EXPIRATION } = require('../constants.js');
const { COOKIE_SETTINGS } = require('../constants.js');
const myEmitter = require('../src/ee.js');
const { ADD_CONTACT_INFO_SOCKET } = require('../src/constants/event.js');

clientsContactInfo.post('/', async (req, res) => {
  const fingerprint = req.fingerprint.hash;
  const { id, username, email } = req.session.user;

  try {
    const {
      currentClientID,
      first_name,
      last_name,
      address,
      formal_position,
      role_in_the_org,
      phone_number_office,
      phone_number_mobile,
      phone_number_messenger,
      email,
      linkedin,
      social,
    } = req.body.contactInfo;

    const contactInfo = await ContactInfos.create({
      client_id: currentClientID,
      first_name,
      last_name,
      address,
      formal_position,
      role_in_the_org,
      phone_number_office,
      phone_number_mobile,
      phone_number_messenger,
      email,
      linkedin,
      social,
    });

    const payload = { id, username, email };

    const { accessToken, refreshToken } = await TokenService.getTokens(
      payload,
      fingerprint
    );

    myEmitter.emit(ADD_CONTACT_INFO_SOCKET, contactInfo);
    return res.status(200).json({ contactInfo });
    // .cookie('refreshToken', refreshToken, COOKIE_SETTINGS.REFRESH_TOKEN)
    // .json({
    //   contactInfo,
    //   accessToken,
    //   accessTokenExpiration: ACCESS_TOKEN_EXPIRATION,
    // });
  } catch (err) {
    console.error(err.message);
  }
});

clientsContactInfo.get('/', async (req, res) => {
  const fingerprint = req.fingerprint.hash;
  const { id, username, email } = req.session.user;

  try {
    const contactInfo = await ContactInfos.findAll();
    const payload = { id, username, email };

    const { accessToken, refreshToken } = await TokenService.getTokens(
      payload,
      fingerprint
    );

    return res.status(200).json({ contactInfo });
    // .cookie('refreshToken', refreshToken, COOKIE_SETTINGS.REFRESH_TOKEN)
    // .json({
    //   contactInfo,
    //   accessToken,
    //   accessTokenExpiration: ACCESS_TOKEN_EXPIRATION,
    // });
  } catch (err) {
    console.error(err.message);
  }
});

module.exports = clientsContactInfo;
