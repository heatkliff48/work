'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ContactInfos extends Model {
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
  ContactInfos.init(
    {
      client_id: {
        allowNull: false,
        type: DataTypes.INTEGER
      },
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
    },
    {
      sequelize,
      modelName: 'ContactInfos',
    }
  );
  return ContactInfos;
};
