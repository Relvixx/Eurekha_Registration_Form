import React from 'react';
import { useFormState } from '../../hooks/useFormState';
import { CheckCircle2, ExternalLink } from 'lucide-react';
import { EUREKA_CONFIG } from '../../lib/config/eureka';

export default function StepSuccess() {
  const formState = useFormState();

  return (
    <div className="glass-panel p-10 md:p-14 rounded-2xl w-full text-center animate-in fade-in zoom-in duration-500 max-w-3xl mx-auto mt-8 border border-white/5">
      <div className="w-24 h-24 mx-auto bg-[#00E5FF]/10 text-[#00E5FF] rounded-full flex items-center justify-center mb-8 shadow-[0_0_30px_rgba(0,229,255,0.2)]">
        <CheckCircle2 size={48} strokeWidth={2.5} />
      </div>
      
      <h2 className="text-4xl md:text-5xl font-black text-white mb-4 font-poppins tracking-tight">Registration Successful!</h2>
      
      <p className="text-text-muted text-lg mb-10 max-w-xl mx-auto font-inter">
        Your Eureka registration details and proof have been successfully submitted to E-Cell MET.
      </p>


      <div className="space-y-5 text-left max-w-xl mx-auto mb-12">
        <h3 className="text-white font-bold text-xl border-b border-white/10 pb-3 font-poppins">Next Steps</h3>
        <ul className="space-y-4 text-text-muted text-sm font-inter">

          <li className="flex gap-3">
            <span className="text-primary mt-0.5 text-lg leading-none">•</span>
            <span className="leading-relaxed">Our team will verify your Eureka Registration ID ({formState.eurekaRegistrationId}) and the proof you uploaded.</span>
          </li>
          <li className="flex gap-3">
            <span className="text-primary mt-0.5 text-lg leading-none">•</span>
            <span className="leading-relaxed">You will receive updates from our official email at <a href="mailto:met.iot.ecell@gmail.com" className="font-medium text-primary hover:underline">met.iot.ecell@gmail.com</a> if any further action is required.</span>
          </li>
        </ul>
      </div>

      <div className="pt-10 border-t border-white/10">
        <p className="text-gray-300 mb-8 font-inter">
          To stay updated and complete the final steps before the event, please join our official WhatsApp group.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <a 
            href="https://chat.whatsapp.com/CtqVRlIxGm12EJJFnZhU6y" 
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-3 bg-success hover:bg-[#128C7E] text-white px-8 py-3.5 rounded-xl font-bold font-inter transition-all transform hover:scale-105 shadow-[0_0_20px_rgba(37,211,102,0.3)] w-full sm:w-auto"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/>
            </svg>
            Join WhatsApp Group
          </a>

          <a 
            href="/"
            onClick={() => formState.resetForm()}
            className="inline-flex items-center justify-center px-8 py-3.5 rounded-xl border border-white/10 bg-text-dark text-white hover:bg-primary/10 hover:border-primary/30 hover:text-primary transition-all duration-300 font-semibold font-inter focus-ring w-full sm:w-auto"
          >
            Return to Homepage
          </a>
        </div>
      </div>
    </div>
  );
}
