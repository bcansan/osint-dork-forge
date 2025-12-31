import { Platform, SearchParameters } from '@/types';
import { Search, Globe, Filter, Ban, Sparkles } from 'lucide-react';

interface ParameterInputsProps {
    platform: Platform;
    parameters: SearchParameters;
    setParameters: (params: SearchParameters) => void;
    onGenerate: () => void;
    loading: boolean;
}

const templates: Record<string, { label: string; infoType: string; filters: string }> = {
    "subdomain_enum": { label: "Subdomain Enumeration", infoType: "Subdomains", filters: "-www" },
    "email_harvest": { label: "Email Harvesting", infoType: "Email addresses", filters: "site:linkedin.com OR site:twitter.com" },
    "exposed_files": { label: "Exposed Files", infoType: "PDF, DOC, XLS", filters: "filetype:pdf OR filetype:doc OR filetype:xls" },
    "login_pages": { label: "Login Pages", infoType: "Admin/Login panels", filters: "inurl:login OR inurl:admin" },
    "tech_stack": { label: "Tech Stack", infoType: "Server headers, CMS", filters: "inurl:wp-content OR inurl:plugins" },
};

export default function ParameterInputs({ platform, parameters, setParameters, onGenerate, loading }: ParameterInputsProps) {
    const handleChange = (field: keyof SearchParameters, value: string) => {
        setParameters({ ...parameters, [field]: value });
    };

    return (
        <div className="space-y-6 bg-slate-900/50 border border-primary/20 rounded-lg p-6">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold text-primary flex items-center gap-2">
                    <span className="w-1 h-6 bg-primary rounded-full"></span>
                    Search Parameters
                </h2>

                <select
                    className="bg-background/50 border border-slate-700 rounded text-xs text-slate-400 p-1 focus:border-primary outline-none"
                    onChange={(e) => {
                        const t = templates[e.target.value];
                        if (t) {
                            setParameters({ ...parameters, infoType: t.infoType, filters: t.filters });
                        }
                    }}
                    defaultValue=""
                >
                    <option value="" disabled>Load Template...</option>
                    {Object.entries(templates).map(([key, t]) => (
                        <option key={key} value={key}>{t.label}</option>
                    ))}
                </select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Target Input */}
                <div className="col-span-1 md:col-span-2 space-y-2">
                    <label className="text-xs font-mono text-primary/80 uppercase tracking-wider flex items-center gap-2">
                        <Globe className="w-3 h-3" /> Target (Domain/IP/Org)
                    </label>
                    <input
                        type="text"
                        value={parameters.target}
                        onChange={(e) => handleChange('target', e.target.value)}
                        placeholder="example.com or 192.168.1.1"
                        className="w-full bg-background/50 border border-slate-700 rounded-md p-3 text-slate-100 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all placeholder:text-slate-700 font-mono"
                        onKeyDown={(e) => e.key === 'Enter' && onGenerate()}
                    />
                </div>

                {/* Info Type */}
                <div className="space-y-2">
                    <label className="text-xs font-mono text-primary/80 uppercase tracking-wider flex items-center gap-2">
                        <Search className="w-3 h-3" /> Information Type
                    </label>
                    <input
                        type="text"
                        value={parameters.infoType}
                        onChange={(e) => handleChange('infoType', e.target.value)}
                        placeholder="e.g. Login pages, PDF files, admin panels"
                        className="w-full bg-background/50 border border-slate-700 rounded-md p-3 text-slate-100 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all placeholder:text-slate-700 font-mono"
                    />
                </div>

                {/* Filters */}
                <div className="space-y-2">
                    <label className="text-xs font-mono text-primary/80 uppercase tracking-wider flex items-center gap-2">
                        <Filter className="w-3 h-3" /> Specific Filters
                    </label>
                    <input
                        type="text"
                        value={parameters.filters}
                        onChange={(e) => handleChange('filters', e.target.value)}
                        placeholder="e.g. country:US, port:80, -www"
                        className="w-full bg-background/50 border border-slate-700 rounded-md p-3 text-slate-100 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all placeholder:text-slate-700 font-mono"
                    />
                </div>

                {/* Exclusions */}
                <div className="col-span-1 md:col-span-2 space-y-2">
                    <label className="text-xs font-mono text-red-400/80 uppercase tracking-wider flex items-center gap-2">
                        <Ban className="w-3 h-3" /> Exclusions
                    </label>
                    <input
                        type="text"
                        value={parameters.exclusions}
                        onChange={(e) => handleChange('exclusions', e.target.value)}
                        placeholder="e.g. facebook.com, twitter.com"
                        className="w-full bg-background/50 border border-slate-700 rounded-md p-3 text-slate-100 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all placeholder:text-slate-700 font-mono"
                    />
                </div>
            </div>

            <div className="pt-4 flex justify-end">
                <button
                    onClick={onGenerate}
                    disabled={loading || !parameters.target}
                    className={`
            px-8 py-3 rounded-md font-bold uppercase tracking-wider flex items-center gap-2 transition-all
            ${loading || !parameters.target
                            ? 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
                            : 'bg-primary/20 text-primary border border-primary hover:bg-primary hover:text-background shadow-[0_0_20px_rgba(16,185,129,0.3)] hover:shadow-[0_0_30px_rgba(16,185,129,0.5)]'
                        }
          `}
                >
                    {loading ? (
                        <span className="flex items-center gap-2">
                            <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></span>
                            Generating...
                        </span>
                    ) : (
                        <>
                            <Sparkles className="w-4 h-4" /> Generate Dorks
                        </>
                    )}
                </button>
            </div>
        </div>
    );
}
