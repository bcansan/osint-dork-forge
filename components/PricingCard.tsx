"use client";

import { Check, Zap } from 'lucide-react';

interface PricingCardProps {
    name: string;
    price: string;
    description: string;
    features: string[];
    isPopular?: boolean;
    buttonText: string;
    onButtonClick: () => void;
    isLoading?: boolean;
}

export default function PricingCard({
    name,
    price,
    description,
    features,
    isPopular,
    buttonText,
    onButtonClick,
    isLoading
}: PricingCardProps) {
    return (
        <div className={`relative flex flex-col p-8 rounded-3xl transition-all duration-300 ${isPopular
                ? 'bg-gradient-to-b from-primary/20 to-black border-2 border-primary/50 shadow-2xl shadow-primary/10'
                : 'bg-white/5 border border-white/10 hover:border-white/20'
            }`}>
            {isPopular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground text-[10px] font-bold uppercase tracking-widest px-4 py-1.5 rounded-full shadow-lg">
                    Más Popular
                </div>
            )}

            <div className="mb-8">
                <h3 className="text-xl font-mono font-bold text-white mb-2">{name}</h3>
                <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-bold text-white">{price}</span>
                    <span className="text-slate-500 font-medium">{price !== 'Gratis' && '/mes'}</span>
                </div>
                <p className="text-sm text-slate-400 mt-4 h-10">{description}</p>
            </div>

            <div className="flex-1 mb-8">
                <ul className="space-y-4">
                    {features.map((feature, i) => (
                        <li key={i} className="flex items-start gap-3 text-sm text-slate-300">
                            <div className={`mt-0.5 rounded-full p-0.5 ${isPopular ? 'bg-primary/20 text-primary' : 'bg-white/10 text-slate-500'}`}>
                                <Check className="w-3.5 h-3.5" />
                            </div>
                            {feature}
                        </li>
                    ))}
                </ul>
            </div>

            <button
                onClick={onButtonClick}
                disabled={isLoading}
                className={`w-full py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all active:scale-95 ${isPopular
                        ? 'bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/20'
                        : 'bg-white/10 hover:bg-white/20 text-white'
                    } disabled:opacity-50 disabled:cursor-not-allowed`}
            >
                {isLoading ? (
                    <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
                ) : (
                    <>
                        {isPopular && <Zap className="w-4 h-4 fill-current" />}
                        {buttonText}
                    </>
                )}
            </button>
        </div>
    );
}
