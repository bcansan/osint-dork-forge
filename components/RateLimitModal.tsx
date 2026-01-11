"use client";

import { X, Zap, ArrowRight, ShieldAlert } from 'lucide-react';
import Link from 'next/link';

interface RateLimitModalProps {
    isOpen: boolean;
    onClose: () => void;
    tier: string;
    limit: number;
}

export default function RateLimitModal({ isOpen, onClose, tier, limit }: RateLimitModalProps) {
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
                        <ShieldAlert className="w-8 h-8 text-primary" />
                    </div>

                    <h2 className="text-2xl font-mono font-bold text-white mb-2">¡Límite Alcanzado!</h2>
                    <p className="text-slate-400 mb-8">
                        Has agotado tus <span className="text-primary font-bold">{limit}</span> generaciones mensuales del plan <span className="capitalize text-white font-medium">{tier}</span>.
                    </p>

                    <div className="bg-white/5 border border-white/10 rounded-xl p-6 mb-8 text-left">
                        <h3 className="text-xs font-mono font-bold text-slate-500 uppercase tracking-widest mb-4">¿Por qué actualizar a Pro?</h3>
                        <ul className="space-y-3">
                            {[
                                "100 generaciones mensuales",
                                "Descargas en TXT, JSON y CSV",
                                "Historial completo de 30 días",
                                "Guardado automático de plantillas",
                                "Soporte prioritario"
                            ].map((feature, i) => (
                                <li key={i} className="flex items-center gap-3 text-sm text-slate-300">
                                    <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                                    {feature}
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="flex flex-col gap-3">
                        <Link
                            href="/pricing"
                            className="bg-primary hover:bg-primary/90 text-primary-foreground py-3.5 rounded-xl font-bold flex items-center justify-center gap-2 transition-all group"
                        >
                            <Zap className="w-4 h-4 fill-current group-hover:scale-110 transition-transform" />
                            Actualizar a Pro por $4.99/mes
                        </Link>
                        <button
                            onClick={onClose}
                            className="text-slate-500 hover:text-slate-300 text-sm py-2 font-medium transition-colors"
                        >
                            Quizás más tarde
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
