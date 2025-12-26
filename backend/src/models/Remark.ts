import { Schema, model } from 'mongoose'
import { v4 as uuidv4 } from 'uuid'

const RemarkSchema = new Schema(
  {
    remark_id: { type: String, default: uuidv4, unique: true, index: true },
    internship_id: { type: String, required: true, index: true },
    user_id: { type: String, required: true, index: true },
    note: { type: String, required: true }
  },
  { timestamps: { createdAt: 'created_at', updatedAt: false } }
)

export const Remark = model('remarks', RemarkSchema)
