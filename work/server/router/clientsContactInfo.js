const clientsContactInfo = require("express").Router();
const { ContactInfos } = require("../db/models");
const { Clients } = require("../db/models");
const TokenService = require("../services/Token.js");
const { ACCESS_TOKEN_EXPIRATION } = require("../constants.js");
const { COOKIE_SETTINGS } = require("../constants.js");
const myEmitter = require("../src/ee.js");
const {
  ADD_CONTACT_INFO_SOCKET,
  UPDATE_CONTACT_INFO_SOCKET,
} = require("../src/constants/event.js");

clientsContactInfo.post("/", async (req, res) => {
  try {
    const {
      currentClientID,
      first_name,
      last_name,
      preffered_name,
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
      preffered_name,
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

clientsContactInfo.post("/bitrix-new-contact-info", async (req, res) => {
  try {
    const {
      bitrix_id,
      bitrix_client_id,
      first_name,
      last_name,
      preffered_name,
      address,
      formal_position,
      role_in_the_org,
      phone_number_office,
      phone_number_mobile,
      phone_number_messenger,
      email,
      linkedin,
      social,
    } = req.body;

    console.log(
      req.body,
      "req.body Post Bitrix --------------- clientsContactInfo.js line 79"
    );

    const client = await Clients.findOne({
      where: {
        bitrix_id: bitrix_client_id,
      },
    });

    const contactInfo = await ContactInfos.create({
      client_id: client.id,
      bitrix_id,
      bitrix_client_id,
      first_name,
      last_name,
      preffered_name,
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

    myEmitter.emit(ADD_CONTACT_INFO_SOCKET, contactInfo);
    return res.status(200).json({
      contact_info: contactInfo,
      id: contactInfo.id,
      bitrix_id,
      bitrix_client_id,
    });
  } catch (err) {
    console.error("Ошибка при добавлении клиента из Bitrix:", err.message);

    return res.status(500).json({
      error: "Внутренняя ошибка сервера",
      details: process.env.NODE_ENV === "development" ? err.message : undefined,
    });
  }
});

clientsContactInfo.post("/bitrix-update-contact-info", async (req, res) => {
  try {
    const {
      bitrix_id,
      bitrix_client_id,
      first_name,
      last_name,
      preffered_name,
      address,
      formal_position,
      role_in_the_org,
      phone_number_office,
      phone_number_mobile,
      phone_number_messenger,
      email,
      linkedin,
      social,
    } = req.body;

    console.log(
      req.body,
      "req.body Update Bitrix --------------- clientsContactInfo.js line 141"
    );

    const contactInfo = await ContactInfos.update(
      {
        first_name,
        last_name,
        preffered_name,
        address,
        formal_position,
        role_in_the_org,
        phone_number_office,
        phone_number_mobile,
        phone_number_messenger,
        email,
        linkedin,
        social,
      },
      {
        where: {
          bitrix_id,
          bitrix_client_id,
        },
        returning: true,
        plain: true,
      }
    );

    myEmitter.emit(UPDATE_CONTACT_INFO_SOCKET, contactInfo);
    return res.status(200).json({
      contact_info: contactInfo,
      id: contactInfo.id,
      bitrix_id,
      bitrix_client_id,
    });
  } catch (err) {
    console.error("Ошибка при обновлении клиента из Bitrix:", err.message);

    return res.status(500).json({
      error: "Внутренняя ошибка сервера",
      details: process.env.NODE_ENV === "development" ? err.message : undefined,
    });
  }
});

clientsContactInfo.get("/", async (req, res) => {
  try {
    const contactInfo = await ContactInfos.findAll();

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
