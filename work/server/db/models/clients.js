'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Clients extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({
      ClientLegalAddresses,
      DeliveryAddresses,
      ContactInfos,
      Orders,
    }) {
      // define association here
      this.hasMany(ClientLegalAddresses, { foreignKey: 'id' });
      this.hasMany(DeliveryAddresses, { foreignKey: 'client_id' });
      this.hasMany(ContactInfos, { foreignKey: 'client_id' });
      this.hasMany(Orders, { foreignKey: 'id' });
    }
  }
  Clients.init(
    {
      c_name: {
        type: DataTypes.STRING,
      },
      cif_vat: {
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
