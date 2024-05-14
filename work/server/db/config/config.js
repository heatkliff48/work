module.exports = {
  development: {
    username: 'danil',
    password: '111',
    database: 'work',
    host: '127.0.0.1',
    dialect: 'postgres',
  },
  test: {
    username: 'root',
    password: null,
    database: 'database_test',
    host: '127.0.0.1',
    dialect: 'mysql',
  },
  production: {
    username: 'danil',
    password: '111',
    database: 'work',
    host: process.env.DB_ADDRES,
    dialect: 'postgres',
    dialectOptions: {
      ssl: {
        rejectUnauthorized: false,
      },
    },
  },
};
