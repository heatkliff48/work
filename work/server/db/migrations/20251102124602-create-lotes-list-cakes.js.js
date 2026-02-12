'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('LotesListsCakes', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      note: {
        type: Sequelize.TEXT,
      },
      no_alcanza_altura: {
        type: Sequelize.BOOLEAN,
      },
      marcas_de_medidicion_de_plasticidad: { type: Sequelize.BOOLEAN },
      superficie_irregular: { type: Sequelize.BOOLEAN },
      se_aprecian_manchas_grises: { type: Sequelize.BOOLEAN },
      se_aprecian_manchas_marrones: { type: Sequelize.BOOLEAN },
      se_aprecian_incrustaciones: { type: Sequelize.BOOLEAN },
      color_de_bloques_no_uniforme: { type: Sequelize.BOOLEAN },
      manchas_de_goteo: { type: Sequelize.BOOLEAN },
      se_aprecian_huecos: { type: Sequelize.BOOLEAN },
      marcas_de_mesa_de_separacion: { type: Sequelize.BOOLEAN },
      marcas_de_cambio_de_hilo_de_corte: { type: Sequelize.BOOLEAN },
      otro_tipo_de_marcas_en_superficie: { type: Sequelize.BOOLEAN },
      corte_incompleto: { type: Sequelize.BOOLEAN },
      corte_irregular: { type: Sequelize.BOOLEAN },
      dimension_de_corte_erronea: { type: Sequelize.BOOLEAN },
      grietas_en_pastel: { type: Sequelize.BOOLEAN },
      bordes_rotos: { type: Sequelize.BOOLEAN },
      caida_de_fragmentos_en_separacion: { type: Sequelize.BOOLEAN },
      caida_de_fragmentos_en_paletizado: { type: Sequelize.BOOLEAN },
      faltan_bloques: { type: Sequelize.BOOLEAN },
      mala_separacion: { type: Sequelize.BOOLEAN },
      se_sutituyen_bloques_en_separacion: { type: Sequelize.BOOLEAN },
      se_sustituyen_bloques_en_paletizado: { type: Sequelize.BOOLEAN },
      pastel_sale_completo_sin_paletizar: { type: Sequelize.BOOLEAN },
      pastel_de_muestra: { type: Sequelize.BOOLEAN },
      otros: { type: Sequelize.BOOLEAN },

      sand_fines: { type: Sequelize.TEXT },
      sand_slurry_so3: { type: Sequelize.TEXT },
      return_slurry_so3: { type: Sequelize.TEXT },
      return_slurry_activity: { type: Sequelize.TEXT },
      lime_activity: { type: Sequelize.TEXT },
      lime_slaking_time_sec: { type: Sequelize.TEXT },

      sand_producer: { type: Sequelize.TEXT },
      sand_type: { type: Sequelize.TEXT },
      gypsum_producer: { type: Sequelize.TEXT },
      gypsum_type: { type: Sequelize.TEXT },
      lime_producer: { type: Sequelize.TEXT },
      lime_type: { type: Sequelize.TEXT },
      cement_producer: { type: Sequelize.TEXT },
      cement_type: { type: Sequelize.TEXT },

      al_paste_producer: { type: Sequelize.TEXT },
      al_paste_types: { type: Sequelize.TEXT },
      al_paste_proportion: { type: Sequelize.TEXT },
      al_paste_types_2: { type: Sequelize.TEXT },
      al_paste_proportion_2: { type: Sequelize.TEXT },

      dosing_order: { type: Sequelize.TEXT },
      dosing_delay_cem_sec: { type: Sequelize.TEXT },
      dosing_delay_lime_sec: { type: Sequelize.TEXT },
      mixer_speed_rpm: { type: Sequelize.TEXT },
      mixing_before_al_sec: { type: Sequelize.TEXT },
      mixing_after_al_sec: { type: Sequelize.TEXT },
      vibrator_time_sec: { type: Sequelize.TEXT },
      vibrator_speed_hz: { type: Sequelize.TEXT },

      water_solid_ratio: { type: Sequelize.TEXT },
      sand_slurry_density: { type: Sequelize.TEXT },
      return_slurry_density: { type: Sequelize.TEXT },
      casting_temp_c: { type: Sequelize.TEXT },
      factory_temp_c: { type: Sequelize.TEXT },

      mixer_issues: { type: Sequelize.TEXT },
      oiling_issues: { type: Sequelize.TEXT },
      mold_moving_issues: { type: Sequelize.TEXT },
      form_number: { type: Sequelize.TEXT },
      mold_id: { type: Sequelize.TEXT },
      flowability: { type: Sequelize.TEXT },

      temperature_ferm: { type: Sequelize.TEXT },
      precuring_time: { type: Sequelize.TEXT },
      reaction_time: { type: Sequelize.TEXT },
      cake_height: { type: Sequelize.TEXT },
      shrinkage: { type: Sequelize.TEXT },
      plasticity: { type: Sequelize.TEXT },
      surface_of_the_cake: { type: Sequelize.TEXT },
      issues_with_the_cake: { type: Sequelize.TEXT },
      issues_with_moving_the_mold: { type: Sequelize.TEXT },
      issues_with_position: { type: Sequelize.TEXT },

      cutting_temperature: { type: Sequelize.TEXT },
      dimensions: { type: Sequelize.TEXT },
      issues_with_cake: { type: Sequelize.TEXT },
      issues_with_wires: { type: Sequelize.TEXT },
      issues_with_cutting_line: { type: Sequelize.TEXT },
      tilting_table: { type: Sequelize.TEXT },
      separation_table: { type: Sequelize.TEXT },
      grid_number: { type: Sequelize.TEXT },
      waiting_tunnel_number: { type: Sequelize.TEXT },
      delays_before_autoclave: { type: Sequelize.TEXT },

      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('LotesListsCakes');
  },
};
