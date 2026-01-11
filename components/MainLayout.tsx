import { Shield, Terminal, Zap } from 'lucide-react';
import { SignInButton, SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import Link from 'next/link';

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground selection:bg-primary selection:text-background font-sans">
      <header className="border-b border-white/5 bg-background/50 backdrop-blur-md sticky top-0 z-50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-primary hover:opacity-80 transition-opacity">
            <Shield className="w-6 h-6" />
            <span className="font-mono font-bold text-xl tracking-tighter">OSINT<span className="text-foreground">DORK</span></span>
          </Link>
          <div className="flex items-center gap-6">
            <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
              <Link href="/" className="text-slate-300 hover:text-primary transition-colors">Generator</Link>
              <Link href="/pricing" className="text-slate-300 hover:text-primary transition-colors flex items-center gap-1">
                Pricing <span className="bg-primary/10 text-primary text-[10px] px-1.5 py-0.5 rounded-full border border-primary/20">Pro</span>
              </Link>
            </nav>
            <div className="h-4 w-px bg-white/10 hidden md:block"></div>
            <div className="flex items-center gap-4">
              <SignedOut>
                <SignInButton mode="modal">
                  <button className="text-sm font-medium text-slate-300 hover:text-white transition-colors cursor-pointer">
                    Sign In
                  </button>
                </SignInButton>
                <Link href="/pricing" className="bg-primary hover:bg-primary/90 text-primary-foreground px-4 py-1.5 rounded-lg text-sm font-bold transition-all flex items-center gap-2">
                  <Zap className="w-4 h-4 fill-current" />
                  Upgrade
                </Link>
              </SignedOut>
              <SignedIn>
                <Link href="/pricing" className="hidden sm:flex items-center gap-2 text-sm font-bold text-primary hover:text-primary/80 transition-colors">
                  <Zap className="w-4 h-4 fill-current" />
                  Go Pro
                </Link>
                <UserButton afterSignOutUrl="/" />
              </SignedIn>
              <span className="hidden lg:flex items-center gap-1 text-[10px] text-slate-500 font-mono"><Terminal className="w-3 h-3" /> v1.0.0</span>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 container mx-auto px-4 py-8">
        {children}
      </main>

      <footer className="border-t border-white/5 py-8 text-center">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-slate-500">
            <p>OSINT Dork Generator &copy; {new Date().getFullYear()} | Powered by Claude 3.5 Sonnet</p>
            <div className="flex items-center gap-4">
              <Link href="/terms" className="hover:text-primary">Terms</Link>
              <Link href="/privacy" className="hover:text-primary">Privacy</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
