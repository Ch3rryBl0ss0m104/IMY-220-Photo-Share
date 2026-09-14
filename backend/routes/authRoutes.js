import express from 'express';
import * as userService from '../services/userService.js';

const router = express.Router();

// POST /api/auth/signup
router.post('/signup', async (req, res) => {
  const { name, username, email, password } = req.body || {};

  if (!name || !username || !email || !password) {
    return res.status(400).json({ message: 'Name, username, email, and password are all required.' });
  }

  try {
    const existing = await userService.findUserByEmailOrUsername(email, username);
    if (existing) {
      return res.status(409).json({ message: 'An account with that email or username already exists.' });
    }

    const user = await userService.createUser({ name, username, email, password });

    // Usability requirement: creating an account logs the user in automatically.
    req.session.userId = user._id.toString();

    return res.status(201).json({ message: 'Account created.', user });
  } catch (error) {
    console.error('Signup failed:', error);
    return res.status(500).json({ message: 'Something went wrong creating the account.' });
  }
});

// POST /api/auth/signin
router.post('/signin', async (req, res) => {
  const { email, password } = req.body || {};

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required.' });
  }

  try {
    const user = await userService.findUserByEmail(email);

    // Passwords are stored unhashed 
    if (!user || user.password !== password) {
      return res.status(401).json({ message: 'Incorrect email or password.' });
    }

    req.session.userId = user._id.toString();

    const { password: _password, ...safeUser } = user;
    return res.status(200).json({ message: 'Signed in.', user: safeUser });
  } catch (error) {
    console.error('Signin failed:', error);
    return res.status(500).json({ message: 'Something went wrong signing in.' });
  }
});

// POST /api/auth/signout
router.post('/signout', (req, res) => {
  req.session.destroy((error) => {
    if (error) {
      console.error('Signout failed:', error);
      return res.status(500).json({ message: 'Something went wrong signing out.' });
    }
    res.clearCookie('connect.sid');
    return res.status(200).json({ message: 'Signed out.' });
  });
});

// GET /api/auth/me - used by the frontend on load to check for an existing session
router.get('/me', async (req, res) => {
  if (!req.session?.userId) {
    return res.status(401).json({ message: 'Not signed in.' });
  }

  try {
    const user = await userService.getUserById(req.session.userId);
    if (!user) {
      return res.status(401).json({ message: 'Not signed in.' });
    }
    return res.status(200).json({ user });
  } catch (error) {
    console.error('Fetching current user failed:', error);
    return res.status(500).json({ message: 'Something went wrong.' });
  }
});

export default router;
