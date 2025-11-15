import Comment from '../models/Comment.js';

export async function getAllComments(_, res) {
    try {
        const comments = await Comment.find().sort({ createdAt: -1 });
        res.status(200).json(comments);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Internal server error" });
    }
}

export async function createComment(req, res) {
    try {
        const { post_id, user_id, content } = req.body;
        const newComment = new Comment({ post_id, user_id, content });

        const savedComment = await newComment.save();
        res.status(201).json({ message: "Comment created successfully", comment: savedComment });
    } catch (err) {
        console.error(err);
        res.status(400).json({ message: "Bad request" });
    }
}

export async function updateComment(req, res) {
    try {
        const { content, score } = req.body;
        const updatedComment = await Comment.findByIdAndUpdate(req.params.id, {content, score}, { new: true });
        
        if (!updatedComment) return res.status(404).json({ message: "Comment not found" });

        res.status(200).json({message: "Comment updated successfully", comment: updatedComment});
    } catch (error) {
        console.error(error);
        res.status(400).json({ message: "Bad request" });
    }
}

export async function deleteComment(req, res) {
    try {
        const deletedComment = await Comment.findByIdAndDelete(req.params.id);
        if (!deletedComment) return res.status(404).json({ message: 'Comment not found' });

        res.status(200).json({ message: 'Comment deleted', comment: deletedComment });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}

export async function getCommentById(req, res) {
    try {
        const comment = await Comment.findById(req.params.id);
        if (!comment) return res.status(404).json({ message: 'Comment not found' });

        res.status(200).json(comment);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}