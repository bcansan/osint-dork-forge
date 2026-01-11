import { Copy, Terminal, AlertTriangle, Check, Download, Lock, Bookmark, Save } from 'lucide-react';
import { useState } from 'react';
import PaywallModal from './PaywallModal';

interface ResultsDisplayProps {
    results: string;
    tier?: string;
}

export default function ResultsDisplay({ results, tier = 'free' }: ResultsDisplayProps) {
    const [copied, setCopied] = useState(false);
    const [saved, setSaved] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [paywallOpen, setPaywallOpen] = useState(false);

    if (!results) return null;

    const isPro = tier === 'pro' || tier === 'developer';

    const handleCopy = () => {
        navigator.clipboard.writeText(results);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleSaveTemplate = async () => {
        if (!isPro) {
            setPaywallOpen(true);
            return;
        }

        setIsSaving(true);
        try {
            const res = await fetch('/api/save-template', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: `Dorks ${new Date().toLocaleDateString()}`,
                    content: results,
                    platform: 'multiple', // Simplified
                    category: 'General Recon',
                    parameters: {}
                }),
            });
            if (res.ok) {
                setSaved(true);
                setTimeout(() => setSaved(false), 3000);
            }
        } catch (e) {
            console.error('Error saving template:', e);
        } finally {
            setIsSaving(false);
        }
    };

    const handleDownload = (format: string) => {
        if (!isPro) {
            setPaywallOpen(true);
            return;
        }

        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        const filename = `dorks-${timestamp}.${format.toLowerCase()}`;
        let content = results;

        if (format === 'JSON') {
            content = JSON.stringify({ dorks: results, exported_at: new Date().toISOString() }, null, 2);
        } else if (format === 'CSV') {
            // Very basic conversion
            content = "Title,Dork\n" + results.split('###').filter(Boolean).map(block => {
                const lines = block.trim().split('\n');
                const title = lines[0].trim();
                const dork = lines.find(l => l.startsWith('```'))?.replace(/```/g, '').trim() || '';
                return `"${title}","${dork}"`;
            }).join('\n');
        }

        const blob = new Blob([content], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        a.click();
        URL.revokeObjectURL(url);
    };

    return (
        <div className="space-y-4">
            <PaywallModal
                isOpen={paywallOpen}
                onClose={() => setPaywallOpen(false)}
                title="Función Exclusiva Pro"
                description="Las descargas en múltiples formatos están reservadas para usuarios con plan Pro."
            />

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <h2 className="text-lg font-semibold text-primary flex items-center gap-2">
                    <span className="w-1 h-6 bg-primary rounded-full"></span>
                    Generated Dorks
                </h2>
                <div className="flex items-center gap-2 flex-wrap">
                    <button
                        onClick={handleSaveTemplate}
                        disabled={isSaving}
                        className={`flex items-center gap-2 text-[10px] font-mono font-bold px-3 py-1.5 rounded-lg border transition-all ${saved
                                ? 'bg-green-500/20 border-green-500/50 text-green-500'
                                : isPro
                                    ? 'bg-primary/10 border-primary/30 text-primary hover:bg-primary/20'
                                    : 'bg-white/5 border-white/10 text-slate-500 hover:text-slate-400'
                            }`}
                    >
                        {isSaving ? <div className="w-3.5 h-3.5 border border-current border-t-transparent animate-spin rounded-full" /> : saved ? <Check className="w-3.5 h-3.5" /> : isPro ? <Bookmark className="w-3.5 h-3.5" /> : <Lock className="w-3 h-3 opacity-50" />}
                        {saved ? 'SAVED' : 'SAVE TEMPLATE'}
                    </button>
                    <button
                        onClick={handleCopy}
                        className="flex items-center gap-2 text-[10px] font-mono font-bold bg-white/5 border border-white/10 hover:border-primary/50 px-3 py-1.5 rounded-lg text-slate-400 hover:text-primary transition-all"
                    >
                        {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                        {copied ? 'COPIED' : 'COPY ALL'}
                    </button>

                    <div className="flex items-center gap-2">
                        {['TXT', 'JSON', 'CSV'].map((format) => (
                            <button
                                key={format}
                                onClick={() => handleDownload(format)}
                                className={`flex items-center gap-1.5 text-[10px] font-mono font-bold px-3 py-1.5 rounded-lg border transition-all ${isPro
                                    ? 'bg-primary/10 border-primary/30 text-primary hover:bg-primary/20'
                                    : 'bg-white/5 border-white/10 text-slate-500 hover:text-slate-400'
                                    }`}
                            >
                                {isPro ? <Download className="w-3.5 h-3.5" /> : <Lock className="w-3 h-3 opacity-50" />}
                                {format}
                            </button>
                        ))}
                    </div>
                </div>
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
