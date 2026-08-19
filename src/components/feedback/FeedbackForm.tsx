'use client';

import React, { useState } from 'react';

const EMOJIS = [
  { value: 1, emoji: '😠', label: 'Terrible' },
  { value: 2, emoji: '🙁', label: 'Bad' },
  { value: 3, emoji: '😐', label: 'Okay' },
  { value: 4, emoji: '🙂', label: 'Good' },
  { value: 5, emoji: '😍', label: 'Amazing' },
];

const BEST_PARTS = [
  '🎤 Pitching',
  '🤝 Networking',
  '👨‍⚖️ Mentors & Judges',
  '⚡ The Vibe & Energy',
  '📚 Learning Experience',
  '🍕 Food & Arrangements',
];

const PARTICIPATE_OPTIONS = [
  { value: 'definitely', label: 'Definitely! 🚀', color: 'from-green-500/20 to-green-600/10 border-green-500/30 hover:border-green-400/50' },
  { value: 'maybe', label: 'Maybe 🤔', color: 'from-yellow-500/20 to-yellow-600/10 border-yellow-500/30 hover:border-yellow-400/50' },
  { value: 'probably_not', label: 'Probably Not 😅', color: 'from-red-500/20 to-red-600/10 border-red-500/30 hover:border-red-400/50' },
];

const TOTAL_STEPS = 8;

function StarRating({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  const [hovered, setHovered] = useState(0);

  return (
    <div className="flex gap-2 justify-center">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => onChange(star)}
          onMouseEnter={() => setHovered(star)}
          onMouseLeave={() => setHovered(0)}
          className="group relative transition-all duration-200"
        >
          <svg
            className={`w-10 h-10 sm:w-12 sm:h-12 transition-all duration-200 ${
              star <= (hovered || value)
                ? 'text-yellow-400 drop-shadow-[0_0_8px_rgba(250,204,21,0.5)] scale-110'
                : 'text-white/15 hover:text-white/30'
            }`}
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
          </svg>
        </button>
      ))}
    </div>
  );
}

