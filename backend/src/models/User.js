import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import { Schema } from "mongoose";

const UserSchema = new Schema({
    username: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true, minlength: 6 },
    challengesCompleted: { type: Number, default: 0 },
    challengesGiven: {type: Number, default: 0},
    challengeToday: {type: String, default: ""},
    challengeAssignedAt: { type: Date, default: null },
    reputation: {type: Number, default: 0},
    imageurl: {type: String}
}, { timestamps: true }
);

// Hash password before saving
UserSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next()
  
  const salt = await bcrypt.genSalt(10)
  this.password = await bcrypt.hash(this.password, salt)
  next()
})

// Method to compare passwords
UserSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password)
}

const User = mongoose.model('User', UserSchema);

export default User;
