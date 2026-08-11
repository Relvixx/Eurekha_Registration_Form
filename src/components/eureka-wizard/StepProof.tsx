import React from 'react';
import { Upload } from 'lucide-react';

export default function StepProof() {
  return (
    <div className="glass-panel p-6 md:p-8 rounded-2xl w-full animate-in fade-in slide-in-from-right-4 duration-500">
      <h2 className="text-2xl font-bold text-white mb-2">Registration Proof</h2>
      <p className="text-gray-400 mb-8">Upload proof of your Eureka registration.</p>
      
      <div className="space-y-6">
        <div className="glass-input p-3 text-center border border-white/10">
          <span className="text-gray-500">Eureka Registration ID (Placeholder)</span>
        </div>
        
        <div className="border-2 border-dashed border-white/20 rounded-2xl p-12 text-center bg-white/5 hover:bg-white/10 transition-colors cursor-pointer flex flex-col items-center justify-center">
          <Upload size={48} className="text-gray-400 mb-4" />
          <p className="text-white font-medium mb-1">Click to upload screenshot</p>
          <p className="text-sm text-gray-500">JPG or PNG, max 5MB</p>
        </div>
        
        <div className="flex items-start gap-3 mt-8">
          <input type="checkbox" id="confirm-proof" className="mt-1 w-5 h-5 rounded border-gray-600 text-[#FF1744] focus:ring-[#00E5FF] bg-white/5" />
          <label htmlFor="confirm-proof" className="text-sm text-gray-300">
            I confirm that the provided information is correct and the screenshot is authentic.
          </label>
        </div>
      </div>
    </div>
  );
}
