import { Schema, model } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';
const InternshipStatusHistorySchema = new Schema({
    history_id: { type: String, default: uuidv4, unique: true, index: true },
    internship_id: { type: String, required: true, index: true },
    previous_status: { type: String, required: true },
    new_status: { type: String, required: true },
    updated_by: { type: String, required: true },
    remark: { type: String }
}, { timestamps: { createdAt: 'created_at', updatedAt: false } });
export const InternshipStatusHistory = model('internship_status_history', InternshipStatusHistorySchema);
