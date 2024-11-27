const AutoclaveService = require('../services/Autoclave.js');
const { ErrorUtils } = require('../utils/Errors.js');

class AutoclaveController {
  static async getAutoclave(req, res) {
    try {
      const autoclave = await AutoclaveService.getAutoclave();

      return res.status(200).json(autoclave);
    } catch (err) {
      return ErrorUtils.catchError(res, err);
    }
  }

  static async saveAutoclave(req, res) {
    try {
      await AutoclaveService.saveAutoclave(req.body);

      return res.status(200);
    } catch (err) {
      return ErrorUtils.catchError(res, err);
    }
  }

  static async updateAutoclave(req, res) {
    try {
      const newAutoclave = await AutoclaveService.updateAutoclave(req.body);

      return res.json(newAutoclave).status(200);
    } catch (err) {
      return ErrorUtils.catchError(res, err);
    }
  }
}

module.exports = AutoclaveController;
