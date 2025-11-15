import mongoose from "mongoose";
import { Schema } from "mongoose";

const CommentSchema = new Schema({
    post_id: { type: String, required: true },
    content: { type: String, required: true },
    user_id: { type: String, required: true },
    score: { type: Number, default: 0 }
}, { timestamps: true }
);

const Comment = mongoose.model('Comment', CommentSchema);

export default Comment;
