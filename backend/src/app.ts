import express from 'express'
import cors from 'cors'
import morgan from 'morgan'
import { authRouter } from './routes/auth'
import { usersRouter } from './routes/users'
import { companiesRouter } from './routes/companies'
import { internshipsRouter } from './routes/internships'
import { remarksRouter } from './routes/remarks'
import { followupsRouter } from './routes/followups'
import { activityRouter } from './routes/activity'
import { fetchRouter } from './routes/fetch'

export const app = express()
app.use(cors())
app.use(express.json({ limit: '1mb' }))
app.use(morgan('dev'))

app.get('/health', (_req, res) => {
  res.json({ ok: true })
})

app.use('/auth', authRouter)
app.use('/users', usersRouter)
app.use('/companies', companiesRouter)
app.use('/internships', internshipsRouter)
app.use('/', remarksRouter)
app.use('/', followupsRouter)
app.use('/', activityRouter)
app.use('/', fetchRouter)
