import express from 'express';
import { createNewUser, loginUser, logoutUser, getAllUsers, updateUser, deleteUser } from '../controllers/users.js';

const router = express.Router();

// CREATE - POST
router.post('/register', createNewUser);
router.post('/login', loginUser);
router.post('/logout', logoutUser);

// READ - GET
router.get('/', getAllUsers);

// UPDATE - PATCH
router.put('/:idUser', updateUser);

// DELETE - DELETE
router.delete('/:idUser', deleteUser);

export default router;
