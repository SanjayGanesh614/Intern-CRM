import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User } from '../models/User.js';
import { env } from '../config/env.js';
export const authRouter = Router();
authRouter.post('/login', async (req, res) => {
    const { email, password } = req.body || {};
    if (!email || !password)
        return res.status(400).json({ error: 'invalid_body' });
    const normalizedEmail = email.toLowerCase().trim();
    const user = await User.findOne({ email: normalizedEmail });
    if (!user)
        return res.status(401).json({ error: 'invalid_credentials' });
    const ok = await bcrypt.compare(password, user.password_hash);
    if (!ok)
        return res.status(401).json({ error: 'invalid_credentials' });
    const token = jwt.sign({ user_id: user.user_id, role: user.role, email: user.email, name: user.name }, env.jwtSecret, {
        expiresIn: '12h'
    });
    res.json({ token, user: { user_id: user.user_id, name: user.name, email: user.email, role: user.role } });
});
authRouter.post('/logout', async (_req, res) => {
    res.json({ ok: true });
});
