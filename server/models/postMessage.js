import mongoose from 'mongoose';

const { Schema, model } = mongoose;

const postSchema = new Schema({
  title: { type: String, required: true, trim: true },
  message: { type: String, required: true, trim: true },
  creator: { type: String, required: true, trim: true },
  tags: [String],
  selectedFile: String,
  likeCount: {
    type: Number,
    default: 0,
  },
  createdAt: {
    type: Date,
    default: new Date(),
  }
});

const PostMessage = model('Post', postSchema);

export default PostMessage;
