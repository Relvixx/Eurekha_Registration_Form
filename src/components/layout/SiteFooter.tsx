import React from 'react';
import Link from 'next/link';
import { Globe, Users, Video, Mail, MapPin } from 'lucide-react';

export default function SiteFooter() {
  return (
    <footer className="w-full bg-text-dark border-t border-white/10 pt-16 pb-8 px-4 md:px-8 mt-auto font-inter relative z-10">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
        
        {/* Brand Column */}
        <div className="col-span-1 md:col-span-1">
          <Link href="/" className="flex items-center gap-3 mb-6 focus-ring rounded-lg w-fit group">
            <div className="text-xl font-bold tracking-tight text-white font-poppins">
              ECell <span className="text-[#FF1744]">MET</span>
            </div>
          </Link>
          <p className="text-sm text-gray-400 mb-6 leading-relaxed">
            Fostering innovation, leadership, and startup culture through events, workshops, and mentorship.
          </p>
          <div className="flex items-center gap-4">
            <a href="https://www.instagram.com/ecell.met/" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-[#FF1744] hover:bg-[#FF1744]/10 transition-colors focus-ring" aria-label="Social">
              <Globe size={20} />
            </a>
            <a href="https://www.linkedin.com/company/ecell-met/" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-[#FF1744] hover:bg-[#FF1744]/10 transition-colors focus-ring" aria-label="LinkedIn">
              <Users size={20} />
            </a>
            <a href="https://www.youtube.com/@ecell-met-live/streams" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-[#FF1744] hover:bg-[#FF1744]/10 transition-colors focus-ring" aria-label="YouTube">
              <Video size={20} />
            </a>
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-white font-bold mb-6 text-lg font-poppins">Quick Links</h3>
          <ul className="flex flex-col gap-4">
            <li><Link href="/" className="text-gray-400 hover:text-primary transition-colors text-sm focus-ring rounded">Home</Link></li>
            <li><Link href="/#events" className="text-gray-400 hover:text-primary transition-colors text-sm focus-ring rounded">Events</Link></li>
            <li><Link href="/view-startups" className="text-gray-400 hover:text-primary transition-colors text-sm focus-ring rounded">Startups</Link></li>
            <li><Link href="/team" className="text-gray-400 hover:text-primary transition-colors text-sm focus-ring rounded">Team</Link></li>
          </ul>
        </div>

        {/* Initiatives */}
        <div>
          <h3 className="text-white font-bold mb-6 text-lg font-poppins">Initiatives</h3>
          <ul className="flex flex-col gap-4">
            <li><Link href="/eureka" className="text-gray-400 hover:text-primary transition-colors text-sm focus-ring rounded">Eureka Registration</Link></li>
            <li><Link href="/tec" className="text-gray-400 hover:text-primary transition-colors text-sm focus-ring rounded">The Entrepreneurship Community</Link></li>
            <li><Link href="/#startup-registration" className="text-gray-400 hover:text-primary transition-colors text-sm focus-ring rounded">Startup Registration</Link></li>
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h3 className="text-white font-bold mb-6 text-lg font-poppins">Contact Us</h3>
          <ul className="flex flex-col gap-4">
            <li className="flex items-start gap-3">
              <MapPin size={20} className="text-[#FF1744] shrink-0 mt-0.5" />
              <span className="text-sm text-gray-400">MET Institute of Engineering, Bhujbal Knowledge City, Adgaon, Nashik - 422207</span>
            </li>
            <li className="flex items-center gap-3">
              <Mail size={20} className="text-[#FF1744] shrink-0" />
              <a href="mailto:met.iot.ecell@gmail.com" className="text-sm text-gray-400 hover:text-white transition-colors focus-ring rounded">met.iot.ecell@gmail.com</a>
            </li>
          </ul>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="max-w-7xl mx-auto pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4">
        <p className="text-sm text-gray-500">
          &copy; {new Date().getFullYear()} E-Cell MET. All rights reserved.
        </p>
        <p className="text-sm text-gray-500">
          Designed by E-Cell MET Technical Team
        </p>
      </div>
    </footer>
  );
}
