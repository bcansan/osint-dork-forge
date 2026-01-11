"use client";

import { X, Zap, Download, Lock } from 'lucide-react';
import Link from 'next/link';

interface PaywallModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    description: string;
}

export default function PaywallModal({ isOpen, onClose, title, description }: PaywallModalProps) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div
                className="absolute inset-0 bg-background/80 backdrop-blur-sm"
                onClick={onClose}
            />
            <div className="relative bg-black/90 border border-primary/30 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl shadow-primary/20">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary to-transparent" />

                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-slate-500 hover:text-white transition-colors"
                >
                    <X className="w-5 h-5" />
                </button>

                <div className="p-8 text-center">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-6 border border-primary/20">
                        <Lock className="w-8 h-8 text-primary" />
                    </div>

                    <h2 className="text-2xl font-mono font-bold text-white mb-2">{title}</h2>
                    <p className="text-slate-400 mb-8">{description}</p>

                    <div className="grid grid-cols-3 gap-4 mb-8">
                        {['TXT', 'JSON', 'CSV'].map((format) => (
                            <div key={format} className="bg-white/5 border border-white/10 rounded-lg p-4 flex flex-col items-center gap-2 opacity-50 grayscale">
                                <Download className="w-5 h-5 text-slate-500" />
                                <span className="text-xs font-bold text-slate-400">{format}</span>
                            </div>
                        ))}
                    </div>

                    <div className="flex flex-col gap-3">
                        <Link
                            href="/pricing"
                            className="bg-primary hover:bg-primary/90 text-primary-foreground py-3.5 rounded-xl font-bold flex items-center justify-center gap-2 transition-all group"
                        >
                            <Zap className="w-4 h-4 fill-current group-hover:scale-110 transition-transform" />
                            Obtener Acceso Pro
                        </Link>
                        <button
                            onClick={onClose}
                            className="text-slate-500 hover:text-slate-300 text-sm py-2 font-medium transition-colors"
                        >
                            Seguir como Free
                        </button>
                    </div>

                    <p className="mt-6 text-[10px] text-slate-600 font-mono italic">
                        * Las exportaciones avanzadas requieren una suscripción activa
                    </p>
                </div>
            </div>
        </div>
    );
}
