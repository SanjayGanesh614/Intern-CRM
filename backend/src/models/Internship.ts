import { Schema, model } from 'mongoose'
import { v4 as uuidv4 } from 'uuid'

const InternshipSchema = new Schema(
  {
    internship_id: { type: String, default: uuidv4, unique: true, index: true },
    company_id: { type: String, required: true, index: true },
    title: { type: String, required: true },
    internship_type: { type: String },
    location: { type: String },
    start_date: { type: Date },
    end_date: { type: Date },
    source: { type: String },
    source_url: { type: String },
    fetched_at: { type: Date, required: true, index: true },
    status: {
      type: String,
      enum: [
        'Unassigned',
        'Contacted',
        'Follow-up',
        'Meeting Scheduled',
        'Interested',
        'Not Interested',
        'Onboarded',
        'Rejected'
      ],
      default: 'Unassigned',
      index: true
    },
    assigned_to: { type: String, index: true },
    last_contacted: { type: Date },
    follow_up_date: { type: Date, index: true }
  },
  { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } }
)

InternshipSchema.index({ status: 1 })
InternshipSchema.index({ assigned_to: 1 })
InternshipSchema.index({ follow_up_date: 1 })
InternshipSchema.index({ company_id: 1 })
InternshipSchema.index({ fetched_at: 1 })

export const Internship = model('internships', InternshipSchema)
