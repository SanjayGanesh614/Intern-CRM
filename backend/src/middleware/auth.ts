import jwt from 'jsonwebtoken'
import { env } from '../config/env.js'
import { Request, Response, NextFunction } from 'express'

export function auth(req: Request, res: Response, next: NextFunction) {
  const hdr = req.headers.authorization || ''
  const token = hdr.startsWith('Bearer ') ? hdr.slice(7) : ''
  if (!token) return res.status(401).json({ error: 'unauthorized' })
  try {
    const payload = jwt.verify(token, env.jwtSecret) as any
      ; (req as any).user = payload
    next()
  } catch {
    res.status(401).json({ error: 'invalid_token' })
  }
}

export function requireAdmin(req: Request, res: Response, next: NextFunction) {
  const user = (req as any).user;
  if (!user || user.role !== 'admin') {
    return res.status(403).json({ error: 'forbidden_admin_only' });
  }
  next();
}
