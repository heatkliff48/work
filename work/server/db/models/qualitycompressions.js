'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class QualityCompressions extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  QualityCompressions.init(
    {
      batch_id: DataTypes.STRING,
      sub_lote_id: DataTypes.STRING,
      dimension_id: DataTypes.STRING,
      weight_after_autoclave: DataTypes.STRING,
      weight_after_50c: DataTypes.STRING,
      weight_after_105c: DataTypes.STRING,
      load_kn: DataTypes.STRING,
      length: DataTypes.STRING,
      width: DataTypes.STRING,
      height: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: 'QualityCompressions',
    },
  );
  return QualityCompressions;
};
