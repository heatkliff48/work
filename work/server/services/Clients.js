const TokenService = require('./Token.js');
const { ACCESS_TOKEN_EXPIRATION } = require('../constants.js');
const ClientsRepository = require('../repositories/Clients.js');

class ClientsService {
  static async getAllClients({ id, username, email, fingerprint }) {
    const clients = await ClientsRepository.getAllClientsData();
    const payload = { id, username, email };

    const { accessToken, refreshToken } = await TokenService.getTokens(
      payload,
      fingerprint
    );

    return {
      clients,
      accessToken,
      refreshToken,
      accessTokenExpiration: ACCESS_TOKEN_EXPIRATION,
    };
  }

  static async addNewClient({ id, username, email, fingerprint, client }) {
    const clients = await ClientsRepository.addNewClientData(client);
    const payload = { id, username, email };

    const { accessToken, refreshToken } = await TokenService.getTokens(
      payload,
      fingerprint
    );

    return {
      clients,
      accessToken,
      refreshToken,
      accessTokenExpiration: ACCESS_TOKEN_EXPIRATION,
    };
  }
}

module.exports = ClientsService;
