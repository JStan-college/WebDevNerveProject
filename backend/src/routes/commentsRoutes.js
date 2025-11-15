import { getAllComments, createComment, updateComment, deleteComment, getCommentById } from '../controllers/commentsController.js';

import express from 'express';
const router = express.Router();
import Comment from '../models/Comment.js';

router.get('/', getAllComments);
router.post('/', createComment);
router.get('/:id', getCommentById);
router.put('/:id', updateComment);
router.delete('/:id', deleteComment);

export default router;