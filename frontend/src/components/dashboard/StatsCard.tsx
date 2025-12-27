
import type { LucideIcon } from 'lucide-react';

interface StatsCardProps {
    label: string;
    value: number | string;
    icon: LucideIcon;
    color?: 'blue' | 'green' | 'purple' | 'orange';
    trend?: string;
}

const colorMap = {
    blue: 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400',
    green: 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400',
    purple: 'bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400',
    orange: 'bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400',
};

const StatsCard: React.FC<StatsCardProps> = ({ label, value, icon: Icon, color = 'blue', trend }) => {
    return (
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 transition-all hover:shadow-md">
            <div className="flex items-start justify-between">
                <div>
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                        {label}
                    </h3>
                    <div className="mt-2 flex items-baseline gap-2">
                        <span className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                            {value}
                        </span>
                        {trend && (
                            <span className="text-xs font-medium text-green-600 flex items-center">
                                {trend}
                            </span>
                        )}
                    </div>
                </div>
                <div className={`p-3 rounded-lg ${colorMap[color]}`}>
                    <Icon className="w-6 h-6" />
                </div>
            </div>
        </div>
    );
};

export default StatsCard;
