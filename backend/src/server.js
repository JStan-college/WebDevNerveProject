// backend/index.js
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import postsRoutes from './routes/postsRoutes.js';

import dotenv from 'dotenv';
dotenv.config();

const app = express();
const PORT = process.env.PORT || 8080;

app.use(express.json());

app.use('/api/posts', postsRoutes);

app.use(cors({
  origin: 'http://localhost:3000', //connect to frontend, react dev server
}));

mongoose.connect(process.env.MONGO_URI)
.then(() => console.log("MongoDB Atlas connected"))
.catch(err => console.error("MongoDB connection error:", err));

app.get('/', (req, res) => res.send('Hello World!'));

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

