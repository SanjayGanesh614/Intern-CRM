import { Router } from 'express'
import { auth } from '../middleware/auth.js'
import { requireRole } from '../middleware/roles.js'
import { Internship } from '../models/Internship.js'
import { Company } from '../models/Company.js'
import { Remark } from '../models/Remark.js'
import { FollowUp } from '../models/FollowUp.js'
import { ActivityLog } from '../models/ActivityLog.js'
import { parsePagination, parseSort } from '../utils/pagination.js'
import { assignInternship } from '../services/assign.js'
import { logActivity } from '../services/activity.js'
import { updateStatus } from '../services/status.js'

export const internshipsRouter = Router()

// Bulk Assign
internshipsRouter.post('/bulk/assign', auth, async (req, res) => {
  const { ids, assigned_to } = req.body || {}
  const actor = (req as any).user
  if (!ids || !Array.isArray(ids) || ids.length === 0) return res.status(400).json({ error: 'invalid_ids' })

  await Promise.all(ids.map(id => assignInternship({ internship_id: id, new_assignee: assigned_to || '', actor_user_id: actor.user_id })))

  res.json({ ok: true, count: ids.length })
})

// Bulk Status Update
internshipsRouter.post('/bulk/status', auth, async (req, res) => {
  const { ids, new_status, remark } = req.body || {}
  const actor = (req as any).user
  if (!ids || !Array.isArray(ids) || ids.length === 0) return res.status(400).json({ error: 'invalid_ids' })
  if (!new_status) return res.status(400).json({ error: 'invalid_status' })

  // Process in parallel
  // NOTE: For thousands of items, we might want to batch this or use a queue.
  await Promise.all(ids.map(id => updateStatus({ internship_id: id, new_status, actor_user_id: actor.user_id, remark })))

  res.json({ ok: true, count: ids.length })
})

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

  if (start || end) {
    q.fetched_at = {}
    if (start) q.fetched_at.$gte = new Date(String(start))
    if (end) q.fetched_at.$lte = new Date(String(end))
  }

  // Handle Search separately because we need to search on company name (after lookup) or title
  // But for efficiency, we search title first if possible.
  if (search) {
    q.$or = [
      { title: { $regex: String(search), $options: 'i' } }
      // Company name search requires looking up first, handling below in pipeline match if needed
      // For now, basic title search. Company name search can be added by adding a post-lookup match.
    ]
  }

  const pipeline: any[] = [
    { $match: q },
    {
      $lookup: {
        from: 'companies',
        localField: 'company_id',
        foreignField: 'company_id',
        as: 'company'
      }
    },
    { $unwind: { path: '$company', preserveNullAndEmptyArrays: true } },
    {
      $lookup: {
        from: 'users',
        localField: 'assigned_to',
        foreignField: 'user_id',
        as: 'assignee'
      }
    },
    { $unwind: { path: '$assignee', preserveNullAndEmptyArrays: true } },
    {
      $project: {
        internship_id: 1,
        company_id: 1,
        title: 1,
        internship_type: 1,
        location: 1,
        start_date: 1,
        end_date: 1,
        source: 1,
        source_url: 1,
        fetched_at: 1,
        status: 1,
        assigned_to: 1,
        last_contacted: 1,
        follow_up_date: 1,
        company_name: '$company.name',
        company_industry: '$company.industry',
        company_website: '$company.website',
        assignee_name: '$assignee.name'
      }
    }
  ]

  // Apply Sort
  if (Object.keys(sortSpec).length > 0) {
    pipeline.push({ $sort: sortSpec })
  }

  const [items, totalCount] = await Promise.all([
    Internship.aggregate([
      ...pipeline,
      { $skip: skip },
      { $limit: pageSize }
    ]),
    Internship.aggregate([
      ...pipeline,
      { $count: 'total' }
    ])
  ])

  const total = totalCount.length > 0 ? totalCount[0].total : 0
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
    if (actor.role === 'sales' && assigned_to !== actor.user_id && assigned_to !== '') {
      return res.status(403).json({ error: 'forbidden: sales users can only assign to themselves' })
    }
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
