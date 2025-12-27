import React, { useEffect, useState } from 'react';
import { MessageSquare, RefreshCw, Send } from 'lucide-react';
import { toast } from 'react-hot-toast';
import {
    getInternshipActivity,
    getInternshipRemarks,
    addRemark
} from '../../services/internshipService';
import type { ActivityLog, Remark } from '../../services/internshipService';
import { cn } from '../../utils';

interface ActivityTimelineProps {
    internshipId: string;
}

type TimelineItem =
    | { type: 'activity'; data: ActivityLog }
    | { type: 'remark'; data: Remark };

export const ActivityTimeline: React.FC<ActivityTimelineProps> = ({ internshipId }) => {
    const [items, setItems] = useState<TimelineItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [newRemark, setNewRemark] = useState('');
    const [submitting, setSubmitting] = useState(false);

    const fetchData = async () => {
        try {
            const [activity, remarks] = await Promise.all([
                getInternshipActivity(internshipId),
                getInternshipRemarks(internshipId)
            ]);

            const combined: TimelineItem[] = [
                ...activity.map((a: ActivityLog) => ({ type: 'activity', data: a } as const)),
                ...remarks.map((r: Remark) => ({ type: 'remark', data: r } as const))
            ].sort((a, b) => new Date(b.data.created_at).getTime() - new Date(a.data.created_at).getTime());

            setItems(combined);
        } catch (err) {
            toast.error('Failed to load activity');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [internshipId]);

    const handleAddRemark = async () => {
        if (!newRemark.trim()) return;
        setSubmitting(true);
        try {
            await addRemark(internshipId, newRemark);
            setNewRemark('');
            fetchData();
            toast.success('Remark added');
        } catch (err) {
            toast.error('Failed to add remark');
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) return <div className="text-center py-4 text-gray-500">Loading activity...</div>;

    return (
        <div className="space-y-6">
            {/* Add Remark Input */}
            <div className="flex gap-2">
                <input
                    type="text"
                    value={newRemark}
                    onChange={(e) => setNewRemark(e.target.value)}
                    placeholder="Add a nte or remark..."
                    className="flex-1 rounded-lg border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white text-sm focus:ring-purple-500 focus:border-purple-500"
                    onKeyDown={(e) => e.key === 'Enter' && handleAddRemark()}
                />
                <button
                    onClick={handleAddRemark}
                    disabled={submitting || !newRemark.trim()}
                    className="p-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 transition-colors"
                >
                    <Send className="w-4 h-4" />
                </button>
            </div>

            {/* Timeline */}
            <div className="space-y-4">
                {items.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                        <MessageSquare className="w-8 h-8 mx-auto mb-2 opacity-20" />
                        <p className="text-sm">No activity yet.</p>
                    </div>
                ) : (
                    items.map((item) => {
                        const isRemark = item.type === 'remark';
                        const date = new Date(item.data.created_at).toLocaleString();

                        return (
                            <div key={isRemark ? (item.data as Remark).remark_id : (item.data as ActivityLog).activity_id} className="flex gap-3 text-sm">
                                <div className={cn(
                                    "mt-1 w-8 h-8 rounded-full flex items-center justify-center shrink-0",
                                    isRemark ? "bg-yellow-100 text-yellow-600" : "bg-blue-100 text-blue-600"
                                )}>
                                    {isRemark ? <MessageSquare className="w-4 h-4" /> : <RefreshCw className="w-4 h-4" />}
                                </div>
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-1">
                                        <span className="font-semibold text-gray-900 dark:text-white">
                                            {isRemark ? 'User' : 'System'}
                                            {/* In real app, fetch user name */}
                                        </span>
                                        <span className="text-xs text-gray-500">{date}</span>
                                    </div>
                                    <p className="text-gray-700 dark:text-gray-300">
                                        {isRemark
                                            ? (item.data as Remark).note
                                            : formatActivityMessage(item.data as ActivityLog)
                                        }
                                    </p>
                                </div>
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
};

function formatActivityMessage(log: ActivityLog): string {
    switch (log.action_type) {
        case 'status_change':
            return `Status changed to ${log.metadata?.new_status || 'unknown'}`;
        case 'note_added':
            return 'Added a note';
        case 'assigned':
            return 'Assigned user';
        case 'fetch_completed':
            return 'Fetched internship data';
        case 'ai_message_sent':
            return 'AI sent a message';
        case 'followup_created':
            return 'Scheduled a follow-up';
        case 'followup_updated':
            return 'Updated follow-up';
        default:
            return (log.action_type as string).replace('_', ' ');
    }
}
