import Link from "next/link";
import { ArrowRight } from "lucide-react";
import SiteHeader from "@/components/layout/SiteHeader";
import SiteFooter from "@/components/layout/SiteFooter";

export default function Home() {
  return (
    <div className="flex flex-col items-center flex-1 px-4 text-center min-h-screen pt-24 pb-12">
      <div className="glass-panel max-w-2xl w-full p-8 md:p-12 rounded-3xl animate-in fade-in slide-in-from-bottom-8 duration-700 flex flex-col items-center justify-center my-auto">
        <div className="inline-flex items-center justify-center gap-4 mb-6 py-2 px-6 rounded-full bg-surface-secondary/80 border border-white/10 backdrop-blur-sm shadow-lg">
          <div className="flex items-center gap-2">
            <span className="text-sm font-bold text-white font-poppins">ECell <span className="text-[#FF1744]">MET</span></span>
          </div>
          <div className="w-1 h-1 rounded-full bg-gray-600"></div>
          <span className="text-xs font-semibold text-gray-400 uppercase tracking-widest font-inter">Presents</span>
        </div>
        
        <h1 className="text-4xl md:text-5xl font-bold mb-6 text-white tracking-tight">
          Welcome to <span className="text-primary">Eureka</span>
        </h1>
        
        <p className="text-lg text-gray-400 mb-10 max-w-xl mx-auto leading-relaxed">
          The flagship entrepreneurship registration portal for E-Cell MET. Join the next generation of innovators and startup founders.
        </p>

        <Link 
          href="/eureka" 
          className="btn btn-primary px-8 py-4 rounded-full text-base inline-flex items-center gap-2 group focus-ring"
        >
          Start Registration
          <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>

      <div className="w-full max-w-7xl mx-auto mt-24 rounded-4xl overflow-hidden shadow-2xl">
        <SiteFooter />
      </div>
    </div>
  );
}
