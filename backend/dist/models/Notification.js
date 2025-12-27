import { Schema, model } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';
const NotificationSchema = new Schema({
    notification_id: { type: String, default: uuidv4, unique: true, index: true },
    user_id: { type: String, required: true, index: true }, // Ideally User ID
    type: {
        type: String,
        enum: ['info', 'warning', 'success', 'error'],
        default: 'info'
    },
    title: { type: String, required: true },
    message: { type: String, required: true },
    is_read: { type: Boolean, default: false },
    related_entity_id: { type: String }, // e.g. internship_id
    link: { type: String }, // Optional frontend link to navigate to
}, { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } });
NotificationSchema.index({ user_id: 1, is_read: 1 });
NotificationSchema.index({ created_at: -1 });
export const Notification = model('notifications', NotificationSchema);
