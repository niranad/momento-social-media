import express from 'express';
import { signIn, signInWithGoogle, signUp, confirmUser } from '../controllers/users.js';

const router = express.Router();

router.post('/signin', signIn);
router.post('/signin/googlesignin', signInWithGoogle)
router.post('/signup', signUp);
router.get('/signup/emailconfirmation/newuser', confirmUser);

export default router;
