
import { useThemeStore } from '../../context/themeStore';
import { useAuthStore } from '../../context/authStore';
import { Sun, Moon, LogOut } from 'lucide-react';


const Topbar = () => {
    const { theme, toggleTheme } = useThemeStore();
    const { logout } = useAuthStore();

    return (
        <header className="h-16 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between px-6 sticky top-0 z-40">
            <h1 className="text-lg font-semibold text-gray-800 dark:text-white">
                Inside Sales Dashboard
            </h1>
            <div className="flex items-center gap-4">

                <button
                    onClick={toggleTheme}
                    className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700 transition-colors"
                    title="Toggle Theme"
                >
                    {theme === 'light' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
                </button>
                <div className="h-6 w-px bg-gray-200 dark:bg-gray-700 mx-1" />
                <button
                    onClick={logout}
                    className="flex items-center gap-2 text-sm font-medium text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 transition-colors"
                >
                    <LogOut className="w-4 h-4" />
                    Sign Out
                </button>
            </div>
        </header>
    );
};

export default Topbar;
