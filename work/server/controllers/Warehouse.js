const { ErrorUtils } = require('../utils/Errors.js');
const { COOKIE_SETTINGS } = require('../constants.js');
const WarehouseService = require('../services/Warehouse.js');

class WarehouseController {
  static async getAllWarehouse(req, res) {
    const fingerprint = req.fingerprint.hash;
    const { id, username, email } = req.user;
    try {
      const { warehouse, accessToken, refreshToken, accessTokenExpiration } =
        await WarehouseService.getAllWarehouse({ id, username, email, fingerprint });

      return res
        .cookie('refreshToken', refreshToken, COOKIE_SETTINGS.REFRESH_TOKEN)
        .status(200)
        .json({ warehouse, accessToken, accessTokenExpiration });
    } catch (err) {
      return ErrorUtils.catchError(res, err);
    }
  }

  static async getListOfReservedProducts(req, res) {
    const fingerprint = req.fingerprint.hash;
    const { id, username, email } = req.user;
    try {
      const {
        listOfReservedProducts,
        accessToken,
        refreshToken,
        accessTokenExpiration,
      } = await WarehouseService.getListOfReservedProducts({
        id,
        username,
        email,
        fingerprint,
      });

      return res
        .cookie('refreshToken', refreshToken, COOKIE_SETTINGS.REFRESH_TOKEN)
        .status(200)
        .json({ listOfReservedProducts, accessToken, accessTokenExpiration });
    } catch (err) {
      return ErrorUtils.catchError(res, err);
    }
  }

  static async addNewWarehouse(req, res) {
    const fingerprint = req.fingerprint.hash;
    const { id, username, email } = req.user;
    const warehouse = req.body;

    try {
      const { accessToken, refreshToken, accessTokenExpiration, new_warehouse } =
        await WarehouseService.addNewWarehouse({
          id,
          username,
          email,
          fingerprint,
          warehouse,
        });

      return res
        .cookie('refreshToken', refreshToken, COOKIE_SETTINGS.REFRESH_TOKEN)
        .status(200)
        .json({ new_warehouse, accessToken, accessTokenExpiration });
    } catch (err) {
      return ErrorUtils.catchError(res, err);
    }
  }

  static async updateRemainingStock(req, res) {
    const fingerprint = req.fingerprint.hash;
    const { id, username, email } = req.user;
    const upd_rem_srock = req.body;

    try {
      const { accessToken, refreshToken, accessTokenExpiration } =
        await WarehouseService.updateRemainingStock({
          id,
          username,
          email,
          fingerprint,
          upd_rem_srock,
        });

      return res
        .cookie('refreshToken', refreshToken, COOKIE_SETTINGS.REFRESH_TOKEN)
        .status(200)
        .json({ accessToken, accessTokenExpiration });
    } catch (err) {
      return ErrorUtils.catchError(res, err);
    }
  }

  static async addNewReservedProducts(req, res) {
    const fingerprint = req.fingerprint.hash;
    const { id, username, email } = req.user;
    const reserved_product = req.body;

    try {
      const {
        accessToken,
        refreshToken,
        accessTokenExpiration,
        new_reserved_product,
      } = await WarehouseService.addNewReservedProducts({
        id,
        username,
        email,
        fingerprint,
        reserved_product,
      });

      return res
        .cookie('refreshToken', refreshToken, COOKIE_SETTINGS.REFRESH_TOKEN)
        .status(200)
        .json({ new_reserved_product, accessToken, accessTokenExpiration });
    } catch (err) {
      return ErrorUtils.catchError(res, err);
    }
  }

  static async deleteReservedProducts(req, res) {
    const fingerprint = req.fingerprint.hash;
    const { id, username, email } = req.user;
    const reserved_products_id = req.body;

    try {
      const { accessToken, refreshToken, accessTokenExpiration } =
        await WarehouseService.deleteReservedProducts({
          id,
          username,
          email,
          fingerprint,
          reserved_products_id,
        });

      return res
        .cookie('refreshToken', refreshToken, COOKIE_SETTINGS.REFRESH_TOKEN)
        .status(200)
        .json({ accessToken, accessTokenExpiration });
    } catch (err) {
      return ErrorUtils.catchError(res, err);
    }
  }
}

module.exports = WarehouseController;
