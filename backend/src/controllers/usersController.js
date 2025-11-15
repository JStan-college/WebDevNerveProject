import User from '../models/User.js';

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

//
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
        if (!deletedUser) return res.status(404).json({ message: 'Post not found' });

        res.status(200).json({ message: 'Post deleted', user: deletedUser });
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