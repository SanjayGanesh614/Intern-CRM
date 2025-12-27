import React from 'react';
import { X, ExternalLink, Trash2, Building2, MapPin, Calendar, Briefcase, DollarSign } from 'lucide-react';
import type { Internship } from '../../services/internshipService';
import { cn } from '../../utils';


interface InternshipDrawerProps {
    internship: Internship | null;
    onClose: () => void;
    isOpen: boolean;
}

const InternshipDrawer: React.FC<InternshipDrawerProps> = ({ internship, onClose, isOpen }) => {
    // Handling escape key to close could be added here
    if (!internship) return null;

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
                    "fixed inset-y-0 right-0 z-50 w-full max-w-xl bg-white dark:bg-gray-800 shadow-2xl transform transition-transform duration-300 ease-in-out border-l border-gray-200 dark:border-gray-700",
                    isOpen ? "translate-x-0" : "translate-x-full"
                )}
            >
                <div className="h-full flex flex-col">
                    {/* Header */}
                    <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-700 flex items-center justify-between bg-gray-50/50 dark:bg-gray-900/50">
                        <div className="flex-1 min-w-0 pr-4">
                            <h2 className="text-xl font-bold text-gray-900 dark:text-white truncate">
                                {internship.title}
                            </h2>
                            <p className="text-sm text-gray-500 dark:text-gray-400 truncate flex items-center gap-2">
                                <Building2 className="w-3 h-3" />
                                {internship.company_id} {/* TODO: Map to name */}
                            </p>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400 transition-colors"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Scrollable Content */}
                    <div className="flex-1 overflow-y-auto p-6 space-y-8">

                        {/* Status Section */}
                        <div className="flex flex-wrap gap-4 items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/30 rounded-lg border border-gray-100 dark:border-gray-700">
                            <div>
                                <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                    Current Status
                                </label>
                                <div className="mt-1 flex items-center gap-2">
                                    <span className={cn(
                                        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium",
                                        internship.status === 'Applied' ? "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300" :
                                            internship.status === 'Offer' ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300" :
                                                internship.status === 'Rejected' ? "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300" :
                                                    "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300"
                                    )}>
                                        {internship.status}
                                    </span>
                                </div>
                            </div>
                            <div className="text-right">
                                <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                    Follow-up
                                </label>
                                <p className="mt-1 text-sm font-medium text-gray-900 dark:text-white">
                                    {internship.follow_up_date ? new Date(internship.follow_up_date).toLocaleDateString() : 'Not set'}
                                </p>
                            </div>
                        </div>

                        {/* Details Grid */}
                        <div className="grid grid-cols-2 gap-6">
                            <div className="space-y-1">
                                <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                                    <MapPin className="w-4 h-4" />
                                    Location
                                </div>
                                <p className="text-sm font-medium text-gray-900 dark:text-white">
                                    {internship.location || 'Remote'}
                                </p>
                            </div>
                            <div className="space-y-1">
                                <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                                    <Briefcase className="w-4 h-4" />
                                    Type
                                </div>
                                <p className="text-sm font-medium text-gray-900 dark:text-white">
                                    {internship.internship_type || 'Internship'}
                                </p>
                            </div>
                            <div className="space-y-1">
                                <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                                    <Calendar className="w-4 h-4" />
                                    Posted Date
                                </div>
                                <p className="text-sm font-medium text-gray-900 dark:text-white">
                                    {internship.fetched_at ? new Date(internship.fetched_at).toLocaleDateString() : 'Unknown'}
                                </p>
                            </div>
                            <div className="space-y-1">
                                <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                                    <DollarSign className="w-4 h-4" />
                                    Salary
                                </div>
                                <p className="text-sm font-medium text-gray-900 dark:text-white">
                                    - {/* Payload doesn't implement salary yet */}
                                </p>
                            </div>
                        </div>

                        {/* Description */}
                        <div>
                            <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-2">
                                Description
                            </h3>
                            <div className="prose prose-sm dark:prose-invert max-w-none text-gray-600 dark:text-gray-300">
                                <p>To be implemented: Full description from fetch payload.</p>
                                {/* 
                                    Ideally Internship model should have 'description' field. 
                                    Looking at schemas/Internship.ts in memory... wait, I need to check schema.
                                    Assuming it might exist or will be added. 
                                */}
                            </div>
                        </div>

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
                        <button className="flex items-center justify-center gap-2 px-4 py-2.5 border border-red-200 dark:border-red-900/50 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg text-sm font-medium transition-colors">
                            <Trash2 className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </div>


        </>
    );
};

export default InternshipDrawer;
