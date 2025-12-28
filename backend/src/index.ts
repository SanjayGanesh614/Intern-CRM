import { env } from './config/env.js'
import { connectMongo } from './db/mongo.js'
import { app } from './app.js'
import './models/index.js'


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
