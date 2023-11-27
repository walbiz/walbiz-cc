const path = require('path');
const dotenv = require('dotenv').config({ path: '../../.env' });

console.log('PG_HOST:', process.env.PG_HOST);
console.log('PG_USER:', process.env.PG_USER);
console.log('PG_PASSWORD:', process.env.PG_PASSWORD);
console.log('PG_DB:', process.env.PG_DB);

module.exports = {
  development: {
    client: 'pg',
    connection: {
      host: process.env.PG_HOST,
      user: process.env.PG_USER,
      password: process.env.PG_PASSWORD,
      database: process.env.PG_DB,
    },
    migrations: {
      tableName: 'knex_migrations',
      directory: './migrations',
    },
    seeds: {
      directory: './seeds',
    },
  },
};
