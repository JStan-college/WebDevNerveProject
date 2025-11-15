import mongoose from "mongoose";
import { Schema } from "mongoose";

const UserSchema = new Schema({
    username: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    challengesCompleted: { type: Number, default: 0 },
    challengesGiven: {type: Number, default: 0},
    reputation: {type: Number, default: 0},
    imageurl: {type: String}
}, { timestamps: true }
);

const User = mongoose.model('User', UserSchema);

export default User;
