import express from 'express';
import { signIn, signUp, confirmUser } from '../controllers/users.js';

const router = express.Router();

router.post('/signin', signIn);
router.post('/signup', signUp);
router.post('/signup/emailconfirmation/newuser', confirmUser);

export default router;
