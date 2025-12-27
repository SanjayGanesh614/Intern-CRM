import { ActivityLog } from '../models/ActivityLog.js'

export async function logActivity(data: {
  user_id: string
  internship_id: string
  company_id?: string
  action_type:
    | 'status_change'
    | 'note_added'
    | 'assigned'
    | 'ai_message_sent'
    | 'fetch_completed'
    | 'followup_created'
    | 'followup_updated'
  metadata?: any
}) {
  await ActivityLog.create(data)
}
