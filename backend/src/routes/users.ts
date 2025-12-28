import { Router } from 'express';
import { User } from '../models/User.js';
import { auth, requireAdmin } from '../middleware/auth.js';
import bcrypt from 'bcryptjs';

const router = Router();

// Create User
router.post('/', auth, requireAdmin, async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password || !role) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ error: 'Email already exists' });
    }

    const password_hash = await bcrypt.hash(password, 10);
    const user = await User.create({
      name,
      email,
      password_hash,
      role,
      active_load: 0
    });

    res.status(201).json({
      user_id: user.user_id,
      name: user.name,
      email: user.email,
      role: user.role
    });
  } catch (error) {
    console.error('Create User Error:', error);
    res.status(500).json({ error: 'Failed to create user' });
  }
});

// List all users
router.get('/', auth, async (req, res) => {
  try {
    const users = await User.find({}, '-password_hash').sort({ created_at: -1 });
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

// Update user role
router.patch('/:id/role', auth, requireAdmin, async (req, res) => {
  try {
    const { role } = req.body;
    if (!['admin', 'user'].includes(role)) {
      return res.status(400).json({ error: 'Invalid role' });
    }

    const user = await User.findOneAndUpdate(
      { user_id: req.params.id },
      { role },
      { new: true, fields: '-password_hash' }
    );

    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update role' });
  }
});

// Delete user
router.delete('/:id', auth, requireAdmin, async (req, res) => {
  try {
    const user = await User.findOneAndDelete({ user_id: req.params.id });
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json({ success: true, user_id: req.params.id });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete user' });
  }
});

export default router;
