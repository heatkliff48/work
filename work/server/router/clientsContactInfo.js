const clientsContactInfo = require('express').Router();
const { ContactInfos, Clients, sequelize } = require('../db/models');
const TokenService = require('../services/Token.js');
const { ACCESS_TOKEN_EXPIRATION } = require('../constants.js');
const { COOKIE_SETTINGS } = require('../constants.js');
const myEmitter = require('../src/ee.js');
const {
  ADD_CONTACT_INFO_SOCKET,
  UPDATE_CONTACT_INFO_SOCKET,
} = require('../src/constants/event.js');

clientsContactInfo.post('/', async (req, res) => {
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

// Bitrix sends every company the contact belongs to in bitrix_client_id,
// separated by ";" (e.g. "12;34"). ContactInfos.client_id stays a single
// value, so the contact is stored once per client: the frontend filtering by
// client_id and orders.contact_id keep working unchanged.
const parseBitrixClientIds = (value) => {
  const raw = Array.isArray(value) ? value : String(value ?? '').split(';');
  const ids = raw
    .map((id) => String(id).trim())
    .filter(Boolean)
    .map(Number);

  if (ids.length === 0 || ids.some((id) => !Number.isInteger(id))) return null;
  return [...new Set(ids)];
};

// Creates the contact for clients it isn't stored for yet and updates the
// rest. Bitrix companies with no client here are skipped.
const syncBitrixContactInfo = async (req, res) => {
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
      `req.body ${req.path} Bitrix --------------- clientsContactInfo.js`,
    );

    const bitrixClientIds = parseBitrixClientIds(bitrix_client_id);

    if (!bitrix_id || !bitrixClientIds) {
      return res.status(400).json({
        error: `Invalid bitrix_id "${bitrix_id}" or bitrix_client_id "${bitrix_client_id}"`,
      });
    }

    const clients = await Clients.findAll({
      where: { bitrix_id: bitrixClientIds },
    });
    const foundBitrixIds = new Set(clients.map((client) => client.bitrix_id));
    const missingBitrixClientIds = bitrixClientIds.filter(
      (id) => !foundBitrixIds.has(id),
    );

    if (missingBitrixClientIds.length > 0) {
      console.warn(
        `Contact ${bitrix_id} from Bitrix: no clients for bitrix_client_id ${missingBitrixClientIds.join(
          ';',
        )}, skipped`,
      );
    }

    if (clients.length === 0) {
      return res.status(422).json({
        error: `Clients not found for bitrix_client_id: ${bitrix_client_id}`,
        missing_bitrix_client_ids: missingBitrixClientIds,
        bitrix_id,
        bitrix_client_id,
      });
    }

    const fields = {
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
    };

    const { created, updated } = await sequelize.transaction(
      async (transaction) => {
        const result = { created: [], updated: [] };

        for (const client of clients) {
          const existing = await ContactInfos.findOne({
            where: { bitrix_id, client_id: client.id },
            transaction,
          });

          if (existing) {
            result.updated.push(await existing.update(fields, { transaction }));
          } else {
            result.created.push(
              await ContactInfos.create(
                {
                  ...fields,
                  client_id: client.id,
                  bitrix_id,
                  bitrix_client_id: client.bitrix_id,
                },
                { transaction },
              ),
            );
          }
        }

        return result;
      },
    );

    created.forEach((contactInfo) =>
      myEmitter.emit(ADD_CONTACT_INFO_SOCKET, contactInfo),
    );
    // The client reducer reads the updated row from payload[1], the shape
    // Model.update({ returning: true, plain: true }) used to produce.
    updated.forEach((contactInfo) =>
      myEmitter.emit(UPDATE_CONTACT_INFO_SOCKET, [1, contactInfo]),
    );

    const contactInfos = [...created, ...updated];

    return res.status(200).json({
      contact_infos: contactInfos,
      ids: contactInfos.map((contactInfo) => contactInfo.id),
      missing_bitrix_client_ids: missingBitrixClientIds,
      bitrix_id,
      bitrix_client_id,
    });
  } catch (err) {
    console.error(
      'Error when syncing a contact info from Bitrix:',
      err.message,
    );

    return res.status(500).json({
      error: `Internal server error: ${err.message}`,
      details: process.env.NODE_ENV === 'development' ? err.message : undefined,
    });
  }
};

clientsContactInfo.post('/bitrix-new-contact-info', syncBitrixContactInfo);
clientsContactInfo.post('/bitrix-update-contact-info', syncBitrixContactInfo);

clientsContactInfo.get('/', async (req, res) => {
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
