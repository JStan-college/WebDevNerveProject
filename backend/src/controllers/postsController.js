import Post from '../models/Post.js';
import User from '../models/User.js';

export async function getAllPosts(_, res) {
    try {
        const posts = await Post.find().sort({ createdAt: -1 });
        res.status(200).json(posts);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Internal server error" });
    }
}

export async function createPost(req, res) {
    try {
        const { title, content, challengeId } = req.body;
        // Use server-verified user id from verifyToken middleware
        const userId = req.user && req.user.id;
        if (!userId) return res.status(401).json({ message: 'Unauthorized' });

        const newPost = new Post({ title, content, user_id: userId, challengeId });

        const savedPost = await newPost.save();
        res.status(201).json({ message: "Post created successfully", post: savedPost });
    } catch (err) {
        console.error(err);
        res.status(400).json({ message: "Bad request" });
    }
}

export async function updatePost(req, res) {
    try {
        const { title, content, score } = req.body;

        const post = await Post.findById(req.params.id);
        if (!post) return res.status(404).json({ message: "Post not found" });

        // Only the owner (author) can update the post
        const userId = req.user && req.user.id;
        if (!userId) return res.status(401).json({ message: 'Unauthorized' });
        if (post.user_id.toString() !== userId.toString()) {
            return res.status(403).json({ message: 'Forbidden: not post owner' });
        }

        post.title = title ?? post.title;
        post.content = content ?? post.content;
        if (typeof score !== 'undefined') post.score = score;

        const updatedPost = await post.save();
        res.status(200).json({ message: "Post updated successfully", post: updatedPost });
    } catch (error) {
        console.error(error);
        res.status(400).json({ message: "Bad request" });
    }
}

export async function deletePost(req, res) {
    try {
        const post = await Post.findById(req.params.id);
        if (!post) return res.status(404).json({ message: 'Post not found' });

        const userId = req.user && req.user.id;
        if (!userId) return res.status(401).json({ message: 'Unauthorized' });
        if (post.user_id.toString() !== userId.toString()) {
            return res.status(403).json({ message: 'Forbidden: not post owner' });
        }

        const deletedPost = await Post.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: 'Post deleted', post: deletedPost });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}

export async function getPostById(req, res) {
    try {
        const post = await Post.findById(req.params.id);
        if (!post) return res.status(404).json({ message: 'Post not found' });

        res.status(200).json(post);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}

export async function searchPosts(req, res) {
    try {
        const { q } = req.query;
        
        if (!q || q.trim() === "") {
            return res.status(200).json([]);
        }

        // Search for users by username
        const matchingUsers = await User.find({
            username: { $regex: q, $options: "i" }
        });

        const userIds = matchingUsers.map(u => u._id.toString());

        // Use $regex with $options: "i" for case-insensitive pattern matching
        // Search in title, content, AND by creator username
        const posts = await Post.find({
            $or: [
                { title: { $regex: q, $options: "i" } },
                { content: { $regex: q, $options: "i" } },
                { user_id: { $in: userIds } }
            ]
        }).sort({ createdAt: -1 });

        res.status(200).json(posts);
    } catch (err) {
        console.error("Search error:", err);
        res.status(500).json({ message: "Server error" });
    }
}

export async function likePost(req, res) {
    try {
        const postId = req.params.id;
        const userId = req.user && req.user.id;
        
        if (!userId) return res.status(401).json({ message: 'Unauthorized' });

        const post = await Post.findById(postId);
        if (!post) return res.status(404).json({ message: "Post not found" });

        // Check if user already liked this post
        if (post.likes.includes(userId)) {
            return res.status(400).json({ message: "Already liked" });
        }

        // Add user ID to likes array
        post.likes.push(userId);
        const updatedPost = await post.save();

        res.status(200).json({ message: "Post liked successfully", post: updatedPost });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Internal server error" });
    }
}

export async function unlikePost(req, res) {
    try {
        const postId = req.params.id;
        const userId = req.user && req.user.id;
        
        if (!userId) return res.status(401).json({ message: 'Unauthorized' });

        const post = await Post.findById(postId);
        if (!post) return res.status(404).json({ message: "Post not found" });

        // Check if user has liked this post
        if (!post.likes.includes(userId)) {
            return res.status(400).json({ message: "Not liked yet" });
        }

        // Remove user ID from likes array
        post.likes = post.likes.filter(id => id !== userId);
        const updatedPost = await post.save();

        res.status(200).json({ message: "Post unliked successfully", post: updatedPost });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Internal server error" });
    }
}