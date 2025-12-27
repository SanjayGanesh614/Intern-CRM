
import { NavLink } from 'react-router-dom';
import {
    LayoutDashboard,
    Briefcase,
    Building2,
    Users,
    MessageSquare,
    BarChart3
} from 'lucide-react';
import { cn } from '../../utils';
import { useAuthStore } from '../../context/authStore';

const Sidebar = () => {
    const { user } = useAuthStore();
    const isAdmin = user?.role === 'admin';

    const navItems = [
        { to: '/', icon: LayoutDashboard, label: 'Dashboard' },
        { to: '/internships', icon: Briefcase, label: 'Internships' },
        { to: '/companies', icon: Building2, label: 'Companies' },
        { to: '/outreach', icon: MessageSquare, label: 'Outreach' },
        { to: '/analytics', icon: BarChart3, label: 'Analytics' },
    ];

    if (isAdmin) {
        navItems.push({ to: '/users', icon: Users, label: 'Users' });
        // Settings page to be implemented
    }

    return (
        <aside className="w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 h-screen flex flex-col fixed left-0 top-0 transition-all duration-300 z-50">
            <div className="h-16 flex items-center px-6 border-b border-gray-200 dark:border-gray-700">
                <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                    Intern CRM
                </span>
            </div>
            <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
                {navItems.map((item) => (
                    <NavLink
                        key={item.to}
                        to={item.to}
                        className={({ isActive }) =>
                            cn(
                                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                                isActive
                                    ? "bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-300"
                                    : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700/50"
                            )
                        }
                    >
                        <item.icon className="w-5 h-5" />
                        {item.label}
                    </NavLink>
                ))}
            </nav>
            <div className="p-4 border-t border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-900/50 flex items-center justify-center text-indigo-600 dark:text-indigo-400 font-bold text-xs uppercase">
                        {user?.name?.charAt(0) || 'U'}
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                            {user?.name}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 capitalize">
                            {user?.role}
                        </p>
                    </div>
                </div>
            </div>
        </aside>
    );
};

export default Sidebar;
