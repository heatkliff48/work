const productionBatchLogRouter = require('express').Router();
const { ProductionBatchLog } = require('../db/models');
const TokenService = require('../services/Token.js');
const RefreshSessionsRepository = require('../repositories/RefreshSession.js');
const { ACCESS_TOKEN_EXPIRATION } = require('../constants.js');
const { COOKIE_SETTINGS } = require('../constants.js');

productionBatchLogRouter.get('/', async (req, res) => {
  const fingerprint = req.fingerprint.hash;
  const { id, username, email } = req.session.user;

  try {
    const productionBatchLog = await ProductionBatchLog.findAll({
      order: [['id', 'ASC']],
    });

    const payload = { id, username, email };

    const { accessToken, refreshToken } = await TokenService.getTokens(
      payload,
      fingerprint
    );

    return res.status(200).json({ productionBatchLog });
    // .cookie('refreshToken', refreshToken, COOKIE_SETTINGS.REFRESH_TOKEN)
    // .json({
    //   productionBatchLog,
    //   accessToken,
    //   accessTokenExpiration: ACCESS_TOKEN_EXPIRATION,
    // });
  } catch (err) {
    console.error(err.message);
  }
});

productionBatchLogRouter.post('/', async (req, res) => {
  const fingerprint = req.fingerprint.hash;
  const { id, username, email } = req.session.user;

  const { products_article, orders_article, production_date } =
    req.body.productionBatchLog;

  try {
    const productionBatchLog = await ProductionBatchLog.create({
      products_article,
      orders_article,
      production_date,
    });

    const payload = { id, username, email };

    const { accessToken, refreshToken } = await TokenService.getTokens(
      payload,
      fingerprint
    );

    return res.status(200).json({ productionBatchLog });
    // .cookie('refreshToken', refreshToken, COOKIE_SETTINGS.REFRESH_TOKEN)
    // .json({
    //   productionBatchLog,
    //   accessToken,
    //   accessTokenExpiration: ACCESS_TOKEN_EXPIRATION,
    // });
  } catch (err) {
    console.error(err.message);
    return res.status(500).json(err);
  }
});

productionBatchLogRouter.post('/update/:l_id', async (req, res) => {
  const fingerprint = req.fingerprint.hash;
  const { id, username, email } = req.session.user;

  const { l_id, products_article, orders_article, production_date } =
    req.body.productionBatchLog;

  try {
    const productionBatchLog = await ProductionBatchLog.update(
      {
        products_article,
        orders_article,
        production_date,
      },
      {
        where: {
          id: l_id,
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

    return res.status(200).json({ productionBatchLog });
    // .cookie('refreshToken', refreshToken, COOKIE_SETTINGS.REFRESH_TOKEN)
    // .json({
    //   productionBatchLog,
    //   accessToken,
    //   accessTokenExpiration: ACCESS_TOKEN_EXPIRATION,
    // });
  } catch (err) {
    console.error(err.message);
    return res.status(500).json(err);
  }
});

module.exports = productionBatchLogRouter;
