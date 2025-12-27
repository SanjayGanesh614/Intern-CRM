import { Schema, model } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';
const UserSchema = new Schema({
    user_id: { type: String, default: uuidv4, unique: true, index: true },
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, index: true },
    password_hash: { type: String, required: true },
    role: { type: String, enum: ['admin', 'sales', 'viewer'], required: true },
    active_load: { type: Number, default: 0 }
}, { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } });
export const User = model('users', UserSchema);
