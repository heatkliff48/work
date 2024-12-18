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

  static async updateAutoclave(list_of_order_id) {
    const newAutoclave = await AutoclavesRepository.updateAutoclave(list_of_order_id);

    return newAutoclave;
  }
}

module.exports = AutoclaveService;
