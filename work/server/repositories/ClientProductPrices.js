'use strict';

const {
  ClientProductPrices,
  Products,
  Clients,
  DeliveryAddresses,
} = require('../db/models');
const { BadRequest, NotFound } = require('../utils/Errors.js');
const { resolveClientProductPrice } = require('../services/clientProductPriceLookup.js');

const priceNumber = (value) => {
  const num = Number(String(value ?? '').replace(',', '.'));
  if (!Number.isFinite(num) || num < 0) {
    throw new BadRequest('Price is required');
  }
  return num;
};

class ClientProductPricesRepository {
  static async getAll() {
    return ClientProductPrices.findAll({ order: [['id', 'DESC']] });
  }

  static async findApplicable({ productId, clientId, projectId }) {
    const rows = await ClientProductPrices.findAll({
      where: {
        product_id: productId,
        client_id: clientId,
      },
    });
    return resolveClientProductPrice(rows, { productId, clientId, projectId });
  }

  static async create({ product_id, client_id, delivery_address_id, price }) {
    const productId = Number(product_id);
    const clientId = Number(client_id);
    if (!Number.isInteger(productId) || productId <= 0) {
      throw new BadRequest('Product is required');
    }
    if (!Number.isInteger(clientId) || clientId <= 0) {
      throw new BadRequest('Client is required');
    }
    const product = await Products.findByPk(productId);
    if (!product) throw new BadRequest('Product is required');
    const client = await Clients.findByPk(clientId);
    if (!client) throw new BadRequest('Client is required');

    let projectId = null;
    if (
      delivery_address_id != null &&
      delivery_address_id !== '' &&
      Number(delivery_address_id) !== 0
    ) {
      projectId = Number(delivery_address_id);
      if (!Number.isInteger(projectId) || projectId <= 0) {
        throw new BadRequest('Project is invalid');
      }
      const project = await DeliveryAddresses.findByPk(projectId);
      if (!project || Number(project.client_id) !== clientId) {
        throw new BadRequest('Project is invalid');
      }
    }

    return ClientProductPrices.create({
      product_id: productId,
      client_id: clientId,
      delivery_address_id: projectId,
      price: priceNumber(price),
    });
  }

  static async remove(id) {
    const rowId = Number(id);
    if (!Number.isInteger(rowId) || rowId <= 0) throw new NotFound('Price not found');
    const row = await ClientProductPrices.findByPk(rowId);
    if (!row) throw new NotFound('Price not found');
    await row.destroy();
    return rowId;
  }
}

module.exports = ClientProductPricesRepository;
