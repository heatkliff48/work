const { ErrorUtils } = require('../utils/Errors.js');
const { COOKIE_SETTINGS } = require('../constants.js');
const RolesService = require('../services/Roles.js');
const myEmitter = require('../src/ee.js');
const {
  UPDATE_ROLE_SOCKET,
  UPDATE_ROLE_ACTIVE_SOCKET,
} = require('../src/constants/event.js');

class RolesController {
  static async getAllRoles(req, res) {
    const fingerprint = req.fingerprint.hash;
    const { id, username, email } = req.session.user;

    try {
      const { accessToken, refreshToken, accessTokenExpiration, roles } =
        await RolesService.getAllRoles({ id, username, email, fingerprint });

      return res.status(200).json({ roles });
      // .cookie('refreshToken', refreshToken, COOKIE_SETTINGS.REFRESH_TOKEN)
      // .json({ roles, accessToken, accessTokenExpiration });
    } catch (err) {
      return ErrorUtils.catchError(res, err);
    }
  }

  static async updateRoles(req, res) {
    const fingerprint = req.fingerprint.hash;
    const { id, username, email } = req.session.user;
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

      myEmitter.emit(UPDATE_ROLE_SOCKET, updRoleData);

      return res.status(200);
      // .cookie('refreshToken', refreshToken, COOKIE_SETTINGS.REFRESH_TOKEN)
      // .json({ updRoleData, accessToken, accessTokenExpiration });
    } catch (err) {
      return ErrorUtils.catchError(res, err);
    }
  }

  static async updateActiveRoles(req, res) {
    const fingerprint = req.fingerprint.hash;
    const { id, username, email } = req.session.user;
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

      myEmitter.emit(UPDATE_ROLE_ACTIVE_SOCKET, updActiveRoleData);

      return res.status(200);
      // .cookie('refreshToken', refreshToken, COOKIE_SETTINGS.REFRESH_TOKEN)
      // .json({ updActiveRoleData, accessToken, accessTokenExpiration });
    } catch (err) {
      return ErrorUtils.catchError(res, err);
    }
  }

  static async getPagesList(req, res) {
    const fingerprint = req.fingerprint.hash;
    const { id, username, email } = req.session.user;
    try {
      const { accessToken, refreshToken, accessTokenExpiration, pages } =
        await RolesService.getPagesList({ id, username, email, fingerprint });

      return res.status(200).json({ pages });
      // .cookie('refreshToken', refreshToken, COOKIE_SETTINGS.REFRESH_TOKEN)
      // .json({ pages, accessToken, accessTokenExpiration });
    } catch (err) {
      return ErrorUtils.catchError(res, err);
    }
  }
}

module.exports = RolesController;
