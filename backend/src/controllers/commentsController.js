import Comment from '../models/Comment.js';

export async function getAllComments(req, res) {
    try {
        const { postId } = req.query;
        
        let query = {};
        if (postId) {
            query = { post_id: postId };
        }
        
        const comments = await Comment.find(query).sort({ createdAt: -1 });
        res.status(200).json(comments);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Internal server error" });
    }
}

export async function createComment(req, res) {
    try {
        // user_id comes from JWT token in middleware
        const { content, postId } = req.body;
        const userId = req.user.id;

        if (!content || !postId) {
            return res.status(400).json({ message: "Content and postId are required" });
        }

        const newComment = new Comment({ 
            post_id: postId, 
            user_id: userId, 
            content 
        });

        const savedComment = await newComment.save();
        res.status(201).json(savedComment);
    } catch (err) {
        console.error(err);
        res.status(400).json({ message: "Bad request" });
    }
}

export async function updateComment(req, res) {
    try {
        const { content } = req.body;
        const comment = await Comment.findById(req.params.id);
        
        if (!comment) return res.status(404).json({ message: "Comment not found" });

        // Only the owner can update the comment
        const userId = req.user && req.user.id;
        if (!userId) return res.status(401).json({ message: 'Unauthorized' });
        if (comment.user_id.toString() !== userId.toString()) {
            return res.status(403).json({ message: 'Forbidden: not comment owner' });
        }

        comment.content = content ?? comment.content;
        const updatedComment = await comment.save();

        res.status(200).json({message: "Comment updated successfully", comment: updatedComment});
    } catch (error) {
        console.error(error);
        res.status(400).json({ message: "Bad request" });
    }
}

export async function deleteComment(req, res) {
    try {
        const comment = await Comment.findById(req.params.id);
        if (!comment) return res.status(404).json({ message: 'Comment not found' });

        // Only the owner can delete the comment
        const userId = req.user && req.user.id;
        if (!userId) return res.status(401).json({ message: 'Unauthorized' });
        if (comment.user_id.toString() !== userId.toString()) {
            return res.status(403).json({ message: 'Forbidden: not comment owner' });
        }

        const deletedComment = await Comment.findByIdAndDelete(req.params.id);
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