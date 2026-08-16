import { Metadata } from 'next';
import FormShell from '@/components/eureka-form/FormShell';

export const metadata: Metadata = {
  title: 'Eureka Registration Form | E-Cell MET',
  description: 'Step-by-step registration form for Eureka startup and student tracks.',
};

import SiteFooter from '@/components/layout/SiteFooter';

export default function EurekaRegistrationPage() {
  return (
    <div className="flex-1 w-full bg-text-dark flex flex-col relative overflow-hidden">
      {/* Background ambient light effects */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-200 h-100 bg-primary/10 blur-[120px] rounded-full pointer-events-none -z-10"></div>
      <div className="absolute bottom-0 right-0 w-125 h-75 bg-accent-deep/15 blur-[100px] rounded-full pointer-events-none -z-10"></div>
      
      <div className="flex-1">
        <FormShell />
      </div>
      
      <SiteFooter />
    </div>
  );
}
