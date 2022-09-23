import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';
import fs from 'fs';
import path from 'path';
import User from '../models/userData.js';
import asyncWrapper from '../middleware/async.js';
import dotenv from 'dotenv';

dotenv.config();

const {
  MAIL_TRAP_HOST,
  MAIL_TRAP_PASS,
  MAIL_TRAP_PORT,
  MAIL_TRAP_USER,
} = process.env;

export const signIn = asyncWrapper(async (req, res) => {
  const { email, password } = req.body;

  const existingUser = await User.findOne({ email });

  if (!existingUser)
    return res.status(404).json({ message: 'User does not exist' });

  const isPasswordValid = await bcrypt.compare(password, existingUser.password);

  if (!isPasswordValid)
    return res.status(400).json({ message: 'Invalid credentials' });

  const token = jwt.sign(
    { email: existingUser.email, id: existingUser._id },
    'test',
    { expiresIn: '1h' },
  );

  res.status(200).json({ result: existingUser, token });
});

export const signUp = asyncWrapper(async (req, res) => {
  const { email, password, confirmPassword, firstName, lastName } = req.body;

  const existingUser = await User.findOne({ email });

  if (existingUser) {
    return res.status(404).json({ message: 'User already exists' });
  }

  if (password !== confirmPassword) {
    return res.status(400).json({ message: "Passwords don't match" });
  }

  const token = jwt.sign(
    { name: `${firstName} ${lastName}`, email, password },
    'test',
    { expiresIn: '24h' },
  );

  const filePath = path.join(process.cwd(), '/confirmation_email.html');
  const emailConfirmationMesg = fs
    .readFileSync(filePath, 'utf-8')
    .replace(/[\n\r]+/g, '')
    .replace(/\*/, firstName)
    .replace(/value="signature"/, `value="${token}"`);

  const transporter = nodemailer.createTransport({
    host: MAIL_TRAP_HOST,
    port: MAIL_TRAP_PORT,
    auth: {
      user: MAIL_TRAP_USER,
      pass: MAIL_TRAP_PASS,
    },
  });

  transporter.verify((err, success) => {
    if (err) {
      console.log(err);
    }
  });

  const mailOptions = {
    from: 'momento@test.com',
    to: email,
    subject: 'Email Confirmation',
    html: emailConfirmationMesg,
  };

  transporter.sendMail(mailOptions, (err, info) => {
    if (err) {
      console.log(err);
    } else {
      console.log(info);
    }
  });

  return res.status(200).json({ message: 'Email confirmation message sent' });
});

export const confirmUser = asyncWrapper(async (req, res) => {
  const { signature } = req.body;

  let decodedToken = {};

  try {
    decodedToken = jwt.verify(signature, 'test');
    if (decodedToken?.exp * 1000 < new Date().getTime()) {
      res.status(412).json({ message: 'Sign-up link has expired' });
    }
  } catch (error) {
    console.log(error);
    res.status(417).json({ message: 'Invalid sign-up credentials' });
  }

  const { name, email, password } = decodedToken;
  const user = await User.findOne({ email });

  if (user) {
    return res.status(400).json({ message: 'Invalid request' });
  }

  const hashedPassword = await bcrypt.hash(password, 12);

  if (!isPasswordValid) {
    console.log('Signature is corrupt!');
    return res.status(400).json({ message: 'Invalid user credentials' });
  }

  await User.create({
    email,
    password: hashedPassword,
    name,
  });

  const confirmationPage = fs
    .readFileSync(path.join(process.cwd(), '/confirmation_page.html'), 'utf-8')
    .replace(/[\n\r]/g, '');

  res.writeHead('200', { 'Content-Type': 'text/html' });
  res.write(confirmationPage);
  return res.end();
});
