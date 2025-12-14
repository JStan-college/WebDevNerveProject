import mongoose from "mongoose";
import { Schema } from "mongoose";

const ChallengeSchema = new Schema({
    title: { type: String, required: true },
    genre: { type: String, required: true },
}
);

const Challenge = mongoose.model('Challenge', ChallengeSchema);

export default Challenge;
