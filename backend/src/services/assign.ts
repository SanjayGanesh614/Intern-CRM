import { Internship } from '../models/Internship'
import { User } from '../models/User'
import { logActivity } from './activity'

export async function assignInternship(opts: {
  internship_id: string
  new_assignee: string
  actor_user_id: string
}) {
  const internship = await Internship.findOne({ internship_id: opts.internship_id })
  if (!internship) return
  const prevAssignee = internship.assigned_to || null
  if (prevAssignee && prevAssignee !== opts.new_assignee) {
    await User.updateOne({ user_id: prevAssignee }, { $inc: { active_load: -1 } })
  }
  if (opts.new_assignee && prevAssignee !== opts.new_assignee) {
    await User.updateOne({ user_id: opts.new_assignee }, { $inc: { active_load: 1 } })
  }
  internship.assigned_to = opts.new_assignee
  await internship.save()
  await logActivity({
    user_id: opts.actor_user_id,
    internship_id: String(internship.internship_id),
    company_id: internship.company_id,
    action_type: 'assigned',
    metadata: { prev_assignee: prevAssignee, new_assignee: opts.new_assignee }
  })
}
