import mongoose from "mongoose";
import { Schema } from "mongoose";

const PostSchema = new Schema({
    title: { type: String, required: true },
    content: { type: String, required: true },
    user_id: { type: String, required: true },
    challengeId: { type: String, required: true },
    score: { type: Number, default: 0 },
    imageurl: {type: String}
}, { timestamps: true }
);

const Post = mongoose.model('Post', PostSchema);

export default Post;
