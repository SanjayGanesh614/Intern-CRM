import React, { useState } from 'react';
import { X, Play, Loader2 } from 'lucide-react';
import { runFetch } from '../../services/fetchService';


interface FetchModalProps {
    isOpen: boolean;
    onClose: () => void;
    onStarted: (fetchId: string) => void;
}

const FetchModal: React.FC<FetchModalProps> = ({ isOpen, onClose, onStarted }) => {
    const [loading, setLoading] = useState(false);
    const [locations, setLocations] = useState('');
    const [types, setTypes] = useState<string[]>(['Software Engineering', 'Data Science', 'Product Management']);

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const locs = locations.split(',').map(l => l.trim()).filter(Boolean);
            const res = await runFetch({
                internship_types: types,
                locations: locs.length > 0 ? locs : undefined,
                threshold: 50 // Default safe limit
            });
            onStarted(res.fetch_id);
        } catch (err) {
            console.error(err);
            alert('Failed to start fetch job');
        } finally {
            setLoading(false);
        }
    };

    const toggleType = (t: string) => {
        setTypes(prev => prev.includes(t) ? prev.filter(x => x !== t) : [...prev, t]);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-lg overflow-hidden border border-gray-100 dark:border-gray-700">
                <div className="flex items-center justify-between p-4 border-b border-gray-100 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        Start New Fetch Job
                    </h3>
                    <button onClick={onClose} className="p-1 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400 transition-colors">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    <div className="space-y-3">
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                            Target Roles
                        </label>
                        <div className="flex flex-wrap gap-2">
                            {['Software Engineering', 'Data Science', 'Product Management', 'Marketing', 'Design'].map(role => (
                                <button
                                    key={role}
                                    type="button"
                                    onClick={() => toggleType(role)}
                                    className={`text-xs px-3 py-1.5 rounded-full border transition-all ${types.includes(role)
                                        ? 'bg-blue-100 border-blue-200 text-blue-700 dark:bg-blue-900/40 dark:border-blue-800 dark:text-blue-300'
                                        : 'bg-white border-gray-200 text-gray-600 hover:border-gray-300 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-400'
                                        }`}
                                >
                                    {role}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label htmlFor="locations" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                            Locations (comma separated)
                        </label>
                        <input
                            id="locations"
                            type="text"
                            placeholder="e.g. San Francisco, New York, Remote"
                            value={locations}
                            onChange={e => setLocations(e.target.value)}
                            className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                        />
                    </div>

                    <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-100 dark:border-amber-900/30 rounded-lg p-3 text-xs text-amber-800 dark:text-amber-200">
                        <p><strong>Note:</strong> This process runs a Python script in the background. It may take several minutes to fetch and process data from external sources.</p>
                    </div>

                    <div className="flex justify-end gap-3 pt-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm"
                        >
                            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4" />}
                            Start Fetch
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default FetchModal;
