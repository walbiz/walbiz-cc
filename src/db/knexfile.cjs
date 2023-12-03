const path = require('path');
const dotenv = require('dotenv').config({ path: '../../.env' });

module.exports = {
  production: {
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
  development: {
    client: 'pg',
    connection: {
      host: process.env.PG_DEV_HOST,
      user: process.env.PG_DEV_USER,
      password: process.env.PG_DEV_PASSWORD,
      database: process.env.PG_DEV_DB,
    },
    migrations: {
      tableName: 'knex_migrations',
      directory: './migrations/dev',
    },
    seeds: {
      directory: './seeds/dev',
    },
  },
};
