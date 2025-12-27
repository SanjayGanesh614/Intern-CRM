import { Schema, model } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';
const FollowUpSchema = new Schema({
    followup_id: { type: String, default: uuidv4, unique: true, index: true },
    internship_id: { type: String, required: true, index: true },
    user_id: { type: String, required: true, index: true },
    due_date: { type: Date, required: true },
    notes: { type: String },
    reminder_sent: { type: Boolean, default: false }
}, { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } });
export const FollowUp = model('follow_ups', FollowUpSchema);
