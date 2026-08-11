import React, { useRef, useState } from 'react';
import { Upload, X, CheckCircle2, Loader2, FileText, AlertCircle } from 'lucide-react';
import { useWizardState } from '../../hooks/useWizardState';
import { 
  STUDENT_STAGES, 
  STARTUP_STAGES, 
  STUDENT_CATEGORIES, 
  STARTUP_CATEGORIES 
} from '../../lib/config/eureka';
import { uploadPitchDeck, createRegistrationDraft } from '../../lib/api';

interface StepIdeaStartupProps {
  errors?: Record<string, string>;
}

export default function StepIdeaStartup({ errors = {} }: StepIdeaStartupProps) {
  const { 
    participantType, 
    studentIdeaDetails, 
    startupDetails, 
    updateStudentIdeaDetails, 
    updateStartupDetails,
    registrationId,
    draftToken,
    setRegistrationId,
    setDraftToken,
  } = useWizardState();

  const wizardState = useWizardState();

  const [isUploadingDeck, setIsUploadingDeck] = useState(false);
  const [deckUploadError, setDeckUploadError] = useState<string | null>(null);
  const [isDraggingDeck, setIsDraggingDeck] = useState(false);
  const deckInputRef = useRef<HTMLInputElement>(null);

  const isStudent = participantType === 'student';

  const validateDeckFile = (file: File): string | null => {
    if (file.size > 10 * 1024 * 1024) {
      return 'File size exceeds 10MB limit.';
    }
    const allowedTypes = [
      'application/pdf',
      'application/vnd.ms-powerpoint',
      'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    ];
    if (!allowedTypes.includes(file.type)) {
      return 'Invalid file type. Only PDF, PPT, and PPTX are allowed.';
    }
    return null;
  };

  const handleDeckFileUpload = async (file: File) => {
    setDeckUploadError(null);
    const errorMsg = validateDeckFile(file);
    if (errorMsg) {
      setDeckUploadError(errorMsg);
      return;
    }

    // If no draft exists yet, create one on-the-fly
    let currentRegId = registrationId;
    let currentDraftToken = draftToken;

    if (!currentRegId || !currentDraftToken) {
      try {
        const result = await createRegistrationDraft(wizardState);
        if (result) {
          currentRegId = result.registrationId;
          currentDraftToken = result.draftToken;
          setDraftToken(currentDraftToken!);
          setRegistrationId(currentRegId!);
        } else {
          setDeckUploadError('Could not initialize registration. Please try again.');
          return;
        }
      } catch (err: any) {
        setDeckUploadError(err.message || 'Could not initialize registration. Please try again.');
        return;
      }
    }

    setIsUploadingDeck(true);
    try {
      const response = await uploadPitchDeck(
        currentRegId!,
        currentDraftToken!,
        file
      );
      
      if (response && response.success) {
        if (isStudent) {
          updateStudentIdeaDetails({ pitchDeckUploaded: true, pitchDeckPath: response.path, pitchDeckFileName: file.name });
        } else {
          updateStartupDetails({ pitchDeckUploaded: true, pitchDeckPath: response.path, pitchDeckFileName: file.name });
        }
      } else {
        setDeckUploadError('Failed to upload pitch deck. Please try again.');
      }
    } catch (error: any) {
      setDeckUploadError(error.message || 'An error occurred during upload.');
    } finally {
      setIsUploadingDeck(false);
    }
  };

  const onDragOverDeck = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDraggingDeck(true);
  };

  const onDragLeaveDeck = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDraggingDeck(false);
  };

  const onDropDeck = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDraggingDeck(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleDeckFileUpload(e.dataTransfer.files[0]);
    }
  };

  const onFileInputChangeDeck = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleDeckFileUpload(e.target.files[0]);
    }
  };

  const handleRemoveDeck = () => {
    if (isStudent) {
      updateStudentIdeaDetails({ pitchDeckUploaded: false, pitchDeckPath: '', pitchDeckFileName: '' });
    } else {
      updateStartupDetails({ pitchDeckUploaded: false, pitchDeckPath: '', pitchDeckFileName: '' });
    }
  };

  const renderDeckUpload = () => {
    const isUploaded = isStudent ? studentIdeaDetails.pitchDeckUploaded : startupDetails.pitchDeckUploaded;
    const fileName = isStudent ? studentIdeaDetails.pitchDeckFileName : startupDetails.pitchDeckFileName;

    if (isUploaded) {
      return (
        <div className="bg-[#1a1a1a] border border-white/10 p-4 rounded-xl flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#1A6FF5]/10 rounded-full flex items-center justify-center">
              <CheckCircle2 size={20} className="text-[#1A6FF5]" />
            </div>
            <div>
              <p className="text-white font-medium text-sm">{fileName || 'Pitch Deck Uploaded'}</p>
              <p className="text-emerald-400 text-xs">Upload Successful</p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleRemoveDeck}
            className="text-gray-400 hover:text-white transition-colors p-2"
            title="Remove pitch deck"
          >
            <X size={20} />
          </button>
        </div>
      );
    }

    return (
      <div 
        className={`border-2 border-dashed rounded-xl p-6 text-center transition-all ${
          isDraggingDeck 
            ? 'border-[#1A6FF5] bg-[#1A6FF5]/5 scale-[1.02]' 
            : deckUploadError ? 'border-[#FF253A]/50 bg-[#FF253A]/5' : 'border-white/10 hover:border-white/30 hover:bg-white/5'
        }`}
        onDragOver={onDragOverDeck}
        onDragLeave={onDragLeaveDeck}
        onDrop={onDropDeck}
        onClick={() => !isUploadingDeck && deckInputRef.current?.click()}
      >
        <input 
          type="file" 
          className="hidden" 
          ref={deckInputRef}
          accept=".pdf,.ppt,.pptx"
          onChange={onFileInputChangeDeck}
          disabled={isUploadingDeck}
        />
        
        {isUploadingDeck ? (
          <div className="flex flex-col items-center gap-3">
            <Loader2 className="w-8 h-8 text-[#1A6FF5] animate-spin" />
            <div className="text-sm text-gray-300 font-medium">Uploading...</div>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-3 cursor-pointer">
            <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
              isDraggingDeck ? 'bg-[#1A6FF5] text-white' : 'bg-[#1E1E1E] text-gray-400'
            }`}>
              <Upload size={24} />
            </div>
            <div>
              <p className="text-gray-300 text-sm font-medium">
                Click or drag file here
              </p>
              <p className="text-gray-500 text-xs mt-1">
                PDF, PPT, PPTX up to 10MB
              </p>
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderError = (field: string) => {
    if (errors[field]) {
      return <p className="text-[#FF253A] text-xs mt-1.5 font-inter font-medium text-left">{errors[field]}</p>;
    }
    return null;
  };

  if (isStudent) {
    return (
      <div className="glass-panel p-8 md:p-10 rounded-2xl w-full animate-in fade-in slide-in-from-right-4 duration-500">
        <h2 className="text-3xl font-black text-white mb-3 font-poppins tracking-tight">Idea Details</h2>
        <p className="text-[#888888] mb-10 font-inter text-lg">Tell us about your proposed idea.</p>
        
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-white mb-3 font-inter text-left">
              Idea Name <span className="text-[#1A6FF5]">*</span>
            </label>
            <input
              type="text"
              value={studentIdeaDetails.ideaName}
              onChange={(e) => updateStudentIdeaDetails({ ideaName: e.target.value })}
              className={`glass-input w-full p-4 rounded-xl text-white ${errors.ideaName ? 'border-[#FF253A] shadow-[0_0_10px_rgba(255,37,58,0.1)]' : 'border-white/10'}`}
              placeholder="e.g. Smart Waste AI"
            />
            {renderError('ideaName')}
          </div>

          <div>
            <label className="block text-sm font-semibold text-white mb-3 font-inter text-left">
              Problem Statement <span className="text-[#1A6FF5]">*</span>
            </label>
            <textarea
              value={studentIdeaDetails.problemStatement}
              onChange={(e) => updateStudentIdeaDetails({ problemStatement: e.target.value })}
              className={`glass-input w-full p-4 rounded-xl text-white min-h-[120px] resize-y ${errors.problemStatement ? 'border-[#FF253A] shadow-[0_0_10px_rgba(255,37,58,0.1)]' : 'border-white/10'}`}
              placeholder="What problem are you solving?"
            />
            {renderError('problemStatement')}
          </div>

          <div>
            <label className="block text-sm font-semibold text-white mb-3 font-inter text-left">
              Proposed Solution <span className="text-[#1A6FF5]">*</span>
            </label>
            <textarea
              value={studentIdeaDetails.proposedSolution}
              onChange={(e) => updateStudentIdeaDetails({ proposedSolution: e.target.value })}
              className={`glass-input w-full p-4 rounded-xl text-white min-h-[120px] resize-y ${errors.proposedSolution ? 'border-[#FF253A] shadow-[0_0_10px_rgba(255,37,58,0.1)]' : 'border-white/10'}`}
              placeholder="How does your idea solve this problem?"
            />
            {renderError('proposedSolution')}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-white mb-3 font-inter text-left">
                Domain / Category <span className="text-[#1A6FF5]">*</span>
              </label>
              <select
                value={studentIdeaDetails.category}
                onChange={(e) => updateStudentIdeaDetails({ category: e.target.value })}
                className={`glass-input w-full p-4 rounded-xl text-white appearance-none bg-no-repeat ${errors.category ? 'border-[#FF253A] shadow-[0_0_10px_rgba(255,37,58,0.1)]' : 'border-white/10'}`}
                style={{
                  backgroundImage: 'url("data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2224%22%20height%3D%2224%22%20viewBox%3D%220%200%24%2024%22%20fill%3D%22none%22%20stroke%3D%22%23888888%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpolyline%20points%3D%226%209%2012%2015%2018%209%22%3E%3C%2Fpolyline%3E%3C%2Fsvg%3E")',
                  backgroundPosition: 'right 16px center',
                  backgroundSize: '16px 16px'
                }}
              >
                <option value="">Select a category</option>
                {STUDENT_CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
              {renderError('category')}
            </div>

            <div>
              <label className="block text-sm font-semibold text-white mb-3 font-inter text-left">
                Current Stage <span className="text-[#1A6FF5]">*</span>
              </label>
              <select
                value={studentIdeaDetails.currentStage}
                onChange={(e) => updateStudentIdeaDetails({ currentStage: e.target.value })}
                className={`glass-input w-full p-4 rounded-xl text-white appearance-none bg-no-repeat ${errors.currentStage ? 'border-[#FF253A] shadow-[0_0_10px_rgba(255,37,58,0.1)]' : 'border-white/10'}`}
                style={{
                  backgroundImage: 'url("data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2224%22%20height%3D%2224%22%20viewBox%3D%220%200%24%2024%22%20fill%3D%22none%22%20stroke%3D%22%23888888%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpolyline%20points%3D%226%209%2012%2015%2018%209%22%3E%3C%2Fpolyline%3E%3C%2Fsvg%3E")',
                  backgroundPosition: 'right 16px center',
                  backgroundSize: '16px 16px'
                }}
              >
                <option value="">Select current stage</option>
                {STUDENT_STAGES.map((stage) => (
                  <option key={stage} value={stage}>{stage}</option>
                ))}
              </select>
              {renderError('currentStage')}
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-white mb-3 font-inter text-left">
              Short Description <span className="text-[#1A6FF5]">*</span>
            </label>
            <textarea
              value={studentIdeaDetails.shortDescription}
              onChange={(e) => updateStudentIdeaDetails({ shortDescription: e.target.value })}
              className={`glass-input w-full p-4 rounded-xl text-white min-h-[100px] resize-y ${errors.shortDescription ? 'border-[#FF253A] shadow-[0_0_10px_rgba(255,37,58,0.1)]' : 'border-white/10'}`}
              placeholder="Provide a brief summary of your idea"
            />
            {renderError('shortDescription')}
          </div>

          <div>
            <label className="block text-sm font-semibold text-white mb-3 font-inter text-left">
              Website / Demo URL <span className="text-[#888888] text-xs font-normal ml-2 font-inter">(Optional)</span>
            </label>
            <input
              type="url"
              value={studentIdeaDetails.websiteUrl}
              onChange={(e) => updateStudentIdeaDetails({ websiteUrl: e.target.value })}
              className={`glass-input w-full p-4 rounded-xl text-white ${errors.websiteUrl ? 'border-[#FF253A] shadow-[0_0_10px_rgba(255,37,58,0.1)]' : 'border-white/10'}`}
              placeholder="https://..."
            />
            {renderError('websiteUrl')}
          </div>

          <div>
            <label className="block text-sm font-semibold text-white mb-1 font-inter text-left">
              Pitch Deck / PPT <span className="text-[#888888] text-xs font-normal ml-2 font-inter">(Optional)</span>
            </label>
            <div className="mb-4 text-xs text-[#888888] text-left space-y-1.5 p-3 bg-white/5 rounded-lg border border-white/10">
              <p className="flex items-start gap-2">
                <span className="text-[#1A6FF5] font-bold">•</span> 
                <span>The presentation time will be <strong className="text-white font-medium">5 mins</strong> (2 min pitching, 3 min Q&A).</span>
              </p>
              <p className="flex items-start gap-2">
                <span className="text-[#1A6FF5] font-bold">•</span> 
                <span>Your pitch deck must contain <strong className="text-white font-medium">at least 7 slides</strong>.</span>
              </p>
            </div>
            {renderDeckUpload()}
            {deckUploadError && (
              <p className="text-[#FF253A] text-xs mt-2 font-inter font-medium text-left flex items-center gap-1">
                <AlertCircle size={14} /> {deckUploadError}
              </p>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Startup rendering
  return (
    <div className="glass-panel p-8 md:p-10 rounded-2xl w-full animate-in fade-in slide-in-from-right-4 duration-500">
      <h2 className="text-3xl font-black text-white mb-3 font-poppins tracking-tight">Startup Details</h2>
      <p className="text-[#888888] mb-10 font-inter text-lg">Tell us about your startup.</p>
      
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-semibold text-white mb-3 font-inter text-left">
            Startup Name <span className="text-[#1A6FF5]">*</span>
          </label>
          <input
            type="text"
            value={startupDetails.startupName}
            onChange={(e) => updateStartupDetails({ startupName: e.target.value })}
            className={`glass-input w-full p-4 rounded-xl text-white ${errors.startupName ? 'border-[#FF253A] shadow-[0_0_10px_rgba(255,37,58,0.1)]' : 'border-white/10'}`}
            placeholder="e.g. Acme Corp"
          />
          {renderError('startupName')}
        </div>

        <div>
          <label className="block text-sm font-semibold text-white mb-3 font-inter text-left">
            Problem Statement <span className="text-[#1A6FF5]">*</span>
          </label>
          <textarea
            value={startupDetails.problemStatement}
            onChange={(e) => updateStartupDetails({ problemStatement: e.target.value })}
            className={`glass-input w-full p-4 rounded-xl text-white min-h-[120px] resize-y ${errors.problemStatement ? 'border-[#FF253A] shadow-[0_0_10px_rgba(255,37,58,0.1)]' : 'border-white/10'}`}
            placeholder="What problem does your startup solve?"
          />
          {renderError('problemStatement')}
        </div>

        <div>
          <label className="block text-sm font-semibold text-white mb-3 font-inter text-left">
            Solution <span className="text-[#1A6FF5]">*</span>
          </label>
          <textarea
            value={startupDetails.solution}
            onChange={(e) => updateStartupDetails({ solution: e.target.value })}
            className={`glass-input w-full p-4 rounded-xl text-white min-h-[120px] resize-y ${errors.solution ? 'border-[#FF253A] shadow-[0_0_10px_rgba(255,37,58,0.1)]' : 'border-white/10'}`}
            placeholder="How does your startup solve this problem?"
          />
          {renderError('solution')}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-semibold text-white mb-3 font-inter text-left">
              Domain / Category <span className="text-[#1A6FF5]">*</span>
            </label>
            <select
              value={startupDetails.category}
              onChange={(e) => updateStartupDetails({ category: e.target.value })}
              className={`glass-input w-full p-4 rounded-xl text-white appearance-none bg-no-repeat ${errors.category ? 'border-[#FF253A] shadow-[0_0_10px_rgba(255,37,58,0.1)]' : 'border-white/10'}`}
              style={{
                backgroundImage: 'url("data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2224%22%20height%3D%2224%22%20viewBox%3D%220%200%24%2024%22%20fill%3D%22none%22%20stroke%3D%22%23888888%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpolyline%20points%3D%226%209%2012%2015%2018%209%22%3E%3C%2Fpolyline%3E%3C%2Fsvg%3E")',
                backgroundPosition: 'right 16px center',
                backgroundSize: '16px 16px'
              }}
            >
              <option value="">Select a category</option>
              {STARTUP_CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
            {renderError('category')}
          </div>

          <div>
            <label className="block text-sm font-semibold text-white mb-3 font-inter text-left">
              Current Stage <span className="text-[#1A6FF5]">*</span>
            </label>
            <select
              value={startupDetails.currentStage}
              onChange={(e) => updateStartupDetails({ currentStage: e.target.value })}
              className={`glass-input w-full p-4 rounded-xl text-white appearance-none bg-no-repeat ${errors.currentStage ? 'border-[#FF253A] shadow-[0_0_10px_rgba(255,37,58,0.1)]' : 'border-white/10'}`}
              style={{
                backgroundImage: 'url("data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2224%22%20height%3D%2224%22%20viewBox%3D%220%200%24%2024%22%20fill%3D%22none%22%20stroke%3D%22%23888888%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpolyline%20points%3D%226%209%2012%2015%2018%209%22%3E%3C%2Fpolyline%3E%3C%2Fsvg%3E")',
                backgroundPosition: 'right 16px center',
                backgroundSize: '16px 16px'
              }}
            >
              <option value="">Select current stage</option>
              {STARTUP_STAGES.map((stage) => (
                <option key={stage} value={stage}>{stage}</option>
              ))}
            </select>
            {renderError('currentStage')}
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-white mb-3 font-inter text-left">
            Short Description <span className="text-[#1A6FF5]">*</span>
          </label>
          <textarea
            value={startupDetails.shortDescription}
            onChange={(e) => updateStartupDetails({ shortDescription: e.target.value })}
            className={`glass-input w-full p-4 rounded-xl text-white min-h-[100px] resize-y ${errors.shortDescription ? 'border-[#FF253A] shadow-[0_0_10px_rgba(255,37,58,0.1)]' : 'border-white/10'}`}
            placeholder="Provide a brief summary of your startup"
          />
          {renderError('shortDescription')}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-semibold text-white mb-3 font-inter text-left">
              Website URL <span className="text-[#888888] text-xs font-normal ml-2 font-inter">(Optional)</span>
            </label>
            <input
              type="url"
              value={startupDetails.websiteUrl}
              onChange={(e) => updateStartupDetails({ websiteUrl: e.target.value })}
              className={`glass-input w-full p-4 rounded-xl text-white ${errors.websiteUrl ? 'border-[#FF253A] shadow-[0_0_10px_rgba(255,37,58,0.1)]' : 'border-white/10'}`}
              placeholder="https://..."
            />
            {renderError('websiteUrl')}
          </div>

          <div>
            <label className="block text-sm font-semibold text-white mb-1 font-inter text-left">
              Pitch Deck / PPT <span className="text-[#888888] text-xs font-normal ml-2 font-inter">(Optional)</span>
            </label>
            <div className="mb-4 text-xs text-[#888888] text-left space-y-1.5 p-3 bg-white/5 rounded-lg border border-white/10">
              <p className="flex items-start gap-2">
                <span className="text-[#1A6FF5] font-bold">•</span> 
                <span>The presentation time will be <strong className="text-white font-medium">5 mins</strong> (2 min pitching, 3 min Q&A).</span>
              </p>
              <p className="flex items-start gap-2">
                <span className="text-[#1A6FF5] font-bold">•</span> 
                <span>Your pitch deck must contain <strong className="text-white font-medium">at least 7 slides</strong>.</span>
              </p>
            </div>
            {renderDeckUpload()}
            {deckUploadError && (
              <p className="text-[#FF253A] text-xs mt-2 font-inter font-medium text-left flex items-center gap-1">
                <AlertCircle size={14} /> {deckUploadError}
              </p>
            )}
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-semibold text-white mb-3 font-inter text-left">
            LinkedIn Profile URL <span className="text-[#888888] text-xs font-normal ml-2 font-inter">(Optional)</span>
          </label>
          <input
            type="url"
            value={startupDetails.linkedinUrl}
            onChange={(e) => updateStartupDetails({ linkedinUrl: e.target.value })}
            className={`glass-input w-full p-4 rounded-xl text-white ${errors.linkedinUrl ? 'border-[#FF253A] shadow-[0_0_10px_rgba(255,37,58,0.1)]' : 'border-white/10'}`}
            placeholder="https://linkedin.com/company/..."
          />
          {renderError('linkedinUrl')}
        </div>
      </div>
    </div>
  );
}
