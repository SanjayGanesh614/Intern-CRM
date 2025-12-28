import React, { useEffect, useState } from 'react';
import { getAllUsers } from '../../services/userService';
import type { User } from '../../services/userService';
import { Loader2 } from 'lucide-react';

interface AssignmentDropdownProps {
    value: string | undefined;
    onChange: (userId: string) => void;
    className?: string;
    disabled?: boolean;
    currentUser?: any; // or strict User type
}

const AssignmentDropdown: React.FC<AssignmentDropdownProps> = ({ value, onChange, className, disabled, currentUser }) => {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetch = async () => {
            setLoading(true);
            try {
                const data = await getAllUsers();
                setUsers(data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetch();
    }, []);

    if (loading) return <div className="text-gray-400 text-xs flex items-center gap-1"><Loader2 className="w-3 h-3 animate-spin" /> Loading users...</div>;

    // Filter to only show relevant roles if needed (Admin/Sales)
    const assignableUsers = users.filter(u => {
        if (currentUser?.role === 'sales') {
            return u.user_id === currentUser.user_id;
        }
        return ['admin', 'sales'].includes(u.role);
    });

    return (
        <select
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            disabled={disabled}
            className={`block w-full rounded-lg border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm shadow-sm focus:border-purple-500 focus:ring-purple-500 dark:text-white ${className}`}
        >
            <option value="">Unassigned</option>
            {assignableUsers.map(user => (
                <option key={user.user_id} value={user.user_id}>
                    {user.name}
                    {/* Hacky way to check for active_load type safety since interface might lag */}
                    {(user as any).active_load !== undefined ? ` (${(user as any).active_load} active)` : ''}
                </option>
            ))}
        </select>
    );
};

export default AssignmentDropdown;
