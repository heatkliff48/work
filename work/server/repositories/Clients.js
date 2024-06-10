const { ClientCards } = require('../db/models');

class ClientssRepository {
  static async getAllClientsData() {
    const clients = await ClientCards.findAll();
    return clients;
  }
  static async addNewClientData(client) {
    const newClient = await ClientCards.create(client);
    return newClient;
  }
}

module.exports = ClientssRepository;
