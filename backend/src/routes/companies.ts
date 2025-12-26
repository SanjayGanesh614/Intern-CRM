import { Router } from 'express'
import { auth } from '../middleware/auth'
import { requireRole } from '../middleware/roles'
import { Company } from '../models/Company'

export const companiesRouter = Router()

companiesRouter.get('/', auth, async (req, res) => {
  const { industry, size, search } = req.query
  const q: any = {}
  if (industry) q.industry = industry
  if (size) q.size = size
  if (search) q.name = { $regex: String(search), $options: 'i' }
  const companies = await Company.find(q).lean()
  res.json(companies)
})

companiesRouter.get('/:company_id', auth, async (req, res) => {
  const { company_id } = req.params
  const company = await Company.findOne({ company_id }).lean()
  if (!company) return res.status(404).json({ error: 'not_found' })
  res.json(company)
})

companiesRouter.post('/', auth, requireRole(['admin']), async (req, res) => {
  const { name, website, industry, size, headquarters, linkedin_url, enrichment_source } = req.body || {}
  if (!name) return res.status(400).json({ error: 'invalid_body' })
  const company = await Company.create({ name, website, industry, size, headquarters, linkedin_url, enrichment_source })
  res.status(201).json({ company_id: company.company_id })
})

companiesRouter.patch('/:company_id', auth, requireRole(['admin']), async (req, res) => {
  const { company_id } = req.params
  const update = req.body || {}
  await Company.updateOne({ company_id }, { $set: update })
  res.json({ ok: true })
})
