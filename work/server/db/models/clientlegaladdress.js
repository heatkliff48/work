'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ClientLegalAddresses extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({ Clients }) {
      // define association here
      this.belongsTo(Clients, { foreignKey: 'id' });
    }
  }
  ClientLegalAddresses.init(
    {
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
      phone_office: {
        type: DataTypes.STRING,
      },
      fax: {
        type: DataTypes.STRING,
      },
      phone_mobile: {
        type: DataTypes.STRING,
      },
      web_link: {
        type: DataTypes.STRING,
      },
      email: {
        type: DataTypes.STRING,
      },
    },
    {
      sequelize,
      modelName: 'ClientLegalAddresses',
    }
  );
  return ClientLegalAddresses;
};
