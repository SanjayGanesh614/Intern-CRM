import { Internship } from '../models/Internship.js';
import { InternshipStatusHistory } from '../models/InternshipStatusHistory.js';
import { Remark } from '../models/Remark.js';
import { logActivity } from './activity.js';
export async function updateStatus(opts) {
    const internship = await Internship.findOne({ internship_id: opts.internship_id });
    if (!internship)
        return;
    const previous_status = internship.status;
    internship.status = opts.new_status;
    await internship.save();
    await InternshipStatusHistory.create({
        internship_id: internship.internship_id,
        previous_status,
        new_status: opts.new_status,
        updated_by: opts.actor_user_id,
        remark: opts.remark || ''
    });
    if (opts.remark) {
        await Remark.create({
            internship_id: internship.internship_id,
            user_id: opts.actor_user_id,
            note: opts.remark
        });
    }
    await logActivity({
        user_id: opts.actor_user_id,
        internship_id: String(internship.internship_id),
        company_id: internship.company_id,
        action_type: 'status_change',
        metadata: { previous_status, new_status: opts.new_status }
    });
}
