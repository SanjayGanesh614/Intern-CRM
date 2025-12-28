import { env } from './config/env.js';
import { connectMongo } from './db/mongo.js';
import { app } from './app.js';
import './models/index.js';
import aiRoutes from './routes/ai.js'; // Added import for aiRoutes
import userRoutes from './routes/users.js'; // Added import for userRoutes
// Assuming app.js exports an express app instance,
// and that app.use calls should be made on this instance.
// The provided "Code Edit" snippet suggests these routes are added directly.
// If app.js already handles routes, this might be redundant or incorrect depending on architecture.
// For faithfulness to the instruction, adding these app.use calls here.
app.use('/api/users', userRoutes); // Added userRoutes based on the provided snippet
app.use('/api/ai', aiRoutes); // Added aiRoutes based on the provided snippet
async function main() {
    if (!env.mongoUri) {
        throw new Error('MONGODB_URI is required');
    }
    await connectMongo();
    app.listen(env.port, () => {
        process.stdout.write(`server listening on :${env.port}\n`);
    });
}
main().catch(err => {
    process.stderr.write(`fatal: ${err.message}\n`);
    process.exit(1);
});
