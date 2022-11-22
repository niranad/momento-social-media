import mongoose from 'mongoose';

const { Schema, model } = mongoose;

const UserSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    isGoogleUser: {
      type: Boolean,
      default: false,
    },
  },
  { bufferCommands: false, autoIndex: false, autoCreate: false },
);

export default model('User', UserSchema);
