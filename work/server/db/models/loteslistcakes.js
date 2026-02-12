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
      note: DataTypes.TEXT,
      no_alcanza_altura: DataTypes.BOOLEAN,
      marcas_de_medidicion_de_plasticidad: DataTypes.BOOLEAN,
      superficie_irregular: DataTypes.BOOLEAN,
      se_aprecian_manchas_grises: DataTypes.BOOLEAN,
      se_aprecian_manchas_marrones: DataTypes.BOOLEAN,
      se_aprecian_incrustaciones: DataTypes.BOOLEAN,
      color_de_bloques_no_uniforme: DataTypes.BOOLEAN,
      manchas_de_goteo: DataTypes.BOOLEAN,
      se_aprecian_huecos: DataTypes.BOOLEAN,
      marcas_de_mesa_de_separacion: DataTypes.BOOLEAN,
      marcas_de_cambio_de_hilo_de_corte: DataTypes.BOOLEAN,
      otro_tipo_de_marcas_en_superficie: DataTypes.BOOLEAN,
      corte_incompleto: DataTypes.BOOLEAN,
      corte_irregular: DataTypes.BOOLEAN,
      dimension_de_corte_erronea: DataTypes.BOOLEAN,
      grietas_en_pastel: DataTypes.BOOLEAN,
      bordes_rotos: DataTypes.BOOLEAN,
      caida_de_fragmentos_en_separacion: DataTypes.BOOLEAN,
      caida_de_fragmentos_en_paletizado: DataTypes.BOOLEAN,
      faltan_bloques: DataTypes.BOOLEAN,
      mala_separacion: DataTypes.BOOLEAN,
      se_sutituyen_bloques_en_separacion: DataTypes.BOOLEAN,
      se_sustituyen_bloques_en_paletizado: DataTypes.BOOLEAN,
      pastel_sale_completo_sin_paletizar: DataTypes.BOOLEAN,
      pastel_de_muestra: DataTypes.BOOLEAN,
      otros: DataTypes.BOOLEAN,

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
      al_paste_types_2: DataTypes.TEXT,
      al_paste_proportion_2: DataTypes.TEXT,

      dosing_order: DataTypes.TEXT,
      dosing_delay_cem_sec: DataTypes.TEXT,
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
      form_number: DataTypes.TEXT,
      mold_id: DataTypes.TEXT,
      flowability: DataTypes.TEXT,

      temperature_ferm: DataTypes.TEXT,
      precuring_time: DataTypes.TEXT,
      reaction_time: DataTypes.TEXT,
      cake_height: DataTypes.TEXT,
      shrinkage: DataTypes.TEXT,
      plasticity: DataTypes.TEXT,
      surface_of_the_cake: DataTypes.TEXT,
      issues_with_the_cake: DataTypes.TEXT,
      issues_with_moving_the_mold: DataTypes.TEXT,
      issues_with_position: DataTypes.TEXT,

      cutting_temperature: DataTypes.TEXT,
      dimensions: DataTypes.TEXT,
      issues_with_cake: DataTypes.TEXT,
      issues_with_wires: DataTypes.TEXT,
      issues_with_cutting_line: DataTypes.TEXT,
      tilting_table: DataTypes.TEXT,
      separation_table: DataTypes.TEXT,
      grid_number: DataTypes.TEXT,
      waiting_tunnel_number: DataTypes.TEXT,
      delays_before_autoclave: DataTypes.TEXT,
    },
    {
      sequelize,
      modelName: 'LotesListsCakes',
    },
  );

  return LotesListsCakes;
};
