import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Filter, ChevronLeft, ChevronRight, Search } from 'lucide-react';
import InternshipTable from '../../components/internships/InternshipTable';
import InternshipDrawer from '../../components/internships/InternshipDrawer';
import { getInternships } from '../../services/internshipService';
import type { Internship } from '../../services/internshipService';
import type { RowSelectionState } from '@tanstack/react-table';

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

    const fetchData = async () => {
        setLoading(true);
        try {
            const res = await getInternships({
                page,
                pageSize,
                search: searchTerm,
                status: statusFilter || undefined,
            });
            setData(res.items);
            setTotal(res.total);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [page, pageSize, searchTerm, statusFilter]);

    const updateParam = (key: string, value: string) => {
        const newParams = new URLSearchParams(searchParams);
        if (value) {
            newParams.set(key, value);
        } else {
            newParams.delete(key);
        }
        newParams.set('page', '1'); // Reset to page 1 on filter
        setSearchParams(newParams);
    };

    const handlePageChange = (newPage: number) => {
        const newParams = new URLSearchParams(searchParams);
        newParams.set('page', String(newPage));
        setSearchParams(newParams);
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                    Internships
                </h2>
                <div className="flex items-center gap-2">
                    {Object.keys(rowSelection).length > 0 && (
                        <span className="text-sm font-medium text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30 px-3 py-1 rounded-md">
                            {Object.keys(rowSelection).length} selected
                        </span>
                    )}
                    <button className="flex items-center gap-2 px-3 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700">
                        <Filter className="w-4 h-4" />
                        Filters
                    </button>
                    {/* Export/Bulk actions would go here */}
                </div>
            </div>

            <div className="flex gap-4 items-center bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-200 dark:border-gray-700">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search roles..."
                        className="w-full pl-9 pr-4 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={searchTerm}
                        onChange={(e) => updateParam('search', e.target.value)}
                    />
                </div>
                <select
                    className="px-3 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={statusFilter}
                    onChange={(e) => updateParam('status', e.target.value)}
                >
                    <option value="">All Status</option>
                    <option value="Unassigned">Unassigned</option>
                    <option value="Applied">Applied</option>
                    <option value="Interview">Interview</option>
                    <option value="Offer">Offer</option>
                    <option value="Rejected">Rejected</option>
                </select>
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
                onClose={() => setSelectedInternship(null)}
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
