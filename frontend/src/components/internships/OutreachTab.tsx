import React, { useState } from 'react';
import type { Internship } from '../../services/internshipService';
import { generateOutreach } from '../../services/aiService';
import { Mail, Linkedin, Sparkles, Loader2, Copy, Check } from 'lucide-react';
import { toast } from 'react-hot-toast'; // Assuming react-hot-toast is used based on InternshipDrawer

interface OutreachTabProps {
    internship: Internship;
}

export const OutreachTab: React.FC<OutreachTabProps> = ({ internship }) => {
    const [activeType, setActiveType] = useState<'email' | 'linkedin'>('email');
    const [generatedContent, setGeneratedContent] = useState('');
    const [userNotes, setUserNotes] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [copied, setCopied] = useState(false);

    const handleGenerate = async () => {
        if (!internship.company_name) {
            toast.error('Company name is missing');
            return;
        }

        setIsLoading(true);
        setGeneratedContent('');
        try {
            const response = await generateOutreach({
                company_name: internship.company_name,
                internship_title: internship.title,
                internship_description: internship.description,
                type: activeType,
                user_notes: userNotes
            });

            if (response.status === 'success' && response.generated_content) {
                setGeneratedContent(response.generated_content);
            } else {
                toast.error(response.message || 'Failed to generate content');
            }
        } catch (error: any) {
            toast.error(error.message);
        } finally {
            setIsLoading(false);
        }
    };

    const handleCopy = () => {
        navigator.clipboard.writeText(generatedContent);
        setCopied(true);
        toast.success('Copied to clipboard');
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="space-y-6">
            <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-100 dark:border-blue-800">
                <h4 className="text-sm font-semibold text-blue-900 dark:text-blue-100 flex items-center gap-2 mb-2">
                    <Sparkles className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                    AI Outreach Generator
                </h4>
                <p className="text-xs text-blue-700 dark:text-blue-300">
                    Generating for <strong>{internship.title}</strong> at <strong>{internship.company_name}</strong>.
                    Context from the internship description will be included automatically.
                </p>
            </div>

            <div className="flex gap-4 border-b border-gray-200 dark:border-gray-700 pb-1">
                <button
                    onClick={() => setActiveType('email')}
                    className={`flex items-center gap-2 px-4 py-2 text-sm font-medium border-b-2 transition-colors ${activeType === 'email' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
                >
                    <Mail className="w-4 h-4" /> Email
                </button>
                <button
                    onClick={() => setActiveType('linkedin')}
                    className={`flex items-center gap-2 px-4 py-2 text-sm font-medium border-b-2 transition-colors ${activeType === 'linkedin' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
                >
                    <Linkedin className="w-4 h-4" /> LinkedIn Message
                </button>
            </div>

            <div className="space-y-4">
                <div>
                    <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Additional Context / Instructions (Optional)
                    </label>
                    <textarea
                        value={userNotes}
                        onChange={(e) => setUserNotes(e.target.value)}
                        placeholder="E.g., highlight my React skills, ask for a referral..."
                        className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                        rows={2}
                    />
                </div>

                <button
                    onClick={handleGenerate}
                    disabled={isLoading}
                    className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white py-2.5 rounded-lg text-sm font-medium shadow-sm transition-all disabled:opacity-70 disabled:cursor-not-allowed"
                >
                    {isLoading ? (
                        <>
                            <Loader2 className="w-4 h-4 animate-spin" /> Generating...
                        </>
                    ) : (
                        <>
                            <Sparkles className="w-4 h-4" /> Generate {activeType === 'email' ? 'Email' : 'Message'}
                        </>
                    )}
                </button>

                {generatedContent && (
                    <div className="relative mt-4">
                        <div className="absolute right-2 top-2">
                            <button
                                onClick={handleCopy}
                                className="p-1.5 rounded-md text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 dark:text-gray-400 transition-colors"
                                title="Copy to clipboard"
                            >
                                {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                            </button>
                        </div>
                        <label className="block text-xs font-semibold text-gray-900 dark:text-white mb-2">
                            Generated Draft
                        </label>
                        <textarea
                            value={generatedContent}
                            onChange={(e) => setGeneratedContent(e.target.value)}
                            className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm font-mono bg-gray-50 dark:bg-gray-900 dark:border-gray-700 dark:text-gray-300 p-4"
                            rows={12}
                        />
                    </div>
                )}
            </div>
        </div>
    );
};
