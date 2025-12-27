import React, { useEffect, useState } from 'react';
import {
    useReactTable,
    getCoreRowModel,
    flexRender,
    getFilteredRowModel,
} from '@tanstack/react-table';
import type { ColumnDef } from '@tanstack/react-table';
import { Loader2, Search, Building2, MapPin, ExternalLink } from 'lucide-react';
import { getCompanies } from '../../services/companiesService';
import type { Company } from '../../services/companiesService';
import { cn } from '../../utils';

const CompaniesPage: React.FC = () => {
    const [data, setData] = useState<Company[]>([]);
    const [loading, setLoading] = useState(true);
    const [globalFilter, setGlobalFilter] = useState('');

    useEffect(() => {
        const fetchCompanies = async () => {
            try {
                const res = await getCompanies();
                setData(res);
            } catch (error) {
                console.error('Failed to load companies', error);
            } finally {
                setLoading(false);
            }
        };
        fetchCompanies();
    }, []);

    const columns = React.useMemo<ColumnDef<Company>[]>(() => [
        {
            accessorKey: 'name',
            header: 'Company',
            cell: info => (
                <div className="flex items-center gap-2">
                    <div className="p-2 bg-gray-100 dark:bg-gray-700 rounded-lg">
                        <Building2 className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                    </div>
                    <div>
                        <div className="font-medium text-gray-900 dark:text-white">{info.getValue() as string}</div>
                        <div className="text-xs text-gray-500">{info.row.original.industry || 'Unknown Industry'}</div>
                    </div>
                </div>
            )
        },
        {
            accessorKey: 'status',
            header: 'Status',
            cell: info => {
                const status = info.getValue() as string;
                const colorMap: Record<string, string> = {
                    'Unassigned': 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300',
                    'Contacted': 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
                    'Interview': 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300',
                    'Offer': 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
                    'Onboarded': 'bg-green-800 text-green-100 dark:bg-green-900 dark:text-green-300',
                    'Rejected': 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300',
                };

                return (
                    <span className={cn("inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium", colorMap[status] || colorMap['Unassigned'])}>
                        {status}
                    </span>
                );
            }
        },
        {
            accessorKey: 'assigned_to',
            header: 'Assigned Team',
            cell: info => {
                const assigned = info.getValue() as string[];
                if (!assigned || assigned.length === 0) return <span className="text-gray-400 text-xs italic">Unassigned</span>;

                return (
                    <div className="flex -space-x-2 overflow-hidden">
                        {assigned.slice(0, 3).map((user, i) => (
                            <div key={i} className="inline-block h-6 w-6 rounded-full ring-2 ring-white dark:ring-gray-800 bg-purple-100 flex items-center justify-center text-[10px] font-bold text-purple-600" title={user}>
                                {user.charAt(0)}
                            </div>
                        ))}
                        {assigned.length > 3 && (
                            <div className="inline-block h-6 w-6 rounded-full ring-2 ring-white dark:ring-gray-800 bg-gray-100 flex items-center justify-center text-[10px] font-bold text-gray-600">
                                +{assigned.length - 3}
                            </div>
                        )}
                    </div>
                );
            }
        },
        {
            accessorKey: 'size',
            header: 'Size',
            cell: info => <span className="text-sm text-gray-600 dark:text-gray-400">{info.getValue() as string || '-'}</span>
        },
        {
            accessorKey: 'headquarters',
            header: 'Location',
            cell: info => (
                <div className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-400">
                    <MapPin className="w-3 h-3" />
                    {info.getValue() as string || '-'}
                </div>
            )
        },
        {
            accessorKey: 'website',
            header: 'Website',
            cell: info => {
                const url = info.getValue() as string;
                if (!url) return '-';
                return (
                    <a href={url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline flex items-center gap-1 text-sm">
                        Visit <ExternalLink className="w-3 h-3" />
                    </a>
                );
            }
        }
    ], []);

    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        state: {
            globalFilter,
        },
        onGlobalFilterChange: setGlobalFilter,
    });

    if (loading) return <div className="flex justify-center items-center h-full"><Loader2 className="w-8 h-8 animate-spin text-purple-600" /></div>;

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Companies</h1>
                <div className="relative w-full sm:w-64">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                        value={globalFilter ?? ''}
                        onChange={e => setGlobalFilter(e.target.value)}
                        placeholder="Search companies..."
                        className="w-full pl-10 pr-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 outline-none transition-all"
                    />
                </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead className="bg-gray-50 dark:bg-gray-900/50">
                            {table.getHeaderGroups().map(headerGroup => (
                                <tr key={headerGroup.id}>
                                    {headerGroup.headers.map(header => (
                                        <th key={header.id} className="px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                            {flexRender(header.column.columnDef.header, header.getContext())}
                                        </th>
                                    ))}
                                </tr>
                            ))}
                        </thead>
                        <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                            {table.getRowModel().rows.length === 0 ? (
                                <tr>
                                    <td colSpan={columns.length} className="px-6 py-8 text-center text-gray-500 dark:text-gray-400">
                                        No companies found.
                                    </td>
                                </tr>
                            ) : (
                                table.getRowModel().rows.map(row => (
                                    <tr key={row.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                                        {row.getVisibleCells().map(cell => (
                                            <td key={cell.id} className="px-6 py-4">
                                                {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                            </td>
                                        ))}
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default CompaniesPage;
