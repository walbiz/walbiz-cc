// const pool = require('../db/index.js');
import { query } from '../db/index.js';

export const GetAllUsers = () => {
  const SQLQuery = 'SELECT * FROM users';
  return query(SQLQuery).then((result) => result.rows);
};

export const CreateNewUser = (userData) => {
  const SQLQuery = `INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING id`;
  const values = [userData.name, userData.email, userData.password];
  return query(SQLQuery, values);
};

export const UpdateUser = (body, idUser) => {
  const SQLQuery = 'UPDATE users SET name=$1, email=$2, password=$3 WHERE id=$4';
  const values = [body.name, body.email, body.password, idUser];
  return query(SQLQuery, values);
};

export const DeleteUser = (idUser) => {
  const SQLQuery = 'DELETE FROM users WHERE id=$1';
  return query(SQLQuery, [idUser]);
};

export const GetUserByEmail = (email) => {
  const SQLQuery = 'SELECT * FROM users WHERE email = $1';
  const values = [email];
  return query(SQLQuery, values).then((result) => result.rows[0]); // Assuming there should be only one user with a given email
};

// module.exports = {
//   getAllUsers,
//   createNewUser,
//   updateUser,
//   deleteUser,
//   getUserByEmail, // Add this line to export the new function
// };
