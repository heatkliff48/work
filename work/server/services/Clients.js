const ClientsRepository = require('../repositories/Clients.js');

class ClientsService {
  static async getAllClients() {
    const clients = await ClientsRepository.getAllClientsData();

    return {
      clients,
    };
  }

  static async addNewClient(client) {
    const clients = await ClientsRepository.addNewClientData(client);

    return {
      clients,
    };
  }
}

module.exports = ClientsService;
