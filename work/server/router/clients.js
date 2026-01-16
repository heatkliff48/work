const clientsRouter = require("express").Router();
const { Clients } = require("../db/models");
const { ClientLegalAddresses } = require("../db/models");
const TokenService = require("../services/Token.js");
const { ACCESS_TOKEN_EXPIRATION } = require("../constants.js");
const { COOKIE_SETTINGS } = require("../constants.js");
const myEmitter = require("../src/ee.js");
const {
  ADD_NEW_CLIENT_SOCKET,
  UPDATE_CLIENT_SOCKET,
} = require("../src/constants/event.js");
const {
  ADD_CLIENTS_LEGAL_ADDRESS_SOCKET,
  UPDATE_LEGAL_ADDRESS_SOCKET,
} = require("../src/constants/event.js");

clientsRouter.get("/", async (req, res) => {
  // const fingerprint = req.fingerprint.hash;
  // const { id, username, email } = req.session.user;

  try {
    const allClients = await Clients.findAll({
      order: [["id", "ASC"]],
    });

    // const payload = { id, username, email };

    // const { accessToken, refreshToken } = await TokenService.getTokens(
    //   payload,
    //   fingerprint
    // );

    return res.status(200).json({ allClients });
    // .cookie('refreshToken', refreshToken, COOKIE_SETTINGS.REFRESH_TOKEN)
    // .json({
    //   allClients,
    //   accessToken,
    //   accessTokenExpiration: ACCESS_TOKEN_EXPIRATION,
    // });
  } catch (err) {
    console.error(err.message);
  }
});

clientsRouter.post("/", async (req, res) => {
  const { c_name, cif_vat, category, price_category } = req.body.client;

  try {
    const client = await Clients.create({
      c_name,
      cif_vat,
      category,
      price_category,
    });

    myEmitter.emit(ADD_NEW_CLIENT_SOCKET, client);
    return res.status(200);
  } catch (err) {
    console.error(err.message);
    return res.status(500).json(err);
  }
});

clientsRouter.post("/bitrix-new-client", async (req, res) => {
  try {
    // Для Bitrix данные могут приходить в разном формате
    // Вариант 1: Если Bitrix отправляет в req.body
    const {
      c_name,
      cif_vat,
      category,
      price_category,
      street,
      additional_info,
      city,
      zip_code,
      province,
      country,
      phone_office,
      fax,
      phone_mobile,
      web_link,
      email,
      bitrix_id,
    } = req.body;

    console.log(
      req.body,
      "req.body Post Bitrix -------------------- clients.js line 87"
    );

    // Проверка обязательных полей
    // if (!name || !cif_vat) {
    //   return res.status(400).json({
    //     error: "Обязательные поля: name и cif_vat",
    //   });
    // }

    // Создание клиента в базе данных
    const client = await Clients.create({
      c_name, // Преобразуем имя поля под нашу БД
      cif_vat,
      category,
      price_category,
      bitrix_id, // Сохраняем ID из Bitrix для связи
    });
    console.log(client, "clients.js line 107");
    const legalAddress = await ClientLegalAddresses.create({
      street,
      additional_info,
      city,
      zip_code,
      province,
      country,
      phone_office,
      fax,
      phone_mobile,
      web_link,
      email,
    });
    console.log(legalAddress, "clients.js line 121");

    // Отправляем событие в сокеты (если нужно)
    myEmitter.emit(ADD_NEW_CLIENT_SOCKET, client);
    myEmitter.emit(ADD_CLIENTS_LEGAL_ADDRESS_SOCKET, legalAddress);

    // Возвращаем успешный ответ
    return res.status(200).json({
      client: client,
      id: client.id, // ID в нашей базе
      bitrix_id,
    });
  } catch (err) {
    console.error("Ошибка при добавлении клиента из Bitrix:", err.message);

    // Обработка уникальных ошибок (например, дубликат CIF/VAT)
    // if (err.name === "SequelizeUniqueConstraintError") {
    //   return res.status(409).json({
    //     error: "Клиент с таким CIF/VAT уже существует",
    //     details: err.errors.map((e) => e.message),
    //   });
    // }

    return res.status(500).json({
      error: "Внутренняя ошибка сервера",
      details: process.env.NODE_ENV === "development" ? err.message : undefined,
    });
  }
});

clientsRouter.get("/:id", async (req, res) => {
  try {
    const lastID = await Clients.findOne({
      attributes: ["id"],
      order: [["id", "DESC"]],
    });

    return res.status(200).json({ lastID });
    // .cookie('refreshToken', refreshToken, COOKIE_SETTINGS.REFRESH_TOKEN)
    // .json({
    //   lastID,
    //   accessToken,
    //   accessTokenExpiration: ACCESS_TOKEN_EXPIRATION,
    // })

    // res.json(lastID);
  } catch (err) {
    console.error(err.message);
  }
});

clientsRouter.post("/update/:c_id", async (req, res) => {
  const { c_id, c_name, cif_vat, category, price_category } = req.body.client;

  try {
    //const {c_id} = req.params;
    const client = await Clients.update(
      {
        c_name,
        cif_vat,
        category,
        price_category,
      },
      {
        where: {
          id: c_id,
        },
        returning: true,
        plain: true,
      }
    );

    myEmitter.emit(UPDATE_CLIENT_SOCKET, client);
    return res.status(200); //.json({ client });

    // return (
    //   res
    //     // .cookie('refreshToken', refreshToken, COOKIE_SETTINGS.REFRESH_TOKEN)
    //     .status(200)
    //     .json({
    //       client,
    //       accessToken,
    //       accessTokenExpiration: ACCESS_TOKEN_EXPIRATION,
    //     })
    // );
  } catch (err) {
    console.error(err.message);
    return res.status(500).json(err);
  }
});

clientsRouter.post("/bitrix-update-client", async (req, res) => {
  const {
    c_name,
    cif_vat,
    category,
    price_category,
    street,
    additional_info,
    city,
    zip_code,
    province,
    country,
    phone_office,
    fax,
    phone_mobile,
    web_link,
    email,
    bitrix_id,
  } = req.body;

  console.log(
    req.body,
    "req.body Update Bitrix -------------------- clients.js line 227"
  );

  const oldClient = await Clients.findOne({
    where: {
      bitrix_id: bitrix_id,
    },
  });

  try {
    const client = await Clients.update(
      {
        c_name,
        cif_vat,
        category,
        price_category,
      },
      {
        where: {
          id: oldClient.id,
        },
        returning: true,
        plain: true,
      }
    );
    console.log(client, "clients.js line 259");

    const legalAddress = await ClientLegalAddresses.update(
      {
        street,
        additional_info,
        city,
        zip_code,
        province,
        country,
        phone_office,
        fax,
        phone_mobile,
        web_link,
        email,
      },
      {
        where: {
          id: oldClient.id,
        },
      }
    );
    console.log(legalAddress, "clients.js line 281");

    myEmitter.emit(UPDATE_CLIENT_SOCKET, client);
    myEmitter.emit(UPDATE_LEGAL_ADDRESS_SOCKET, legalAddress);
    return res.status(200).json({
      client: client,
      id: client.id, // ID в нашей базе
      bitrix_id,
    });
  } catch (err) {
    console.error("Ошибка при обновлении клиента из Bitrix:", err.message);

    return res.status(500).json({
      error: "Внутренняя ошибка сервера",
      details: process.env.NODE_ENV === "development" ? err.message : undefined,
    });
  }
});

module.exports = clientsRouter;
