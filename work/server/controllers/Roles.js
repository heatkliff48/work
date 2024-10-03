const { ErrorUtils } = require('../utils/Errors.js');
const RolesService = require('../services/Roles.js');
const myEmitter = require('../src/ee.js');
const {
  UPDATE_ROLE_SOCKET,
  UPDATE_ROLE_ACTIVE_SOCKET,
} = require('../src/constants/event.js');

class RolesController {
  static async getAllRoles(req, res) {
    try {
      const roles = await RolesService.getAllRoles();

      return res.status(200).json({ roles });
    } catch (err) {
      return ErrorUtils.catchError(res, err);
    }
  }

  static async updateRoles(req, res) {
    const { updRole } = req.body;

    try {
      const updRoleData = await RolesService.updateRoles({updRole});

      myEmitter.emit(UPDATE_ROLE_SOCKET, updRoleData);

      return res.status(200);
    } catch (err) {
      return ErrorUtils.catchError(res, err);
    }
  }

  static async updateActiveRoles(req, res) {
    const { updActiveRole } = req.body;

    try {
      const updActiveRoleData = await RolesService.updateActiveRoles({updActiveRole});

      myEmitter.emit(UPDATE_ROLE_ACTIVE_SOCKET, updActiveRoleData);
      return res.status(200);
    } catch (err) {
      return ErrorUtils.catchError(res, err);
    }
  }

  static async getPagesList(req, res) {
    try {
      const pages = await RolesService.getPagesList();

      return res.status(200).json({ pages });
    } catch (err) {
      return ErrorUtils.catchError(res, err);
    }
  }
}

module.exports = RolesController;
