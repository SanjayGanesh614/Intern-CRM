import { Router } from 'express'
import { auth } from '../middleware/auth.js'
import { Remark } from '../models/Remark.js'
import { logActivity } from '../services/activity.js'

export const remarksRouter = Router()

remarksRouter.post('/internships/:id/remarks', auth, async (req, res) => {
  const { id } = req.params
  const actor = (req as any).user
  const { note } = req.body || {}
  if (!note) return res.status(400).json({ error: 'invalid_body' })
  const remark = await Remark.create({ internship_id: id, user_id: actor.user_id, note })
  await logActivity({
    user_id: actor.user_id,
    internship_id: id,
    action_type: 'note_added',
    metadata: { remark_id: remark.remark_id }
  })
  res.status(201).json({ remark_id: remark.remark_id })
})

remarksRouter.get('/internships/:id/remarks', auth, async (req, res) => {
  const { id } = req.params
  const remarks = await Remark.find({ internship_id: id }).sort({ created_at: -1 }).lean()
  res.json(remarks)
})
