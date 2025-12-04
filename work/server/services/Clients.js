const ClientsRepository = require('../repositories/Clients.js');

class ClientsService {
  static async getClientsPriceInfo() {
    const clientsPriceInfos = await ClientsRepository.getClientsPriceInfo();

    return clientsPriceInfos;
  }

  static async updClientsPriceInfo() {
   
  }
}

module.exports = ClientsService;
