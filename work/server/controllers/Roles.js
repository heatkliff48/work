const { ErrorUtils } = require('../utils/Errors.js');
const { COOKIE_SETTINGS } = require('../constants.js');
const RolesService = require('../services/Roles.js');

class RolesController {
  static async getAllRoles(req, res) {
    const fingerprint = req.fingerprint.hash;
    const { id, username, email } = req.user;

    try {
      const { accessToken, refreshToken, accessTokenExpiration, roles } =
        await RolesService.getAllRoles({ id, username, email, fingerprint });

      return res
        .cookie('refreshToken', refreshToken, COOKIE_SETTINGS.REFRESH_TOKEN)
        .status(200)
        .json({ roles, accessToken, accessTokenExpiration });
    } catch (err) {
      return ErrorUtils.catchError(res, err);
    }
  }

  static async updateRoles(req, res) {
    const fingerprint = req.fingerprint.hash;
    const { id, username, email } = req.user;
    const { updRole } = req.body;

    try {
      const { accessToken, refreshToken, accessTokenExpiration, updRoleData } =
        await RolesService.updateRoles({
          id,
          username,
          email,
          fingerprint,
          updRole,
        });

      return res
        .cookie('refreshToken', refreshToken, COOKIE_SETTINGS.REFRESH_TOKEN)
        .status(200)
        .json({ updRoleData, accessToken, accessTokenExpiration });
    } catch (err) {
      return ErrorUtils.catchError(res, err);
    }
  }

  static async updateActiveRoles(req, res) {
    const fingerprint = req.fingerprint.hash;
    const { id, username, email } = req.user;
    const { updActiveRole } = req.body;

    try {
      const { accessToken, refreshToken, accessTokenExpiration, updActiveRoleData } =
        await RolesService.updateActiveRoles({
          id,
          username,
          email,
          fingerprint,
          updActiveRole,
        });

      return res
        .cookie('refreshToken', refreshToken, COOKIE_SETTINGS.REFRESH_TOKEN)
        .status(200)
        .json({ updActiveRoleData, accessToken, accessTokenExpiration });
    } catch (err) {
      return ErrorUtils.catchError(res, err);
    }
  }

  static async getPagesList(req, res) {
    const fingerprint = req.fingerprint.hash;
    const { id, username, email } = req.user;
    try {
      const { accessToken, refreshToken, accessTokenExpiration, pages } =
        await RolesService.getPagesList({ id, username, email, fingerprint });

      return res
        .cookie('refreshToken', refreshToken, COOKIE_SETTINGS.REFRESH_TOKEN)
        .status(200)
        .json({ pages, accessToken, accessTokenExpiration });
    } catch (err) {
      return ErrorUtils.catchError(res, err);
    }
  }
}

module.exports = RolesController;
