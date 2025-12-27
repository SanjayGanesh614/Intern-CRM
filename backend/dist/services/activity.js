import { ActivityLog } from '../models/ActivityLog.js';
export async function logActivity(data) {
    await ActivityLog.create(data);
}
