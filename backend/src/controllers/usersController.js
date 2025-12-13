import User from '../models/User.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export async function getAllUsers(_, res) {
    try {
        const users = await User.find().sort({ createdAt: -1 });
        res.status(200).json(users);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Internal server error" });
    }
}

export async function createUser(req, res) {
    try {
        const { username, email, password} = req.body;
        const newUser = new User({  username, email, password });

        const savedUser = await newUser.save();
        res.status(201).json({ message: "User created successfully", post: savedUser });
    } catch (err) {
        console.error(err);
        res.status(400).json({ message: "Bad request" });
    }
}


export async function updateUser(req, res) {
    try {
        const {username, challengesCompleted, challengesGiven, reputation, imageurl} = req.body;
        const updatedUser = await User.findByIdAndUpdate(req.params.id, {username, challengesCompleted, challengesGiven, reputation, imageurl}, { new: true });
        
        if (!updatedUser) return res.status(404).json({ message: "User not found" });

        res.status(200).json({message: "User updated successfully", user: updatedUser});
    } catch (error) {
        console.error(error);
        res.status(400).json({ message: "Bad request" });
    }
}

export async function deleteUser(req, res) {
    try {
        const deletedUser = await User.findByIdAndDelete(req.params.id);
        if (!deletedUser) return res.status(404).json({ message: 'User not found' });

        res.status(200).json({ message: 'User deleted', user: deletedUser });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}

export async function getUserById(req, res) {
    try {
        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).json({ message: 'Post not found' });

        res.status(200).json(user);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}

export async function getCurrentUser(req, res) {
  try {
    // verifyToken middleware already decoded the token and set req.user
    const userId = req.user && req.user.id;
    if (!userId) return res.status(401).json({ message: 'Unauthorized' });

    const user = await User.findById(userId).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });

    res.status(200).json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
}

export async function loginUser(req, res) {
  try {
    const { username, password } = req.body;

    const user = await User.findOne({ username });
    if (!user) return res.status(404).json({ message: "User not found" });

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword)
      return res.status(401).json({ message: "Invalid password" });

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
      },
    });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
}

export async function logoutUser(req, res) {
  try {
    // Since JWT is stateless, logout is handled client-side by removing the token
    // This endpoint can be used for logging/tracking purposes or clearing server-side sessions
    res.status(200).json({ message: "Logout successful" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
}
