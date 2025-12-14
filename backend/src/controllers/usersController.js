import User from '../models/User.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import Challenge from '../models/Challenge.js';

export async function getAllUsers(_, res) {
    try {
    const users = await User.find().sort({ createdAt: -1 }).select('-password');
    res.status(200).json(users);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Internal server error" });
    }
}

export async function createUser(req, res) {
    try {
    const { username, email, password, imageurl } = req.body;

    // Basic validation
    if (!username || !email || !password) {
      return res.status(400).json({ message: 'username, email and password are required' });
    }

    if (typeof password !== 'string' || password.length < 6) {
      return res.status(400).json({ message: 'password must be at least 6 characters' });
    }

    // simple email regex
    const emailRegex = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: 'invalid email format' });
    }

    // uniqueness checks
    const existing = await User.findOne({ $or: [{ username }, { email }] });
    if (existing) {
      if (existing.username === username) return res.status(409).json({ message: 'username already taken' });
      if (existing.email === email) return res.status(409).json({ message: 'email already in use' });
    }

    const newUser = new User({ username, email, password, imageurl });

    const savedUser = await newUser.save();
    const userToReturn = await User.findById(savedUser._id).select('-password');
    res.status(201).json({ message: "User created successfully", user: userToReturn });
    } catch (err) {
        console.error(err);
        res.status(400).json({ message: "Bad request" });
    }
}


export async function updateUser(req, res) {
  try {
    // Only allow the user themselves to update their profile
    const userId = req.user && req.user.id;
    if (!userId) return res.status(401).json({ message: 'Unauthorized' });
    if (userId.toString() !== req.params.id.toString()) {
      return res.status(403).json({ message: 'Forbidden: cannot update other users' });
    }

    const { username, password, challengesCompleted, challengesGiven, challengeToday, reputation, imageurl, email } = req.body;

    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    // Validate provided fields
    if (typeof password !== 'undefined' && password !== null) {
      if (typeof password !== 'string' || password.length < 6) {
        return res.status(400).json({ message: 'password must be at least 6 characters' });
      }
      user.password = password; // hashed by pre-save
    }

    if (typeof email !== 'undefined' && email !== null) {
      const emailRegex = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;
      if (!emailRegex.test(email)) return res.status(400).json({ message: 'invalid email format' });
      // check uniqueness
      const existingEmail = await User.findOne({ email, _id: { $ne: req.params.id } });
      if (existingEmail) return res.status(409).json({ message: 'email already in use' });
      user.email = email;
    }

    if (typeof username !== 'undefined' && username !== null) {
      if (String(username).trim() === '') return res.status(400).json({ message: 'username cannot be empty' });
      const existingUsername = await User.findOne({ username, _id: { $ne: req.params.id } });
      if (existingUsername) return res.status(409).json({ message: 'username already taken' });
      user.username = username;
    }

    if (typeof challengesCompleted !== 'undefined') user.challengesCompleted = challengesCompleted;
    if (typeof challengesGiven !== 'undefined') user.challengesGiven = challengesGiven;
    if (typeof challengeToday !== 'undefined') user.challengeToday = challengeToday;
    if (typeof reputation !== 'undefined') user.reputation = reputation;
    if (typeof imageurl !== 'undefined') user.imageurl = imageurl;

    const updatedUser = await user.save();
    const userToReturn = await User.findById(updatedUser._id).select('-password');

    res.status(200).json({ message: 'User updated successfully', user: userToReturn });
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: 'Bad request' });
  }
}

export async function deleteUser(req, res) {
    try {
    const userId = req.user && req.user.id;
    if (!userId) return res.status(401).json({ message: 'Unauthorized' });
    if (userId.toString() !== req.params.id.toString()) {
      return res.status(403).json({ message: 'Forbidden: cannot delete other users' });
    }

    const deletedUser = await User.findByIdAndDelete(req.params.id);
    if (!deletedUser) return res.status(404).json({ message: 'User not found' });

    const userToReturn = deletedUser.toObject();
    delete userToReturn.password;

    res.status(200).json({ message: 'User deleted', user: userToReturn });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}

export async function getUserById(req, res) {
    try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });

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

export async function getTodaysChallenge(req, res) {
  try {
    const userId = req.user && req.user.id;
    if (!userId) return res.status(401).json({ message: 'Unauthorized' });

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const now = new Date();
    const assignedAt = user.challengeAssignedAt;
    const isSameDay = (d1, d2) => {
      if (!d1 || !d2) return false;
      return d1.getFullYear() === d2.getFullYear() && d1.getMonth() === d2.getMonth() && d1.getDate() === d2.getDate();
    };

    let challenge = null;

    if (user.challengeToday && assignedAt && isSameDay(new Date(assignedAt), now)) {
      challenge = await Challenge.findById(user.challengeToday);
    } else {
      // assign a new challenge for today if available
      const count = await Challenge.countDocuments();
      if (count > 0) {
        const rand = Math.floor(Math.random() * count);
        challenge = await Challenge.findOne().skip(rand);
        if (challenge) {
          user.challengeToday = challenge._id.toString();
          user.challengeAssignedAt = now;
          await user.save();
        }
      }
    }

    if (!challenge) {
      return res.status(204).json({ message: 'No challenge available' });
    }

    res.status(200).json({ challenge });
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

    // Assign a challenge for today if not already assigned today
    try {
      const now = new Date();
      const assignedAt = user.challengeAssignedAt;
      const isSameDay = (d1, d2) => {
        if (!d1 || !d2) return false;
        return d1.getFullYear() === d2.getFullYear() && d1.getMonth() === d2.getMonth() && d1.getDate() === d2.getDate();
      }

      if (!assignedAt || !isSameDay(new Date(assignedAt), now)) {
        const count = await Challenge.countDocuments();
        if (count > 0) {
          const rand = Math.floor(Math.random() * count);
          const challenge = await Challenge.findOne().skip(rand).select('_id');
          if (challenge) {
            user.challengeToday = challenge._id.toString();
            user.challengeAssignedAt = now;
            await user.save();
          }
        }
      }
    } catch (assignErr) {
      console.error('Error assigning daily challenge:', assignErr);
      // don't fail login on assignment errors
    }

    res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        challengeToday: user.challengeToday || null,
        challengeAssignedAt: user.challengeAssignedAt || null,
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
