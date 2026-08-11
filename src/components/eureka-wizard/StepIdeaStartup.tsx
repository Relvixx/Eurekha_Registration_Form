import React from 'react';
import { useWizardState } from '../../hooks/useWizardState';
import { 
  STUDENT_STAGES, 
  STARTUP_STAGES, 
  STUDENT_CATEGORIES, 
  STARTUP_CATEGORIES 
} from '../../lib/config/eureka';

interface StepIdeaStartupProps {
  errors?: Record<string, string>;
}

export default function StepIdeaStartup({ errors = {} }: StepIdeaStartupProps) {
  const { 
    participantType, 
    studentIdeaDetails, 
    startupDetails, 
    updateStudentIdeaDetails, 
    updateStartupDetails 
  } = useWizardState();

  const isStudent = participantType === 'student';

  const renderError = (field: string) => {
    if (errors[field]) {
      return <p className="text-[#FF1744] text-xs mt-1 text-left">{errors[field]}</p>;
    }
    return null;
  };

  if (isStudent) {
    return (
      <div className="glass-panel p-6 md:p-8 rounded-2xl w-full animate-in fade-in slide-in-from-right-4 duration-500">
        <h2 className="text-2xl font-bold text-white mb-2">Idea Details</h2>
        <p className="text-gray-400 mb-8 text-sm">Tell us about your proposed idea.</p>
        
        <div className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1 text-left">
              Idea Name <span className="text-[#FF1744]">*</span>
            </label>
            <input
              type="text"
              value={studentIdeaDetails.ideaName}
              onChange={(e) => updateStudentIdeaDetails({ ideaName: e.target.value })}
              className={`glass-input w-full p-3 rounded-lg text-white ${errors.ideaName ? 'border-[#FF1744]' : ''}`}
              placeholder="e.g. Smart Waste AI"
            />
            {renderError('ideaName')}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1 text-left">
              Problem Statement <span className="text-[#FF1744]">*</span>
            </label>
            <textarea
              value={studentIdeaDetails.problemStatement}
              onChange={(e) => updateStudentIdeaDetails({ problemStatement: e.target.value })}
              className={`glass-input w-full p-3 rounded-lg text-white min-h-[100px] resize-y ${errors.problemStatement ? 'border-[#FF1744]' : ''}`}
              placeholder="What problem are you solving?"
            />
            {renderError('problemStatement')}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1 text-left">
              Proposed Solution <span className="text-[#FF1744]">*</span>
            </label>
            <textarea
              value={studentIdeaDetails.proposedSolution}
              onChange={(e) => updateStudentIdeaDetails({ proposedSolution: e.target.value })}
              className={`glass-input w-full p-3 rounded-lg text-white min-h-[100px] resize-y ${errors.proposedSolution ? 'border-[#FF1744]' : ''}`}
              placeholder="How does your idea solve this problem?"
            />
            {renderError('proposedSolution')}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1 text-left">
                Domain / Category <span className="text-[#FF1744]">*</span>
              </label>
              <select
                value={studentIdeaDetails.category}
                onChange={(e) => updateStudentIdeaDetails({ category: e.target.value })}
                className={`glass-input w-full p-3 rounded-lg text-white bg-transparent appearance-none ${errors.category ? 'border-[#FF1744]' : ''}`}
              >
                <option value="" className="bg-[#121212]">Select a category</option>
                {STUDENT_CATEGORIES.map((cat) => (
                  <option key={cat} value={cat} className="bg-[#121212]">{cat}</option>
                ))}
              </select>
              {renderError('category')}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1 text-left">
                Current Stage <span className="text-[#FF1744]">*</span>
              </label>
              <select
                value={studentIdeaDetails.currentStage}
                onChange={(e) => updateStudentIdeaDetails({ currentStage: e.target.value })}
                className={`glass-input w-full p-3 rounded-lg text-white bg-transparent appearance-none ${errors.currentStage ? 'border-[#FF1744]' : ''}`}
              >
                <option value="" className="bg-[#121212]">Select current stage</option>
                {STUDENT_STAGES.map((stage) => (
                  <option key={stage} value={stage} className="bg-[#121212]">{stage}</option>
                ))}
              </select>
              {renderError('currentStage')}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1 text-left">
              Short Description <span className="text-[#FF1744]">*</span>
            </label>
            <textarea
              value={studentIdeaDetails.shortDescription}
              onChange={(e) => updateStudentIdeaDetails({ shortDescription: e.target.value })}
              className={`glass-input w-full p-3 rounded-lg text-white min-h-[80px] resize-y ${errors.shortDescription ? 'border-[#FF1744]' : ''}`}
              placeholder="Provide a brief summary of your idea"
            />
            {renderError('shortDescription')}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1 text-left">
              Website / Demo URL <span className="text-gray-500 text-xs font-normal ml-1">(Optional)</span>
            </label>
            <input
              type="url"
              value={studentIdeaDetails.websiteUrl}
              onChange={(e) => updateStudentIdeaDetails({ websiteUrl: e.target.value })}
              className={`glass-input w-full p-3 rounded-lg text-white ${errors.websiteUrl ? 'border-[#FF1744]' : ''}`}
              placeholder="https://..."
            />
            {renderError('websiteUrl')}
          </div>
        </div>
      </div>
    );
  }

  // Startup rendering
  return (
    <div className="glass-panel p-6 md:p-8 rounded-2xl w-full animate-in fade-in slide-in-from-right-4 duration-500">
      <h2 className="text-2xl font-bold text-white mb-2">Startup Details</h2>
      <p className="text-gray-400 mb-8 text-sm">Tell us about your startup.</p>
      
      <div className="space-y-5">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1 text-left">
            Startup Name <span className="text-[#FF1744]">*</span>
          </label>
          <input
            type="text"
            value={startupDetails.startupName}
            onChange={(e) => updateStartupDetails({ startupName: e.target.value })}
            className={`glass-input w-full p-3 rounded-lg text-white ${errors.startupName ? 'border-[#FF1744]' : ''}`}
            placeholder="e.g. Acme Corp"
          />
          {renderError('startupName')}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1 text-left">
            Problem Statement <span className="text-[#FF1744]">*</span>
          </label>
          <textarea
            value={startupDetails.problemStatement}
            onChange={(e) => updateStartupDetails({ problemStatement: e.target.value })}
            className={`glass-input w-full p-3 rounded-lg text-white min-h-[100px] resize-y ${errors.problemStatement ? 'border-[#FF1744]' : ''}`}
            placeholder="What problem does your startup solve?"
          />
          {renderError('problemStatement')}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1 text-left">
            Solution <span className="text-[#FF1744]">*</span>
          </label>
          <textarea
            value={startupDetails.solution}
            onChange={(e) => updateStartupDetails({ solution: e.target.value })}
            className={`glass-input w-full p-3 rounded-lg text-white min-h-[100px] resize-y ${errors.solution ? 'border-[#FF1744]' : ''}`}
            placeholder="How does your startup solve this problem?"
          />
          {renderError('solution')}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1 text-left">
              Domain / Category <span className="text-[#FF1744]">*</span>
            </label>
            <select
              value={startupDetails.category}
              onChange={(e) => updateStartupDetails({ category: e.target.value })}
              className={`glass-input w-full p-3 rounded-lg text-white bg-transparent appearance-none ${errors.category ? 'border-[#FF1744]' : ''}`}
            >
              <option value="" className="bg-[#121212]">Select a category</option>
              {STARTUP_CATEGORIES.map((cat) => (
                <option key={cat} value={cat} className="bg-[#121212]">{cat}</option>
              ))}
            </select>
            {renderError('category')}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1 text-left">
              Current Stage <span className="text-[#FF1744]">*</span>
            </label>
            <select
              value={startupDetails.currentStage}
              onChange={(e) => updateStartupDetails({ currentStage: e.target.value })}
              className={`glass-input w-full p-3 rounded-lg text-white bg-transparent appearance-none ${errors.currentStage ? 'border-[#FF1744]' : ''}`}
            >
              <option value="" className="bg-[#121212]">Select current stage</option>
              {STARTUP_STAGES.map((stage) => (
                <option key={stage} value={stage} className="bg-[#121212]">{stage}</option>
              ))}
            </select>
            {renderError('currentStage')}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1 text-left">
            Short Description <span className="text-[#FF1744]">*</span>
          </label>
          <textarea
            value={startupDetails.shortDescription}
            onChange={(e) => updateStartupDetails({ shortDescription: e.target.value })}
            className={`glass-input w-full p-3 rounded-lg text-white min-h-[80px] resize-y ${errors.shortDescription ? 'border-[#FF1744]' : ''}`}
            placeholder="Provide a brief summary of your startup"
          />
          {renderError('shortDescription')}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1 text-left">
              Website URL <span className="text-gray-500 text-xs font-normal ml-1">(Optional)</span>
            </label>
            <input
              type="url"
              value={startupDetails.websiteUrl}
              onChange={(e) => updateStartupDetails({ websiteUrl: e.target.value })}
              className={`glass-input w-full p-3 rounded-lg text-white ${errors.websiteUrl ? 'border-[#FF1744]' : ''}`}
              placeholder="https://..."
            />
            {renderError('websiteUrl')}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1 text-left">
              LinkedIn URL <span className="text-gray-500 text-xs font-normal ml-1">(Optional)</span>
            </label>
            <input
              type="url"
              value={startupDetails.linkedinUrl}
              onChange={(e) => updateStartupDetails({ linkedinUrl: e.target.value })}
              className={`glass-input w-full p-3 rounded-lg text-white ${errors.linkedinUrl ? 'border-[#FF1744]' : ''}`}
              placeholder="https://linkedin.com/in/..."
            />
            {renderError('linkedinUrl')}
          </div>
        </div>
      </div>
    </div>
  );
}
