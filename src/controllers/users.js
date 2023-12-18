import { GetAllUsers, CreateNewUser, UpdateUser, DeleteUserAndWishlists, GetUserByEmail } from '../models/users.js';
import bcrypt from 'bcrypt';

export const getAllUsers = async (req, res, next) => {
  try {
    const data = await GetAllUsers();
    res.json({
      success: true,
      message: 'GET all users success',
      data: data,
      error: null,
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

  if (body.password !== body.verifyPassword) {
    return res.status(400).json({
      success: false,
      message: 'Passwords do not match.',
      error: 'BAD_REQUEST',
    });
  }

  const hashedPassword = await bcrypt.hash(body.password, 10);

  const userData = {
    name: body.name,
    email: body.email,
    password: hashedPassword,
  };

  try {
    const result = await CreateNewUser(userData);

    const userId = result.rows[0].id;

    res.status(201).json({
      message: 'CREATE new user success',
      data: { id: userId, ...userData },
      error: null,
    });
  } catch (error) {
    if (error.code === '23505' && error.constraint === 'users_email_unique') {
      res.status(400).json({
        message: `Email ${body.email} already exists.`,
      });
    } else {
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
      error: null,
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
    await DeleteUserAndWishlists(idUser);
    res.json({
      success: true,
      message: 'DELETE user success',
      error: null,
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
      error: null,
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
  res.json({ success: true, message: 'Logout successful', error: null });
};
