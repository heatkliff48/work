"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      "Users",
      [
        {
          username: "admin",
          email: "admin@baublock.com",
          password:
            "$2a$08$Kp/TC0fF8ZaVR9y.HeFWJuLNapyjqmq6EJ2S25dYKAZj9RqwOoRzK",
          role: 3,
          createdAt: new Date("2025-08-10 00:38:50.933+03"),
          updatedAt: new Date("2025-08-10 00:38:50.933+03"),
        },
        {
          username: "ag@baublock.com",
          email: "ag@baublock.com",
          password:
            "$2a$08$l3fRbqKqM50o3ljeWhJjZO6XOpDxQyDCyCCNXpexW39ZH9x2nqvDS",
          role: 2,
          createdAt: new Date("2025-08-10 00:45:08.472+03"),
          updatedAt: new Date("2025-08-10 00:45:08.472+03"),
        },
        {
          username: "abb@baublock.com",
          email: "abb@baublock.com",
          password:
            "$2a$08$nf5eiWpMi7dGCrAuzXkESeIw7E8OFrYT2vl2HhBUfSYJQAfSVfy8i",
          role: 13,
          createdAt: new Date("2025-08-10 00:46:28.003+03"),
          updatedAt: new Date("2025-08-10 00:46:28.003+03"),
        },
        {
          username: "el@baublock.com",
          email: "el@baublock.com",
          password:
            "$2a$08$FxcEsn7fpNTNhoDp7DDDGuf3tlKUWocqrgfU4GAr4DRG1QkTQmjjq",
          role: 4,
          createdAt: new Date("2025-08-10 00:47:32.592+03"),
          updatedAt: new Date("2025-08-10 00:47:32.592+03"),
        },
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("Users", null, {});
  },
};
