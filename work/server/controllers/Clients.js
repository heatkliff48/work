const ClientsService = require('../services/Clients.js');
const { ErrorUtils } = require('../utils/Errors.js');
const myEmitter = require('../src/ee.js');
const { ADD_NEW_CLIENT_SOCKET } = require('../src/constants/event.js');

class ClientsController {
  static async getAllClients(req, res) {
    try {
      const { clients } = await ClientsService.getAllClients({});

      return res.status(200).json({ clients });
      // .cookie('refreshToken', refreshToken, COOKIE_SETTINGS.REFRESH_TOKEN)
      // .json({ clients, accessToken, accessTokenExpiration });
    } catch (err) {
      return ErrorUtils.catchError(res, err);
    }
  }

  static async addClient(req, res) {
    const new_client = req.body.client;

    try {
      const { client } = await ClientsService.addNewClient(
        new_client,
      );
      myEmitter.emit(ADD_NEW_CLIENT_SOCKET, client);
      return res.status(200); //.json({ client });
      // .cookie('refreshToken', refreshToken, COOKIE_SETTINGS.REFRESH_TOKEN)
      // .json({ client, accessToken, accessTokenExpiration })
    } catch (err) {
      return ErrorUtils.catchError(res, err);
    }
  }

  // static async delClient(req, res) {
  //   const { fingerprint } = req;
  //   const refreshToken = req.cookies.refreshToken;
  //   try {
  //     await ClientsService.logOut(refreshToken);

  //     return res.clearCookie('refreshToken').sendStatus(200);
  //   } catch (err) {
  //     return ErrorUtils.catchError(res, err);
  //   }
  // }
}

module.exports = ClientsController;
