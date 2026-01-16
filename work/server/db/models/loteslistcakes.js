'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class LotesListsCakes extends Model {
    static associate(models) {
      // define association here
    }
  }

  LotesListsCakes.init(
    {
      no_alcanza_altura: DataTypes.TEXT,
      marcas_de_medidicion_de_plasticidad: DataTypes.TEXT,
      superficie_irregular: DataTypes.TEXT,
      se_aprecian_manchas_grises: DataTypes.TEXT,
      se_aprecian_manchas_marrones: DataTypes.TEXT,
      se_aprecian_incrustaciones: DataTypes.TEXT,
      color_de_bloques_no_uniforme: DataTypes.TEXT,
      manchas_de_goteo: DataTypes.TEXT,
      se_aprecian_huecos: DataTypes.TEXT,
      marcas_de_mesa_de_separacion: DataTypes.TEXT,
      marcas_de_cambio_de_hilo_de_corte: DataTypes.TEXT,
      otro_tipo_de_marcas_en_superficie: DataTypes.TEXT,
      corte_incompleto: DataTypes.TEXT,
      corte_irregular: DataTypes.TEXT,
      dimension_de_corte_erronea: DataTypes.TEXT,
      grietas_en_pastel: DataTypes.TEXT,
      bordes_rotos: DataTypes.TEXT,
      caida_de_fragmentos_en_separacion: DataTypes.TEXT,
      caida_de_fragmentos_en_paletizado: DataTypes.TEXT,
      faltan_bloques: DataTypes.TEXT,
      mala_separacion: DataTypes.TEXT,
      se_sutituyen_bloques_en_separacion: DataTypes.TEXT,
      se_sustituyen_bloques_en_paletizado: DataTypes.TEXT,
      pastel_sale_completo_sin_paletizar: DataTypes.TEXT,
      pastel_de_muestra: DataTypes.TEXT,
      otros: DataTypes.TEXT,

      sand_fines: DataTypes.TEXT,
      sand_slurry_so3: DataTypes.TEXT,
      return_slurry_so3: DataTypes.TEXT,
      return_slurry_activity: DataTypes.TEXT,
      lime_activity: DataTypes.TEXT,
      lime_slaking_time_sec: DataTypes.TEXT,

      sand_producer: DataTypes.TEXT,
      sand_type: DataTypes.TEXT,
      gypsum_producer: DataTypes.TEXT,
      gypsum_type: DataTypes.TEXT,
      lime_producer: DataTypes.TEXT,
      lime_type: DataTypes.TEXT,
      cement_producer: DataTypes.TEXT,
      cement_type: DataTypes.TEXT,

      al_paste_producer: DataTypes.TEXT,
      al_paste_types: DataTypes.TEXT,
      al_paste_proportion: DataTypes.TEXT,

      dosing_order: DataTypes.TEXT,
      dosing_delay_lime_sec: DataTypes.TEXT,
      mixer_speed_rpm: DataTypes.TEXT,
      mixing_before_al_sec: DataTypes.TEXT,
      mixing_after_al_sec: DataTypes.TEXT,
      vibrator_time_sec: DataTypes.TEXT,
      vibrator_speed_hz: DataTypes.TEXT,

      water_solid_ratio: DataTypes.TEXT,
      sand_slurry_density: DataTypes.TEXT,
      return_slurry_density: DataTypes.TEXT,
      casting_temp_c: DataTypes.TEXT,
      factory_temp_c: DataTypes.TEXT,

      mixer_issues: DataTypes.TEXT,
      oiling_issues: DataTypes.TEXT,
      mold_moving_issues: DataTypes.TEXT,

      // mixing_time_before_al: DataTypes.TEXT,
      // mixing_time_with_al: DataTypes.TEXT,
      // delay_before_dosing_to_the_mixer: DataTypes.TEXT,
      // mixer_speed: DataTypes.TEXT,
      // temperature_in_the_factory: DataTypes.TEXT,
      // temperature_in_the_precuring_chamber: DataTypes.TEXT,
      // density_of_the_sand_slurry: DataTypes.TEXT,
      // density_of_the_return: DataTypes.TEXT,
      // fines_of_the_sand: DataTypes.TEXT,
      // so3_content: DataTypes.TEXT,
      // al_paste_type: DataTypes.TEXT, // (list has al_paste_types)
      // cake_height: DataTypes.TEXT,
      // cutting_temperature: DataTypes.TEXT,
      // plasticity: DataTypes.TEXT,
      // surface_of_the_cake: DataTypes.TEXT,
      // reaction_precuring_chamber: DataTypes.TEXT,
      // precuring_time: DataTypes.TEXT,
      // delays_before_autoclaving: DataTypes.TEXT,
      // rising_cracks: DataTypes.TEXT,
      // mechanical_cracks: DataTypes.TEXT,
      // dimensional_error: DataTypes.TEXT,
      // broken_corners_blocks_on_the_cutting_line: DataTypes.TEXT,
      // problems_after_autoclaving: DataTypes.TEXT,
      // autoclaving_cycle: DataTypes.TEXT,
      // compressive_strength_of_the_end_product: DataTypes.TEXT,
      // density_of_the_end_product: DataTypes.TEXT,
      // issues_with_equipment_mixer: DataTypes.TEXT,
      // issues_with_equipment_cutting_line: DataTypes.TEXT,
      // issues_with_equipment_green_line: DataTypes.TEXT,
      // issues_with_equipment_separation_table: DataTypes.TEXT,
      // issues_with_equipment_autoclave: DataTypes.TEXT,
      // issues_with_equipment_white_line: DataTypes.TEXT,
      // issues_with_equipment_packing_line: DataTypes.TEXT,
    },
    {
      sequelize,
      modelName: 'LotesListsCakes',
    }
  );

  return LotesListsCakes;
};
