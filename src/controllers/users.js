import { GetAllUsers, CreateNewUser, UpdateUser, DeleteUser, GetUserByEmail } from '../models/users.js';
import bcrypt from 'bcrypt';

export const getAllUsers = async (req, res, next) => {
  try {
    const data = await GetAllUsers();
    res.json({
      message: 'GET all users success',
      data: data,
    });
  } catch (error) {
    console.error('Error in getAllUsers:', error);
    res.status(500).json({
      message: 'Server Error',
      serverMessage: error,
    });
  }
};

export const createNewUser = async (req, res, next) => {
  const { body } = req;

  const hashedPassword = await bcrypt.hash(body.password, 10);

  const userData = {
    name: body.name,
    email: body.email,
    password: hashedPassword,
  };

  try {
    const result = await CreateNewUser(userData);

    // Extract the returned id from the result
    const userId = result.rows[0].id;

    res.status(201).json({
      message: 'CREATE new user success',
      data: { id: userId, ...userData },
      //   data: userData,
    });
  } catch (error) {
    if (error.code === '23505' && error.constraint === 'users_email_unique') {
      // Email already exists
      res.status(400).json({
        message: `Email ${body.email} already exists.`,
      });
    } else {
      // Other server errors
      res.status(500).json({
        message: 'Server Error',
        serverMessage: error,
      });
    }
  }
};

export const updateUser = async (req, res, next) => {
  const { idUser } = req.params;
  const { body } = req;

  if (body.password) {
    body.password = await bcrypt.hash(body.password, 10);
  }

  try {
    await UpdateUser(body, idUser);
    res.json({
      message: 'UPDATE user success',
      data: {
        id: idUser,
        ...body,
      },
    });
  } catch (error) {
    res.status(500).json({
      message: 'Server Error',
      serverMessage: error,
    });
  }
};

export const deleteUser = async (req, res, next) => {
  const { idUser } = req.params;
  try {
    await DeleteUser(idUser);
    res.json({
      message: 'DELETE user success',
      data: null,
    });
  } catch (error) {
    res.status(500).json({
      message: 'Server Error',
      serverMessage: error,
    });
  }
};

export const loginUser = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    const user = await GetUserByEmail(email);

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({
        message: 'Invalid email or password',
      });
    }

    res.json({
      message: 'Login successful',
      user,
    });
  } catch (error) {
    console.error('Error in loginUser:', error);
    res.status(500).json({
      message: 'Server Error',
      serverMessage: error,
    });
  }
};

export const logoutUser = (req, res, next) => {
  res.json({
    message: 'Logout successful',
  });
};
