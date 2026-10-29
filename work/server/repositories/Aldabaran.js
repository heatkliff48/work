const { Aldabarans } = require('../db/models');

class AldabaranRepository {
  static async getAldabaran() {
    const aldabaran = await Aldabarans.findAll();

    return aldabaran;
  }

  static async createAldabaran(aldabaranData) {
    const { data, num, agencia, matricula, referencia, order_id, trailer } =
      aldabaranData;
    const currentAldabaran = await Aldabarans.create({
      data,
      num,
      agencia,
      matricula,
      referencia,
      order_id,
      trailer,
    });
    return currentAldabaran;
  }
}

module.exports = AldabaranRepository;
