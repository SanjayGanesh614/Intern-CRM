import React, { useEffect, useState } from 'react';
import { Calendar, Check, Clock, Plus } from 'lucide-react';
import { toast } from 'react-hot-toast';
import {
    getInternshipFollowUps,
    createFollowUp,
    completeFollowUp
} from '../../services/internshipService';
import type { FollowUp } from '../../services/internshipService';
import { cn } from '../../utils';

interface FollowUpTabProps {
    internshipId: string;
}

export const FollowUpTab: React.FC<FollowUpTabProps> = ({ internshipId }) => {
    const [followUps, setFollowUps] = useState<FollowUp[]>([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);

    // Form state
    const [dueDate, setDueDate] = useState('');
    const [notes, setNotes] = useState('');
    const [submitting, setSubmitting] = useState(false);

    const fetchFollowUps = async () => {
        try {
            const data = await getInternshipFollowUps(internshipId);
            setFollowUps(data);
        } catch (err) {
            toast.error('Failed to load follow-ups');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchFollowUps();
    }, [internshipId]);

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            await createFollowUp(internshipId, { due_date: dueDate, notes });
            toast.success('Follow-up scheduled');
            setShowForm(false);
            setDueDate('');
            setNotes('');
            fetchFollowUps();
        } catch (err) {
            toast.error('Failed to schedule follow-up');
        } finally {
            setSubmitting(false);
        }
    };

    const handleComplete = async (id: string) => {
        try {
            await completeFollowUp(id);
            toast.success('Follow-up completed');
            fetchFollowUps();
        } catch (err) {
            toast.error('Failed to complete follow-up');
        }
    };

    if (loading) return <div className="text-center py-4 text-gray-500">Loading follow-ups...</div>;

    return (
        <div className="space-y-6">
            {/* Header / Add Button */}
            {!showForm && (
                <button
                    onClick={() => setShowForm(true)}
                    className="w-full py-2 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg text-gray-500 hover:border-purple-500 hover:text-purple-600 transition-colors flex items-center justify-center gap-2 font-medium"
                >
                    <Plus className="w-4 h-4" /> Schedule Follow-Up
                </button>
            )}

            {/* Create Form */}
            {showForm && (
                <form onSubmit={handleCreate} className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg border border-gray-200 dark:border-gray-600 space-y-3">
                    <div>
                        <label className="block text-xs font-semibold text-gray-500 mb-1">Due Date</label>
                        <input
                            type="datetime-local"
                            required
                            value={dueDate}
                            onChange={(e) => setDueDate(e.target.value)}
                            className="w-full rounded-md border-gray-300 dark:bg-gray-700 dark:border-gray-500 text-sm"
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-semibold text-gray-500 mb-1">Notes</label>
                        <textarea
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            className="w-full rounded-md border-gray-300 dark:bg-gray-700 dark:border-gray-500 text-sm"
                            rows={2}
                            placeholder="Reason for follow-up..."
                        />
                    </div>
                    <div className="flex justify-end gap-2">
                        <button
                            type="button"
                            onClick={() => setShowForm(false)}
                            className="px-3 py-1.5 text-sm text-gray-600 hover:text-gray-800"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={submitting}
                            className="px-3 py-1.5 bg-purple-600 text-white rounded-md text-sm font-medium hover:bg-purple-700 disabled:opacity-50"
                        >
                            Schedule
                        </button>
                    </div>
                </form>
            )}

            {/* List */}
            <div className="space-y-3">
                {followUps.length === 0 && !showForm && (
                    <div className="text-center py-8 text-gray-400">
                        <Clock className="w-8 h-8 mx-auto mb-2 opacity-20" />
                        <p className="text-sm">No pending follow-ups</p>
                    </div>
                )}

                {followUps.map(item => {
                    const isOverdue = new Date(item.due_date) < new Date();
                    return (
                        <div key={item.followup_id} className={cn(
                            "group flex items-start gap-3 p-3 rounded-lg border",
                            isOverdue ? "border-red-200 bg-red-50 dark:bg-red-900/10 dark:border-red-900/30" : "border-gray-200 bg-white dark:bg-gray-800 dark:border-gray-700"
                        )}>
                            <div className="mt-1">
                                <Calendar className={cn("w-4 h-4", isOverdue ? "text-red-500" : "text-purple-500")} />
                            </div>
                            <div className="flex-1">
                                <div className="flex items-center justify-between mb-1">
                                    <span className={cn("text-sm font-semibold", isOverdue ? "text-red-700 dark:text-red-400" : "text-gray-900 dark:text-white")}>
                                        {new Date(item.due_date).toLocaleString()}
                                    </span>
                                    {isOverdue && <span className="text-xs text-red-600 font-medium px-1.5 py-0.5 bg-red-100 rounded">Overdue</span>}
                                </div>
                                <p className="text-sm text-gray-600 dark:text-gray-300">{item.notes || 'No notes'}</p>
                            </div>
                            <button
                                onClick={() => handleComplete(item.followup_id)}
                                className="p-1.5 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded transition-colors"
                                title="Mark as complete"
                            >
                                <Check className="w-5 h-5" />
                            </button>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};
