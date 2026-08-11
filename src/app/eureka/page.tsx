import { Metadata } from 'next';
import WizardShell from '@/components/eureka-wizard/WizardShell';

export const metadata: Metadata = {
  title: 'Eureka Registration Wizard | E-Cell MET',
  description: 'Step-by-step registration wizard for Eureka startup and student tracks.',
};

export default function EurekaRegistrationPage() {
  return (
    <div className="flex-1 w-full bg-[#121212] flex flex-col relative overflow-hidden">
      {/* Background ambient light effects */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-[#FF1744]/5 blur-[120px] rounded-full pointer-events-none -z-10"></div>
      <div className="absolute bottom-0 right-0 w-[500px] h-[300px] bg-[#00E5FF]/5 blur-[100px] rounded-full pointer-events-none -z-10"></div>
      
      <WizardShell />
    </div>
  );
}
