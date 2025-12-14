import { getAllUsers, createUser, updateUser, deleteUser, getUserById, loginUser, logoutUser, getCurrentUser } from '../controllers/usersController.js';

import express from 'express';
const router = express.Router();
import User from '../models/User.js';
import { verifyToken } from '../middleware/auth.js';

router.get('/', getAllUsers);
router.post('/', createUser);
router.get('/me', verifyToken, getCurrentUser);
router.get('/:id', getUserById);
router.put('/:id', verifyToken, updateUser);
router.delete('/:id', verifyToken, deleteUser);
router.post('/login', loginUser);
router.post('/logout', verifyToken, logoutUser);

export default router;