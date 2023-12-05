import pgs from 'pg';
import dotenv from 'dotenv';

const { Pool } = pgs;

dotenv.config();

// Production Environtment (comment this field if want to user dev env)
const pool = new Pool({
  user: process.env.PG_USER,
  host: process.env.PG_HOST,
  database: process.env.PG_DB,
  password: process.env.PG_PASSWORD,
  port: process.env.PG_PORT,
});

// // Dev Environtment (comment this field if want to user prod env)
// const pool = new Pool({
//   user: process.env.PG_DEV_USER,
//   host: process.env.PG_DEV_HOST,
//   database: process.env.PG_DEV_DB,
//   password: process.env.PG_DEV_PASSWORD,
//   port: process.env.PG_DEV_PORT,
// });

export const query = async (text, params) => {
  const start = Date.now();
  const res = await pool.query(text, params);
  const duration = Date.now() - start;
  console.log('executed query', { text, duration, rows: res.rowCount });
  return res;
};
