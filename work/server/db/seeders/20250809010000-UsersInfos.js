"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      "UsersInfos",
      [
        {
          fullName: "Admin",
          shift: "None",
          subdivision: "Subdivision",
          phone: "123321",
          createdAt: new Date("2025-08-10 00:38:50.936+03"),
          updatedAt: new Date("2025-08-10 00:38:50.936+03"),
        },
        {
          fullName: "Arkadii",
          shift: "None",
          subdivision: "",
          phone: "+34722883641",
          createdAt: new Date("2025-08-10 00:45:08.448+03"),
          updatedAt: new Date("2025-08-10 00:45:08.448+03"),
        },
        {
          fullName: "Aleksander",
          shift: "None",
          subdivision: "",
          phone: "+34",
          createdAt: new Date("2025-08-10 00:46:27.982+03"),
          updatedAt: new Date("2025-08-10 00:46:27.982+03"),
        },
        {
          fullName: "Elina",
          shift: "None",
          subdivision: "",
          phone: "+34627231546",
          createdAt: new Date("2025-08-10 00:47:32.573+03"),
          updatedAt: new Date("2025-08-10 00:47:32.573+03"),
        },
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("UsersInfos", null, {});
  },
};
