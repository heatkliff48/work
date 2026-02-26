'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class QualityDimensions extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  QualityDimensions.init(
    {
      batch_id: DataTypes.STRING,
      sub_lote_id: DataTypes.STRING,
      largo_1: DataTypes.STRING,
      largo_2: DataTypes.STRING,
      largo_3: DataTypes.STRING,
      largo_4: DataTypes.STRING,
      ancho_1: DataTypes.STRING,
      ancho_2: DataTypes.STRING,
      ancho_3: DataTypes.STRING,
      ancho_4: DataTypes.STRING,
      altura_1: DataTypes.STRING,
      altura_2: DataTypes.STRING,
      altura_3: DataTypes.STRING,
      altura_4: DataTypes.STRING,
      support_face_parallelism_1: DataTypes.STRING,
      support_face_parallelism_2: DataTypes.STRING,
      support_face_parallelism_3: DataTypes.STRING,
      support_face_parallelism_4: DataTypes.STRING,
      diagonal_1: DataTypes.STRING,
      diagonal_2: DataTypes.STRING,
      diagonal_3: DataTypes.STRING,
      diagonal_4: DataTypes.STRING,
      flatness_1: DataTypes.STRING,
      flatness_2: DataTypes.STRING,
      flatness_3: DataTypes.STRING,
      flatness_4: DataTypes.STRING,
      angle_90_1: DataTypes.STRING,
      angle_90_2: DataTypes.STRING,
      angle_90_3: DataTypes.STRING,
      angle_90_4: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: 'QualityDimensions',
    },
  );
  return QualityDimensions;
};
