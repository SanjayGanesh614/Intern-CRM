import { Router } from 'express'
import { auth } from '../middleware/auth'
import { ActivityLog } from '../models/ActivityLog'

export const activityRouter = Router()

activityRouter.get('/internships/:id/activity', auth, async (req, res) => {
  const { id } = req.params
  const items = await ActivityLog.find({ internship_id: id }).sort({ created_at: -1 }).lean()
  res.json(items)
})

activityRouter.get('/companies/:id/activity', auth, async (req, res) => {
  const { id } = req.params
  const items = await ActivityLog.find({ company_id: id }).sort({ created_at: -1 }).lean()
  res.json(items)
})
