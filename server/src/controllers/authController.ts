import { Response } from 'express';
import User, { IUser } from '../models/User.js';
import { AuthRequest } from '../middleware/auth.middleware.js';

export const signup = async (req: AuthRequest, res: Response) => {
  try {
    const { username, email, password, ageRange } = req.body;

    // Validate input
    if (!username || !email || !password || !ageRange) {
      console.log('❌ Missing fields:', { username: !!username, email: !!email, password: !!password, ageRange: !!ageRange });
      return res.status(400).json({ error: 'Missing required fields' });
    }

    console.log('✅ Creating user:', username, email);

    // Check if user already exists
    const existingUser = await User.findOne({
      $or: [{ email: email.toLowerCase() }, { username: username.toLowerCase() }]
    });

    if (existingUser) {
      console.log('❌ User already exists:', email);
      return res.status(400).json({ error: 'Email or username already exists' });
    }

    // Create new user
    const newUser = new User({
      username: username.trim(),
      email: email.toLowerCase().trim(),
      passwordHash: password,
      ageRange: ageRange.trim()
    });

    console.log('💾 Saving user to database...');

    // Save user to database
    const savedUser = await newUser.save();
    console.log('✅ User saved to MongoDB:', savedUser._id);

    // Authenticate user session
    console.log('🔐 Authenticating session...');
    req.logIn(savedUser, (err) => {
      if (err) {
        console.error('❌ Login error:', err);
        return res.status(500).json({ error: 'Failed to create session' });
      }

      console.log('✅ User logged in successfully');
      res.status(201).json({
        message: 'User created successfully',
        user: {
          id: savedUser._id,
          username: savedUser.username,
          email: savedUser.email,
          ageRange: savedUser.ageRange
        }
      });
    });
  } catch (error: any) {
    console.error('❌ Signup error:', error);

    // Handle duplicate key error
    if (error.code === 11000) {
      const field = Object.keys(error.keyPattern)[0];
      console.log(`Duplicate key for field: ${field}`);
      return res.status(400).json({ error: `${field} already exists` });
    }

    // Handle validation errors
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors)
        .map((err: any) => err.message)
        .join(', ');
      console.log('Validation error:', messages);
      return res.status(400).json({ error: messages });
    }

    console.error('Stack:', error.stack);
    res.status(500).json({ error: 'Failed to create account' });
  }
};

export const login = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const user = req.user as IUser;
    res.json({
      message: 'Logged in successfully',
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        ageRange: user.ageRange
      }
    });
  } catch (error) {
    res.status(500).json({ error: 'Login failed' });
  }
};

export const logout = (req: AuthRequest, res: Response) => {
  req.logOut((err) => {
    if (err) {
      return res.status(500).json({ error: 'Logout failed' });
    }
    res.json({ message: 'Logged out successfully' });
  });
};

export const getCurrentUser = (req: AuthRequest, res: Response) => {
  if (!req.user) {
    return res.status(401).json({ error: 'Not authenticated' });
  }

  const user = req.user as IUser;
  res.json({
    user: {
      id: user._id,
      username: user.username,
      email: user.email,
      ageRange: user.ageRange
    }
  });
};
