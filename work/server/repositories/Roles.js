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

    console.log('>>>>>>>', updRole);

    const { id: role_id, PageAndRolesArray } = updRole;

    for (const pageData of PageAndRolesArray) {
      console.log('pageData', pageData);
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

      console.log('>>>>>>updateRolesData 2 <<<<<<', existingPageAndRoles);

      let updRoleData;

      if (!existingPageAndRoles) {
        updRoleData = await PageAndRoles.create({
          page_id,
          role_id,
          write,
          read,
        });
        console.log('>>>>>>updateRolesData 3 <<<<<<', updRoleData);
      } else {
        [, updRoleData] = await PageAndRoles.update(
          { write, read },
          {
            where: { page_id, role_id },
            returning: true,
            plain: true,
          }
        );
        console.log('>>>>>>updateRolesData 4 <<<<<<', updRoleData);
      }

      results.push(updRoleData);
    }
    console.log('>>>>>>>>>>>>>>>> RESULTS', results);
    return results;
  }

  static async getPagesListData() {
    const pages = await Pages.findAll();
    return pages;
  }
}

module.exports = RolesRepository;
