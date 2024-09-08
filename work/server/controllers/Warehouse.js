const { ErrorUtils } = require('../utils/Errors.js');
const { COOKIE_SETTINGS } = require('../constants.js');
const WarehouseService = require('../services/Warehouse.js');

class WarehouseController {
  static async getAllWarehouse(req, res) {
    const fingerprint = req.fingerprint.hash;
    const { id, username, email } = req.session.user;
    try {
      const { warehouse, accessToken, refreshToken, accessTokenExpiration } =
        await WarehouseService.getAllWarehouse({ id, username, email, fingerprint });

      return res.status(200).json({ warehouse });
      // .cookie('refreshToken', refreshToken, COOKIE_SETTINGS.REFRESH_TOKEN)
      // .json({ warehouse, accessToken, accessTokenExpiration });
    } catch (err) {
      return ErrorUtils.catchError(res, err);
    }
  }

  static async getListOfOrderedProduction(req, res) {
    const fingerprint = req.fingerprint.hash;
    const { id, username, email } = req.session.user;
    try {
      const { orderedProduction, accessToken, refreshToken, accessTokenExpiration } =
        await WarehouseService.getListOfOrderedProduction({
          id,
          username,
          email,
          fingerprint,
        });

      return res.status(200).json({ orderedProduction });
      // .cookie('refreshToken', refreshToken, COOKIE_SETTINGS.REFRESH_TOKEN)
      // .json({ orderedProduction, accessToken, accessTokenExpiration });
    } catch (err) {
      return ErrorUtils.catchError(res, err);
    }
  }

  static async getListOfReservedProductsOEM(req, res) {
    const fingerprint = req.fingerprint.hash;
    const { id, username, email } = req.session.user;
    try {
      const {
        orderedProductionOEM,
        accessToken,
        refreshToken,
        accessTokenExpiration,
      } = await WarehouseService.getListOfReservedProductsOEM({
        id,
        username,
        email,
        fingerprint,
      });

      return res.status(200).json({ orderedProductionOEM });
      // .cookie('refreshToken', refreshToken, COOKIE_SETTINGS.REFRESH_TOKEN)
      // .json({ orderedProductionOEM, accessToken, accessTokenExpiration });
    } catch (err) {
      return ErrorUtils.catchError(res, err);
    }
  }

  static async getListOfReservedProducts(req, res) {
    const fingerprint = req.fingerprint.hash;
    const { id, username, email } = req.session.user;
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

      return res.status(200).json({ listOfReservedProducts });
      // .cookie('refreshToken', refreshToken, COOKIE_SETTINGS.REFRESH_TOKEN)
      // .json({ listOfReservedProducts, accessToken, accessTokenExpiration });
    } catch (err) {
      return ErrorUtils.catchError(res, err);
    }
  }

  static async addNewWarehouse(req, res) {
    const fingerprint = req.fingerprint.hash;
    const { id, username, email } = req.session.user;
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

      return res.status(200).json({ new_warehouse });
      // .cookie('refreshToken', refreshToken, COOKIE_SETTINGS.REFRESH_TOKEN)
      // .json({ new_warehouse, accessToken, accessTokenExpiration });
    } catch (err) {
      return ErrorUtils.catchError(res, err);
    }
  }

  static async addNewListOfOrderedProduction(req, res) {
    const fingerprint = req.fingerprint.hash;
    const { id, username, email } = req.session.user;
    const orderedProduction = req.body;

    try {
      const {
        accessToken,
        refreshToken,
        accessTokenExpiration,
        new_ordered_production,
      } = await WarehouseService.addNewListOfOrderedProduction({
        id,
        username,
        email,
        fingerprint,
        orderedProduction,
      });

      return res.status(200).json({ new_ordered_production });
      // .cookie('refreshToken', refreshToken, COOKIE_SETTINGS.REFRESH_TOKEN)
      // .json({ new_ordered_production, accessToken, accessTokenExpiration });
    } catch (err) {
      return ErrorUtils.catchError(res, err);
    }
  }

  static async addNewListOfOrderedProductionOEM(req, res) {
    const fingerprint = req.fingerprint.hash;
    const { id, username, email } = req.session.user;
    const orderedProductionOEM = req.body;

    try {
      const {
        accessToken,
        refreshToken,
        accessTokenExpiration,
        new_ordered_production_OEM,
      } = await WarehouseService.addNewListOfOrderedProductionOEM({
        id,
        username,
        email,
        fingerprint,
        orderedProductionOEM,
      });

      return res.status(200).json({ new_ordered_production_OEM });
      // .cookie('refreshToken', refreshToken, COOKIE_SETTINGS.REFRESH_TOKEN)
      // .json({ new_ordered_production_OEM, accessToken, accessTokenExpiration });
    } catch (err) {
      return ErrorUtils.catchError(res, err);
    }
  }

  static async updateRemainingStock(req, res) {
    const fingerprint = req.fingerprint.hash;
    const { id, username, email } = req.session.user;
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

      return res.status(200);
      // .cookie('refreshToken', refreshToken, COOKIE_SETTINGS.REFRESH_TOKEN)
      // .json({ accessToken, accessTokenExpiration })
    } catch (err) {
      return ErrorUtils.catchError(res, err);
    }
  }

  static async addNewReservedProducts(req, res) {
    const fingerprint = req.fingerprint.hash;
    const { id, username, email } = req.session.user;
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

      return res.status(200).json({ new_reserved_product });
      // .cookie('refreshToken', refreshToken, COOKIE_SETTINGS.REFRESH_TOKEN)
      // .json({ new_reserved_product, accessToken, accessTokenExpiration });
    } catch (err) {
      return ErrorUtils.catchError(res, err);
    }
  }

  static async deleteReservedProducts(req, res) {
    const fingerprint = req.fingerprint.hash;
    const { id, username, email } = req.session.user;
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

      return res.status(200);
      // .cookie('refreshToken', refreshToken, COOKIE_SETTINGS.REFRESH_TOKEN)
      // .json({ accessToken, accessTokenExpiration });
    } catch (err) {
      return ErrorUtils.catchError(res, err);
    }
  }
}

module.exports = WarehouseController;
