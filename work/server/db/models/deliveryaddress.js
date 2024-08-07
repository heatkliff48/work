'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class DeliveryAddresses extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({ Clients,Orders }) {
      // define association here
      this.belongsTo(Clients, { foreignKey: 'id' })
      // this.hasMany(Orders, { foreignKey: 'id' })
    }
  }
  DeliveryAddresses.init({
    client_id: {
      allowNull: false,
      type: DataTypes.INTEGER
    },
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
    modelName: 'DeliveryAddresses',
  });
  return DeliveryAddresses;
};
