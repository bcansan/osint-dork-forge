'use client';

import { useState, useEffect } from 'react';
import { Platform, SearchParameters } from '@/types';
import { DorkTemplate } from '@/types/templates';
import SearchConfigPanel from './SearchConfigPanel';
import ParameterInputs from './ParameterInputs';
import ResultsDisplay from './ResultsDisplay';
import RateLimitModal from './RateLimitModal';
import { History, Trash2, Zap } from 'lucide-react';
import { useAuth } from '@clerk/nextjs';
import Link from 'next/link';

export default function DorkTool() {
    const { isSignedIn } = useAuth();
    const [platform, setPlatform] = useState<Platform>('google');
    const [parameters, setParameters] = useState<SearchParameters>({
        target: '',
        infoType: '',
        filters: '',
        exclusions: '',
    });
    const [results, setResults] = useState('');
    const [loading, setLoading] = useState(false);
    const [history, setHistory] = useState<string[]>([]);
    const [mounted, setMounted] = useState(false);

    // Rate Limit State
    const [rateLimitModalOpen, setRateLimitModalOpen] = useState(false);
    const [limitData, setLimitData] = useState({ tier: 'free', limit: 3, remaining: 3 });

    useEffect(() => {
        setMounted(true);
        const saved = localStorage.getItem('osint_dork_history');
        if (saved) {
            try { setHistory(JSON.parse(saved)); } catch (e) { console.error(e); }
        }

        // Initial subscription check
        fetchSubscription();
    }, []);

    const fetchSubscription = async () => {
        try {
            const res = await fetch('/api/check-subscription');
            const data = await res.json();
            if (data.tier) {
                setLimitData({
                    tier: data.tier,
                    limit: data.generations_limit,
                    remaining: data.generations_limit - data.generations_used
                });
            }
        } catch (e) {
            console.error('Error fetching subscription:', e);
        }
    };

    const saveToHistory = (newResult: string) => {
        const newHistory = [newResult, ...history].slice(0, 10);
        setHistory(newHistory);
        localStorage.setItem('osint_dork_history', JSON.stringify(newHistory));
    };

    const clearHistory = () => {
        setHistory([]);
        localStorage.removeItem('osint_dork_history');
    };

    const handleGenerate = async (template?: DorkTemplate) => {
        setLoading(true);
        setResults('');
        try {
            const res = await fetch('/api/generate-dork', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ platform, parameters, templateInfo: template }),
            });

            const data = await res.json();

            if (res.status === 429) {
                setLimitData(data.rateLimit);
                setRateLimitModalOpen(true);
                setResults('');
            } else if (data.dorks) {
                setResults(data.dorks);
                saveToHistory(data.dorks);
                if (data.remaining !== undefined) {
                    setLimitData(prev => ({ ...prev, remaining: data.remaining }));
                }
            } else if (data.error) {
                setResults(`Error: ${data.error}`);
            } else {
                setResults('Error: No dorks generated.');
            }
        } catch (e) {
            console.error(e);
            setResults('Error generating dorks. Please check your network or API key.');
        } finally {
            setLoading(false);
        }
    };

    if (!mounted) return null;

    return (
        <div className="max-w-5xl mx-auto py-4">
            <RateLimitModal
                isOpen={rateLimitModalOpen}
                onClose={() => setRateLimitModalOpen(false)}
                tier={limitData.tier}
                limit={limitData.limit}
            />

            <div className="mb-8 text-center space-y-2">
                <div className="flex justify-center mb-4">
                    <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 px-4 py-1.5 rounded-full text-[10px] font-mono uppercase tracking-widest text-slate-400">
                        <span className={`w-1.5 h-1.5 rounded-full ${limitData.remaining > 0 ? 'bg-green-500' : 'bg-red-500'}`}></span>
                        Tier: <span className="text-primary font-bold">{limitData.tier}</span>
                        <span className="mx-2 opacity-30">|</span>
                        Remaining: <span className="text-white font-bold">{limitData.remaining === Infinity ? '∞' : limitData.remaining}</span>
                        {limitData.tier === 'free' && (
                            <Link href="/pricing" className="ml-2 text-primary hover:underline flex items-center gap-1 group">
                                <Zap className="w-3 h-3 fill-current group-hover:scale-110 transition-transform" />
                                Upgrade
                            </Link>
                        )}
                    </div>
                </div>
                <h1 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-primary via-accent to-secondary tracking-tighter">
                    RECONNAISSANCE ENGINE
                </h1>
                <p className="text-slate-400 max-w-2xl mx-auto">
                    Generate advanced search queries for multiple intelligence platforms using AI-optimized syntax.
                </p>
            </div>

            <SearchConfigPanel platform={platform} setPlatform={setPlatform} />

            <ParameterInputs
                platform={platform}
                parameters={parameters}
                setParameters={setParameters}
                onGenerate={handleGenerate}
                loading={loading}
            />

            <div className="mt-8 space-y-8">
                <ResultsDisplay results={results} tier={limitData.tier} />

                {history.length > 0 && (
                    <div className="border-t border-slate-800 pt-8">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-slate-400 font-mono text-xs flex items-center gap-2">
                                <History className="w-3 h-3" /> RECENT SEARCHES
                            </h3>
                            <button onClick={clearHistory} className="text-red-500/50 hover:text-red-500 transition-colors">
                                <Trash2 className="w-4 h-4" />
                            </button>
                        </div>

                        <div className="grid gap-3">
                            {history.map((item, i) => (
                                <div
                                    key={i}
                                    onClick={() => setResults(item)}
                                    className="group relative bg-slate-900/40 p-3 rounded border border-slate-800 hover:border-primary/50 cursor-pointer transition-all"
                                >
                                    <p className="font-mono text-xs text-slate-500 line-clamp-2 leading-relaxed group-hover:text-slate-300">
                                        {item.replace(/[\r\n]+/g, ' ')}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
