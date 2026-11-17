'use strict';

const ClientProductPricesRepository = require('../repositories/ClientProductPrices.js');

class ClientProductPricesService {
  static getAll() {
    return ClientProductPricesRepository.getAll();
  }

  static create(body) {
    return ClientProductPricesRepository.create(body);
  }

  static remove(id) {
    return ClientProductPricesRepository.remove(id);
  }
}

module.exports = ClientProductPricesService;
