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
    description: { type: String },
    posted_at: { type: String },
    fetched_at: { type: Date, required: true, index: true },
    status: {
      type: String,
      enum: [
        'Unassigned',
        'Applied',
        'Contacted',
        'Interview',
        'Offer',
        'Ghosted',
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



export const Internship = model('internships', InternshipSchema)
