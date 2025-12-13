import { getAllPosts, createPost, updatePost, deletePost, getPostById, searchPosts } from '../controllers/postsController.js';

import { verifyToken } from '../middleware/auth.js';

import express from 'express';
const router = express.Router();
import Post from '../models/Post.js';

router.get('/', getAllPosts);
router.post('/', verifyToken, createPost);
router.get('/search', searchPosts);
router.get('/:id', getPostById);
router.put('/:id', verifyToken, updatePost);
router.delete('/:id', verifyToken,deletePost);

export default router;