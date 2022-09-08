import PostMessage from '../models/postMessage.js';
import asyncWrapper from '../middleware/async.js';
import mongoose from 'mongoose';

export const getPosts = asyncWrapper(async (req, res) => {
  const posts = await PostMessage.find();
  res.status(200).json(posts);
});

export const createPost = asyncWrapper(async (req, res) => {
  const post = await PostMessage.create(req.body);
  res.status(200).json({ post });
});

export const updatePost = asyncWrapper(async (req, res) => {
  const { id: _id } = req.params;
  const post = req.body;

  if (!mongoose.Types.ObjectId.isValid(_id))
    return res.status(404).send(`No post with the id: ${_id}`);

  const updatedPost = await PostMessage.findByIdAndUpdate(_id, post, {
    new: true,
    runValidators: true,
  });
  res.status(200).json(updatedPost);
});
