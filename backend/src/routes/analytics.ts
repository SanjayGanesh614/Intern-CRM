import { Router } from 'express'
import { auth } from '../middleware/auth.js'
import { Internship } from '../models/Internship.js'
import { Company } from '../models/Company.js'
import { FollowUp } from '../models/FollowUp.js'

export const analyticsRouter = Router()

analyticsRouter.get('/dashboard', auth, async (req, res) => {
    try {
        const [
            totalInternships,
            totalCompanies,
            statusBreakdown,
            dueFollowups,
            conversions,
            industryPerformance,
            leaderboard
        ] = await Promise.all([
            Internship.countDocuments({}),
            Company.countDocuments({}),
            Internship.aggregate([
                { $group: { _id: '$status', count: { $sum: 1 } } }
            ]),
            FollowUp.countDocuments({
                status: 'pending',
                due_date: {
                    $gte: new Date(new Date().setHours(0, 0, 0, 0)),
                    $lt: new Date(new Date().setHours(23, 59, 59, 999))
                }
            }),
            Internship.countDocuments({ status: { $in: ['Onboarded', 'Offer'] } }),
            Company.aggregate([
                { $group: { _id: '$industry', count: { $sum: 1 } } },
                { $sort: { count: -1 } },
                { $limit: 10 }
            ]),
            Internship.aggregate([
                { $match: { assigned_to: { $exists: true, $ne: null } } },
                { $group: { _id: '$assigned_to', count: { $sum: 1 } } },
                {
                    $lookup: {
                        from: 'users',
                        localField: '_id',
                        foreignField: 'user_id',
                        as: 'user'
                    }
                },
                { $unwind: { path: '$user', preserveNullAndEmptyArrays: true } },
                {
                    $project: {
                        _id: { $ifNull: ['$user.name', 'Unknown'] },
                        count: 1
                    }
                },
                { $sort: { count: -1 } },
                { $limit: 5 }
            ])
        ])

        // Format status breakdown
        const stats: Record<string, number> = {}
        statusBreakdown.forEach((s: any) => {
            stats[s._id] = s.count
        })

        res.json({
            total_internships: totalInternships,
            total_companies: totalCompanies,
            internships_by_status: stats,
            followups_due_today: dueFollowups,
            conversions,
            industry_performance: industryPerformance,
            leaderboard
        })
    } catch (error) {
        console.error('Analytics Error:', error)
        res.status(500).json({ error: 'internal_server_error' })
    }
})

analyticsRouter.get('/timeline', auth, async (req, res) => {
    try {
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

        const timeline = await Internship.aggregate([
            {
                $match: {
                    created_at: { $gte: thirtyDaysAgo }
                }
            },
            {
                $group: {
                    _id: { $dateToString: { format: "%Y-%m-%d", date: "$created_at" } },
                    count: { $sum: 1 }
                }
            },
            { $sort: { _id: 1 } }
        ]);

        res.json(timeline);
    } catch (error) {
        console.error('Timeline Error:', error);
        res.status(500).json({ error: 'internal_server_error' });
    }
})
