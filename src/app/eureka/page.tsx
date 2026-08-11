import { Metadata } from 'next';
import WizardShell from '@/components/eureka-wizard/WizardShell';

export const metadata: Metadata = {
  title: 'Eureka Registration Wizard | E-Cell MET',
  description: 'Step-by-step registration wizard for Eureka startup and student tracks.',
};

import SiteFooter from '@/components/layout/SiteFooter';

export default function EurekaRegistrationPage() {
  return (
    <div className="flex-1 w-full bg-[#000000] flex flex-col relative overflow-hidden">
      {/* Background ambient light effects */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-[#1A6FF5]/10 blur-[120px] rounded-full pointer-events-none -z-10"></div>
      <div className="absolute bottom-0 right-0 w-[500px] h-[300px] bg-[#000596]/15 blur-[100px] rounded-full pointer-events-none -z-10"></div>
      
      <div className="flex-1">
        <WizardShell />
      </div>
      
      <SiteFooter />
    </div>
  );
}
