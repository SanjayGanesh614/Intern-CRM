import { Schema, model } from 'mongoose'
import { v4 as uuidv4 } from 'uuid'

const AIOutreachHistorySchema = new Schema(
  {
    message_id: { type: String, default: uuidv4, unique: true, index: true },
    internship_id: { type: String, required: true, index: true },
    company_id: { type: String, required: true, index: true },
    user_id: { type: String, required: true, index: true },
    message_text: { type: String, required: true },
    message_type: { type: String, enum: ['email', 'linkedin', 'followup', 'general'], required: true }
  },
  { timestamps: { createdAt: 'created_at', updatedAt: false } }
)

export const AIOutreachHistory = model('ai_outreach_history', AIOutreachHistorySchema)
