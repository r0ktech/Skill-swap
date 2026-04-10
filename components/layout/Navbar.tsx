"use client";

import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/80 backdrop-blur-md">
      <div className="container flex h-16 items-center justify-between px-4 md:px-6">
        <Link href="/" className="flex items-center space-x-2 group relative z-50">
          <Image 
            src="/logo.png" 
            alt="SkillSwap Logo" 
            width={150} 
            height={40} 
            className="w-auto h-8 md:h-10 transition-transform group-hover:scale-105" 
            priority
          />
        </Link>
        <nav className="hidden md:flex gap-6">
          <Link href="/browse" className={`text-sm font-medium transition-colors hover:text-primary ${pathname === '/browse' ? 'text-primary font-bold' : 'text-slate-600'}`}>
            Browse Skills
          </Link>
          <Link href="/dashboard" className={`text-sm font-medium transition-colors hover:text-primary ${pathname === '/dashboard' ? 'text-primary font-bold' : 'text-slate-600'}`}>
            Dashboard
          </Link>
          <Link href="/dashboard/messages" className={`text-sm font-medium transition-colors hover:text-primary ${pathname === '/dashboard/messages' ? 'text-primary font-bold' : 'text-slate-600'}`}>
            Messages
          </Link>
        </nav>
        <div className="hidden md:flex items-center gap-4 relative z-50">
          <Button variant="ghost" asChild className="hidden sm:inline-flex text-slate-600">
            <Link href="/login">Log in</Link>
          </Button>
          <Button asChild className="rounded-full">
            <Link href="/signup">Sign up</Link>
          </Button>
        </div>

        {/* Mobile Toggle & Sign Up */}
        <div className="flex md:hidden items-center gap-3 relative z-50">
          <Button asChild className="rounded-full h-8 px-4 text-xs">
            <Link href="/signup">Sign up</Link>
          </Button>
          <button 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="text-slate-600 focus:outline-none p-1 bg-slate-100 rounded-md"
            aria-label="Toggle Navigation"
          >
            {isMobileMenuOpen ? (
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="4" x2="20" y1="12" y2="12"/><line x1="4" x2="20" y1="6" y2="6"/><line x1="4" x2="20" y1="18" y2="18"/></svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-16 left-0 w-full bg-white border-b shadow-xl px-4 pt-2 pb-6 flex flex-col space-y-4 z-40 animate-in slide-in-from-top-2">
          <Link href="/browse" onClick={() => setIsMobileMenuOpen(false)} className={`text-base font-medium px-2 py-2 rounded-md transition-colors ${pathname === '/browse' ? 'text-primary bg-primary/5' : 'text-slate-800 hover:text-primary hover:bg-slate-50'}`}>
            Browse Skills
          </Link>
          <Link href="/dashboard" onClick={() => setIsMobileMenuOpen(false)} className={`text-base font-medium px-2 py-2 rounded-md transition-colors ${pathname === '/dashboard' ? 'text-primary bg-primary/5' : 'text-slate-800 hover:text-primary hover:bg-slate-50'}`}>
            Dashboard
          </Link>
          <Link href="/dashboard/messages" onClick={() => setIsMobileMenuOpen(false)} className={`text-base font-medium px-2 py-2 rounded-md transition-colors ${pathname === '/dashboard/messages' ? 'text-primary bg-primary/5' : 'text-slate-800 hover:text-primary hover:bg-slate-50'}`}>
            Messages
          </Link>
          <div className="border-t border-slate-100 pt-4">
             <Link href="/login" onClick={() => setIsMobileMenuOpen(false)} className="text-base font-medium text-slate-600 hover:text-primary px-2 py-2 block w-full">
               Log in
             </Link>
          </div>
        </div>
      )}
    </header>
  );
}
