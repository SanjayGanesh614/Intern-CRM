import { Router } from 'express'
import { auth } from '../middleware/auth'
import { requireRole } from '../middleware/roles'
import { Internship } from '../models/Internship'
import { Company } from '../models/Company'
import { Remark } from '../models/Remark'
import { FollowUp } from '../models/FollowUp'
import { ActivityLog } from '../models/ActivityLog'
import { parsePagination, parseSort } from '../utils/pagination'
import { assignInternship } from '../services/assign'
import { logActivity } from '../services/activity'
import { updateStatus } from '../services/status'

export const internshipsRouter = Router()

internshipsRouter.get('/', auth, async (req, res) => {
  const { page, pageSize, skip } = parsePagination(req.query)
  const { sortSpec } = parseSort(req.query)
  const q: any = {}
  const { status, internship_type, location, source, assigned_user, search, start, end } = req.query
  if (status) q.status = status
  if (internship_type) q.internship_type = internship_type
  if (location) q.location = location
  if (source) q.source = source
  if (assigned_user) q.assigned_to = assigned_user
  if (search) q.title = { $regex: String(search), $options: 'i' }
  if (start || end) {
    q.fetched_at = {}
    if (start) q.fetched_at.$gte = new Date(String(start))
    if (end) q.fetched_at.$lte = new Date(String(end))
  }
  const [items, total] = await Promise.all([
    Internship.find(q).sort(sortSpec).skip(skip).limit(pageSize).lean(),
    Internship.countDocuments(q)
  ])
  res.json({ items, page, pageSize, total })
})

internshipsRouter.get('/:id', auth, async (req, res) => {
  const { id } = req.params
  const internship = await Internship.findOne({ internship_id: id }).lean()
  if (!internship) return res.status(404).json({ error: 'not_found' })
  const [company, remarks, followups, activity] = await Promise.all([
    Company.findOne({ company_id: internship.company_id }).lean(),
    Remark.find({ internship_id: id }).sort({ created_at: -1 }).lean(),
    FollowUp.find({ internship_id: id }).sort({ due_date: 1 }).lean(),
    ActivityLog.find({ internship_id: id }).sort({ created_at: -1 }).lean()
  ])
  res.json({ internship, company, remarks, followups, activity })
})

internshipsRouter.patch('/:id', auth, async (req, res) => {
  const { id } = req.params
  const update = req.body || {}
  const actor = (req as any).user
  const internship = await Internship.findOne({ internship_id: id })
  if (!internship) return res.status(404).json({ error: 'not_found' })
  const fields: any = {}
  const allowed = [
    'title',
    'internship_type',
    'location',
    'start_date',
    'end_date',
    'source',
    'source_url',
    'last_contacted'
  ]
  for (const k of allowed) if (update[k] !== undefined) fields[k] = update[k]
  const assigned_to = update.assigned_to
  if (assigned_to !== undefined && assigned_to !== internship.assigned_to) {
    await assignInternship({ internship_id: id, new_assignee: assigned_to || '', actor_user_id: actor.user_id })
  }
  if (Object.keys(fields).length > 0) {
    await Internship.updateOne({ internship_id: id }, { $set: fields })
    await logActivity({
      user_id: actor.user_id,
      internship_id: id,
      company_id: internship.company_id,
      action_type: 'assigned',
      metadata: { update: fields }
    })
  }
  res.json({ ok: true })
})

internshipsRouter.delete('/:id', auth, requireRole(['admin']), async (req, res) => {
  const { id } = req.params
  await Internship.deleteOne({ internship_id: id })
  res.json({ ok: true })
})

internshipsRouter.patch('/:id/status', auth, async (req, res) => {
  const { id } = req.params
  const { new_status, remark } = req.body || {}
  const actor = (req as any).user
  if (!new_status) return res.status(400).json({ error: 'invalid_body' })
  await updateStatus({ internship_id: id, new_status, actor_user_id: actor.user_id, remark })
  res.json({ ok: true })
})
