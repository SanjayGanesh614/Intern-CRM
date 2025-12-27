import bcrypt from 'bcryptjs'
import { connectMongo } from '../db/mongo.js'
import { env } from '../config/env.js'
import { User } from '../models/User.js'

async function run() {
  if (!env.mongoUri) throw new Error('MONGODB_URI required')
  await connectMongo()
  const email = 'admin@example.com'.toLowerCase().trim()
  const name = 'Admin'
  const password = 'admin123'
  const existing = await User.findOne({ email })
  if (existing) {
    process.stdout.write(`admin exists: ${existing.user_id}\n`)
    process.exit(0)
  }
  const password_hash = await bcrypt.hash(password, 10)
  const user = await User.create({ name, email, password_hash, role: 'admin' })
  process.stdout.write(`admin created: ${user.user_id} email=${email} password=${password}\n`)
  process.exit(0)
}

run().catch(err => {
  process.stderr.write(`seed error: ${err.message}\n`)
  process.exit(1)
})
