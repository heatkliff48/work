require('dotenv').config();
const AldabaranRepository = require('../repositories/Aldabaran.js');


class AldabaranService {
  static async getAldabaran() {
    const aldabaran = await AldabaranRepository.getAldabaran()

    return aldabaran
  }

  static async createAldabaran(data) {
    const currentAldabaran = await AldabaranRepository.createAldabaran(data);

    return currentAldabaran
  }
}

module.exports = AldabaranService;
