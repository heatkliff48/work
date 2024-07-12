'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ContactInfo extends Model {
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
  ContactInfo.init({
    first_name: {
      type: DataTypes.STRING,
    },
    last_name: {
      type: DataTypes.STRING,
    },
    address: {
      type: DataTypes.STRING,
    },
    formal_position: {
      type: DataTypes.STRING,
    },
    role_in_the_org: {
      type: DataTypes.STRING,
    },
    phone_number_office: {
      type: DataTypes.STRING,
    },
    phone_number_mobile: {
      type: DataTypes.STRING,
    },
    phone_number_messenger: {
      type: DataTypes.STRING,
    },
    email: {
      type: DataTypes.STRING,
    },
    linkedin: {
      type: DataTypes.STRING,
    },
    social: {
      type: DataTypes.STRING,
    },
  }, {
    sequelize,
    tableName: 'contact_info',
    modelName: 'ContactInfo',
  });
  return ContactInfo;
};