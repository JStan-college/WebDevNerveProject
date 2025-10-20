import mongoose from "mongoose";
import { Schema } from "mongoose";

const PostSchema = new Schema({
    title: { type: String, required: true },
    content: { type: String, required: true },
    userId: { type: String, required: true },
    challengeId: { type: String, required: true },
    score: { type: Number, default: 0 }
}, { timestamps: true }
);

const Post = mongoose.model('Post', PostSchema);

export default Post;
