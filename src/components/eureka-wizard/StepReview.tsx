import React from 'react';

export default function StepReview() {
  return (
    <div className="glass-panel p-6 md:p-8 rounded-2xl w-full animate-in fade-in slide-in-from-right-4 duration-500">
      <h2 className="text-2xl font-bold text-white mb-2">Review & Submit</h2>
      <p className="text-gray-400 mb-8">Please review all information before final submission.</p>
      
      <div className="space-y-6">
        {/* Placeholder review sections */}
        <div className="bg-[#1a1a1a] rounded-xl p-6 border border-white/5 relative">
          <button className="absolute top-4 right-4 text-sm text-[#00E5FF] hover:underline focus-ring rounded">Edit</button>
          <h3 className="text-white font-bold mb-4">Participant Type</h3>
          <p className="text-gray-400 text-sm">Student</p>
        </div>
        
        <div className="bg-[#1a1a1a] rounded-xl p-6 border border-white/5 relative">
          <button className="absolute top-4 right-4 text-sm text-[#00E5FF] hover:underline focus-ring rounded">Edit</button>
          <h3 className="text-white font-bold mb-4">Team Details</h3>
          <p className="text-gray-400 text-sm">Team Alpha (3 Members)</p>
        </div>
        
        <div className="bg-[#1a1a1a] rounded-xl p-6 border border-white/5 relative">
          <button className="absolute top-4 right-4 text-sm text-[#00E5FF] hover:underline focus-ring rounded">Edit</button>
          <h3 className="text-white font-bold mb-4">Registration Proof</h3>
          <p className="text-gray-400 text-sm">Screenshot uploaded</p>
        </div>
        
        <div className="flex items-start gap-3 mt-8 p-4 bg-[#FF1744]/10 border border-[#FF1744]/20 rounded-xl">
          <input type="checkbox" id="final-declaration" className="mt-1 w-5 h-5 rounded border-gray-600 text-[#FF1744] focus:ring-[#00E5FF] bg-white/5" />
          <label htmlFor="final-declaration" className="text-sm text-gray-300">
            I hereby declare that all the information provided is true to the best of my knowledge. I understand that any false information may lead to disqualification.
          </label>
        </div>
      </div>
    </div>
  );
}
