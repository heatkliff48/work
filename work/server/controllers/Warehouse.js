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
}

module.exports = WarehouseController;
