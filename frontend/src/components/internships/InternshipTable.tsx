import React, { useMemo } from 'react';
import {
    useReactTable,
    getCoreRowModel,
    flexRender,
} from '@tanstack/react-table';
import type { ColumnDef, RowSelectionState } from '@tanstack/react-table';
import { MoreHorizontal, ExternalLink } from 'lucide-react';
import type { Internship } from '../../services/internshipService';
import { cn } from '../../utils';

const formatDate = (dateStr?: string) => {
    if (!dateStr) return '-';
    return new Date(dateStr).toLocaleDateString();
};

interface InternshipTableProps {
    data: Internship[];
    loading: boolean;
    rowSelection: RowSelectionState;
    setRowSelection: React.Dispatch<React.SetStateAction<RowSelectionState>>;
    onStatusChange?: (id: string, status: string) => void;
    onRowClick?: (internship: Internship) => void;
}

const InternshipTable: React.FC<InternshipTableProps> = ({
    data,
    loading,
    rowSelection,
    setRowSelection,
    onStatusChange,
    onRowClick
}) => {

    const columns = useMemo<ColumnDef<Internship>[]>(() => [
        {
            id: 'select',
            header: ({ table }) => (
                <input
                    type="checkbox"
                    checked={table.getIsAllPageRowsSelected()}
                    onChange={table.getToggleAllPageRowsSelectedHandler()}
                    className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                />
            ),
            cell: ({ row }) => (
                <input
                    type="checkbox"
                    checked={row.getIsSelected()}
                    onChange={row.getToggleSelectedHandler()}
                    className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                />
            ),
            enableSorting: false,
        },
        {
            accessorKey: 'company_name',
            header: 'Company',
            cell: info => (
                <div className="flex flex-col">
                    <span className="font-medium text-gray-900 dark:text-gray-100">{String(info.getValue() || 'Unknown Company')}</span>
                    {/* Fallback to ID if name missing for some reason, though aggregation handles it */}
                    {!info.getValue() && <span className="text-xs text-gray-400 font-mono">{info.row.original.company_id.slice(0, 6)}...</span>}
                </div>
            ),
        },
        {
            accessorKey: 'title',
            header: 'Role',
            cell: info => <div className="font-medium text-gray-900 dark:text-gray-100">{String(info.getValue())}</div>,
        },
        {
            accessorKey: 'internship_type',
            header: 'Type',
            cell: info => <span className="text-gray-600 dark:text-gray-400 text-sm">{String(info.getValue())}</span>,
        },
        {
            accessorKey: 'status',
            header: 'Sales Status',
            cell: info => {
                const status = String(info.getValue());
                // PRD: Unassigned – Grey, Contacted – Blue, Follow-up – Yellow, Meeting Scheduled – Purple, Interested – Green, Not Interested – Red, Closed – Dark Green
                const colorMap: Record<string, string> = {
                    'Unassigned': 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300',
                    'Contacted': 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
                    'Applied': 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300', // Mapping Applied -> Contacted logic
                    'Follow-up': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300',
                    'Meeting Scheduled': 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300',
                    'Interview': 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300',
                    'Interested': 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
                    'Offer': 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
                    'Not Interested': 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300',
                    'Rejected': 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300', // Mapping Rejected -> Not Interested logic
                    'Onboarded': 'bg-green-800 text-green-100 dark:bg-green-900 dark:text-green-300',
                };
                return (
                    <span className={cn("inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium cursor-pointer hover:opacity-80", colorMap[status] || colorMap['Unassigned'])}>
                        {status}
                    </span>
                    // Note: Inline dropdown update could leverage a Popover here, but keeping it simple for now as requested.
                );
            }
        },
        {
            accessorKey: 'assignee_name',
            header: 'Assigned To',
            cell: info => {
                const val = info.getValue() as string;
                return val ? (
                    <div className="flex items-center gap-2">
                        <div className="w-5 h-5 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center text-xs font-bold">
                            {val.charAt(0)}
                        </div>
                        <span className="text-sm text-gray-700 dark:text-gray-300">{val}</span>
                    </div>
                ) : (
                    <span className="text-gray-400 text-sm italic">Unassigned</span>
                );
            }
        },
        {
            accessorKey: 'source',
            header: 'Source',
            cell: info => (
                <div className="flex items-center gap-1 text-sm text-blue-600 dark:text-blue-400 hover:underline">
                    {String(info.getValue())}
                    <a href={info.row.original.source_url} target="_blank" rel="noopener noreferrer" onClick={e => e.stopPropagation()}>
                        <ExternalLink className="w-3 h-3 text-gray-400 hover:text-blue-500" />
                    </a>
                </div>
            )
        },
        {
            accessorKey: 'fetched_at',
            header: 'Fetched',
            cell: info => <span className="text-gray-500 dark:text-gray-400 text-xs">{formatDate(String(info.getValue()))}</span>,
        },
        {
            id: 'actions',
            cell: () => (
                <button className="text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300">
                    <MoreHorizontal className="w-5 h-5" />
                </button>
            )
        }
    ], [onStatusChange]);

    const table = useReactTable({
        data,
        columns,
        state: {
            rowSelection,
        },
        onRowSelectionChange: setRowSelection,
        getCoreRowModel: getCoreRowModel(),
        manualPagination: true,
        getRowId: row => row.internship_id, // Important for selection
    });

    if (loading) {
        return (
            <div className="w-full h-64 flex items-center justify-center text-gray-400">
                <Loader2 className="w-6 h-6 animate-spin mr-2" />
                Loading internships...
            </div>
        );
    }

    // Helper to render Skeleton if loading? No, simple loader is fine.

    return (
        <div className="overflow-x-auto border border-gray-200 dark:border-gray-700 rounded-lg">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-800">
                    {table.getHeaderGroups().map(headerGroup => (
                        <tr key={headerGroup.id}>
                            {headerGroup.headers.map(header => (
                                <th
                                    key={header.id}
                                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                                >
                                    {header.isPlaceholder
                                        ? null
                                        : flexRender(
                                            header.column.columnDef.header,
                                            header.getContext()
                                        )}
                                </th>
                            ))}
                        </tr>
                    ))}
                </thead>
                <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
                    {table.getRowModel().rows.length === 0 ? (
                        <tr>
                            <td colSpan={columns.length} className="px-6 py-12 text-center text-gray-500 dark:text-gray-400">
                                No internships found matching your filters.
                            </td>
                        </tr>
                    ) : (
                        table.getRowModel().rows.map(row => (
                            <tr
                                key={row.id}
                                onClick={() => onRowClick?.(row.original)}
                                className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors cursor-pointer group"
                            >
                                {row.getVisibleCells().map(cell => (
                                    <td key={cell.id} className="px-6 py-4 whitespace-nowrap text-sm">
                                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                    </td>
                                ))}
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
    );
};

// Add Loader2 import since we use it
import { Loader2 } from 'lucide-react';

export default InternshipTable;
