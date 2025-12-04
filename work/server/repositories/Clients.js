const { ClientsPriceInfos } = require('../db/models');

class ClientsRepository {
  static async getClientsPriceInfo() {
    const clientsPriceInfos = await ClientsPriceInfos.findAll();
    return clientsPriceInfos;
  }
  static async updClientsPriceInfo(client) {
    // const newClient = await ClientsPriceInfos.create(client);
    // return newClient;
  }
}

module.exports = ClientsRepository;
