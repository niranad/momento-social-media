import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';
import fs from 'fs';
import path from 'path';
import User from '../models/userData.js';
import asyncWrapper from '../middleware/async.js';
import customEnv from 'custom-env';

customEnv.env(true);

const {
  MAIL_TRAP_HOST,
  MAIL_TRAP_PORT,
  MAIL_TRAP_USER,
  MAIL_TRAP_PASS,
  JWT_SECRET,
} = process.env;

export const signIn = asyncWrapper(async (req, res) => {
  const { email, password } = req.body;

  const existingUser = await User.findOne({ email });

  if (!existingUser)
    return res.status(404).json({ message: 'User does not exist' });

  const isPasswordValid = await bcrypt.compare(password, existingUser.password);

  if (!isPasswordValid)
    return res.status(422).json({ message: 'Invalid credentials' });

  const token = jwt.sign(
    { email: existingUser.email, id: existingUser._id },
    'test',
    { expiresIn: '3h' },
  );

  res.status(200).json({ result: existingUser, token });
});

export const signInWithGoogle = asyncWrapper(async (req, res) => {
  const { credential } = req.body;

  // Decode credential
  const decodedData = jwt.decode(credential);
  const { email, given_name, family_name, sub, jti, picture } = decodedData;

  // Check if user exists exists in db
  let user = await User.findOne({ email });

  // Create a secured passwordless account for new google OAuth user
  if (!user) {
    // Google Users will only be able to sign in with google OAuth
    const securePass = `${sub}${new Date().getTime()}${jti}`;
    const hashedPass = await bcrypt.hash(securePass, 12);
    user = await User.create({
      name: `${given_name} ${family_name}`,
      email,
      password: hashedPass,
      isGoogleUser: true,
    });
  }

  const token = jwt.sign({ email: user.email, id: user._id }, 'test', {
    expiresIn: '3h',
  });

  res.status(200).json({ result: user, token, imageUrl: picture });
});

export const signUp = asyncWrapper(async (req, res) => {
  const { email, password, confirmPassword, firstName, lastName } = req.body;
  if (!email || !password || !confirmPassword || !firstName || !lastName) {
    return res.status(400).send({ message: 'Missing some required field(s)' });
  }
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res.status(400).json({ message: 'Email already exists' });
  }
  if (password !== confirmPassword) {
    return res.status(400).json({ message: "Passwords don't match" });
  }
  const token = jwt.sign(
    { name: `${firstName} ${lastName}`, email, password },
    JWT_SECRET,
    { expiresIn: '24h' },
  );

  const filePath = path.join(process.cwd(), '/confirmation_email.html');
  const emailConfirmationMesg = fs
    .readFileSync(filePath, 'utf-8')
    .replace(/[\n\r]+/g, '')
    .replace(/\*/, firstName)
    .replace(/signature=/, `signature=${token}`);

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

  try {
    await transporter.sendMail(mailOptions);
  } catch (error) {
    return res.status(503).json({
      message:
        'Email verification service is currently unavailable. Please try again in a minute.',
    });
  }

  return res.status(200).json({ message: 'Email verification link sent' });
});

export const confirmUser = asyncWrapper(async (req, res) => {
  const { signature } = req.query;
  let decodedToken = {};

  try {
    decodedToken = jwt.verify(signature, JWT_SECRET);
  } catch (error) {
    console.log(error);
    res.status(422).json({ message: 'Credentials link has expired' });
  }

  const { name, email, password } = decodedToken;
  const user = await User.findOne({ email });

  if (user) {
    return res.status(422).json({ message: 'Invalid request' });
  }

  const hashedPassword = await bcrypt.hash(password, 12);

  await User.create({
    email,
    password: hashedPassword,
    name,
  });

  const confirmPage = fs.createReadStream(
    path.join(process.cwd(), '/confirmation_page.html'),
    'utf-8',
  );

  res.writeHead(200, { 'Content-Type': 'text/html' });
  return await new Promise((resolve, reject) => {
    confirmPage
      .pipe(res)
      .on('unpipe', () => {
        resolve(res.end());
      })
      .on('error', (err) => {
        reject(
          res.json({ message: 'Your email has been confirmed successfully.' }),
        );
      });
  });
});
