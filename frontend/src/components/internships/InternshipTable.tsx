import React, { useMemo } from 'react';
import {
    useReactTable,
    getCoreRowModel,
    flexRender,
} from '@tanstack/react-table';
import type { ColumnDef, RowSelectionState } from '@tanstack/react-table';
import { MoreHorizontal } from 'lucide-react';
import type { Internship } from '../../services/internshipService';
import { cn } from '../../utils';

// Helper for date formatting since date-fns might not be installed yet, using Intl
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
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
            ),
            cell: ({ row }) => (
                <input
                    type="checkbox"
                    checked={row.getIsSelected()}
                    onChange={row.getToggleSelectedHandler()}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
            ),
            enableSorting: false,
        },
        {
            accessorKey: 'title',
            header: 'Role',
            cell: info => <div className="font-medium text-gray-900 dark:text-gray-100">{String(info.getValue())}</div>,
        },
        {
            accessorKey: 'company_id', // Ideally company name, need population or lookup. Assuming populated/flattened or ID for now.
            // Actually backend sends raw ID. Frontend might need to fetch company map or backend should populate.
            // api.md says: GET /internships returns items. Internship model has company_id. 
            // Ideally we need company name. I will check if backend populates it? 
            // looking at backend code: Internship.find().lean(). It does NOT populate company.
            // So I will just show ID or "Company" for now, or I need to update backend.
            // For now, I will display ID.
            header: 'Company',
            cell: info => <span className="text-gray-500 dark:text-gray-400 font-mono text-xs">{String(info.getValue()).slice(0, 8)}...</span>,
        },
        {
            accessorKey: 'status',
            header: 'Status',
            cell: info => {
                const status = String(info.getValue());
                const colorMap: Record<string, string> = {
                    'Unassigned': 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300',
                    'Applied': 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
                    'Interview': 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300',
                    'Offer': 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
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
            accessorKey: 'internship_type',
            header: 'Type',
            cell: info => <span className="text-gray-600 dark:text-gray-400">{String(info.getValue())}</span>,
        },
        {
            accessorKey: 'location',
            header: 'Location',
            cell: info => <span className="text-gray-600 dark:text-gray-400">{String(info.getValue())}</span>,
        },
        {
            accessorKey: 'fetched_at',
            header: 'Fetched',
            cell: info => <span className="text-gray-500 dark:text-gray-400 text-sm">{formatDate(String(info.getValue()))}</span>,
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
        // debugTable: true,
    });

    if (loading) {
        return (
            <div className="w-full h-64 flex items-center justify-center text-gray-400">
                Loading data...
            </div>
        );
    }

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
                            <td colSpan={columns.length} className="px-6 py-4 text-center text-gray-500 dark:text-gray-400">
                                No internships found.
                            </td>
                        </tr>
                    ) : (
                        table.getRowModel().rows.map(row => (
                            <tr
                                key={row.id}
                                onClick={() => onRowClick?.(row.original)}
                                className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors cursor-pointer"
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

export default InternshipTable;
