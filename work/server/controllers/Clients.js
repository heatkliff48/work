const ClientsService = require('../services/Clients.js');
const { ErrorUtils } = require('../utils/Errors.js');
const myEmitter = require('../src/ee.js');
const { NEED_UPD_CONTACT_PRICE_INFO_SOCKET } = require('../src/constants/event.js');

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
      await ClientsService.updClientsPriceInfo(updClient);

      myEmitter.emit(NEED_UPD_CONTACT_PRICE_INFO_SOCKET, updClient);
      return res.status(200);
    } catch (err) {
      return ErrorUtils.catchError(res, err);
    }
  }
}

module.exports = ClientsController;
