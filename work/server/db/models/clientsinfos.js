'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ClientsInfos extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({ Clients }) {
      this.belongsTo(Clients, { foreignKey: 'c_id' });
    }
  }
  ClientsInfos.init(
    {
      c_id: DataTypes.INTEGER,
      first_name: DataTypes.STRING,
      last_name: DataTypes.STRING,
      address: DataTypes.STRING,
      formal_position: DataTypes.STRING,
      role_in_the_org: DataTypes.STRING,
      phone_number_office: DataTypes.STRING,
      phone_number_mobile: DataTypes.STRING,
      phone_number_messenger: DataTypes.STRING,
      email: DataTypes.STRING,
      linkedin: DataTypes.STRING,
      social: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: 'ClientsInfos',
    }
  );
  return ClientsInfos;
};
