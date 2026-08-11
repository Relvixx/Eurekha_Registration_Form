import Link from "next/link";
import { ArrowRight } from "lucide-react";
import SiteHeader from "@/components/layout/SiteHeader";
import SiteFooter from "@/components/layout/SiteFooter";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center flex-1 px-4 text-center min-h-screen pt-24 pb-12">
      <SiteHeader />
      <div className="glass-panel max-w-2xl w-full p-8 md:p-12 rounded-3xl animate-in fade-in slide-in-from-bottom-8 duration-700 flex-1 flex flex-col justify-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-6 text-white tracking-tight">
          Welcome to <span className="text-[#FF1744]">Eureka</span>
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
      <SiteFooter />
    </div>
  );
}
