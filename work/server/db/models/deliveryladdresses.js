'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class DeliverylAddresses extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({ ClientCards }) {
      this.belongsTo(ClientCards, { foreignKey: 'c_id' });

      // define association here
    }
  }
  DeliverylAddresses.init(
    {
      c_id: DataTypes.INTEGER,
      stret: DataTypes.STRING,
      additional_info: DataTypes.STRING,
      city: DataTypes.STRING,
      zip_code: DataTypes.INTEGER,
      province: DataTypes.STRING,
      country: DataTypes.STRING,
      phone_number: DataTypes.STRING,
      email: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: 'DeliverylAddresses',
    }
  );
  return DeliverylAddresses;
};
