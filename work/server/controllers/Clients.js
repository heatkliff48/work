const ClientsService = require('../services/Clients.js');
const { ErrorUtils } = require('../utils/Errors.js');
const myEmitter = require('../src/ee.js');
const { ADD_NEW_CLIENT_SOCKET } = require('../src/constants/event.js');

class ClientsController {
  static async getClientsPriceInfo(req, res) {
    try {
      const clientsPriceInfos = await ClientsService.getClientsPriceInfo();

      return res.status(200).json(clientsPriceInfos);
    } catch (err) {
      return ErrorUtils.catchError(res, err);
    }
  }

  static async updClientsPriceInfo(req, res) {
    const updClient = req.body;

    try {
      const updClientsPriceInfos = await ClientsService.addNewClient(updClient);

      // myEmitter.emit(ADD_NEW_CLIENT_SOCKET, updClientsPriceInfos);
      return res.status(200);
    } catch (err) {
      return ErrorUtils.catchError(res, err);
    }
  }
}

module.exports = ClientsController;
