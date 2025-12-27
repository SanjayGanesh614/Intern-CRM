import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';
export function auth(req, res, next) {
    const hdr = req.headers.authorization || '';
    const token = hdr.startsWith('Bearer ') ? hdr.slice(7) : '';
    if (!token)
        return res.status(401).json({ error: 'unauthorized' });
    try {
        const payload = jwt.verify(token, env.jwtSecret);
        req.user = payload;
        next();
    }
    catch {
        res.status(401).json({ error: 'invalid_token' });
    }
}
export function requireAdmin(req, res, next) {
    const user = req.user;
    if (!user || user.role !== 'admin') {
        return res.status(403).json({ error: 'forbidden_admin_only' });
    }
    next();
}
