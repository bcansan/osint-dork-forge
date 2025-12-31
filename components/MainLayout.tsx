import { Shield, Terminal } from 'lucide-react';

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground selection:bg-primary selection:text-background font-sans">
      <header className="border-b border-primary/20 bg-background/50 backdrop-blur-md sticky top-0 z-50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
            <div className="flex items-center gap-2 text-primary">
                <Shield className="w-6 h-6" />
                <span className="font-mono font-bold text-xl tracking-tighter">OSINT<span className="text-foreground">DORK</span></span>
            </div>
            <div className="flex items-center gap-4 text-sm text-slate-400">
                <span className="flex items-center gap-1"><Terminal className="w-4 h-4"/> v1.0.0</span>
            </div>
        </div>
      </header>

      <main className="flex-1 container mx-auto px-4 py-8">
        {children}
      </main>

      <footer className="border-t border-primary/10 py-6 text-center text-xs text-slate-600">
        <p>OSINT Dork Generator &copy; {new Date().getFullYear()} | Authorized Use Only</p>
      </footer>
    </div>
  );
}
