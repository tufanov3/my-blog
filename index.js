import express from 'express';
import fs from 'fs';
import multer from 'multer';
import cors from 'cors';
import mongoose from 'mongoose';

import CommentModel from './models/Comment.js';
import UserModel from './models/User.js';
import PostModel from './models/Post.js';

import { registerValidation, loginValidation, postCreateValidation } from './validations.js';
import { handleValidationErrors, checkAuth } from './utils/index.js';
import { UserController, PostController } from './controllers/index.js';


const connectionString = process.env.MONGODB_URI || 'mongodb+srv://tufanovgeidar:alanya2030@cluster0.jhtmq.mongodb.net/myDatabase?retryWrites=true&w=majority'

mongoose
  .connect(connectionString)
  .then(() => console.log('Successfully connected to MongoDB'))
  .catch((err) => console.log('Connection failed:', err.message));

const app = express();

const storage = multer.diskStorage({
  destination: (_, __, cb) => {
    if (!fs.existsSync('uploads')) {
      fs.mkdirSync('uploads');
    }
    cb(null, 'uploads');
  },
  filename: (_, file, cb) => {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage });

app.use(express.json());
app.use(cors());
app.use('/uploads', express.static('uploads'));

// Auth routes
app.post('/auth/login', loginValidation, handleValidationErrors, UserController.login);
app.post('/auth/register', registerValidation, handleValidationErrors, UserController.register);
app.get('/auth/me', checkAuth, UserController.getMe);

// File upload
app.post('/upload', checkAuth, upload.single('image'), (req, res) => {
  res.json({
    url: `/uploads/${req.file.originalname}`,
  });
});

// Posts and tags
app.get('/tags', PostController.getLastTags);
app.get('/posts/tags', PostController.getLastTags);

// Get all posts with comment count
app.get('/posts', async (req, res) => {
  try {
    const posts = await PostModel.find()
      .sort({ createdAt: -1 })
      .populate('user')
      .lean();

    const postsWithCommentsCount = await Promise.all(
      posts.map(async (post) => {
        const commentsCount = await CommentModel.countDocuments({ postId: post._id });
        return { ...post, commentsCount };
      })
    );

    res.json(postsWithCommentsCount);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch posts' });
  }
});

// Get a single post
app.get('/posts/:id', PostController.getOne);

// Create a post
app.post('/posts', checkAuth, postCreateValidation, handleValidationErrors, PostController.create);

// Delete a post
app.delete('/posts/:id', checkAuth, PostController.remove);

// Update a post
app.patch('/posts/:id', checkAuth, postCreateValidation, handleValidationErrors, PostController.update);

// Popular posts
app.get('/posts/popular', async (req, res) => {
  try {
    const posts = await PostModel.find()
      .sort({ viewsCount: -1 })
      .populate('user')
      .lean();

    const postsWithCommentsCount = await Promise.all(
      posts.map(async (post) => {
        const commentsCount = await CommentModel.countDocuments({ postId: post._id });
        return { ...post, commentsCount };
      })
    );

    res.json(postsWithCommentsCount);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch popular posts' });
  }
});

// Get posts by tag with comment count
app.get('/posts/tags/:tag', async (req, res) => {
  const { tag } = req.params;

  try {
    const posts = await PostModel.find({ tags: { $in: [tag] } }).lean();

    const postsWithCommentsCount = await Promise.all(
      posts.map(async (post) => {
        const commentsCount = await CommentModel.countDocuments({ postId: post._id });
        return { ...post, commentsCount };
      })
    );

    res.status(200).json(postsWithCommentsCount);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Comments
app.get('/posts/:id/comments', async (req, res) => {
  try {
    const comments = await CommentModel.find({ postId: req.params.id }).populate('user', 'name');
    res.json(comments);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch comments' });
  }
});

app.post("/posts/:id/comments", checkAuth, async (req, res) => {
  const { text } = req.body;

  try {
    const user = await UserModel.findById(req.userId);
    const newComment = new CommentModel({
      postId: req.params.id,
      text,
      user: req.userId,
      userName: user.name,
    });
    await newComment.save();

    await PostModel.findByIdAndUpdate(req.params.id, {
      $inc: { commentsCount: 1 },
    });

    res.json(newComment);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Не удалось добавить комментарий" });
  }
});

// Start server
app.listen(process.env.PORT || 4444, (err) => {
  if (err) {
    return console.log(err);
  }

  console.log('Server OK');
});
