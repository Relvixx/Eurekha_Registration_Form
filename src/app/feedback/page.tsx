import FeedbackForm from '@/components/feedback/FeedbackForm';

export const metadata = {
  title: 'Event Feedback | Eureka - E-Cell MET',
  description: 'Share your experience and help us improve future events.',
};

export default function FeedbackPage() {
  return (
    <div className="min-h-screen bg-[#050505] flex flex-col relative overflow-hidden font-inter">
      {/* Background ambient effects */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-[#1A6FF5]/8 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[500px] h-[300px] bg-[#00E5FF]/6 blur-[100px] rounded-full pointer-events-none" />

      {/* Header */}
      <header className="text-center pt-10 sm:pt-14 pb-6 px-4 relative z-10">
        <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 rounded-full px-4 py-1.5 mb-4">
          <span className="text-xs tracking-widest uppercase text-gray-400 font-semibold">Eureka 2026</span>
          <span className="text-gray-600">·</span>
          <span className="text-xs text-[#00E5FF] font-medium">Feedback</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-white font-poppins mb-2">
          We&apos;d Love Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#1A6FF5] to-[#00E5FF]">Feedback</span>
        </h1>
        <p className="text-gray-400 text-sm sm:text-base max-w-md mx-auto">
          Quick 8 questions. Mostly taps. Takes under a minute.
        </p>
      </header>

      {/* Form */}
      <main className="flex-1 flex flex-col justify-center pb-16 relative z-10">
        <FeedbackForm />
      </main>

      {/* Footer */}
      <footer className="text-center pb-6 relative z-10">
        <p className="text-xs text-gray-600">
          E-Cell MET · Eureka 2026
        </p>
      </footer>
    </div>
  );
}
