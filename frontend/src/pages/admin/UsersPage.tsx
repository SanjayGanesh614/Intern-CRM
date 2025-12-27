import React, { useEffect, useState } from 'react';
import { getAllUsers, updateUserRole, deleteUser, createUser } from '../../services/userService';
import type { User } from '../../services/userService';
import { Shield, ShieldAlert, Trash2, User as UserIcon, Loader2, Search, Plus, X } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { useAuthStore } from '../../context/authStore';

const UsersPage: React.FC = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const { user: currentUser } = useAuthStore();

    // Create User State
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [createName, setCreateName] = useState('');
    const [createEmail, setCreateEmail] = useState('');
    const [createPassword, setCreatePassword] = useState('');
    const [createRole, setCreateRole] = useState<'admin' | 'user' | 'sales'>('sales');
    const [createLoading, setCreateLoading] = useState(false);

    const fetchUsers = async () => {
        try {
            setLoading(true);
            const data = await getAllUsers();
            setUsers(data);
        } catch (err) {
            toast.error('Failed to load users');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const handleCreateUser = async (e: React.FormEvent) => {
        e.preventDefault();
        setCreateLoading(true);
        try {
            const newUser = await createUser({
                name: createName,
                email: createEmail,
                password: createPassword,
                role: createRole
            });
            setUsers(prev => [newUser, ...prev]);
            toast.success('User created successfully');
            setIsCreateOpen(false);
            // Reset form
            setCreateName('');
            setCreateEmail('');
            setCreatePassword('');
        } catch (err: any) {
            toast.error(err.response?.data?.error || 'Failed to create user');
        } finally {
            setCreateLoading(false);
        }
    };

    const handleRoleChange = async (userId: string, newRole: 'admin' | 'user') => {
        try {
            await updateUserRole(userId, newRole);
            setUsers(prev => prev.map(u => u.user_id === userId ? { ...u, role: newRole } : u));
            toast.success(`Role updated to ${newRole}`);
        } catch (err) {
            toast.error('Failed to update role');
        }
    };

    const handleDelete = async (userId: string) => {
        if (!window.confirm('Are you sure you want to delete this user? This cannot be undone.')) return;
        try {
            await deleteUser(userId);
            setUsers(prev => prev.filter(u => u.user_id !== userId));
            toast.success('User deleted');
        } catch (err) {
            toast.error('Failed to delete user');
        }
    };

    const filteredUsers = users.filter(u =>
        u.name.toLowerCase().includes(search.toLowerCase()) ||
        u.email.toLowerCase().includes(search.toLowerCase())
    );

    if (loading) return <div className="flex justify-center items-center h-full"><Loader2 className="w-8 h-8 animate-spin text-purple-600" /></div>;

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">User Management</h1>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Manage system access and roles</p>
                </div>
                <div className="flex items-center gap-3 w-full sm:w-auto">
                    <div className="relative w-full sm:w-64">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search users..."
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            className="w-full pl-9 pr-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm focus:ring-2 focus:ring-purple-500 outline-none transition-all"
                        />
                    </div>
                    <button
                        onClick={() => setIsCreateOpen(true)}
                        className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                    >
                        <Plus className="w-4 h-4" />
                        Add User
                    </button>
                </div>
            </div>

            {/* Create User Modal */}
            {isCreateOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-md w-full p-6 animate-in fade-in zoom-in duration-200">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Add New User</h2>
                            <button onClick={() => setIsCreateOpen(false)} className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300">
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        <form onSubmit={handleCreateUser} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Name</label>
                                <input
                                    type="text"
                                    required
                                    value={createName}
                                    onChange={e => setCreateName(e.target.value)}
                                    className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email</label>
                                <input
                                    type="email"
                                    required
                                    value={createEmail}
                                    onChange={e => setCreateEmail(e.target.value)}
                                    className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Password</label>
                                <input
                                    type="password"
                                    required
                                    value={createPassword}
                                    onChange={e => setCreatePassword(e.target.value)}
                                    className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Role</label>
                                <select
                                    value={createRole}
                                    onChange={e => setCreateRole(e.target.value as any)}
                                    className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                                >
                                    <option value="sales">Sales</option>
                                    <option value="admin">Admin</option>
                                    <option value="user">Viewer (User)</option>
                                </select>
                            </div>
                            <div className="flex gap-3 mt-6">
                                <button
                                    type="button"
                                    onClick={() => setIsCreateOpen(false)}
                                    className="flex-1 px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={createLoading}
                                    className="flex-1 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition-colors disabled:opacity-70 disabled:cursor-not-allowed flex justify-center items-center gap-2"
                                >
                                    {createLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Create User'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-gray-50 dark:bg-gray-900/50 border-b border-gray-100 dark:border-gray-700">
                            <tr>
                                <th className="px-6 py-4 font-semibold text-gray-600 dark:text-gray-300">User</th>
                                <th className="px-6 py-4 font-semibold text-gray-600 dark:text-gray-300">Role</th>
                                <th className="px-6 py-4 font-semibold text-gray-600 dark:text-gray-300">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                            {filteredUsers.map(user => (
                                <tr key={user.user_id} className="hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-purple-100 dark:bg-purple-900/50 flex items-center justify-center text-purple-600 dark:text-purple-400 font-bold">
                                                {user.name.charAt(0)}
                                            </div>
                                            <div>
                                                <p className="font-medium text-gray-900 dark:text-white">{user.name}</p>
                                                <p className="text-xs text-gray-500 dark:text-gray-400">{user.email}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border ${user.role === 'admin'
                                            ? 'bg-indigo-50 text-indigo-700 border-indigo-100 dark:bg-indigo-900/20 dark:text-indigo-300 dark:border-indigo-800'
                                            : 'bg-gray-100 text-gray-700 border-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700'
                                            }`}>
                                            {user.role === 'admin' ? <Shield className="w-3 h-3" /> : <UserIcon className="w-3 h-3" />}
                                            {user.role}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            {user.role === 'user' ? (
                                                <button
                                                    onClick={() => handleRoleChange(user.user_id, 'admin')}
                                                    className="p-1.5 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                                                    title="Promote to Admin"
                                                >
                                                    <ShieldAlert className="w-4 h-4" />
                                                </button>
                                            ) : (
                                                <button
                                                    onClick={() => handleRoleChange(user.user_id, 'user')}
                                                    className="p-1.5 text-gray-500 hover:bg-gray-100 rounded-lg transition-colors"
                                                    title="Demote to User"
                                                    disabled={user.user_id === currentUser?.user_id} // Prevent self-demotion
                                                >
                                                    <UserIcon className="w-4 h-4" />
                                                </button>
                                            )}
                                            <button
                                                onClick={() => handleDelete(user.user_id)}
                                                className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                title="Delete User"
                                                disabled={user.user_id === currentUser?.user_id} // Prevent self-deletion
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default UsersPage;
