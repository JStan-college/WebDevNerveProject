import { getAllUsers, createUser, updateUser, deleteUser, getUserById } from '../controllers/usersController.js';

import express from 'express';
const router = express.Router();
import User from '../models/User.js';

router.get('/', getAllUsers);
router.post('/', createUser);
router.get('/:id', getUserById);
router.delete('/:id', deleteUser);

export default router;