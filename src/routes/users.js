import express from 'express';
import { createNewUser, loginUser, logoutUser, getAllUsers, updateUser, deleteUser } from '../controllers/users.js';

const router = express.Router();

router.post('/register', createNewUser);
router.post('/login', loginUser);
router.post('/logout', logoutUser);

router.get('/', getAllUsers);

router.put('/:idUser', updateUser);

router.delete('/:idUser', deleteUser);

export default router;
