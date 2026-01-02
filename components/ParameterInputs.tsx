import { useState, useEffect } from 'react';
import { Platform, SearchParameters } from '@/types';
import { Search, Globe, Filter, Ban, Sparkles, Info, AlertTriangle, ShieldAlert } from 'lucide-react';
import { PREDEFINED_TEMPLATES, TEMPLATE_CATEGORIES, DorkTemplate } from '@/types/templates';

interface ParameterInputsProps {
    platform: Platform;
    parameters: SearchParameters;
    setParameters: (params: SearchParameters) => void;
    onGenerate: (template?: DorkTemplate) => void;
    loading: boolean;
}

export default function ParameterInputs({ platform, parameters, setParameters, onGenerate, loading }: ParameterInputsProps) {
    const [selectedCategory, setSelectedCategory] = useState<string>('');
    const [selectedTemplateKey, setSelectedTemplateKey] = useState<string>('');
    const [templateInfo, setTemplateInfo] = useState<DorkTemplate | null>(null);

    const handleChange = (field: keyof SearchParameters, value: string) => {
        setParameters({ ...parameters, [field]: value });
    };

    const handleTemplateChange = (key: string) => {
        setSelectedTemplateKey(key);
        if (key && PREDEFINED_TEMPLATES[key]) {
            const t = PREDEFINED_TEMPLATES[key];
            setTemplateInfo(t);

            // Auto-fill based on template
            const platformQuery = t.platforms[platform] || '';
            const newParams = { ...parameters };

            // Set info type based on template description
            newParams.infoType = t.description;
            // Set filters based on the platform specific dork/query in the template
            // This acts as a starting point or "context" for the AI
            newParams.filters = platformQuery;

            setParameters(newParams);
        } else {
            setTemplateInfo(null);
        }
    };

    const getSeverityBadge = (severity: string) => {
        const badges: Record<string, string> = { CRITICAL: '🔴', HIGH: '🟠', MEDIUM: '🟡', LOW: '🟢' };
        return badges[severity] || '';
    };

    const getSeverityColor = (severity: string) => {
        const colors: Record<string, string> = {
            CRITICAL: 'bg-red-900/30 text-red-400 border border-red-500/30',
            HIGH: 'bg-orange-900/30 text-orange-400 border border-orange-500/30',
            MEDIUM: 'bg-yellow-900/30 text-yellow-400 border border-yellow-500/30',
            LOW: 'bg-green-900/30 text-green-400 border border-green-500/30'
        };
        return colors[severity] || '';
    };

    function getTargetLabel(template?: DorkTemplate | null): string {
        if (!template) return "🎯 TARGET (DOMAIN/IP/ORG)";

        const labels: Record<string, string> = {
            'IP Cameras': '🎯 TARGET (IP Range or Country)',
            'Directory Listing': '🎯 TARGET (Domain)',
            'IoT Devices': '🎯 TARGET (IP Range or Country)',
            'Critical Services': '🎯 TARGET (IP Range, Country or Org)',
            'Admin Panels': '🎯 TARGET (Domain or Organization)',
            'Sensitive Files': '🎯 TARGET (Domain or leave empty)'
        };

        return labels[template.category] || "🎯 TARGET (DOMAIN/IP/ORG)";
    }

    function getTargetPlaceholder(template?: DorkTemplate | null): string {
        if (!template) return "example.com or 192.168.1.0/24";

        const placeholders: Record<string, string> = {
            'IP Cameras': '192.168.1.0/24 or country:ES',
            'Directory Listing': 'example.com',
            'IoT Devices': 'country:ES or 10.0.0.0/8',
            'Critical Services': '10.0.0.0/8 or org:"Company"',
            'Admin Panels': 'company.com or inurl:company',
            'Sensitive Files': 'target.com (optional)'
        };

        return placeholders[template.category] || "example.com";
    }

    function getTargetExamples(template: DorkTemplate) {
        const examples: Record<string, string[]> = {
            'IP Cameras': [
                '• IP específica: 192.168.1.100',
                '• Rango CIDR: 10.0.0.0/24',
                '• País: country:ES, country:MX',
                '• Ciudad: city:"Madrid"'
            ],
            'Directory Listing': [
                '• Dominio: example.com',
                '• Subdominio: admin.example.com',
                '• Comodín: *.example.com'
            ],
            'IoT Devices': [
                '• Rango IP: 192.168.0.0/16',
                '• País: country:ES',
                '• Organización: org:"ISP Name"'
            ],
            'Critical Services': [
                '• Red interna: 10.0.0.0/8',
                '• ASN: asn:AS12345',
                '• ISP: net:"Provider Name"'
            ],
            'Admin Panels': [
                '• Dominio: company.com',
                '• Subdominios: *.company.com',
                '• URL path: inurl:/admin'
            ],
            'Sensitive Files': [
                '• Dominio: target.com',
                '• Organización: site:*.org.com',
                '• Global: (dejar vacío)'
            ]
        };

        const categoryExamples = examples[template.category] || [];

        return (
            <div className="mt-3 bg-slate-900/40 p-2 rounded border border-slate-700/50">
                {categoryExamples.map((ex, i) => (
                    <div key={i} className="text-xs text-slate-400 font-mono">{ex}</div>
                ))}
            </div>
        );
    }

    // Filter templates by category
    const filteredTemplates = Object.entries(PREDEFINED_TEMPLATES).filter(([_, t]) =>
        selectedCategory ? t.category === selectedCategory : true
    );

    return (
        <div className="space-y-6 bg-slate-900/50 border border-primary/20 rounded-lg p-6">
            <div className="flex flex-col gap-4 mb-6">
                <div className="flex justify-between items-center">
                    <h2 className="text-lg font-semibold text-primary flex items-center gap-2">
                        <span className="w-1 h-6 bg-primary rounded-full"></span>
                        Search Parameters
                    </h2>
                </div>

                {/* Categories and Templates Selection */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1">
                        <label className="text-xs font-mono text-primary/60 uppercase tracking-wider">Category</label>
                        <select
                            className="w-full bg-background/50 border border-slate-700 rounded-md p-2 text-sm text-slate-300 focus:border-primary outline-none"
                            value={selectedCategory}
                            onChange={(e) => {
                                setSelectedCategory(e.target.value);
                                setSelectedTemplateKey('');
                                setTemplateInfo(null);
                            }}
                        >
                            <option value="">Select Category...</option>
                            {Object.entries(TEMPLATE_CATEGORIES).map(([key, label]) => (
                                <option key={key} value={key}>{label}</option>
                            ))}
                        </select>
                    </div>

                    <div className="space-y-1">
                        <label className="text-xs font-mono text-primary/60 uppercase tracking-wider">Template</label>
                        <select
                            className="w-full bg-background/50 border border-slate-700 rounded-md p-2 text-sm text-slate-300 focus:border-primary outline-none"
                            value={selectedTemplateKey}
                            onChange={(e) => handleTemplateChange(e.target.value)}
                            disabled={!selectedCategory}
                        >
                            <option value="">Select Template...</option>
                            {filteredTemplates.map(([key, t]) => (
                                <option key={key} value={key}>{t.name}</option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Template Info Card */}
                {templateInfo && (
                    <div className="bg-slate-800/40 rounded-md border border-slate-700 p-4 animate-in fade-in slide-in-from-top-2">
                        <div className="flex items-start justify-between gap-4">
                            <div>
                                <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2">
                                    {templateInfo.name}
                                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-mono uppercase ${getSeverityColor(templateInfo.severity)}`}>
                                        {getSeverityBadge(templateInfo.severity)} {templateInfo.severity}
                                    </span>
                                </h3>
                                <p className="text-xs text-slate-400 mt-1">{templateInfo.description}</p>
                            </div>
                            <div className="text-xs bg-blue-900/20 text-blue-400 px-2 py-1 rounded border border-blue-500/20 whitespace-nowrap">
                                {templateInfo.category}
                            </div>
                        </div>

                        {templateInfo.credentials && (
                            <div className="mt-3 bg-red-950/30 border border-red-500/30 rounded p-2 flex items-start gap-2">
                                <ShieldAlert className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                                <div>
                                    <span className="text-xs font-bold text-red-400 block mb-1">DANGER: KNOWN CREDENTIALS</span>
                                    <code className="text-xs font-mono text-red-300/80 break-all">{templateInfo.credentials}</code>
                                </div>
                            </div>
                        )}

                        {templateInfo && (
                            <div className="mt-4">
                                <div className="text-xs font-bold text-slate-400 mb-1 flex items-center gap-1">
                                    <Info className="w-3 h-3" />
                                    💡 Ejemplos de Target para esta búsqueda:
                                </div>
                                {getTargetExamples(templateInfo)}
                            </div>
                        )}
                    </div>
                )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Target Input */}
                <div className="col-span-1 md:col-span-2 space-y-2">
                    <label className="text-xs font-mono text-primary/80 uppercase tracking-wider flex items-center gap-2">
                        <Globe className="w-3 h-3" /> {getTargetLabel(templateInfo)}
                    </label>
                    <input
                        type="text"
                        value={parameters.target}
                        onChange={(e) => handleChange('target', e.target.value)}
                        placeholder={getTargetPlaceholder(templateInfo)}
                        className="w-full bg-background/50 border border-slate-700 rounded-md p-3 text-slate-100 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all placeholder:text-slate-700 font-mono"
                        onKeyDown={(e) => e.key === 'Enter' && onGenerate(templateInfo || undefined)}
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
                    onClick={() => onGenerate(templateInfo || undefined)}
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
