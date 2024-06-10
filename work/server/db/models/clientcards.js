'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ClientCards extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({ ClientLegalAddresses, ClientsInfos, DeliverylAddresses }) {
      this.hasMany(ClientLegalAddresses, { foreignKey: 'c_id' });
      this.hasMany(DeliverylAddresses, { foreignKey: 'c_id' });
      this.hasMany(ClientsInfos, { foreignKey: 'c_id' });
    }
  }
  ClientCards.init(
    {
      name: DataTypes.STRING,
      tin: DataTypes.STRING,
      category: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: 'ClientCards',
    }
  );
  return ClientCards;
};
