'use client';

import React, { useState } from 'react';
import { Menu, X } from 'lucide-react';
import Link from 'next/link';

export default function SiteHeader() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <>
      {/* Desktop Navigation */}
      <nav className="hidden md:flex justify-center w-full fixed top-6 z-50 px-4 pointer-events-none">
        <div className="glass-panel rounded-full px-6 py-3 flex items-center justify-between w-full max-w-4xl pointer-events-auto">
          <Link href="/" className="flex items-center gap-3 group focus-ring rounded-lg px-2 py-1">
            <div className="text-xl font-bold tracking-tight text-white">
              ECell <span className="text-[#FF1744]">MET</span>
            </div>
          </Link>
          
          <div className="flex items-center gap-8 text-sm font-medium text-white/80">
            <Link href="/" className="hover:text-white transition-colors focus-ring rounded">Home</Link>
            <Link href="/#events" className="hover:text-white transition-colors focus-ring rounded">Events</Link>
            <Link href="/#team" className="hover:text-white transition-colors focus-ring rounded">Team</Link>
            <Link href="/#contact" className="hover:text-white transition-colors focus-ring rounded">Contact</Link>
          </div>
          
          <a 
            href="#" 
            className="btn btn-primary px-6 py-2 rounded-full text-sm focus-ring"
          >
            Join Community
          </a>
        </div>
      </nav>

      {/* Mobile Navigation */}
      <nav className="md:hidden fixed top-0 left-0 right-0 z-50 bg-[#121212]/90 backdrop-blur-md border-b border-white/10">
        <div className="flex items-center justify-between px-4 py-4 w-full">
          <Link href="/" className="flex items-center gap-3 focus-ring rounded-lg">
            <div className="text-xl font-bold tracking-tight text-white">
              ECell <span className="text-[#FF1744]">MET</span>
            </div>
          </Link>
          <button 
            className="p-2 text-white hover:text-[#FF1744] transition-colors bg-white/5 rounded-full backdrop-blur-md border border-white/10 focus-ring"
            aria-label="Toggle Menu"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
        
        {/* Mobile Menu Dropdown */}
        {isMobileMenuOpen && (
          <div className="absolute top-full left-0 right-0 bg-[#121212]/95 backdrop-blur-xl border-b border-white/10 p-4 flex flex-col gap-4 shadow-2xl">
            <Link href="/" onClick={() => setIsMobileMenuOpen(false)} className="text-white font-medium p-2 hover:bg-white/5 rounded focus-ring">Home</Link>
            <Link href="/#events" onClick={() => setIsMobileMenuOpen(false)} className="text-white font-medium p-2 hover:bg-white/5 rounded focus-ring">Events</Link>
            <Link href="/#team" onClick={() => setIsMobileMenuOpen(false)} className="text-white font-medium p-2 hover:bg-white/5 rounded focus-ring">Team</Link>
            <Link href="/#contact" onClick={() => setIsMobileMenuOpen(false)} className="text-white font-medium p-2 hover:bg-white/5 rounded focus-ring">Contact</Link>
            <a href="#" className="btn btn-primary py-3 w-full rounded-full text-center mt-2 focus-ring">
              Join Community
            </a>
          </div>
        )}
      </nav>
    </>
  );
}
