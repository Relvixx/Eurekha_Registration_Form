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
    <div className="relative overflow-hidden rounded-2xl bg-[#000000] border border-white/5 p-6 sm:p-8 flex flex-col items-center justify-center text-center shadow-2xl group transition-all hover:border-white/10">
      
      <div className="relative z-10 w-full max-w-sm mx-auto">
        <h3 className="text-sm font-semibold text-[#888888] uppercase tracking-wider mb-4 font-inter">
          Your NEC Referral Code
        </h3>
        
        <div className="bg-[#1A1A2E] border border-white/5 rounded-xl py-5 px-6 mb-6 flex items-center justify-center shadow-inner group-hover:border-[#1A6FF5]/30 transition-colors">
          <span className="font-mono text-3xl sm:text-4xl font-bold tracking-[0.2em] text-[#1A6FF5] select-all">
            {code}
          </span>
        </div>
        
        <button
          type="button"
          onClick={handleCopy}
          className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-3 rounded-xl border border-white/10 bg-[#000000] hover:bg-[#1A6FF5]/5 hover:border-[#1A6FF5]/30 hover:text-[#1A6FF5] transition-all duration-300 text-sm font-medium focus-ring text-white/90"
        >
          {copied ? (
            <span className="flex items-center text-[#00E5FF]">
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Copied
            </span>
          ) : (
            <span className="flex items-center">
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
