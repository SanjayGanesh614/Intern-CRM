import { Router } from 'express'
import bcrypt from 'bcryptjs'
import { auth } from '../middleware/auth'
import { requireRole } from '../middleware/roles'
import { User } from '../models/User'

export const usersRouter = Router()

usersRouter.get('/', auth, requireRole(['admin']), async (_req, res) => {
  const users = await User.find().lean()
  res.json(users)
})

usersRouter.post('/', auth, requireRole(['admin']), async (req, res) => {
  const { name, email, password, role } = req.body || {}
  if (!name || !email || !password || !role) return res.status(400).json({ error: 'invalid_body' })
  const existing = await User.findOne({ email })
  if (existing) return res.status(409).json({ error: 'email_exists' })
  const password_hash = await bcrypt.hash(password, 10)
  const user = await User.create({ name, email, password_hash, role })
  res.status(201).json({ user_id: user.user_id })
})

usersRouter.patch('/:user_id', auth, requireRole(['admin']), async (req, res) => {
  const { user_id } = req.params
  const { name, email, role } = req.body || {}
  const update: any = {}
  if (name) update.name = name
  if (email) update.email = email
  if (role) update.role = role
  await User.updateOne({ user_id }, { $set: update })
  res.json({ ok: true })
})

usersRouter.get('/:user_id/load', auth, requireRole(['admin']), async (req, res) => {
  const { user_id } = req.params
  const user = await User.findOne({ user_id })
  if (!user) return res.status(404).json({ error: 'not_found' })
  res.json({ active_load: user.active_load })
})
