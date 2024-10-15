const AutoclavesRepository = require('../repositories/Autoclave');

require('dotenv').config();

class AutoclaveService {
  static async getAutoclave() {
    const autoclave = await AutoclavesRepository.getAutoclave();

    return autoclave;
  }

  static async saveAutoclave(autoclave) {
    await AutoclavesRepository.saveAutoclave(autoclave);

    return;
  }
}

module.exports = AutoclaveService;
