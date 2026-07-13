const clientsRouter = require('express').Router();
const { Clients, Orders, sequelize } = require('../db/models');
const { ClientLegalAddresses } = require('../db/models');
const TokenService = require('../services/Token.js');
const { ACCESS_TOKEN_EXPIRATION } = require('../constants.js');
const { COOKIE_SETTINGS } = require('../constants.js');
const myEmitter = require('../src/ee.js');
const {
  ADD_NEW_CLIENT_SOCKET,
  UPDATE_CLIENT_SOCKET,
} = require('../src/constants/event.js');
const {
  ADD_CLIENTS_LEGAL_ADDRESS_SOCKET,
  UPDATE_LEGAL_ADDRESS_SOCKET,
} = require('../src/constants/event.js');

const multer = require('multer');
const axios = require('axios');
const qs = require('qs');

const upload = multer({ storage: multer.memoryStorage() }); // для хранения файла в памяти

const todayDate = () => {
  const date = new Date();
  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const year = date.getFullYear();

  return `${day}.${month}.${year}`;
};

clientsRouter.get('/', async (req, res) => {
  // const fingerprint = req.fingerprint.hash;
  // const { id, username, email } = req.session.user;

  try {
    const allClients = await Clients.findAll({
      order: [['id', 'ASC']],
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

clientsRouter.post('/', async (req, res) => {
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

clientsRouter.post('/bitrix-new-client', async (req, res) => {
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
      'req.body Post Bitrix -------------------- clients.js line 87',
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
    console.log('---');
    console.log(client, 'clients.js line 107');
    console.log('---');
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
    console.log('---');
    console.log(legalAddress, 'clients.js line 121');
    console.log('---');

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
    console.error('Error when adding a client from Bitrix:', err.message);

    // Обработка уникальных ошибок (например, дубликат CIF/VAT)
    // if (err.name === "SequelizeUniqueConstraintError") {
    //   return res.status(409).json({
    //     error: "Клиент с таким CIF/VAT уже существует",
    //     details: err.errors.map((e) => e.message),
    //   });
    // }

    return res.status(500).json({
      error: `Internal server error: ${err.message}`,
      details: process.env.NODE_ENV === 'development' ? err.message : undefined,
    });
  }
});

clientsRouter.get('/:id', async (req, res) => {
  try {
    const lastID = await Clients.findOne({
      attributes: ['id'],
      order: [['id', 'DESC']],
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

clientsRouter.post('/update/:c_id', async (req, res) => {
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
      },
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

clientsRouter.post('/bitrix-update-client', async (req, res) => {
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
    'req.body Update Bitrix -------------------- clients.js line 227',
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
      },
    );
    console.log('---');
    console.log(client, 'clients.js line 259');
    console.log('---');

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
        returning: true,
        plain: true,
      },
    );
    console.log('---');
    console.log(legalAddress, 'clients.js line 281');
    console.log('---');

    myEmitter.emit(UPDATE_CLIENT_SOCKET, client);
    myEmitter.emit(UPDATE_LEGAL_ADDRESS_SOCKET, legalAddress);
    return res.status(200).json({
      client: client,
      id: client[1].id, // ID в нашей базе
      bitrix_id,
    });
  } catch (err) {
    console.error('Error when adding a client from Bitrix:', err.message);

    return res.status(500).json({
      error: `Internal server error: ${err.message}`,
      details: process.env.NODE_ENV === 'development' ? err.message : undefined,
    });
  }
});

clientsRouter.post(
  '/bitrix-send-offer',
  upload.single('file'), // имя поля в FormData на фронте должно быть 'file'
  async (req, res) => {
    const t = await sequelize.transaction();

    try {
      const { deal_id, id, vatValue } = req.body;

      if (!req.file) {
        await t.rollback();
        return res.status(400).json({ error: 'Файл не был передан' });
      }

      if (!deal_id) {
        await t.rollback();
        return res.status(400).json({ error: 'Обязательное поле: deal_id' });
      }

      if (!id) {
        await t.rollback();
        return res.status(400).json({ error: 'Обязательное поле: id' });
      }

      // Блокируем строку заказа на время инкремента —
      // без этого при двух почти одновременных запросах оба могут
      // прочитать одно и то же старое значение UF_NUMBER_OFFER
      const order = await Orders.findByPk(id, {
        lock: t.LOCK.UPDATE,
        transaction: t,
      });

      if (!order) {
        await t.rollback();
        return res.status(404).json({ error: 'Заказ не найден' });
      }

      // Инкрементируем номер, который лежит в БД
      const newUfNumberOffer = (order.uf_number_offer || 0) + 1;

      await order.update(
        {
          deal_id,
          uf_number_offer: newUfNumberOffer,
        },
        { transaction: t },
      );

      await t.commit();

      // Строка, которая реально уходит в Bitrix: новый номер + "_" + артикул
      const ufNumberOfferForBitrix = `${newUfNumberOffer}_${order.article}`;

      // Кодируем файл в base64
      const fileBase64 = req.file.buffer.toString('base64');

      const today = todayDate();

      const postData = {
        secret: process.env.BITRIX_OFFER_SECRET, // тот самый secret из sendOffer.php — храним в .env, не в коде
        action: 'addOffer',
        data: {
          UF_DATE_OFFER: today,
          SUM: vatValue,
          DEAL_ID: Number(deal_id),
          UF_NUMBER_OFFER: ufNumberOfferForBitrix,
          FILES: [
            {
              name: req.file.originalname,
              content: fileBase64,
            },
          ],
        },
      };

      const bitrixResponse = await axios.post(
        'https://bx24.baublock.com/local/tools/importOffer.php',
        qs.stringify(postData),
        {
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          timeout: 60000,
        },
      );

      console.log(
        bitrixResponse.data,
        'bitrixResponse.data clients.js /bitrix-send-offer',
      );

      return res.status(200).json({
        httpCode: bitrixResponse.status,
        bitrixResponse: bitrixResponse.data,
        // Возвращаем актуальные значения на фронт — без вебсокетов,
        // прямо в ответе на этот же запрос
        deal_id,
        uf_number_offer: ufNumberOfferForBitrix,
      });
    } catch (err) {
      if (!t.finished) await t.rollback();

      console.error('Error sending offer to Bitrix:', err.message);

      return res.status(500).json({
        error: `Internal server error: ${err.message}`,
        details:
          process.env.NODE_ENV === 'development' ? err.message : undefined,
      });
    }
  },
);

module.exports = clientsRouter;
