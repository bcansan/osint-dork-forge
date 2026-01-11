"use client";

import { useState } from 'react';
import MainLayout from '@/components/MainLayout';
import PricingCard from '@/components/PricingCard';
import { useAuth, useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';

export default function PricingPage() {
    const { isSignedIn } = useAuth();
    const { user } = useUser();
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    const handleUpgrade = async () => {
        if (!isSignedIn) {
            // Clerk modal or redirect
            router.push('/sign-in?redirect_url=/pricing');
            return;
        }

        setLoading(true);
        try {
            const response = await fetch('/api/create-checkout', {
                method: 'POST',
            });
            const data = await response.json();
            if (data.url) {
                window.location.href = data.url;
            } else {
                throw new Error(data.error || 'Failed to create checkout session');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Error al iniciar el pago. Por favor intenta de nuevo.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <MainLayout>
            <div className="max-w-7xl mx-auto px-4 py-12">
                <div className="text-center mb-16">
                    <h1 className="text-4xl md:text-5xl font-mono font-bold text-white mb-4 tracking-tighter">
                        Potencia tu <span className="text-primary italic">OSINT</span> Workflow
                    </h1>
                    <p className="text-xl text-slate-400 max-w-2xl mx-auto font-sans">
                        Generaciones ilimitadas, exportaciones avanzadas y gestión de plantillas para investigadores profesionales.
                    </p>
                </div>

                <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                    <PricingCard
                        name="Free"
                        price="Gratis"
                        description="Para entusiastas que están empezando en el mundo del OSINT."
                        features={[
                            "3 generaciones por mes",
                            "Acceso a todos los buscadores",
                            "Vista previa de dorks",
                            "Soporte comunitario"
                        ]}
                        buttonText={isSignedIn ? "Plan Actual" : "Empezar Gratis"}
                        onButtonClick={() => router.push('/')}
                    />

                    <PricingCard
                        name="Pro"
                        price="$4.99"
                        isPopular={true}
                        description="La herramienta definitiva para el reconocimiento avanzado."
                        features={[
                            "100 generaciones por mes",
                            "Descargas en TXT, JSON y CSV",
                            "Historial de 30 días",
                            "Gestión de Plantillas VIP",
                            "Sin límites de rate limit",
                            "Soporte prioritario"
                        ]}
                        buttonText="Actualizar a Pro"
                        onButtonClick={handleUpgrade}
                        isLoading={loading}
                    />
                </div>

                <div className="mt-24 bg-white/5 border border-white/10 rounded-3xl p-8 md:p-12">
                    <div className="grid md:grid-cols-3 gap-12">
                        <div className="text-center md:text-left">
                            <h4 className="text-lg font-bold text-white mb-2 font-mono">Seguridad Primero</h4>
                            <p className="text-sm text-slate-400">Usamos Stripe para pagos seguros y Clerk para autenticación de grado empresarial.</p>
                        </div>
                        <div className="text-center md:text-left">
                            <h4 className="text-lg font-bold text-white mb-2 font-mono">Actualización Instantánea</h4>
                            <p className="text-sm text-slate-400">Tus límites se actualizan automáticamente al completar el pago en segundos.</p>
                        </div>
                        <div className="text-center md:text-left">
                            <h4 className="text-lg font-bold text-white mb-2 font-mono">Cancela en Cualquier Momento</h4>
                            <p className="text-sm text-slate-400">Sin contratos ni compromisos. Gestiona tu suscripción desde el panel de usuario.</p>
                        </div>
                    </div>
                </div>

                <p className="text-center text-slate-600 text-xs mt-12 font-mono">
                    ¿Eres desarrollador u organización? <a href="mailto:admin@osintdork.com" className="text-primary hover:underline">Contáctanos</a> para planes personalizados.
                </p>
            </div>
        </MainLayout>
    );
}
