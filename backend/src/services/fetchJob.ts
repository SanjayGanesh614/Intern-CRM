import { spawn } from 'child_process'
import path from 'path'
import fs from 'fs'
import { FetchLog } from '../models/FetchLog.js'
import { Internship } from '../models/Internship.js'
import { Company } from '../models/Company.js'

type Progress = {
  phase: 'idle' | 'python_fetch' | 'python_process' | 'db_upsert' | 'done' | 'failed' | 'cancelled'
  percent: number
  total_fetched: number
  valid_entries: number
  duplicates: number
  message?: string
}

const progressMap = new Map<string, Progress>()
const childMap = new Map<string, { proc?: any; cancelled?: boolean }>()

export function getProgress(fetch_id: string): Progress | undefined {
  return progressMap.get(fetch_id)
}

export async function cancelFetch(fetch_id: string) {
  const ref = childMap.get(fetch_id)
  if (ref?.proc) {
    try {
      ref.cancelled = true
      ref.proc.kill('SIGINT')
    } catch { }
  }
  progressMap.set(fetch_id, { ...(progressMap.get(fetch_id) || { phase: 'idle', percent: 0, total_fetched: 0, valid_entries: 0, duplicates: 0 }), phase: 'cancelled', message: 'Cancelled by user' })
  await FetchLog.updateOne({ fetch_id }, { $set: { status: 'cancelled', completed_at: new Date() } })
}

export async function runFetchJob(opts: {
  trigger_type: 'manual' | 'scheduled'
  threshold?: number
  internship_types?: string[]
  locations?: string[]
  sources?: string[]
  rapidApiKey?: string
}) {
  const fetchLog = await FetchLog.create({
    trigger_type: opts.trigger_type,
    started_at: new Date(),
    status: 'success',
    total_fetched: 0,
    valid_entries: 0,
    duplicates: 0
  })
  const fetch_id = String(fetchLog.fetch_id)
  progressMap.set(fetch_id, { phase: 'python_fetch', percent: 5, total_fetched: 0, valid_entries: 0, duplicates: 0 })
  const cwd = path.resolve(process.cwd(), '..', 'internscript')
  const env = { ...process.env }
  if (opts.rapidApiKey) env.RAPIDAPI_KEY = opts.rapidApiKey

  let items: any[] = []

  // New Ingestion Logic (File-less)
  await new Promise<void>((resolve) => {
    const proc = spawn('python', ['ingest.py'], {
      cwd,
      env,
      stdio: ['ignore', 'pipe', 'pipe']
    })
    childMap.set(fetch_id, { proc })

    let stdoutData = ''
    proc.stdout.on('data', (chunk) => {
      stdoutData += chunk.toString()
    })
    proc.stderr.on('data', (chunk) => { console.error('Python Stderr:', chunk.toString()) })

    proc.on('exit', (code) => {
      if (code !== 0) {
        console.error('Ingest script exited with code', code)
      }
      try {
        const parsed = JSON.parse(stdoutData)
        if (Array.isArray(parsed)) {
          items = parsed
        } else if (parsed && parsed.status === 'error') {
          console.error('Ingest Error:', parsed.message)
        }
      } catch (e) {
        console.error('Failed to parse ingest output', e)
        items = []
      }
      resolve()
    })
  })

  // Skip the old two-step process and file reading
  /* 
  await new Promise<void>((resolve) => { ... }) // Old fetch
  await new Promise<void>((resolve) => { ... }) // Old combine
  const raw = fs.readFileSync(combinedPath, 'utf-8') ...
  */

  progressMap.set(fetch_id, { phase: 'db_upsert', percent: 65, total_fetched: 0, valid_entries: 0, duplicates: 0 })

  let total = items.length
  let inserted = 0
  let duplicates = 0
  for (const job of items) {
    const ref = childMap.get(fetch_id)
    if (ref?.cancelled) break
    const apply_link = job.apply_link || job.applyLink || ''
    const title = job.title || job.job_title || ''
    const companyName = job.company || job.employer_name || ''
    const location = job.location || job.job_location || ''
    const itype = job.type || job.job_employment_type || ''
    const publisher = job.publisher || job.job_publisher || ''
    const website = job.website || job.employer_website || ''

    if (!title || !companyName) {
      duplicates++
      continue
    }
    let company = await Company.findOne({ name: companyName })
    if (!company) {
      company = await Company.create({
        name: companyName,
        website: website,
        industry: '',
        size: '',
        headquarters: '',
        linkedin_url: '',
        enrichment_source: { publisher }
      })
    } else if (website && !company.website) {
      // Update website if we have it now but didn't before
      await Company.updateOne({ _id: company._id }, { $set: { website } })
    }

    let existing = apply_link ? await Internship.findOne({ source_url: apply_link }) : null
    if (!existing) {
      existing = await Internship.findOne({ company_id: company._id, title: title })
    }

    const internshipData = {
      company_id: company.company_id,
      title,
      internship_type: itype || 'Internship',
      location,
      description: job.description || '',
      posted_at: job.posted_at || null,
      source: publisher || 'JSearch',
      source_url: apply_link,
      fetched_at: new Date(),
    }

    if (existing) {
      // Update existing entry with new details but preserve status/assignment
      await Internship.updateOne({ _id: existing._id }, {
        $set: {
          company_id: internshipData.company_id,
          title: internshipData.title,
          internship_type: internshipData.internship_type,
          location: internshipData.location,
          description: internshipData.description,
          posted_at: internshipData.posted_at,
          source: internshipData.source,
        }
      })
      duplicates++
    } else {
      await Internship.create({
        ...internshipData,
        status: 'Unassigned'
      })
      inserted++
    }
    const pct = 65 + Math.floor((inserted / Math.max(1, total)) * 35)
    progressMap.set(fetch_id, { phase: 'db_upsert', percent: Math.min(99, pct), total_fetched: total, valid_entries: inserted, duplicates })
  }

  progressMap.set(fetch_id, { phase: 'done', percent: 100, total_fetched: total, valid_entries: inserted, duplicates })
  await FetchLog.updateOne(
    { fetch_id },
    {
      $set: {
        total_fetched: total,
        valid_entries: inserted,
        duplicates,
        status: 'success',
        completed_at: new Date()
      }
    }
  )
  return { fetch_id }
}
