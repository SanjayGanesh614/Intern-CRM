import React, { useEffect, useState, useRef } from 'react';
import { Loader2, CheckCircle2, AlertCircle, Ban } from 'lucide-react';
import { getFetchStatus, cancelFetch } from '../../services/fetchService';
import type { FetchProgressData } from '../../services/fetchService';
import { cn } from '../../utils';

interface FetchProgressProps {
    fetchId: string;
    onClose: () => void;
}

const FetchProgress: React.FC<FetchProgressProps> = ({ fetchId, onClose }) => {
    const [progress, setProgress] = useState<FetchProgressData | null>(null);
    const [error, setError] = useState('');
    const pollRef = useRef<ReturnType<typeof setInterval> | undefined>(undefined);

    useEffect(() => {
        const poll = async () => {
            try {
                const data = await getFetchStatus(fetchId);
                setProgress(data);
                if (['done', 'failed', 'cancelled'].includes(data.phase)) {
                    clearInterval(pollRef.current as any); // Cast to any or number/NodeJS.Timeout
                }
            } catch (err) {
                console.error(err);
                setError('Lost connection to fetch job');
                clearInterval(pollRef.current as any);
            }
        };

        poll(); // Initial call
        pollRef.current = setInterval(poll, 2000);

        return () => clearInterval(pollRef.current as any);
    }, [fetchId]);

    const handleCancel = async () => {
        if (!confirm('Are you sure you want to stop this job?')) return;
        try {
            await cancelFetch(fetchId);
        } catch (err) {
            console.error(err);
        }
    };

    const isFinished = progress && ['done', 'failed', 'cancelled'].includes(progress.phase);

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-lg overflow-hidden border border-gray-100 dark:border-gray-700">
                <div className="p-6 text-center space-y-4">
                    {error ? (
                        <div className="text-red-500 flex flex-col items-center">
                            <AlertCircle className="w-12 h-12 mb-2" />
                            <p className="font-medium">{error}</p>
                        </div>
                    ) : progress ? (
                        <>
                            <div className="flex items-center justify-center mb-4">
                                {progress.phase === 'done' ? (
                                    <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center text-green-600 dark:text-green-400">
                                        <CheckCircle2 className="w-8 h-8" />
                                    </div>
                                ) : progress.phase === 'failed' || progress.phase === 'cancelled' ? (
                                    <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center text-red-600 dark:text-red-400">
                                        <Ban className="w-8 h-8" />
                                    </div>
                                ) : (
                                    <div className="relative w-20 h-20 flex items-center justify-center">
                                        <Loader2 className="w-16 h-16 text-blue-500 animate-spin" />
                                        <span className="absolute text-xs font-bold text-gray-700 dark:text-gray-300">{progress.percent}%</span>
                                    </div>
                                )}
                            </div>

                            <h3 className="text-xl font-bold text-gray-900 dark:text-white capitalize">
                                {progress.phase.replace('_', ' ')}
                            </h3>

                            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 mb-4">
                                <div
                                    className={cn("h-2.5 rounded-full transition-all duration-500",
                                        progress.phase === 'failed' || progress.phase === 'cancelled' ? "bg-red-500" : "bg-blue-600"
                                    )}
                                    style={{ width: `${progress.percent}%` }}
                                ></div>
                            </div>

                            <div className="grid grid-cols-3 gap-4 text-center">
                                <div className="bg-gray-50 dark:bg-gray-700/50 p-3 rounded-lg">
                                    <p className="text-xs text-gray-500 dark:text-gray-400">Fetched</p>
                                    <p className="text-lg font-bold text-gray-900 dark:text-white">{progress.total_fetched}</p>
                                </div>
                                <div className="bg-gray-50 dark:bg-gray-700/50 p-3 rounded-lg">
                                    <p className="text-xs text-gray-500 dark:text-gray-400">Valid</p>
                                    <p className="text-lg font-bold text-gray-900 dark:text-white">{progress.valid_entries}</p>
                                </div>
                                <div className="bg-gray-50 dark:bg-gray-700/50 p-3 rounded-lg">
                                    <p className="text-xs text-gray-500 dark:text-gray-400">Duplicates</p>
                                    <p className="text-lg font-bold text-gray-900 dark:text-white">{progress.duplicates}</p>
                                </div>
                            </div>
                        </>
                    ) : (
                        <div className="flex flex-col items-center">
                            <Loader2 className="w-8 h-8 text-gray-400 animate-spin mb-2" />
                            <p className="text-sm text-gray-500">Initializing...</p>
                        </div>
                    )}

                    <div className="pt-4 flex justify-center">
                        {!isFinished ? (
                            <button
                                onClick={handleCancel}
                                className="px-6 py-2 border border-red-200 dark:border-red-900/50 text-red-600 dark:text-red-400 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-sm font-medium transition-colors"
                            >
                                Stop Job
                            </button>
                        ) : (
                            <button
                                onClick={onClose}
                                className="px-6 py-2 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-lg hover:opacity-90 text-sm font-medium transition-opacity"
                            >
                                Close
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FetchProgress;
