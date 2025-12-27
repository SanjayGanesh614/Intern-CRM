import { Router } from 'express'
import { auth } from '../middleware/auth.js'
import { requireRole } from '../middleware/roles.js'
import { runFetchJob, getProgress, cancelFetch } from '../services/fetchJob.js'

export const fetchRouter = Router()

fetchRouter.post('/fetch/run', auth, requireRole(['admin']), async (req, res) => {
  const { mode, threshold, internship_types, locations, sources } = req.body || {}
  const rapidApiKey = process.env.RAPIDAPI_KEY || ''
  const result = await runFetchJob({
    trigger_type: 'manual',
    threshold,
    internship_types,
    locations,
    sources,
    rapidApiKey
  })
  res.json(result)
})

fetchRouter.get('/fetch/status/:fetch_id', auth, async (req, res) => {
  const { fetch_id } = req.params
  const prog = getProgress(fetch_id)
  if (!prog) return res.status(404).json({ error: 'not_found' })
  res.json(prog)
})

fetchRouter.post('/fetch/cancel/:fetch_id', auth, requireRole(['admin']), async (req, res) => {
  const { fetch_id } = req.params
  await cancelFetch(fetch_id)
  res.json({ ok: true })
})
