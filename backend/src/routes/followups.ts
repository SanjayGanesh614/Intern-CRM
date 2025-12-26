import { Router } from 'express'
import { auth } from '../middleware/auth'
import { FollowUp } from '../models/FollowUp'
import { logActivity } from '../services/activity'

export const followupsRouter = Router()

followupsRouter.post('/internships/:id/followups', auth, async (req, res) => {
  const { id } = req.params
  const actor = (req as any).user
  const { due_date, notes } = req.body || {}
  if (!due_date) return res.status(400).json({ error: 'invalid_body' })
  const followup = await FollowUp.create({
    internship_id: id,
    user_id: actor.user_id,
    due_date: new Date(due_date),
    notes
  })
  await logActivity({
    user_id: actor.user_id,
    internship_id: id,
    action_type: 'followup_created',
    metadata: { followup_id: followup.followup_id }
  })
  res.status(201).json({ followup_id: followup.followup_id })
})

followupsRouter.get('/internships/:id/followups', auth, async (req, res) => {
  const { id } = req.params
  const items = await FollowUp.find({ internship_id: id }).sort({ due_date: 1 }).lean()
  res.json(items)
})

followupsRouter.patch('/followups/:followup_id', auth, async (req, res) => {
  const { followup_id } = req.params
  const actor = (req as any).user
  const { due_date, notes } = req.body || {}
  const update: any = {}
  if (due_date) update.due_date = new Date(due_date)
  if (notes !== undefined) update.notes = notes
  await FollowUp.updateOne({ followup_id }, { $set: update })
  await logActivity({
    user_id: actor.user_id,
    internship_id: '',
    action_type: 'followup_updated',
    metadata: { followup_id, update }
  })
  res.json({ ok: true })
})

followupsRouter.patch('/followups/:followup_id/complete', auth, async (req, res) => {
  const { followup_id } = req.params
  const actor = (req as any).user
  const item = await FollowUp.findOne({ followup_id })
  if (!item) return res.status(404).json({ error: 'not_found' })
  await FollowUp.deleteOne({ followup_id })
  await logActivity({
    user_id: actor.user_id,
    internship_id: item.internship_id,
    action_type: 'followup_updated',
    metadata: { followup_id, completed: true }
  })
  res.json({ ok: true })
})
