import { getAllPosts, createPost, updatePost, deletePost, getPostById } from '../controllers/postsController.js';

import express from 'express';
const router = express.Router();
import Post from '../models/Post.js';

router.get('/', getAllPosts);
router.post('/', createPost);
router.get('/:id', getPostById);
router.put('/:id', updatePost);
router.delete('/:id', deletePost);

export default router;