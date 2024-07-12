const { Roles, Pages, PageAndRoles } = require('../db/models');

class RolesRepository {
  static async getAllRolesData() {
    const roles = await Roles.findAll({
      include: {
        model: Pages,
        as: 'PageAndRolesArray',
      },
    });

    return roles;
  }

  static async updateRolesData(updRole) {
    const results = [];
    const { id: role_id, PageAndRolesArray } = updRole;

    for (const pageData of PageAndRolesArray) {
      const { id: page_id, PageAndRoles: pageAndRolesData } = pageData;

      // Проверяем, существует ли pageAndRolesData и имеет ли он свойства write и read
      const write =
        pageAndRolesData && typeof pageAndRolesData.write === 'boolean'
          ? pageAndRolesData.write
          : false;
      const read =
        pageAndRolesData && typeof pageAndRolesData.read === 'boolean'
          ? pageAndRolesData.read
          : false;

      const existingPageAndRoles = await PageAndRoles.findOne({
        where: { page_id, role_id },
      });

      let updRoleData;

      if (!existingPageAndRoles) {
        updRoleData = await PageAndRoles.create({
          page_id,
          role_id,
          write,
          read,
        });
      } else {
        [, updRoleData] = await PageAndRoles.update(
          { write, read },
          {
            where: { page_id, role_id },
            returning: true,
            plain: true,
          }
        );
      }

      results.push(updRoleData);
    }
    return results;
  }

  static async updateActiveRolesData(updActiveRole) {
    const updActiveRoleData = [];

    for (const updRole of updActiveRole) {
      const updatedRole = await Roles.update(updRole, {
        where: { id: updRole.id },
        returning: true,
        plain: true,
      });

      updActiveRoleData.push(updatedRole[1]); // Добавляем обновленную роль в массив
    }

    return updActiveRoleData;
  }

  static async getPagesListData() {
    const pages = await Pages.findAll();
    return pages;
  }
}

module.exports = RolesRepository;
