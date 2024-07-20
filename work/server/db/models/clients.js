'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Clients extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({ ClientLegalAddress, DeliveryAddress, ContactInfo }) {
      // define association here
      this.hasMany(ClientLegalAddress, { foreignKey: 'id' });
      this.hasMany(DeliveryAddress, { foreignKey: 'id' });
      this.hasMany(ContactInfo, { foreignKey: 'id' });
    }
  }
  Clients.init(
    {
      c_name: {
        type: DataTypes.STRING,
      },
      tin: {
        type: DataTypes.STRING,
      },
      category: {
        type: DataTypes.STRING,
      },
    },
    {
      sequelize,
      modelName: 'Clients',
    }
  );
  return Clients;
};
