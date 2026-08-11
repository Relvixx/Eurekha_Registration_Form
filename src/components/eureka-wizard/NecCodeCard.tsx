'use client';

import { useState } from 'react';
import { EUREKA_CONFIG } from '../../lib/config/eureka';

export default function NecCodeCard() {
  const [copied, setCopied] = useState(false);
  const code = EUREKA_CONFIG.necReferralCode;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      // Graceful fallback if clipboard access fails
      console.warn('Clipboard access denied or unavailable', err);
    }
  };

  return (
    <div className="relative overflow-hidden rounded-xl bg-white/5 border border-white/10 p-6 sm:p-8 flex flex-col items-center justify-center text-center backdrop-blur-sm">
      <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent opacity-50" />
      
      <div className="relative z-10 w-full max-w-sm mx-auto">
        <h3 className="text-sm font-semibold text-white/70 uppercase tracking-wider mb-3">
          Your NEC Referral Code
        </h3>
        
        <div className="bg-black/40 border border-white/10 rounded-lg py-4 px-6 mb-5 flex items-center justify-center shadow-inner">
          <span className="font-mono text-2xl sm:text-3xl font-bold tracking-[0.2em] text-[#FF1744] select-all">
            {code}
          </span>
        </div>
        
        <button
          type="button"
          onClick={handleCopy}
          className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-2.5 rounded-full bg-black/40 hover:bg-white/10 transition-colors duration-200 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#FF1744]/50 focus:ring-offset-2 focus:ring-offset-black"
        >
          {copied ? (
            <span className="flex items-center text-emerald-400">
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Copied
            </span>
          ) : (
            <span className="flex items-center text-white/90">
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
              </svg>
              Copy Code
            </span>
          )}
        </button>
      </div>
    </div>
  );
}
