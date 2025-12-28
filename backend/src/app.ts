import express from 'express'
import cors from 'cors'
import morgan from 'morgan'
import { authRouter } from './routes/auth.js'
import { companiesRouter } from './routes/companies.js'
import { internshipsRouter } from './routes/internships.js'
import { remarksRouter } from './routes/remarks.js'
import { followupsRouter } from './routes/followups.js'
import { activityRouter } from './routes/activity.js'
import { fetchRouter } from './routes/fetch.js'
import { analyticsRouter } from './routes/analytics.js'
import usersRouter from './routes/users.js'
import aiRoutes from './routes/ai.js'

export const app = express()
app.use(cors())
app.use(express.json({ limit: '1mb' }))
app.use(morgan('dev'))

app.get('/health', (_req, res) => {
  res.json({ ok: true })
})

app.use('/auth', authRouter)
app.use('/companies', companiesRouter)
app.use('/internships', internshipsRouter)
app.use('/', remarksRouter)
app.use('/', followupsRouter)
app.use('/', activityRouter)
app.use('/', fetchRouter)
app.use('/analytics', analyticsRouter)
app.use('/users', usersRouter)
app.use('/ai', aiRoutes)
