import express from 'express';
import { getAllUsers, getUserById,createNewUser, loginUser, logoutUser, updateUser, deleteUser } from '../controllers/users.js';

const router = express.Router();

router.post('/register', createNewUser);
router.post('/login', loginUser);
router.post('/logout', logoutUser);

router.get('/', getAllUsers);
router.get('/:idUser', getUserById);

router.put('/:idUser', updateUser);

router.delete('/:idUser', deleteUser);

export default router;
