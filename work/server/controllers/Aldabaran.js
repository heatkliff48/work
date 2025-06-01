const AldabaranService = require('../services/Aldabaran.js');
const myEmitter = require('../src/ee.js');
const { ADD_NEW_ALDABARAN_SOCKET } = require('../src/constants/event.js');
const { ErrorUtils } = require('../utils/Errors.js');

class AldabaranController {
  static async getAldabaran(req, res) {
    try {
      const aldabaran = await AldabaranService.getAldabaran();

      return res.status(200).json(aldabaran);
    } catch (err) {
      return ErrorUtils.catchError(res, err);
    }
  }

  static async createAldabaran(req, res) {
    const data = req.body;

    try {
      const currentAldabaran = await AldabaranService.createAldabaran(data);
      myEmitter.emit(ADD_NEW_ALDABARAN_SOCKET, currentAldabaran);
      return res.status(200);
    } catch (err) {
      return ErrorUtils.catchError(res, err);
    }
  }
}

module.exports = AldabaranController;
