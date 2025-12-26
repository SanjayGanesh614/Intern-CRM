import { Schema, model } from 'mongoose'
import { v4 as uuidv4 } from 'uuid'

const ActivityLogSchema = new Schema(
  {
    activity_id: { type: String, default: uuidv4, unique: true, index: true },
    user_id: { type: String, required: true, index: true },
    internship_id: { type: String, required: true, index: true },
    company_id: { type: String },
    action_type: {
      type: String,
      enum: [
        'status_change',
        'note_added',
        'assigned',
        'ai_message_sent',
        'fetch_completed',
        'followup_created',
        'followup_updated'
      ],
      required: true
    },
    metadata: { type: Schema.Types.Mixed }
  },
  { timestamps: { createdAt: 'created_at', updatedAt: false } }
)

export const ActivityLog = model('activity_log', ActivityLogSchema)
