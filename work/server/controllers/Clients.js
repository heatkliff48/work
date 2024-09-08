const ClientsService = require('../services/Clients.js');
const { ErrorUtils } = require('../utils/Errors.js');
const { COOKIE_SETTINGS } = require('../constants.js');

class ClientsController {
  static async getAllClients(req, res) {
    const fingerprint = req.fingerprint.hash;
    const { id, username, email } = req.body.user;
    try {
      const { accessToken, refreshToken, accessTokenExpiration, clients } =
        await ClientsService.getAllClients({ id, username, email, fingerprint });

      return res.status(200).json({ clients });
      // .cookie('refreshToken', refreshToken, COOKIE_SETTINGS.REFRESH_TOKEN)
      // .json({ clients, accessToken, accessTokenExpiration });
    } catch (err) {
      return ErrorUtils.catchError(res, err);
    }
  }

  static async addClient(req, res) {
    const fingerprint = req.fingerprint.hash;
    const { id, username, email } = req.body.user;
    const { client } = req.body;

    try {
      const { accessToken, refreshToken, accessTokenExpiration, client } =
        await ClientsService.addNewClient({
          id,
          username,
          email,
          fingerprint,
          client,
        });
      return res.status(200).json({ client });
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
