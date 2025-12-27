import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Search, Download, X } from 'lucide-react';
import InternshipTable from '../../components/internships/InternshipTable';
import InternshipDrawer from '../../components/internships/InternshipDrawer';
import AssignmentDropdown from '../../components/internships/AssignmentDropdown';
import { getInternships, bulkAssignInternships, bulkUpdateStatus } from '../../services/internshipService';
import type { Internship } from '../../services/internshipService';
import type { RowSelectionState } from '@tanstack/react-table';
import { toast } from 'react-hot-toast';

const InternshipsPage = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const [data, setData] = useState<Internship[]>([]);
    const [loading, setLoading] = useState(true);
    const [total, setTotal] = useState(0);
    const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
    const [selectedInternship, setSelectedInternship] = useState<Internship | null>(null);

    // Filters
    const page = Number(searchParams.get('page') || '1');
    const pageSize = Number(searchParams.get('pageSize') || '20');
    const searchTerm = searchParams.get('search') || '';
    const statusFilter = searchParams.get('status') || '';
    const typeFilter = searchParams.get('type') || '';
    const sourceFilter = searchParams.get('source') || '';
    const assignedFilter = searchParams.get('assigned') || '';

    // Bulk Action State
    const [isBulkAssignOpen, setIsBulkAssignOpen] = useState(false);
    const [isBulkStatusOpen, setIsBulkStatusOpen] = useState(false);
    const [bulkAssignId, setBulkAssignId] = useState('');
    const [bulkStatusValue, setBulkStatusValue] = useState('');

    const fetchData = async () => {
        setLoading(true);
        try {
            const res = await getInternships({
                page,
                pageSize,
                search: searchTerm,
                status: statusFilter || undefined,
                internship_type: typeFilter || undefined,
                source: sourceFilter || undefined,
                assigned_user: assignedFilter || undefined
            });
            setData(res.items);
            setTotal(res.total);
            setRowSelection({}); // Clear selection on refetch/filter change
        } catch (error) {
            console.error(error);
            toast.error('Failed to load internships');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [page, pageSize, searchTerm, statusFilter, typeFilter, sourceFilter, assignedFilter]);

    const updateParam = (key: string, value: string) => {
        const newParams = new URLSearchParams(searchParams);
        if (value) {
            newParams.set(key, value);
        } else {
            newParams.delete(key);
        }
        newParams.set('page', '1');
        setSearchParams(newParams);
    };

    const handlePageChange = (newPage: number) => {
        const newParams = new URLSearchParams(searchParams);
        newParams.set('page', String(newPage));
        setSearchParams(newParams);
    };

    const handleBulkAssign = async () => {
        if (!bulkAssignId) return;
        const ids = Object.keys(rowSelection);
        if (ids.length === 0) return;

        try {
            await bulkAssignInternships(ids, bulkAssignId);
            toast.success(`Assigned ${ids.length} internships`);
            setIsBulkAssignOpen(false);
            fetchData();
        } catch (err) {
            toast.error('Failed to assign internships');
        }
    };

    const handleBulkStatus = async () => {
        if (!bulkStatusValue) return;
        const ids = Object.keys(rowSelection);
        if (ids.length === 0) return;

        try {
            await bulkUpdateStatus(ids, bulkStatusValue);
            toast.success(`Updated status for ${ids.length} internships`);
            setIsBulkStatusOpen(false);
            fetchData();
        } catch (err) {
            toast.error('Failed to update status');
        }
    };

    const selectedCount = Object.keys(rowSelection).length;

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                    Internships
                </h2>

                {selectedCount > 0 ? (
                    <div className="flex items-center gap-3 bg-purple-50 dark:bg-purple-900/20 px-4 py-2 rounded-lg border border-purple-100 dark:border-purple-900/50 animate-in fade-in slide-in-from-top-2">
                        <span className="text-sm font-medium text-purple-700 dark:text-purple-300">
                            {selectedCount} selected
                        </span>
                        <div className="h-4 w-px bg-purple-200 dark:bg-purple-800" />

                        <div className="relative">
                            <button
                                onClick={() => setIsBulkAssignOpen(!isBulkAssignOpen)}
                                className="text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400"
                            >
                                Assign
                            </button>
                            {isBulkAssignOpen && (
                                <div className="absolute top-full mt-2 left-0 w-64 bg-white dark:bg-gray-800 shadow-xl rounded-lg p-3 border border-gray-100 dark:border-gray-700 z-50">
                                    <label className="block text-xs font-medium text-gray-500 mb-1">Assign to:</label>
                                    <AssignmentDropdown value={bulkAssignId} onChange={setBulkAssignId} className="mb-2" />
                                    <button onClick={handleBulkAssign} className="w-full bg-purple-600 text-white text-xs py-1.5 rounded-md hover:bg-purple-700">Confirm Assignment</button>
                                </div>
                            )}
                        </div>

                        <div className="relative">
                            <button
                                onClick={() => setIsBulkStatusOpen(!isBulkStatusOpen)}
                                className="text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400"
                            >
                                Set Status
                            </button>
                            {isBulkStatusOpen && (
                                <div className="absolute top-full mt-2 left-0 w-48 bg-white dark:bg-gray-800 shadow-xl rounded-lg p-3 border border-gray-100 dark:border-gray-700 z-50">
                                    <label className="block text-xs font-medium text-gray-500 mb-1">New Status:</label>
                                    <select
                                        value={bulkStatusValue}
                                        onChange={e => setBulkStatusValue(e.target.value)}
                                        className="block w-full rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-xs mb-2 p-1.5"
                                    >
                                        <option value="">Select...</option>
                                        <option value="Unassigned">Unassigned</option>
                                        <option value="Contacted">Contacted</option>
                                        <option value="Interview">Interview</option>
                                        <option value="Offer">Offer</option>
                                        <option value="Rejected">Rejected</option>
                                    </select>
                                    <button onClick={handleBulkStatus} className="w-full bg-purple-600 text-white text-xs py-1.5 rounded-md hover:bg-purple-700">Update Status</button>
                                </div>
                            )}
                        </div>

                        <button className="text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 flex items-center gap-1">
                            <Download className="w-4 h-4" /> Export
                        </button>

                        <button onClick={() => setRowSelection({})} className="ml-2 p-1 hover:bg-purple-100 dark:hover:bg-purple-900/40 rounded-full text-purple-600">
                            <X className="w-4 h-4" />
                        </button>
                    </div>
                ) : (
                    <div className="flex items-center gap-2">
                        {/* Normal Header Actions */}
                    </div>
                )}
            </div>

            {/* Advanced Filters Toolbar */}
            <div className="bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-200 dark:border-gray-700 flex flex-wrap gap-4 items-center">
                <div className="relative flex-1 min-w-[200px]">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search role..."
                        className="w-full pl-9 pr-4 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                        value={searchTerm}
                        onChange={(e) => updateParam('search', e.target.value)}
                    />
                </div>

                <select
                    className="px-3 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                    value={statusFilter}
                    onChange={(e) => updateParam('status', e.target.value)}
                >
                    <option value="">All Status</option>
                    <option value="Unassigned">Unassigned</option>
                    <option value="Contacted">Contacted</option>
                    <option value="Interview">Interview</option>
                    <option value="Offer">Offer</option>
                    <option value="Rejected">Rejected</option>
                </select>

                <select
                    className="px-3 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                    value={typeFilter}
                    onChange={(e) => updateParam('type', e.target.value)}
                >
                    <option value="">All Types</option>
                    <option value="Internship">Internship</option>
                    <option value="Full-time">Full-time</option>
                    <option value="Part-time">Part-time</option>
                </select>

                <select
                    className="px-3 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                    value={sourceFilter}
                    onChange={(e) => updateParam('source', e.target.value)}
                >
                    <option value="">All Sources</option>
                    <option value="JSearch">JSearch</option>
                    <option value="LinkedIn">LinkedIn</option>
                    <option value="Manual">Manual</option>
                </select>

                <div className="w-48">
                    <AssignmentDropdown
                        value={assignedFilter}
                        onChange={(val) => updateParam('assigned', val)}
                        className="py-2 bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-700"
                    />
                </div>

                {(searchTerm || statusFilter || typeFilter || sourceFilter || assignedFilter) && (
                    <button
                        onClick={() => setSearchParams({ page: '1', pageSize: String(pageSize) })}
                        className="text-sm text-red-500 hover:text-red-700 flex items-center gap-1"
                    >
                        <X className="w-3 h-3" /> Clear
                    </button>
                )}
            </div>

            <InternshipTable
                data={data}
                loading={loading}
                rowSelection={rowSelection}
                setRowSelection={setRowSelection}
                onRowClick={setSelectedInternship}
            />

            <InternshipDrawer
                internship={selectedInternship}
                isOpen={!!selectedInternship}
                onClose={() => {
                    setSelectedInternship(null);
                    fetchData(); // Refresh data on close to reflect drawer updates
                }}
            />

            <div className="flex justify-between items-center bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-200 dark:border-gray-700">
                <span className="text-sm text-gray-500 dark:text-gray-400">
                    Showing {data.length} of {total} results
                </span>
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => handlePageChange(page - 1)}
                        disabled={page <= 1}
                        className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed text-gray-600 dark:text-gray-400"
                    >
                        <ChevronLeft className="w-5 h-5" />
                    </button>
                    <span className="text-sm font-medium text-gray-900 dark:text-white px-2">
                        Page {page}
                    </span>
                    <button
                        onClick={() => handlePageChange(page + 1)}
                        disabled={page * pageSize >= total}
                        className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed text-gray-600 dark:text-gray-400"
                    >
                        <ChevronRight className="w-5 h-5" />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default InternshipsPage;
