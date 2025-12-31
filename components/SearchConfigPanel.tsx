import { Platform } from '@/types';
import { ChevronDown } from 'lucide-react';

interface SearchConfigPanelProps {
    platform: Platform;
    setPlatform: (p: Platform) => void;
}

const platforms: { id: Platform; label: string }[] = [
    { id: 'google', label: 'Google Dorks' },
    { id: 'shodan', label: 'Shodan' },
    { id: 'zoomeye', label: 'ZoomEye' },
    { id: 'censys', label: 'Censys' },
    { id: 'fofa', label: 'FOFA' },
];

export default function SearchConfigPanel({ platform, setPlatform }: SearchConfigPanelProps) {
    return (
        <div className="bg-slate-900/50 border border-primary/20 rounded-lg p-6 mb-6">
            <h2 className="text-lg font-semibold text-primary mb-4 flex items-center gap-2">
                <span className="w-1 h-6 bg-primary rounded-full"></span>
                Target Platform
            </h2>

            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                {platforms.map((p) => (
                    <button
                        key={p.id}
                        onClick={() => setPlatform(p.id)}
                        className={`
              relative px-4 py-3 rounded-md border text-sm font-medium transition-all duration-200
              flex items-center justify-center gap-2
              ${platform === p.id
                                ? 'bg-primary/10 border-primary text-primary shadow-[0_0_15px_rgba(16,185,129,0.2)]'
                                : 'bg-background border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                            }
            `}
                    >
                        {p.label}
                        {platform === p.id && (
                            <div className="absolute inset-0 border-2 border-primary rounded-md animate-pulse pointer-events-none opacity-20"></div>
                        )}
                    </button>
                ))}
            </div>
        </div>
    );
}
