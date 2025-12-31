import { Copy, Terminal, AlertTriangle, Check } from 'lucide-react';
import { useState } from 'react';

interface ResultsDisplayProps {
    results: string;
}

export default function ResultsDisplay({ results }: ResultsDisplayProps) {
    const [copied, setCopied] = useState(false);

    if (!results) return null;

    const handleCopy = () => {
        navigator.clipboard.writeText(results);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-primary flex items-center gap-2">
                    <span className="w-1 h-6 bg-primary rounded-full"></span>
                    Generated Dorks
                </h2>
                <button
                    onClick={handleCopy}
                    className="flex items-center gap-2 text-xs font-mono text-primary/80 hover:text-primary transition-colors"
                >
                    {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    {copied ? 'COPIED' : 'COPY ALL'}
                </button>
            </div>

            <div className="relative group">
                <div className="absolute inset-0 bg-primary/5 rounded-lg blur-sm group-hover:bg-primary/10 transition-all"></div>
                <div className="relative bg-black/40 border border-primary/30 rounded-lg p-6 font-mono text-sm leading-relaxed text-slate-300 overflow-x-auto">
                    <pre className="whitespace-pre-wrap">{results}</pre>
                </div>
            </div>

            <div className="bg-amber-500/10 border border-amber-500/20 rounded-md p-4 flex gap-3 text-amber-500/90 text-xs">
                <AlertTriangle className="w-5 h-5 flex-shrink-0" />
                <div>
                    <p className="font-bold mb-1">LEGAL WARNING</p>
                    <p className="opacity-80">
                        These search queries are for educational and authorized application security testing purposes only.
                        Using them to identify systems without authorization may violate laws such as the CFAA.
                        Always obtain permission before performing extensive reconnaissance.
                    </p>
                </div>
            </div>
        </div>
    );
}
