import express from 'express';
const router = express.Router();

import { getAllChallenges, createChallenge, updateChallenge, deleteChallenge, getChallengeById } from '../controllers/challengesController.js';
import { verifyToken } from '../middleware/auth.js';

router.get('/', getAllChallenges);
router.post('/', verifyToken, createChallenge);
router.get('/:id', getChallengeById);
router.put('/:id', verifyToken, updateChallenge);
router.delete('/:id', verifyToken, deleteChallenge);

export default router;
