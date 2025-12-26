import { Schema, model } from 'mongoose'
import { v4 as uuidv4 } from 'uuid'

const FetchLogSchema = new Schema(
  {
    fetch_id: { type: String, default: uuidv4, unique: true, index: true },
    trigger_type: { type: String, enum: ['manual', 'scheduled'], required: true },
    total_fetched: { type: Number, default: 0 },
    valid_entries: { type: Number, default: 0 },
    duplicates: { type: Number, default: 0 },
    started_at: { type: Date, required: true },
    completed_at: { type: Date },
    status: { type: String, enum: ['success', 'failed', 'cancelled'], required: true }
  },
  { timestamps: false }
)

export const FetchLog = model('fetch_log', FetchLogSchema)
