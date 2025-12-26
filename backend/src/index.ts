import { env } from './config/env'
import { connectMongo } from './db/mongo'
import { app } from './app'
import './models'

async function main() {
  if (!env.mongoUri) {
    throw new Error('MONGODB_URI is required')
  }
  await connectMongo()
  app.listen(env.port, () => {
    process.stdout.write(`server listening on :${env.port}\n`)
  })
}

main().catch(err => {
  process.stderr.write(`fatal: ${err.message}\n`)
  process.exit(1)
})
