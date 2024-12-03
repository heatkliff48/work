const { Roles, Pages, PageAndRoles } = require('../db/models');

class RolesRepository {
  static async getAllRolesData() {
    try {
      const roles = await Roles.findAll({
        include: {
          model: Pages,
          as: 'PageAndRolesArray',
        },
      });

      return roles;
    } catch (error) {
      console.log('>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>.error', error);
      return error;
    }
  }

  static async updateRolesData(updRole) {
    try {
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
    } catch (error) {
      console.log('>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>.error', error);
      return error;
    }
  }

  static async updateActiveRolesData(updActiveRole) {
    try {
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
    } catch (error) {
      console.log('>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>.error', error);
      return error;
    }
  }

  static async getPagesListData() {
    try {
      const pages = await Pages.findAll();
      return pages;
    } catch (error) {
      console.log('>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>.error', error);
      return error;
    }
  }
}

module.exports = RolesRepository;
