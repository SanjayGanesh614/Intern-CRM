import { Internship } from '../models/Internship'
import { InternshipStatusHistory } from '../models/InternshipStatusHistory'
import { Remark } from '../models/Remark'
import { logActivity } from './activity'

export async function updateStatus(opts: {
  internship_id: string
  new_status: string
  actor_user_id: string
  remark?: string
}) {
  const internship = await Internship.findOne({ internship_id: opts.internship_id })
  if (!internship) return
  const previous_status = internship.status
  internship.status = opts.new_status as any
  await internship.save()
  await InternshipStatusHistory.create({
    internship_id: internship.internship_id,
    previous_status,
    new_status: opts.new_status,
    updated_by: opts.actor_user_id,
    remark: opts.remark || ''
  })
  if (opts.remark) {
    await Remark.create({
      internship_id: internship.internship_id,
      user_id: opts.actor_user_id,
      note: opts.remark
    })
  }
  await logActivity({
    user_id: opts.actor_user_id,
    internship_id: String(internship.internship_id),
    company_id: internship.company_id,
    action_type: 'status_change',
    metadata: { previous_status, new_status: opts.new_status }
  })
}
