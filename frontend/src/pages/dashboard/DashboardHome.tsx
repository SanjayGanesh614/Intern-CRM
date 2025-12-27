import { useEffect, useState } from 'react';
import { Briefcase, Building2, Bell, RefreshCw, Plus } from 'lucide-react';
import api from '../../services/api';
import StatsCard from '../../components/dashboard/StatsCard';
import FetchModal from '../../components/fetch/FetchModal';
import FetchProgress from '../../components/fetch/FetchProgress';
import { cn } from '../../utils';

interface DashboardStats {
    total_internships: number;
    total_companies: number;
    internships_by_status: Record<string, number>;
    followups_due_today: number;
}

const DashboardHome = () => {
    const [stats, setStats] = useState<DashboardStats | null>(null);
    const [loading, setLoading] = useState(true);
    const [showFetchModal, setShowFetchModal] = useState(false);
    const [activeFetchId, setActiveFetchId] = useState<string | null>(null);

    const fetchStats = async () => {
        try {
            const res = await api.get('/analytics/dashboard');
            setStats(res.data);
        } catch (error) {
            console.error('Failed to fetch dashboard stats', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchStats();
    }, []);

    const statusColors: Record<string, string> = {
        'Applied': 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300',
        'Interview': 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300',
        'Offer': 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300',
        'Rejected': 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300',
        'Unassigned': 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300',
        'default': 'bg-gray-50 text-gray-600 dark:bg-gray-800/50 dark:text-gray-400'
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                        Dashboard Overview
                    </h2>
                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                        Welcome back! Here's what's happening today.
                    </p>
                </div>
                <div className="flex gap-3">
                    <button
                        onClick={() => setShowFetchModal(true)}
                        className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors shadow-sm"
                    >
                        <RefreshCw className="w-4 h-4" />
                        Run Fetch
                    </button>
                    <button
                        onClick={() => alert("Company create coming soon")}
                        className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors shadow-sm"
                    >
                        <Plus className="w-4 h-4" />
                        Add Company
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatsCard
                    label="Total Internships"
                    value={loading ? '-' : stats?.total_internships || 0}
                    icon={Briefcase}
                    color="blue"
                />
                <StatsCard
                    label="Total Companies"
                    value={loading ? '-' : stats?.total_companies || 0}
                    icon={Building2}
                    color="purple"
                />
                <StatsCard
                    label="Follow-ups Due Today"
                    value={loading ? '-' : stats?.followups_due_today || 0}
                    icon={Bell}
                    color={stats?.followups_due_today ? 'orange' : 'green'}
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                        Internship Status
                    </h3>
                    <div className="space-y-4">
                        {loading ? (
                            <p className="text-sm text-gray-500">Loading...</p>
                        ) : stats && Object.keys(stats.internships_by_status).length > 0 ? (
                            Object.entries(stats.internships_by_status).map(([status, count]) => (
                                <div key={status} className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                                    <div className="flex items-center gap-3">
                                        <span className={cn("w-2.5 h-2.5 rounded-full", statusColors[status] || statusColors.default.split(' ')[0])} />
                                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                            {String(status)}
                                        </span>
                                    </div>
                                    <span className="text-sm font-semibold text-gray-900 dark:text-white">
                                        {String(count)}
                                    </span>
                                </div>
                            ))
                        ) : (
                            <div className="py-8 text-center text-sm text-gray-500 dark:text-gray-400">
                                No internships found
                            </div>
                        )}
                    </div>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                        Recent Activity
                    </h3>
                    {/* Placeholder for Activity Feed (Phase 5/9) */}
                    <div className="flex flex-col items-center justify-center h-48 text-gray-400 border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-lg">
                        <p className="text-sm">Activity Feed coming soon</p>
                    </div>
                </div>
            </div>

            <FetchModal
                isOpen={showFetchModal}
                onClose={() => setShowFetchModal(false)}
                onStarted={(id) => {
                    setShowFetchModal(false);
                    setActiveFetchId(id);
                }}
            />

            {activeFetchId && (
                <FetchProgress
                    fetchId={activeFetchId}
                    onClose={() => {
                        setActiveFetchId(null);
                        fetchStats(); // Refresh stats after fetch
                    }}
                />
            )}
        </div>
    );
};

export default DashboardHome;
