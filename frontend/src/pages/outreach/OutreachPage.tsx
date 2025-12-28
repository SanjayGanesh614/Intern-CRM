import React from 'react';
import { MessageSquare, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const OutreachPage = () => {
    const navigate = useNavigate();

    return (
        <div className="p-6 max-w-4xl mx-auto">
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-2xl p-8 border border-blue-100 dark:border-blue-800 text-center">
                <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/50 rounded-full flex items-center justify-center mx-auto mb-6">
                    <MessageSquare className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                </div>

                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                    AI Outreach Center
                </h1>

                <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto mb-8">
                    To generate personalized emails and LinkedIn messages, please browse your Internships and select a specific candidate/company.
                    The AI Outreach tools are context-aware and located within the Internship Details drawer.
                </p>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                    <button
                        onClick={() => navigate('/internships')}
                        className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-semibold transition-colors shadow-lg shadow-blue-600/20"
                    >
                        Go to Internships <ArrowRight className="w-5 h-5" />
                    </button>
                </div>
            </div>

            <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
                        <span className="w-6 h-6 rounded-full bg-green-100 text-green-600 flex items-center justify-center text-xs">1</span>
                        Select an Internship
                    </h3>
                    <p className="text-gray-500 dark:text-gray-400 text-sm">
                        Navigate to the Internships page and click on any row to open the details view.
                    </p>
                </div>

                <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
                        <span className="w-6 h-6 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center text-xs">2</span>
                        Use AI Tools
                    </h3>
                    <p className="text-gray-500 dark:text-gray-400 text-sm">
                        Click the <strong>AI Outreach</strong> tab in the drawer to generate personalized content instantly.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default OutreachPage;
