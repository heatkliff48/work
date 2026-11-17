'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class ClientProductPrices extends Model {
    static associate() {}
  }
  ClientProductPrices.init(
    {
      product_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      client_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      delivery_address_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      price: {
        type: DataTypes.FLOAT,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: 'ClientProductPrices',
      tableName: 'ClientProductPrices',
    },
  );
  return ClientProductPrices;
};
