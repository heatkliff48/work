'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert(
      'PageAndRoles',
      [
        {
          id: 1,
          page_id: 1,
          role_id: 13,
          read: true,
          write: false,
          createdAt: new Date('2025-01-28T11:14:26.437Z'),
          updatedAt: new Date('2025-01-28T11:14:26.437Z'),
        },
        {
          id: 2,
          page_id: 2,
          role_id: 13,
          read: false,
          write: false,
          createdAt: new Date('2025-01-28T11:14:26.468Z'),
          updatedAt: new Date('2025-01-28T11:14:26.468Z'),
        },
        {
          id: 3,
          page_id: 3,
          role_id: 13,
          read: false,
          write: false,
          createdAt: new Date('2025-01-28T11:14:26.476Z'),
          updatedAt: new Date('2025-01-28T11:14:26.476Z'),
        },
        {
          id: 4,
          page_id: 4,
          role_id: 13,
          read: false,
          write: false,
          createdAt: new Date('2025-01-28T11:14:26.484Z'),
          updatedAt: new Date('2025-01-28T11:14:26.484Z'),
        },
        {
          id: 5,
          page_id: 5,
          role_id: 13,
          read: false,
          write: false,
          createdAt: new Date('2025-01-28T11:14:26.492Z'),
          updatedAt: new Date('2025-01-28T11:14:26.492Z'),
        },
        {
          id: 6,
          page_id: 6,
          role_id: 13,
          read: false,
          write: false,
          createdAt: new Date('2025-01-28T11:14:26.5Z'),
          updatedAt: new Date('2025-01-28T11:14:26.5Z'),
        },
        {
          id: 7,
          page_id: 7,
          role_id: 13,
          read: true,
          write: false,
          createdAt: new Date('2025-01-28T11:14:26.507Z'),
          updatedAt: new Date('2025-01-28T11:14:26.507Z'),
        },
        {
          id: 8,
          page_id: 8,
          role_id: 13,
          read: false,
          write: false,
          createdAt: new Date('2025-01-28T11:14:26.514Z'),
          updatedAt: new Date('2025-01-28T11:14:26.514Z'),
        },
        {
          id: 9,
          page_id: 9,
          role_id: 13,
          read: false,
          write: false,
          createdAt: new Date('2025-01-28T11:14:26.522Z'),
          updatedAt: new Date('2025-01-28T11:14:26.522Z'),
        },
        {
          id: 10,
          page_id: 10,
          role_id: 13,
          read: false,
          write: false,
          createdAt: new Date('2025-01-28T11:14:26.534Z'),
          updatedAt: new Date('2025-01-28T11:14:26.534Z'),
        },
        {
          id: 11,
          page_id: 11,
          role_id: 13,
          read: true,
          write: true,
          createdAt: new Date('2025-01-28T11:14:26.542Z'),
          updatedAt: new Date('2025-01-28T11:14:26.542Z'),
        },
        {
          id: 12,
          page_id: 12,
          role_id: 13,
          read: true,
          write: false,
          createdAt: new Date('2025-01-28T11:14:26.549Z'),
          updatedAt: new Date('2025-01-28T11:14:26.549Z'),
        },
        {
          id: 13,
          page_id: 13,
          role_id: 13,
          read: false,
          write: false,
          createdAt: new Date('2025-01-28T11:14:26.556Z'),
          updatedAt: new Date('2025-01-28T11:14:26.556Z'),
        },
        {
          id: 14,
          page_id: 14,
          role_id: 13,
          read: true,
          write: false,
          createdAt: new Date('2025-01-28T11:14:26.561Z'),
          updatedAt: new Date('2025-01-28T11:14:26.561Z'),
        },
        {
          id: 15,
          page_id: 15,
          role_id: 13,
          read: false,
          write: false,
          createdAt: new Date('2025-01-28T11:14:26.567Z'),
          updatedAt: new Date('2025-01-28T11:14:26.567Z'),
        },
        {
          id: 16,
          page_id: 16,
          role_id: 13,
          read: false,
          write: false,
          createdAt: new Date('2025-01-28T11:14:26.573Z'),
          updatedAt: new Date('2025-01-28T11:14:26.573Z'),
        },
        {
          id: 17,
          page_id: 17,
          role_id: 13,
          read: false,
          write: false,
          createdAt: new Date('2025-01-28T11:14:26.577Z'),
          updatedAt: new Date('2025-01-28T11:14:26.577Z'),
        },
        {
          id: 18,
          page_id: 18,
          role_id: 13,
          read: false,
          write: false,
          createdAt: new Date('2025-01-28T11:14:26.583Z'),
          updatedAt: new Date('2025-01-28T11:14:26.583Z'),
        },
        {
          id: 19,
          page_id: 19,
          role_id: 13,
          read: false,
          write: false,
          createdAt: new Date('2025-01-28T11:14:26.589Z'),
          updatedAt: new Date('2025-01-28T11:14:26.589Z'),
        },
        {
          id: 20,
          page_id: 1,
          role_id: 16,
          read: true,
          write: true,
          createdAt: new Date('2025-01-28T11:18:07.523Z'),
          updatedAt: new Date('2025-01-28T11:18:07.523Z'),
        },
        {
          id: 21,
          page_id: 2,
          role_id: 16,
          read: true,
          write: true,
          createdAt: new Date('2025-01-28T11:18:07.539Z'),
          updatedAt: new Date('2025-01-28T11:18:07.539Z'),
        },
        {
          id: 22,
          page_id: 3,
          role_id: 16,
          read: true,
          write: true,
          createdAt: new Date('2025-01-28T11:18:07.547Z'),
          updatedAt: new Date('2025-01-28T11:18:07.547Z'),
        },
        {
          id: 23,
          page_id: 4,
          role_id: 16,
          read: true,
          write: true,
          createdAt: new Date('2025-01-28T11:18:07.552Z'),
          updatedAt: new Date('2025-01-28T11:18:07.552Z'),
        },
        {
          id: 24,
          page_id: 5,
          role_id: 16,
          read: true,
          write: true,
          createdAt: new Date('2025-01-28T11:18:07.558Z'),
          updatedAt: new Date('2025-01-28T11:18:07.558Z'),
        },
        {
          id: 25,
          page_id: 6,
          role_id: 16,
          read: false,
          write: false,
          createdAt: new Date('2025-01-28T11:18:07.563Z'),
          updatedAt: new Date('2025-01-28T11:18:07.563Z'),
        },
        {
          id: 26,
          page_id: 7,
          role_id: 16,
          read: true,
          write: true,
          createdAt: new Date('2025-01-28T11:18:07.568Z'),
          updatedAt: new Date('2025-01-28T11:18:07.568Z'),
        },
        {
          id: 27,
          page_id: 8,
          role_id: 16,
          read: true,
          write: true,
          createdAt: new Date('2025-01-28T11:18:07.573Z'),
          updatedAt: new Date('2025-01-28T11:18:07.573Z'),
        },
        {
          id: 28,
          page_id: 9,
          role_id: 16,
          read: true,
          write: true,
          createdAt: new Date('2025-01-28T11:18:07.577Z'),
          updatedAt: new Date('2025-01-28T11:18:07.577Z'),
        },
        {
          id: 29,
          page_id: 10,
          role_id: 16,
          read: false,
          write: false,
          createdAt: new Date('2025-01-28T11:18:07.582Z'),
          updatedAt: new Date('2025-01-28T11:18:07.582Z'),
        },
        {
          id: 30,
          page_id: 11,
          role_id: 16,
          read: false,
          write: false,
          createdAt: new Date('2025-01-28T11:18:07.587Z'),
          updatedAt: new Date('2025-01-28T11:18:07.587Z'),
        },
        {
          id: 31,
          page_id: 12,
          role_id: 16,
          read: true,
          write: false,
          createdAt: new Date('2025-01-28T11:18:07.592Z'),
          updatedAt: new Date('2025-01-28T11:18:07.592Z'),
        },
        {
          id: 32,
          page_id: 13,
          role_id: 16,
          read: true,
          write: false,
          createdAt: new Date('2025-01-28T11:18:07.598Z'),
          updatedAt: new Date('2025-01-28T11:18:07.598Z'),
        },
        {
          id: 33,
          page_id: 14,
          role_id: 16,
          read: false,
          write: false,
          createdAt: new Date('2025-01-28T11:18:07.603Z'),
          updatedAt: new Date('2025-01-28T11:18:07.603Z'),
        },
        {
          id: 34,
          page_id: 15,
          role_id: 16,
          read: false,
          write: false,
          createdAt: new Date('2025-01-28T11:18:07.609Z'),
          updatedAt: new Date('2025-01-28T11:18:07.609Z'),
        },
        {
          id: 35,
          page_id: 16,
          role_id: 16,
          read: false,
          write: false,
          createdAt: new Date('2025-01-28T11:18:07.613Z'),
          updatedAt: new Date('2025-01-28T11:18:07.613Z'),
        },
        {
          id: 36,
          page_id: 17,
          role_id: 16,
          read: false,
          write: false,
          createdAt: new Date('2025-01-28T11:18:07.618Z'),
          updatedAt: new Date('2025-01-28T11:18:07.618Z'),
        },
        {
          id: 37,
          page_id: 18,
          role_id: 16,
          read: false,
          write: false,
          createdAt: new Date('2025-01-28T11:18:07.623Z'),
          updatedAt: new Date('2025-01-28T11:18:07.623Z'),
        },
        {
          id: 38,
          page_id: 19,
          role_id: 16,
          read: true,
          write: true,
          createdAt: new Date('2025-01-28T11:18:07.629Z'),
          updatedAt: new Date('2025-01-28T11:18:07.629Z'),
        },
      ],
      {}
    );
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('YourTableName', null, {});
  },
};
