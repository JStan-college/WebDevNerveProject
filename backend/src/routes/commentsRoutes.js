import { getAllComments, createComment, updateComment, deleteComment, getCommentById } from '../controllers/commentsController.js';

import { verifyToken } from '../middleware/auth.js';
import express from 'express';
const router = express.Router();
import Comment from '../models/Comment.js';

router.get('/', getAllComments);
router.post('/', verifyToken, createComment);
router.get('/:id', getCommentById);
router.put('/:id', verifyToken, updateComment);
router.delete('/:id', verifyToken, deleteComment);

export default router;