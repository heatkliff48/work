const ClientsRepository = require('../repositories/Clients.js');

class ClientsService {
  static async getClientsPriceInfo() {
    const clientsPriceInfos = await ClientsRepository.getClientsPriceInfo();

    return clientsPriceInfos;
  }

  static async updClientsPriceInfo(updClient) {
      await ClientsRepository.updClientsPriceInfo(updClient);

    return 
  }
}

module.exports = ClientsService;
