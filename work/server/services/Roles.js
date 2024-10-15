const RolesRepository = require('../repositories/Roles.js');

class RolesService {
  static async getAllRoles() {
    const roles = await RolesRepository.getAllRolesData();
    return roles;
  }

  static async updateRoles({ updRole }) {
    const updRoleData = await RolesRepository.updateRolesData(updRole);

    return updRoleData;
  }

  static async updateActiveRoles({ updActiveRole }) {
    const updActiveRoleData = await RolesRepository.updateActiveRolesData(
      updActiveRole
    );

    return updActiveRoleData;
  }

  static async getPagesList() {
    const pages = await RolesRepository.getPagesListData();

    return pages;
  }
}

module.exports = RolesService;
