const { Aldabarans } = require('../db/models');

class AldabaranRepository {
  static async getAldabaran() {
    const aldabaran = await Aldabarans.findAll();

    return aldabaran;
  }

  static async createAldabaran(aldabaranData) {
    const { data, num } = aldabaranData;
    const currentAldabaran = await Aldabarans.create({
      data,
      num,
    });
    return currentAldabaran;
  }
}

module.exports = AldabaranRepository;
