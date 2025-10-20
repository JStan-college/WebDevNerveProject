import Post from '../models/Post.js';

export async function getAllPosts(req, res) {
    try {
        const posts = await Post.find();
        res.status(200).json(posts);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Internal server error" });
    }
}

export async function createPost(req, res) {
    try {
        const { title, content, userId, challengeId } = req.body;
        const newPost = new Post({ title, content, userId, challengeId });

        const savedPost = await newPost.save();
        res.status(201).json({ message: "Post created successfully", post: savedPost });
    } catch (err) {
        console.error(err);
        res.status(400).json({ message: "Bad request" });
    }
}

export async function updatePost(req, res) {
    try {
        const {title, content, score} = req.body;
        const updatedPost = await Post.findByIdAndUpdate(req.params.id, {title, content, score}, { new: true });
        
        if (!updatedPost) return res.status(404).json({ message: "Post not found" });

        res.status(200).json({message: "Post updated successfully", post: updatedPost});
    } catch (error) {
        console.error(error);
        res.status(400).json({ message: "Bad request" });
    }
}

export async function deletePost(req, res) {
    try {
        const deletedPost = await Post.findByIdAndDelete(req.params.id);
        if (!deletedPost) return res.status(404).json({ message: 'Post not found' });

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