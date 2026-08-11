'use client';

import React, { useState } from 'react';
import { useForm, Controller, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2, ArrowRight, User, Users, GraduationCap, Lightbulb, Phone, Mail } from 'lucide-react';
import { immediateRegistrationSchema, ImmediateRegistrationFormValues } from '@/lib/short-schema';
import { STUDENT_STAGES, STARTUP_STAGES, STUDENT_CATEGORIES, STARTUP_CATEGORIES } from '@/lib/config/eureka';

export default function ImmediateRegistrationForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  const { control, handleSubmit, watch, formState: { errors } } = useForm<ImmediateRegistrationFormValues>({
    resolver: zodResolver(immediateRegistrationSchema),
    defaultValues: {
      participantType: 'student',
      teamName: '',
      leadName: '',
      leadEmail: '',
      leadPhone: '',
      leadAltPhone: '',
      leadCollege: '',
      leadBranch: '',
      leadYear: '',
      membersNames: '',
      ideaCategory: '',
      ideaStage: '',
    }
  });

  const participantType = useWatch({
    control,
    name: 'participantType',
    defaultValue: 'student'
  });
  const stages = participantType === 'student' ? STUDENT_STAGES : STARTUP_STAGES;
  const categories = participantType === 'student' ? STUDENT_CATEGORIES : STARTUP_CATEGORIES;

  const onSubmit = async (data: ImmediateRegistrationFormValues) => {
    setIsSubmitting(true);
    setSubmitError(null);
    try {
      const res = await fetch('/api/short-register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const result = await res.json();
      if (!res.ok) {
        throw new Error(result.error || 'Failed to register');
      }

      setIsSuccess(true);
    } catch (err: unknown) {
      setSubmitError(err instanceof Error ? err.message : 'Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="glass-panel p-8 md:p-12 rounded-2xl w-full max-w-2xl mx-auto text-center animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-10 h-10 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2 className="text-3xl font-black text-white mb-4 font-poppins">Registration Initiated!</h2>
        <p className="text-gray-300 mb-8 font-inter">
          Thank you for starting your Eureka journey with us. To stay updated and complete the final steps before the event, please join our official WhatsApp group.
        </p>
        
        <a 
          href="https://chat.whatsapp.com/CtqVRlIxGm12EJJFnZhU6y" 
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-3 bg-success hover:bg-[#128C7E] text-white px-8 py-4 rounded-xl font-bold font-inter transition-all transform hover:scale-105 shadow-[0_0_20px_rgba(37,211,102,0.3)]"
        >
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/>
          </svg>
          Join E-Cell WhatsApp Group
        </a>
      </div>
    );
  }

  const renderError = (field: keyof ImmediateRegistrationFormValues) => {
    if (errors[field]) {
      return <p className="text-error text-xs mt-1.5 font-medium text-left">{errors[field]?.message}</p>;
    }
    return null;
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        
        {/* Step 1: Basic Info */}
        <div className="glass-panel p-8 rounded-2xl animate-in fade-in slide-in-from-bottom-4 duration-500 delay-100">
          <div className="flex items-center gap-3 mb-6 border-b border-white/10 pb-4">
            <Users className="text-primary w-6 h-6" />
            <h2 className="text-2xl font-bold text-white font-poppins">Team Information</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-white mb-2">Participant Type <span className="text-primary">*</span></label>
              <Controller
                name="participantType"
                control={control}
                render={({ field }) => (
                  <div className="flex gap-4">
                    <label className={`flex-1 flex items-center justify-center p-4 rounded-xl cursor-pointer border transition-all ${field.value === 'student' ? 'bg-primary/20 border-primary text-white shadow-[0_0_15px_rgba(26,111,245,0.2)]' : 'border-white/10 text-gray-400 hover:bg-white/5'}`}>
                      <input type="radio" value="student" className="hidden" checked={field.value === 'student'} onChange={() => field.onChange('student')} />
                      <span className="font-semibold font-poppins text-lg">Student</span>
                    </label>
                    <label className={`flex-1 flex items-center justify-center p-4 rounded-xl cursor-pointer border transition-all ${field.value === 'startup' ? 'bg-primary/20 border-primary text-white shadow-[0_0_15px_rgba(26,111,245,0.2)]' : 'border-white/10 text-gray-400 hover:bg-white/5'}`}>
                      <input type="radio" value="startup" className="hidden" checked={field.value === 'startup'} onChange={() => field.onChange('startup')} />
                      <span className="font-semibold font-poppins text-lg">Startup</span>
                    </label>
                  </div>
                )}
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-white mb-2">Team Name <span className="text-primary">*</span></label>
              <Controller
                name="teamName"
                control={control}
                render={({ field }) => (
                  <input {...field} className={`glass-input w-full p-3.5 rounded-xl text-white transition-all focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary ${errors.teamName ? 'border-error' : 'border-white/10'}`} placeholder="e.g. Innovators" />
                )}
              />
              {renderError('teamName')}
            </div>

            <div>
              <label className="block text-sm font-semibold text-white mb-2">Team Members (Comma separated)</label>
              <Controller
                name="membersNames"
                control={control}
                render={({ field }) => (
                  <input {...field} className="glass-input w-full p-3.5 rounded-xl text-white border-white/10 transition-all focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary" placeholder="Rahul, Priya, Amit" />
                )}
              />
            </div>
          </div>
        </div>

        {/* Step 2: Leader Details */}
        <div className="glass-panel p-8 rounded-2xl animate-in fade-in slide-in-from-bottom-4 duration-500 delay-200">
          <div className="flex items-center gap-3 mb-6 border-b border-white/10 pb-4">
            <User className="text-primary w-6 h-6" />
            <h2 className="text-2xl font-bold text-white font-poppins">Leader Details</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-white mb-2">Full Name <span className="text-primary">*</span></label>
              <Controller
                name="leadName"
                control={control}
                render={({ field }) => (
                  <input {...field} className={`glass-input w-full p-3.5 rounded-xl text-white transition-all focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary ${errors.leadName ? 'border-error' : 'border-white/10'}`} placeholder="Leader Name" />
                )}
              />
              {renderError('leadName')}
            </div>

            <div>
              <label className="block text-sm font-semibold text-white mb-2">Email Address <span className="text-primary">*</span></label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5" />
                <Controller
                  name="leadEmail"
                  control={control}
                  render={({ field }) => (
                    <input {...field} type="email" className={`glass-input w-full py-3.5 pr-3.5 pl-12! rounded-xl text-white transition-all focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary ${errors.leadEmail ? 'border-error' : 'border-white/10'}`} placeholder="email@example.com" />
                  )}
                />
              </div>
              {renderError('leadEmail')}
            </div>

            <div>
              <label className="block text-sm font-semibold text-white mb-2">Phone Number <span className="text-primary">*</span></label>
              <div className="relative">
                <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5" />
                <Controller
                  name="leadPhone"
                  control={control}
                  render={({ field }) => (
                    <input {...field} type="tel" className={`glass-input w-full py-3.5 pr-3.5 pl-12! rounded-xl text-white transition-all focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary ${errors.leadPhone ? 'border-error' : 'border-white/10'}`} placeholder="10-digit number" />
                  )}
                />
              </div>
              {renderError('leadPhone')}
            </div>

            <div>
              <label className="block text-sm font-semibold text-white mb-2">Alternate Phone (Optional)</label>
              <div className="relative">
                <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5" />
                <Controller
                  name="leadAltPhone"
                  control={control}
                  render={({ field }) => (
                    <input {...field} type="tel" className={`glass-input w-full py-3.5 pr-3.5 pl-12! rounded-xl text-white transition-all focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary ${errors.leadAltPhone ? 'border-error' : 'border-white/10'}`} placeholder="Optional" />
                  )}
                />
              </div>
              {renderError('leadAltPhone')}
            </div>
            
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-white mb-2">College/Institution <span className="text-primary">*</span></label>
              <div className="relative">
                <GraduationCap className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5" />
                <Controller
                  name="leadCollege"
                  control={control}
                  render={({ field }) => (
                    <input {...field} className={`glass-input w-full py-3.5 pr-3.5 pl-12! rounded-xl text-white transition-all focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary ${errors.leadCollege ? 'border-error' : 'border-white/10'}`} placeholder="Full College Name" />
                  )}
                />
              </div>
              {renderError('leadCollege')}
            </div>

            <div>
              <label className="block text-sm font-semibold text-white mb-2">Branch/Course <span className="text-primary">*</span></label>
              <Controller
                name="leadBranch"
                control={control}
                render={({ field }) => (
                  <input {...field} className={`glass-input w-full p-3.5 rounded-xl text-white transition-all focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary ${errors.leadBranch ? 'border-error' : 'border-white/10'}`} placeholder="e.g. BTech Computer Science" />
                )}
              />
              {renderError('leadBranch')}
            </div>

            <div>
              <label className="block text-sm font-semibold text-white mb-2">Year of Study <span className="text-primary">*</span></label>
              <Controller
                name="leadYear"
                control={control}
                render={({ field }) => (
                  <select {...field} className={`glass-input w-full p-3.5 rounded-xl text-white appearance-none transition-all focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary ${errors.leadYear ? 'border-error' : 'border-white/10'}`}>
                    <option value="" disabled className="bg-[#1A1A1A] text-gray-500">Select Year</option>
                    <option value="1st Year" className="bg-[#1A1A1A] text-white">1st Year</option>
                    <option value="2nd Year" className="bg-[#1A1A1A] text-white">2nd Year</option>
                    <option value="3rd Year" className="bg-[#1A1A1A] text-white">3rd Year</option>
                    <option value="4th Year" className="bg-[#1A1A1A] text-white">4th Year</option>
                    <option value="Postgraduate" className="bg-[#1A1A1A] text-white">Postgraduate</option>
                    <option value="Other" className="bg-[#1A1A1A] text-white">Other</option>
                  </select>
                )}
              />
              {renderError('leadYear')}
            </div>
          </div>
        </div>

        {/* Step 3: Idea Details */}
        <div className="glass-panel p-8 rounded-2xl animate-in fade-in slide-in-from-bottom-4 duration-500 delay-300">
          <div className="flex items-center gap-3 mb-6 border-b border-white/10 pb-4">
            <Lightbulb className="text-primary w-6 h-6" />
            <h2 className="text-2xl font-bold text-white font-poppins">Idea Details</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-white mb-2">Idea Category <span className="text-primary">*</span></label>
              <Controller
                name="ideaCategory"
                control={control}
                render={({ field }) => (
                  <select {...field} className={`glass-input w-full p-3.5 rounded-xl text-white appearance-none transition-all focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary ${errors.ideaCategory ? 'border-error' : 'border-white/10'}`}>
                    <option value="" disabled className="bg-[#1A1A1A] text-gray-500">Select a category</option>
                    {categories.map((cat) => (
                      <option key={cat} value={cat} className="bg-[#1A1A1A] text-white">{cat}</option>
                    ))}
                  </select>
                )}
              />
              {renderError('ideaCategory')}
            </div>

            <div>
              <label className="block text-sm font-semibold text-white mb-2">Idea Stage <span className="text-primary">*</span></label>
              <Controller
                name="ideaStage"
                control={control}
                render={({ field }) => (
                  <select {...field} className={`glass-input w-full p-3.5 rounded-xl text-white appearance-none transition-all focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary ${errors.ideaStage ? 'border-error' : 'border-white/10'}`}>
                    <option value="" disabled className="bg-[#1A1A1A] text-gray-500">Select current stage</option>
                    {stages.map((stage) => (
                      <option key={stage} value={stage} className="bg-[#1A1A1A] text-white">{stage}</option>
                    ))}
                  </select>
                )}
              />
              {renderError('ideaStage')}
            </div>
          </div>
        </div>

        {submitError && (
          <div className="bg-error/10 border border-error/30 p-4 rounded-xl text-error font-medium text-center">
            {submitError}
          </div>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-primary hover:bg-[#1456c2] text-white py-4 px-6 rounded-xl font-bold font-inter text-lg shadow-[0_0_20px_rgba(26,111,245,0.4)] transition-all flex items-center justify-center gap-2 hover:scale-[1.02] disabled:opacity-70 disabled:hover:scale-100"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-6 h-6 animate-spin" />
              Processing...
            </>
          ) : (
            <>
              Submit Registration
              <ArrowRight className="w-6 h-6" />
            </>
          )}
        </button>
      </form>
    </div>
  );
}
