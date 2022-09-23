import PostMessage from '../models/postMessage.js';
import asyncWrapper from '../middleware/async.js';
import mongoose from 'mongoose';

export const getPosts = asyncWrapper(async (req, res) => {
  const { page } = req.query;

  const LIMIT = 8;
  const startIndex = (Number(page) - 1) * LIMIT;
  const total = await PostMessage.countDocuments({});

  const posts = await PostMessage.find()
    .sort({ _id: -1 })
    .limit(LIMIT)
    .skip(startIndex);

  res.status(200).json({
    data: posts,
    currentPage: Number(page),
    numberOfPages: Math.ceil(total / LIMIT),
  });
});

export const getPostsBySearch = asyncWrapper(async (req, res) => {
  let { title, tags } = req.query;

  const LIMIT = title === 'postdetails@post' ? 4 : 8;

  title = new RegExp(title, 'i');

  const posts = await PostMessage.find({
    $or: [{ title }, { tags: { $in: tags.split(',') } }],
  }).sort({ _id: -1}).limit(LIMIT);

  res.status(200).json(posts);
});

export const createPost = asyncWrapper(async (req, res) => {
  const post = req.body;

  const newPost = await PostMessage.create({
    ...post,
    creator: req.userId,
    createdAt: new Date().toISOString(),
  });

  res.status(201).json(newPost);
});

export const getPost = asyncWrapper(async (req, res) => {
  const { id } = req.params;

  const post = await PostMessage.findById(id);

  res.status(200).json(post);
});

export const updatePost = asyncWrapper(async (req, res) => {
  const { id: _id } = req.params;
  const post = req.body;

  if (!mongoose.Types.ObjectId.isValid(_id)) {
    return res.status(404).send(`No post with the id: ${_id}`);
  }

  const updatedPost = await PostMessage.findByIdAndUpdate(_id, post, {
    new: true,
    runValidators: true,
  });

  res.status(200).json(updatedPost);
});

export const commentPost = asyncWrapper(async (req, res) => {
  const { id } = req.params;
  const { value } = req.body;

  const post = await PostMessage.findById(id);

  post.comments.push(value);

  const updatedPost = await PostMessage.findByIdAndUpdate(id, post, { new: true });

  res.status(200).json(updatedPost);
});

export const deletePost = asyncWrapper(async (req, res) => {
  const { id: _id } = req.params;

  if (!req.userId) {
    return res.status(401).json({ message: 'User Unathenticated' });
  }

  if (!mongoose.Types.ObjectId.isValid(_id)) {
    res.status(404).json(`No post with the id: ${_id}`);
  }

  await PostMessage.findByIdAndRemove(_id);
  res.status(200).json({ message: 'Post deleted successfully' });
});

export const likePost = asyncWrapper(async (req, res) => {
  const { id: _id } = req.params;

  if (!req.userId) {
    return res.status(401).json({ message: 'User Unathenticated' });
  }

  if (!mongoose.Types.ObjectId.isValid(_id)) {
    res.status(404).json(`No post with the id: ${_id}`);
  }

  const post = await PostMessage.findById(_id);

  const index = post.likes.findIndex((id) => id === String(req.userId));

  if (index === -1) {
    // wants to like
    post.likes.push(req.userId);
  } else {
    // wants to unlike
    post.likes = post.likes.filter((id) => id !== String(req.userId));
  }

  const updatedPost = await PostMessage.findByIdAndUpdate(
    _id,
    { likes: post.likes },
    { new: true },
  );

  res.status(200).json(updatedPost);
});
