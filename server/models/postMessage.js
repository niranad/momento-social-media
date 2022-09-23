import mongoose from 'mongoose';

const { Schema, model } = mongoose;

const postSchema = new Schema({
  title: { type: String, required: true, trim: true },
  message: { type: String, required: true, trim: true },
  name: { type: String, required: true, trim: true },
  creator: { type: String, required: true, trim: true },
  tags: [String],
  selectedFile: String,
  likes: {
    type: [String],
    default: [],
  },
  comments: { type: [String], default: [] },
  createdAt: {
    type: Date,
    default: new Date(),
  },
});

const PostMessage = model('Post', postSchema);

export default PostMessage;