export default function FeedbackForm() {
  const [currentStep, setCurrentStep] = useState(1);
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');

  // Form state
  const [overallExperience, setOverallExperience] = useState(0);
  const [organizationRating, setOrganizationRating] = useState(0);
  const [bestParts, setBestParts] = useState<string[]>([]);
  const [wouldParticipateAgain, setWouldParticipateAgain] = useState('');
  const [communicationRating, setCommunicationRating] = useState(0);
  const [venueRating, setVenueRating] = useState(0);
  const [improvementSuggestion, setImprovementSuggestion] = useState('');
  const [participantName, setParticipantName] = useState('');

  const [stepError, setStepError] = useState('');

  const progress = ((currentStep - 1) / TOTAL_STEPS) * 100;

  const toggleBestPart = (part: string) => {
    setBestParts((prev) =>
      prev.includes(part) ? prev.filter((p) => p !== part) : [...prev, part]
    );
  };

  const canGoNext = (): boolean => {
    switch (currentStep) {
      case 1: return overallExperience > 0;
      case 2: return organizationRating > 0;
      case 3: return bestParts.length > 0;
      case 4: return wouldParticipateAgain !== '';
      case 5: return true; // optional
      case 6: return true; // optional
      case 7: return true; // optional
      case 8: return true; // optional
      default: return false;
    }
  };

  const handleNext = () => {
    if (currentStep <= 4 && !canGoNext()) {
      setStepError('Please select an option to continue.');
      return;
    }
    setStepError('');
    if (currentStep < TOTAL_STEPS) {
      setCurrentStep((s) => s + 1);
    }
  };

  const handleBack = () => {
    setStepError('');
    if (currentStep > 1) {
      setCurrentStep((s) => s - 1);
    }
  };

  const handleSubmit = async () => {
    setSubmitError('');
    setIsSubmitting(true);

    try {
      const res = await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          overall_experience: overallExperience,
          organization_rating: organizationRating,
          best_parts: bestParts,
          would_participate_again: wouldParticipateAgain,
          communication_rating: communicationRating || null,
          venue_rating: venueRating || null,
          improvement_suggestion: improvementSuggestion || null,
          participant_name: participantName || null,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Submission failed');

      setSubmitted(true);
    } catch (err: any) {
      setSubmitError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // --- Confetti / Thank You Screen ---
  if (submitted) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] px-4 text-center animate-in fade-in zoom-in-95 duration-500">
        <div className="text-7xl sm:text-8xl mb-6 animate-bounce">🎉</div>
        <h2 className="text-3xl sm:text-4xl font-black text-white font-poppins mb-3">
          Thank You!
        </h2>
        <p className="text-gray-400 text-lg max-w-md font-inter">
          Your feedback means the world to us. We&apos;ll use it to make our next event even better!
        </p>
        <div className="mt-8 flex gap-3 text-4xl">
          {['🚀', '💡', '🔥', '⭐', '🎯'].map((e, i) => (
            <span
              key={i}
              className="animate-in fade-in slide-in-from-bottom-4 duration-500"
              style={{ animationDelay: `${i * 150}ms`, animationFillMode: 'both' }}
            >
              {e}
            </span>
          ))}
        </div>
      </div>
    );
  }

  // --- Form Steps ---
  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6 text-center">
            <h3 className="text-2xl font-bold text-white font-poppins">How was your overall experience?</h3>
            <p className="text-gray-400 text-sm">Tap the emoji that best describes your experience</p>
            <div className="flex gap-3 sm:gap-5 justify-center flex-wrap">
              {EMOJIS.map((e) => (
                <button
                  key={e.value}
                  type="button"
                  onClick={() => { setOverallExperience(e.value); setStepError(''); }}
                  className={`flex flex-col items-center gap-2 p-3 sm:p-4 rounded-2xl border transition-all duration-300 ${
                    overallExperience === e.value
                      ? 'bg-white/10 border-white/30 scale-110 shadow-[0_0_20px_rgba(255,255,255,0.1)]'
                      : 'bg-white/5 border-white/5 hover:bg-white/10 hover:scale-105'
                  }`}
                >
                  <span className={`text-4xl sm:text-5xl transition-transform duration-300 ${
                    overallExperience === e.value ? 'scale-110' : ''
                  }`}>{e.emoji}</span>
                  <span className={`text-xs font-medium ${
                    overallExperience === e.value ? 'text-white' : 'text-gray-500'
                  }`}>{e.label}</span>
                </button>
              ))}
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6 text-center">
            <h3 className="text-2xl font-bold text-white font-poppins">How would you rate the event organization?</h3>
            <p className="text-gray-400 text-sm">From venue setup to time management</p>
            <StarRating value={organizationRating} onChange={(v) => { setOrganizationRating(v); setStepError(''); }} />
          </div>
        );

      case 3:
        return (
          <div className="space-y-6 text-center">
            <h3 className="text-2xl font-bold text-white font-poppins">What did you enjoy the most?</h3>
            <p className="text-gray-400 text-sm">Select all that apply</p>
            <div className="grid grid-cols-2 gap-3">
              {BEST_PARTS.map((part) => (
                <button
                  key={part}
                  type="button"
                  onClick={() => { toggleBestPart(part); setStepError(''); }}
                  className={`p-3 sm:p-4 rounded-xl border text-sm font-medium transition-all duration-200 ${
                    bestParts.includes(part)
                      ? 'bg-[#1A6FF5]/15 border-[#1A6FF5]/40 text-white shadow-[0_0_12px_rgba(26,111,245,0.15)]'
                      : 'bg-white/5 border-white/10 text-gray-400 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  {part}
                </button>
              ))}
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6 text-center">
            <h3 className="text-2xl font-bold text-white font-poppins">Would you participate again next year?</h3>
            <div className="space-y-3">
              {PARTICIPATE_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => { setWouldParticipateAgain(opt.value); setStepError(''); }}
                  className={`w-full p-4 rounded-xl border text-lg font-semibold transition-all duration-300 bg-gradient-to-r ${opt.color} ${
                    wouldParticipateAgain === opt.value
                      ? 'scale-[1.02] shadow-lg ring-1 ring-white/20 text-white'
                      : 'text-gray-300 hover:text-white'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
        );

      case 5:
        return (
          <div className="space-y-6 text-center">
            <h3 className="text-2xl font-bold text-white font-poppins">How well was the event communicated?</h3>
            <p className="text-gray-400 text-sm">Pre-event information, updates, and instructions</p>
            <StarRating value={communicationRating} onChange={setCommunicationRating} />
            <p className="text-xs text-gray-500">Optional — skip if you prefer</p>
          </div>
        );

      case 6:
        return (
          <div className="space-y-6 text-center">
            <h3 className="text-2xl font-bold text-white font-poppins">Rate the venue & arrangements</h3>
            <p className="text-gray-400 text-sm">Seating, projector, overall comfort</p>
            <StarRating value={venueRating} onChange={setVenueRating} />
            <p className="text-xs text-gray-500">Optional — skip if you prefer</p>
          </div>
        );

      case 7:
        return (
          <div className="space-y-6 text-center">
            <h3 className="text-2xl font-bold text-white font-poppins">One thing we should improve?</h3>
            <p className="text-gray-400 text-sm">Your honest feedback helps us grow</p>
            <div className="relative">
              <textarea
                value={improvementSuggestion}
                onChange={(e) => {
                  if (e.target.value.length <= 200) setImprovementSuggestion(e.target.value);
                }}
                placeholder="e.g. More time for Q&A, better food..."
                className="w-full p-4 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 resize-none h-28 focus:outline-none focus:border-[#1A6FF5]/50 focus:shadow-[0_0_10px_rgba(26,111,245,0.1)] transition-all"
              />
              <div className="absolute bottom-3 right-3 text-xs text-gray-500">
                {improvementSuggestion.length}/200
              </div>
            </div>
            <p className="text-xs text-gray-500">Optional — skip if you prefer</p>
          </div>
        );

      case 8:
        return (
          <div className="space-y-6 text-center">
            <h3 className="text-2xl font-bold text-white font-poppins">Your Name / Team Name</h3>
            <p className="text-gray-400 text-sm">So we know who this awesome feedback is from</p>
            <input
              type="text"
              value={participantName}
              onChange={(e) => setParticipantName(e.target.value)}
              placeholder="e.g. Team Innovators"
              className="w-full p-4 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-[#1A6FF5]/50 focus:shadow-[0_0_10px_rgba(26,111,245,0.1)] transition-all text-center text-lg"
            />
            <p className="text-xs text-gray-500">Optional — skip if you prefer</p>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="w-full max-w-lg mx-auto px-4">
      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-2">
          <span className="text-xs text-gray-500 font-medium">Question {currentStep} of {TOTAL_STEPS}</span>
          <span className="text-xs text-gray-500 font-medium">{Math.round(progress)}%</span>
        </div>
        <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-[#1A6FF5] to-[#00E5FF] rounded-full transition-all duration-500 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Step Content */}
      <div
        key={currentStep}
        className="animate-in fade-in slide-in-from-right-4 duration-400 min-h-[280px] flex items-center"
      >
        <div className="w-full">{renderStep()}</div>
      </div>

      {/* Error */}
      {stepError && (
        <p className="text-center text-sm text-[#FF1744] mt-4 font-medium animate-in fade-in duration-200">
          {stepError}
        </p>
      )}
      {submitError && (
        <p className="text-center text-sm text-[#FF1744] mt-4 font-medium animate-in fade-in duration-200">
          {submitError}
        </p>
      )}

      {/* Navigation */}
      <div className="flex items-center justify-between mt-8 gap-4">
        {currentStep > 1 ? (
          <button
            type="button"
            onClick={handleBack}
            className="px-6 py-3 rounded-xl border border-white/10 text-gray-400 hover:text-white hover:border-white/20 transition-all font-medium text-sm"
          >
            Back
          </button>
        ) : (
          <div />
        )}

        {currentStep < TOTAL_STEPS ? (
          <button
            type="button"
            onClick={handleNext}
            className={`px-8 py-3 rounded-xl font-semibold text-sm transition-all duration-300 ${
              canGoNext()
                ? 'bg-[#1A6FF5] text-white hover:bg-[#1A6FF5]/90 shadow-[0_0_20px_rgba(26,111,245,0.3)]'
                : currentStep <= 4
                  ? 'bg-white/5 text-gray-500 cursor-not-allowed'
                  : 'bg-white/10 text-gray-300 hover:bg-white/15'
            }`}
          >
            {currentStep > 4 && !canGoNext() ? 'Skip' : 'Next'}
          </button>
        ) : (
          <button
            type="button"
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="px-8 py-3 rounded-xl font-semibold text-sm bg-gradient-to-r from-[#1A6FF5] to-[#00E5FF] text-white hover:opacity-90 transition-all shadow-[0_0_25px_rgba(26,111,245,0.4)] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <span className="flex items-center gap-2">
                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Submitting...
              </span>
            ) : (
              'Submit Feedback ✨'
            )}
          </button>
        )}
      </div>
    </div>
  );
}
