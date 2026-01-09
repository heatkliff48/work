"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("LotesLists", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      cake_id: {
        type: Sequelize.INTEGER,
      },
      cake_id_finish: {
        type: Sequelize.INTEGER,
      },
      production_date: {
        type: Sequelize.STRING,
      },
      product: {
        type: Sequelize.STRING,
      },
      recipe: {
        type: Sequelize.STRING,
      },
      quantity_cakes: {
        type: Sequelize.INTEGER,
      },
      warehouse_id: {
        type: Sequelize.STRING,
      },
      custom_recipe: {
        type: Sequelize.BOOLEAN,
      },
      sand_dry: {
        type: Sequelize.STRING,
      },
      sand_slurry_dry: {
        type: Sequelize.STRING,
      },
      lime: {
        type: Sequelize.STRING,
      },
      cement: {
        type: Sequelize.STRING,
      },
      gypsum_dry: {
        type: Sequelize.STRING,
      },
      return_dry: {
        type: Sequelize.STRING,
      },
      gypsum_stone: {
        type: Sequelize.STRING,
      },
      aluminum_paste: {
        type: Sequelize.STRING,
      },
      aluminum_paste_2: {
        type: Sequelize.STRING,
      },
      grinding_balls: {
        type: Sequelize.STRING,
      },
      aac: {
        type: Sequelize.STRING,
      },
      casting_temperature: {
        type: Sequelize.STRING,
      },
      w_s: {
        type: Sequelize.STRING,
      },
      mixing_time_before_al: {
        type: Sequelize.STRING,
      },
      mixing_time_with_al: {
        type: Sequelize.STRING,
      },
      dosing_order: {
        type: Sequelize.STRING,
      },
      delay_before_dosing_to_the_mixer: {
        type: Sequelize.STRING,
      },
      mixer_speed: {
        type: Sequelize.STRING,
      },
      temperature_in_the_factory: {
        type: Sequelize.STRING,
      },
      temperature_in_the_precuring_chamber: {
        type: Sequelize.STRING,
      },
      density_of_the_sand_slurry: {
        type: Sequelize.STRING,
      },
      density_of_the_return: {
        type: Sequelize.STRING,
      },
      fines_of_the_sand: {
        type: Sequelize.STRING,
      },
      so3_content: {
        type: Sequelize.STRING,
      },
      lime_activity: {
        type: Sequelize.STRING,
      },
      lime_type: {
        type: Sequelize.STRING,
      },
      cement_type: {
        type: Sequelize.STRING,
      },
      al_paste_producer: {
        type: Sequelize.STRING,
      },
      al_paste_type: {
        type: Sequelize.STRING,
      },
      al_paste_proportion: {
        type: Sequelize.STRING,
      },
      sand_type: {
        type: Sequelize.STRING,
      },
      gypsum_type: {
        type: Sequelize.STRING,
      },
      cake_height: {
        type: Sequelize.STRING,
      },
      cutting_temperature: {
        type: Sequelize.STRING,
      },
      plasticity: {
        type: Sequelize.STRING,
      },
      surface_of_the_cake: {
        type: Sequelize.STRING,
      },
      reaction_precuring_chamber: {
        type: Sequelize.STRING,
      },
      precuring_time: {
        type: Sequelize.STRING,
      },
      delays_before_autoclaving: {
        type: Sequelize.STRING,
      },
      rising_cracks: {
        type: Sequelize.STRING,
      },
      mechanical_cracks: {
        type: Sequelize.STRING,
      },
      dimensional_error: {
        type: Sequelize.STRING,
      },
      broken_corners_blocks_on_the_cutting_line: {
        type: Sequelize.STRING,
      },
      problems_after_autoclaving: {
        type: Sequelize.STRING,
      },
      autoclaving_cycle: {
        type: Sequelize.STRING,
      },
      compressive_strength_of_the_end_product: {
        type: Sequelize.STRING,
      },
      density_of_the_end_product: {
        type: Sequelize.STRING,
      },
      issues_with_equipment_mixer: {
        type: Sequelize.STRING,
      },
      issues_with_equipment_cutting_line: {
        type: Sequelize.STRING,
      },
      issues_with_equipment_green_line: {
        type: Sequelize.STRING,
      },
      issues_with_equipment_separation_table: {
        type: Sequelize.STRING,
      },
      issues_with_equipment_autoclave: {
        type: Sequelize.STRING,
      },
      issues_with_equipment_white_line: {
        type: Sequelize.STRING,
      },
      issues_with_equipment_packing_line: {
        type: Sequelize.STRING,
      },
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
    await queryInterface.dropTable("LotesLists");
  },
};
