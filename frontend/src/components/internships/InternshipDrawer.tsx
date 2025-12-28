import React, { useState } from 'react';
import { useAuthStore } from '../../context/authStore';
import { X, ExternalLink, Building2, MapPin, Calendar, Briefcase, Globe } from 'lucide-react';
import type { Internship } from '../../services/internshipService';
import { cn } from '../../utils';
import AssignmentDropdown from './AssignmentDropdown';
import { assignInternship, updateInternshipStatus } from '../../services/internshipService';
import { toast } from 'react-hot-toast';
import { ActivityTimeline } from './ActivityTimeline';
import { FollowUpTab } from './FollowUpTab';
import { OutreachTab } from './OutreachTab';

interface InternshipDrawerProps {
    internship: Internship | null;
    onClose: () => void;
    isOpen: boolean;
}

const InternshipDrawer: React.FC<InternshipDrawerProps> = ({ internship, onClose, isOpen }) => {
    const [activeTab, setActiveTab] = useState<'details' | 'remarks' | 'followup' | 'outreach'>('details');
    const { user } = useAuthStore();
    // const [isUpdating, setIsUpdating] = useState(false); // Unused

    if (!internship) return null;

    const handleAssign = async (userId: string) => {
        try {
            await assignInternship(internship.internship_id, userId);
            toast.success('Assignee updated');
            // Optimistic update could go here, or simple global refresh triggered by parent
        } catch (err) {
            toast.error('Failed to assign user');
        }
    };

    const handleStatusChange = async (status: string) => {
        try {
            await updateInternshipStatus(internship.internship_id, status);
            toast.success('Status updated');
        } catch (err) {
            toast.error('Failed to update status');
        }
    };

    return (
        <>
            {/* Backdrop */}
            <div
                className={cn(
                    "fixed inset-0 bg-black/20 backdrop-blur-sm z-40 transition-opacity duration-300",
                    isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
                )}
                onClick={onClose}
            />

            {/* Drawer Panel */}
            <div
                className={cn(
                    "fixed inset-y-0 right-0 z-50 w-full max-w-2xl bg-white dark:bg-gray-800 shadow-2xl transform transition-transform duration-300 ease-in-out border-l border-gray-200 dark:border-gray-700",
                    isOpen ? "translate-x-0" : "translate-x-full"
                )}
            >
                <div className="h-full flex flex-col">
                    {/* Header */}
                    <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-900/50">
                        <div className="flex items-start justify-between mb-4">
                            <div>
                                <h2 className="text-xl font-bold text-gray-900 dark:text-white leading-tight">
                                    {internship.title}
                                </h2>
                                <div className="flex items-center gap-2 mt-1 text-gray-500 dark:text-gray-400">
                                    <Building2 className="w-4 h-4" />
                                    <span className="font-medium text-gray-700 dark:text-gray-300">
                                        {internship.company_name || 'Unknown Company'}
                                        {!internship.company_name && <span className="text-xs ml-1 font-mono">({internship.company_id.slice(0, 6)})</span>}
                                    </span>
                                </div>
                            </div>
                            <button
                                onClick={onClose}
                                className="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400 transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="flex items-center gap-4">
                            <div className="flex-1">
                                <label className="text-xs font-semibold text-gray-500 mb-1 block">Sales Status</label>
                                <select
                                    value={internship.status}
                                    onChange={(e) => handleStatusChange(e.target.value)}
                                    className={cn(
                                        "block w-full rounded-lg border-gray-300 text-sm shadow-sm focus:border-purple-500 focus:ring-purple-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white",
                                        "font-medium"
                                    )}
                                >
                                    <option value="Unassigned">Unassigned</option>
                                    <option value="Contacted">Contacted</option>
                                    <option value="Interview">Interview</option>
                                    <option value="Offer">Offer</option>
                                    <option value="Rejected">Rejected</option>
                                    <option value="Onboarded">Onboarded</option>
                                </select>
                            </div>
                            <div className="flex-1">
                                <div className="flex justify-between items-center mb-1">
                                    <label className="text-xs font-semibold text-gray-500 block">Assigned To</label>
                                    {user && internship.assigned_to !== user.user_id && (
                                        <button
                                            onClick={() => handleAssign(user.user_id)}
                                            className="text-xs text-purple-600 hover:text-purple-700 font-medium hover:underline"
                                        >
                                            Assign to Me
                                        </button>
                                    )}
                                </div>
                                <AssignmentDropdown
                                    value={internship.assigned_to}
                                    onChange={handleAssign}
                                    currentUser={user}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Tabs */}
                    <div className="flex border-b border-gray-200 dark:border-gray-700 px-6">
                        <button
                            onClick={() => setActiveTab('details')}
                            className={cn("py-3 px-4 text-sm font-medium border-b-2 transition-colors", activeTab === 'details' ? "border-purple-600 text-purple-600" : "border-transparent text-gray-500 hover:text-gray-700")}
                        >
                            Details
                        </button>
                        <button
                            onClick={() => setActiveTab('remarks')}
                            className={cn("py-3 px-4 text-sm font-medium border-b-2 transition-colors", activeTab === 'remarks' ? "border-purple-600 text-purple-600" : "border-transparent text-gray-500 hover:text-gray-700")}
                        >
                            Remarks & Activity
                        </button>
                        <button
                            onClick={() => setActiveTab('followup')}
                            className={cn("py-3 px-4 text-sm font-medium border-b-2 transition-colors", activeTab === 'followup' ? "border-purple-600 text-purple-600" : "border-transparent text-gray-500 hover:text-gray-700")}
                        >
                            Follow-Up
                        </button>
                        <button
                            onClick={() => setActiveTab('outreach')}
                            className={cn("py-3 px-4 text-sm font-medium border-b-2 transition-colors", activeTab === 'outreach' ? "border-purple-600 text-purple-600" : "border-transparent text-gray-500 hover:text-gray-700")}
                        >
                            AI Outreach
                        </button>
                    </div>

                    {/* Scrollable Content */}
                    <div className="flex-1 overflow-y-auto p-6 space-y-8 bg-white dark:bg-gray-800">

                        {activeTab === 'details' && (
                            <div className="space-y-6">
                                {/* Details Grid */}
                                <div className="grid grid-cols-2 gap-6">
                                    <div className="space-y-1">
                                        <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                                            <MapPin className="w-4 h-4" /> Location
                                        </div>
                                        <p className="text-sm font-medium text-gray-900 dark:text-white">{internship.location || 'Remote'}</p>
                                    </div>
                                    <div className="space-y-1">
                                        <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                                            <Briefcase className="w-4 h-4" /> Type
                                        </div>
                                        <p className="text-sm font-medium text-gray-900 dark:text-white">{internship.internship_type}</p>
                                    </div>
                                    <div className="space-y-1">
                                        <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                                            <Calendar className="w-4 h-4" /> Posted
                                        </div>
                                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                                            {internship.posted_at || new Date(internship.fetched_at).toLocaleDateString()}
                                        </p>
                                    </div>
                                    <div className="space-y-1">
                                        <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                                            <Globe className="w-4 h-4" /> Source
                                        </div>
                                        <a href={internship.source_url} target="_blank" rel="noreferrer" className="text-sm font-medium text-blue-600 hover:underline flex items-center gap-1">
                                            {internship.source} <ExternalLink className="w-3 h-3" />
                                        </a>
                                    </div>
                                </div>

                                <div className="border-t border-gray-100 dark:border-gray-700 pt-6">
                                    <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-2">Description</h3>
                                    <div className="prose prose-sm dark:prose-invert text-gray-600 dark:text-gray-300 max-w-none whitespace-pre-wrap text-xs">
                                        {internship.description || 'No description available.'}
                                    </div>
                                </div>

                                <div className="border-t border-gray-100 dark:border-gray-700 pt-6">
                                    <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-4">Company Profile</h3>
                                    <div className="grid grid-cols-2 gap-y-4 gap-x-8">
                                        <div>
                                            <span className="text-xs text-gray-500 uppercase">Website</span>
                                            {internship.company_website ? (
                                                <a href={internship.company_website} target="_blank" rel="noreferrer" className="block text-sm font-medium text-blue-600 hover:underline truncate">
                                                    {internship.company_website}
                                                </a>
                                            ) : <p className="text-sm text-gray-400">Not available</p>}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === 'remarks' && (
                            <ActivityTimeline internshipId={internship.internship_id} />
                        )}

                        {activeTab === 'followup' && (
                            <FollowUpTab internshipId={internship.internship_id} />
                        )}

                        {activeTab === 'outreach' && (
                            <div className="p-1">
                                <OutreachTab internship={internship} />
                            </div>
                        )}

                    </div>

                    {/* Footer Actions */}
                    <div className="p-6 border-t border-gray-100 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-900/50 flex gap-3 flex-wrap">
                        <a
                            href={internship.source_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex-1 flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-lg text-sm font-medium transition-colors"
                        >
                            <ExternalLink className="w-4 h-4" />
                            Apply on {internship.source}
                        </a>
                    </div>
                </div>
            </div>
        </>
    );
};

export default InternshipDrawer;
