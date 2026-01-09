'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class LotesList extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  LotesList.init(
    {
      cake_id: DataTypes.INTEGER,
      cake_id_finish: DataTypes.INTEGER,
      production_date: DataTypes.STRING,
      product: DataTypes.STRING,
      recipe: DataTypes.STRING,
      quantity_cakes: DataTypes.INTEGER,
      warehouse_id: DataTypes.STRING,
      custom_recipe: DataTypes.BOOLEAN,
      sand_dry: DataTypes.STRING,
      sand_slurry_dry: DataTypes.STRING,
      lime: DataTypes.STRING,
      cement: DataTypes.STRING,
      gypsum_dry: DataTypes.STRING,
      return_dry: DataTypes.STRING,
      gypsum_stone: DataTypes.STRING,
      aluminum_paste: DataTypes.STRING,
      aluminum_paste_2: DataTypes.STRING,
      grinding_balls: DataTypes.STRING,
      aac: DataTypes.STRING,
      casting_temperature: DataTypes.STRING,
      w_s: DataTypes.STRING,
      mixing_time_before_al: DataTypes.STRING,
      mixing_time_with_al: DataTypes.STRING,
      dosing_order: DataTypes.STRING,
      delay_before_dosing_to_the_mixer: DataTypes.STRING,
      mixer_speed: DataTypes.STRING,
      temperature_in_the_factory: DataTypes.STRING,
      temperature_in_the_precuring_chamber: DataTypes.STRING,
      density_of_the_sand_slurry: DataTypes.STRING,
      density_of_the_return: DataTypes.STRING,
      fines_of_the_sand: DataTypes.STRING,
      so3_content: DataTypes.STRING,
      lime_activity: DataTypes.STRING,
      lime_type: DataTypes.STRING,
      cement_type: DataTypes.STRING,
      al_paste_producer: DataTypes.STRING,
      al_paste_type: DataTypes.STRING,
      al_paste_proportion: DataTypes.STRING,
      sand_type: DataTypes.STRING,
      gypsum_type: DataTypes.STRING,
      cake_height: DataTypes.STRING,
      cutting_temperature: DataTypes.STRING,
      plasticity: DataTypes.STRING,
      surface_of_the_cake: DataTypes.STRING,
      reaction_precuring_chamber: DataTypes.STRING,
      precuring_time: DataTypes.STRING,
      delays_before_autoclaving: DataTypes.STRING,
      rising_cracks: DataTypes.STRING,
      mechanical_cracks: DataTypes.STRING,
      dimensional_error: DataTypes.STRING,
      broken_corners_blocks_on_the_cutting_line: DataTypes.STRING,
      problems_after_autoclaving: DataTypes.STRING,
      autoclaving_cycle: DataTypes.STRING,
      compressive_strength_of_the_end_product: DataTypes.STRING,
      density_of_the_end_product: DataTypes.STRING,
      issues_with_equipment_mixer: DataTypes.STRING,
      issues_with_equipment_cutting_line: DataTypes.STRING,
      issues_with_equipment_green_line: DataTypes.STRING,
      issues_with_equipment_separation_table: DataTypes.STRING,
      issues_with_equipment_autoclave: DataTypes.STRING,
      issues_with_equipment_white_line: DataTypes.STRING,
      issues_with_equipment_packing_line: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: 'LotesList',
    }
  );
  return LotesList;
};
