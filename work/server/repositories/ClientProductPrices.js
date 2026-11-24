'use strict';

const { Op } = require('sequelize');
const {
  ClientProductPrices,
  Products,
  Clients,
  DeliveryAddresses,
} = require('../db/models');
const { BadRequest, NotFound } = require('../utils/Errors.js');
const { resolveOrderLinePrices } = require('../services/clientProductPriceLookup.js');

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
    return resolveOrderLinePrices(rows, { productId, clientId, projectId });
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
      const basePrice = await ClientProductPrices.findOne({
        where: {
          product_id: productId,
          client_id: clientId,
          delivery_address_id: null,
        },
      });
      if (!basePrice) {
        throw new BadRequest(
          'Add a price for this client and product without a project first',
        );
      }
    }

    return ClientProductPrices.create({
      product_id: productId,
      client_id: clientId,
      delivery_address_id: projectId,
      price: priceNumber(price),
    });
  }

  static async update(id, { price }) {
    const rowId = Number(id);
    if (!Number.isInteger(rowId) || rowId <= 0) throw new NotFound('Price not found');
    const row = await ClientProductPrices.findByPk(rowId);
    if (!row) throw new NotFound('Price not found');
    await row.update({ price: priceNumber(price) });
    return row;
  }

  static async remove(id) {
    const rowId = Number(id);
    if (!Number.isInteger(rowId) || rowId <= 0) throw new NotFound('Price not found');
    const row = await ClientProductPrices.findByPk(rowId);
    if (!row) throw new NotFound('Price not found');
    if (row.delivery_address_id == null) {
      const projectPrice = await ClientProductPrices.findOne({
        where: {
          product_id: row.product_id,
          client_id: row.client_id,
          delivery_address_id: { [Op.ne]: null },
        },
      });
      if (projectPrice) {
        throw new BadRequest(
          'Remove the project prices for this client and product first',
        );
      }
    }
    await row.destroy();
    return rowId;
  }
}

module.exports = ClientProductPricesRepository;
