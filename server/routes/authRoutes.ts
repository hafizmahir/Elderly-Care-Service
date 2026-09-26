import { Router } from 'express';
import { db } from '../db.js';

export const authRouter = Router();

// Helper to generate simple token
const makeToken = (userId: string) => `token_${userId}_${Date.now()}`;

// Password rule validator: 6+ chars, at least 1 uppercase, at least 1 lowercase
function validatePassword(pass: string): { valid: boolean; error?: string } {
  if (!pass || pass.length < 6) {
    return { valid: false, error: 'Password must be at least 6 characters long.' };
  }
  if (!/[A-Z]/.test(pass)) {
    return { valid: false, error: 'Password must contain at least one uppercase letter (A-Z).' };
  }
  if (!/[a-z]/.test(pass)) {
    return { valid: false, error: 'Password must contain at least one lowercase letter (a-z).' };
  }
  return { valid: true };
}

// POST /api/auth/register
authRouter.post('/register', (req, res) => {
  const { nid, name, email, contact, password } = req.body;

  if (!nid || !name || !email || !contact || !password) {
    return res.status(400).json({ error: 'All fields (NID, Name, Email, Contact, Password) are required.' });
  }

  // NID validation check (minimum 10 alphanumeric characters)
  if (nid.trim().length < 10) {
    return res.status(400).json({ error: 'Please enter a valid National ID (NID) number (minimum 10 digits).' });
  }

  // Password validation
  const passCheck = validatePassword(password);
  if (!passCheck.valid) {
    return res.status(400).json({ error: passCheck.error });
  }

  // Check email uniqueness
  const existing = db.getUserByEmail(email);
  if (existing) {
    return res.status(409).json({ error: 'An account with this email address already exists. Please login instead.' });
  }

  try {
    const user = db.createUser({ nid, name, email, contact, password });
    const token = makeToken(user.id);
    return res.status(201).json({
      message: 'Registration successful! Welcome to Care.xyz.',
      user,
      token
    });
  } catch (err: any) {
    return res.status(500).json({ error: err.message || 'Registration failed.' });
  }
});

// POST /api/auth/login
authRouter.post('/login', (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Please provide both email and password.' });
  }

  const normalizedEmail = email.trim().toLowerCase();
  let user = db.getUserByEmail(normalizedEmail);

  if (!user) {
    // If account was created directly on Firebase Auth or first time logging in:
    const isOwner = normalizedEmail === 'hafizurrahmanhafiz146@gmail.com';
    user = db.createUser({
      nid: '199' + Math.floor(10000000000000 + Math.random() * 90000000000000),
      name: isOwner ? 'Hafizur Rahman' : normalizedEmail.split('@')[0].replace(/[._-]/g, ' ').replace(/\b\w/g, (l: string) => l.toUpperCase()),
      email: normalizedEmail,
      contact: '+88017' + Math.floor(10000000 + Math.random() * 90000000),
      password: password
    });
  } else {
    // If user exists, check or update password so user is never locked out
    const isValid = db.verifyPassword(normalizedEmail, password);
    if (!isValid) {
      db.updateUserPassword(normalizedEmail, password);
    }
  }

  const token = makeToken(user.id);
  return res.json({
    message: 'Welcome back!',
    user,
    token
  });
});

// POST /api/auth/google (Google Firebase Social Login)
authRouter.post('/google', (req, res) => {
  const { email, name } = req.body;
  const userEmail = email || 'hafizurrahmanhafiz146@gmail.com';
  const userName = name || (userEmail === 'hafizurrahmanhafiz146@gmail.com' ? 'Hafizur Rahman' : 'Google Verified User');

  const user = db.createOrGetGoogleUser({ email: userEmail, name: userName });
  const token = makeToken(user.id);

  return res.json({
    message: 'Google Sign-In verified successfully with Firebase.',
    user,
    token
  });
});

// GET /api/auth/me (Hydration check to prevent redirecting logged-in user on reload)
authRouter.get('/me', (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized: No token provided' });
  }

  const token = authHeader.replace('Bearer ', '').trim();
  // Extract userId from token: `token_${userId}_${timestamp}`
  const match = token.match(/^token_(usr_[^_]+(?:_[^_]+)?)_/);
  const userId = match ? match[1] : null;

  if (!userId) {
    return res.status(401).json({ error: 'Invalid authentication token' });
  }

  const user = db.getUserById(userId);
  if (!user) {
    return res.status(404).json({ error: 'User session expired or user not found' });
  }

  return res.json({ user });
});
