'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ClientLegalAddress extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({ Client }) {
      // define association here
      this.belongsTo(Client, { foreignKey: 'id' })
    }
  }
  ClientLegalAddress.init({
    street: {
      type: DataTypes.STRING,
    },
    additional_info: {
      type: DataTypes.STRING,
    },
    city: {
      type: DataTypes.STRING,
    },
    zip_code: {
      type: DataTypes.INTEGER,
    },
    province: {
      type: DataTypes.STRING,
    },
    country: {
      type: DataTypes.STRING,
    },
    phone_number: {
      type: DataTypes.STRING,
    },
    email: {
      type: DataTypes.STRING,
    },
  }, {
    sequelize,
    tableName: 'clients_legal_address',
    modelName: 'ClientLegalAddress',
  });
  return ClientLegalAddress;
};