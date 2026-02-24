'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class QualityManagement extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  QualityManagement.init(
    {
      batch_id: DataTypes.STRING,
      product_article: DataTypes.STRING,
      total_quantity_plan: DataTypes.INTEGER,
      reserved_quantity: DataTypes.INTEGER,
      reserved_quantity_allocated: DataTypes.INTEGER,
      reserved_quantity_remaining: DataTypes.INTEGER,
      free_quantity_fact: DataTypes.INTEGER,
      production_plan_id: DataTypes.INTEGER,
      sorting: DataTypes.INTEGER,
      raw_mat_cons_batch_id: DataTypes.INTEGER,
      id_ordered_product_to_warehouse: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: 'QualityManagement',
    },
  );
  return QualityManagement;
};
