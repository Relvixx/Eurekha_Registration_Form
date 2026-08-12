'use client';

import React, { useState, useEffect, useMemo, useRef } from 'react';
import { createClient } from '@supabase/supabase-js';
import { 
  Search, Lock, LogOut, CheckCircle, XCircle, Clock, FileText, Download,
  X, AlertCircle, Loader2, ChevronRight, Users, User, GraduationCap, Building2,
  ExternalLink, Calendar
} from 'lucide-react';
import {
  BarChart, Bar, XAxis, Tooltip, ResponsiveContainer, Cell
} from 'recharts';

// --- Types ---
type Tab = 'quick-leads' | 'full-apps';

interface QuickLead {
  id: string;
  created_at: string;
  participant_type: string;
  team_name: string;
  lead_name: string;
  lead_phone: string;
  idea_category: string;
  admin_status: string;
  internal_notes: string | null;
  [key: string]: any;
}

interface FullApplication {
  id: string;
  created_at: string;
  team_name: string;
  idea_name: string | null;
  startup_name: string | null;
  category: string;
  current_stage: string;
  admin_status: string;
  internal_notes: string | null;
  team_members: any[];
  registration_proofs: any[];
  [key: string]: any;
}

// Supabase Anon Client for Realtime
// The env variables must be set correctly in .env.local
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
// Only create client if variables exist to prevent crash
const supabaseClient = supabaseUrl && supabaseAnonKey ? createClient(supabaseUrl, supabaseAnonKey) : null;

export default function AdminDashboard() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);
  // --- State ---
  const [authStatus, setAuthStatus] = useState<'checking' | 'unauthenticated' | 'authenticated'>('checking');
  const [password, setPassword] = useState('');
  const [authError, setAuthError] = useState('');
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  const [activeTab, setActiveTab] = useState<Tab>('quick-leads');
  const [searchQuery, setSearchQuery] = useState('');
  
  const [leads, setLeads] = useState<QuickLead[]>([]);
  const [applications, setApplications] = useState<FullApplication[]>([]);
  const [isLoadingData, setIsLoadingData] = useState(true);
  
  const [selectedLead, setSelectedLead] = useState<QuickLead | null>(null);
  const [selectedApp, setSelectedApp] = useState<FullApplication | null>(null);
  
  const [toasts, setToasts] = useState<{ id: number; message: string; type: 'success' | 'error' }[]>([]);

  // --- Auth Check ---
  useEffect(() => {
    checkSession();
  }, []);

  const checkSession = async () => {
    try {
      const res = await fetch('/api/admin-auth');
      if (res.ok) {
        setAuthStatus('authenticated');
        fetchData();
      } else {
        setAuthStatus('unauthenticated');
      }
    } catch (error) {
      setAuthStatus('unauthenticated');
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    setIsAuthenticating(true);

    try {
      const res = await fetch('/api/admin-auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });

      if (res.ok) {
        setAuthStatus('authenticated');
        fetchData();
      } else {
        const data = await res.json();
        setAuthError(data.error || 'Login failed');
      }
    } catch (error) {
      setAuthError('Network error');
    } finally {
      setIsAuthenticating(false);
    }
  };

  const handleLogout = async () => {
    await fetch('/api/admin-auth', { method: 'DELETE' });
    setAuthStatus('unauthenticated');
    setLeads([]);
    setApplications([]);
    setPassword('');
  };

  // --- Data Fetching ---
  const fetchData = async () => {
    setIsLoadingData(true);
    try {
      const res = await fetch('/api/admin-data');
      if (res.ok) {
        const result = await res.json();
        setLeads(result.data.leads || []);
        setApplications(result.data.applications || []);
      } else {
        showToast('Failed to fetch data', 'error');
      }
    } catch (error) {
      showToast('Error fetching data', 'error');
    } finally {
      setIsLoadingData(false);
    }
  };

  // --- Realtime ---
  useEffect(() => {
    if (authStatus !== 'authenticated' || !supabaseClient) return;

    const channel = supabaseClient
      .channel('admin-realtime')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'immediate_registrations' }, (payload) => {
        if (payload.eventType === 'INSERT') {
          setLeads((prev) => [payload.new as QuickLead, ...prev]);
          showToast('New Quick Lead Submitted!', 'success');
        } else if (payload.eventType === 'UPDATE') {
          setLeads((prev) => prev.map(lead => lead.id === payload.new.id ? payload.new as QuickLead : lead));
          if (selectedLead?.id === payload.new.id) {
            setSelectedLead(payload.new as QuickLead);
          }
        }
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'registrations' }, async (payload) => {
        if (payload.eventType === 'INSERT') {
          showToast('New Full Application Submitted! Fetching details...', 'success');
          // Since we need joined data (team members), we should re-fetch the specific record or all
          fetchData(); 
        } else if (payload.eventType === 'UPDATE') {
          // Update local state without fetching if possible
          setApplications((prev) => prev.map(app => 
            app.id === payload.new.id ? { ...app, ...payload.new } : app
          ));
          if (selectedApp?.id === payload.new.id) {
            setSelectedApp((prev) => prev ? { ...prev, ...payload.new } : null);
          }
        }
      })
      .subscribe();

    return () => {
      supabaseClient.removeChannel(channel);
    };
  }, [authStatus, selectedLead, selectedApp]);

  // --- Actions ---
  const updateRecord = async (id: string, type: 'lead' | 'application', updates: any) => {
    try {
      const res = await fetch('/api/admin-data', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, type, updates }),
      });

      if (!res.ok) throw new Error('Update failed');
      
      const result = await res.json();
      
      // Update local state optimistically (handled by realtime ideally, but safe to do here)
      if (type === 'lead') {
        setLeads(prev => prev.map(item => item.id === id ? { ...item, ...updates } : item));
        if (selectedLead?.id === id) setSelectedLead({ ...selectedLead, ...updates });
      } else {
        setApplications(prev => prev.map(item => item.id === id ? { ...item, ...updates } : item));
        if (selectedApp?.id === id) setSelectedApp({ ...selectedApp, ...updates });
      }
      
      showToast('Saved ✓', 'success');
    } catch (error) {
      showToast('Failed to update', 'error');
    }
  };

  const showToast = (message: string, type: 'success' | 'error') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 3000);
  };

  const getSignedUrl = async (path: string, bucket?: string) => {
    try {
      const res = await fetch('/api/admin-signed-url', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ path, bucket }),
      });
      if (res.ok) {
        const { signedUrl } = await res.json();
        window.open(signedUrl, '_blank');
      } else {
        showToast('Failed to generate URL', 'error');
      }
    } catch (e) {
      showToast('Network error', 'error');
    }
  };

  const exportCSV = () => {
    let csvContent = "data:text/csv;charset=utf-8,";
    
    if (activeTab === 'quick-leads') {
      const headers = ['Date', 'Participant Type', 'Team Name', 'Lead Name', 'Email', 'Phone', 'College', 'Category', 'Stage', 'Status'];
      csvContent += headers.join(",") + "\r\n";
      
      leads.forEach(lead => {
        const row = [
          new Date(lead.created_at).toLocaleDateString(),
          lead.participant_type,
          `"${(lead.team_name || '').replace(/"/g, '""')}"`,
          `"${(lead.lead_name || '').replace(/"/g, '""')}"`,
          lead.lead_email,
          lead.lead_phone,
          `"${(lead.lead_college || '').replace(/"/g, '""')}"`,
          lead.idea_category,
          lead.idea_stage,
          lead.admin_status
        ];
        csvContent += row.join(",") + "\r\n";
      });
    } else {
      const headers = ['Date', 'Participant Type', 'Team Name', 'Idea/Startup Name', 'Category', 'Stage', 'Eureka Status', 'Admin Status', 'Leader Name', 'Leader Email'];
      csvContent += headers.join(",") + "\r\n";
      
      applications.forEach(app => {
        const leader = app.team_members?.find((m: any) => m.is_leader);
        const name = app.participant_type === 'student' ? app.idea_name : app.startup_name;
        
        const row = [
          new Date(app.created_at).toLocaleDateString(),
          app.participant_type,
          `"${(app.team_name || '').replace(/"/g, '""')}"`,
          `"${(name || '').replace(/"/g, '""')}"`,
          app.category,
          app.current_stage,
          app.status,
          app.admin_status || 'pending',
          `"${(leader?.full_name || '').replace(/"/g, '""')}"`,
          leader?.email || ''
        ];
        csvContent += row.join(",") + "\r\n";
      });
    }
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `eureka-${activeTab}-${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // --- Filtering ---
  const filteredLeads = useMemo(() => {
    if (!searchQuery) return leads;
    const q = searchQuery.toLowerCase();
    return leads.filter(l => 
      l.team_name?.toLowerCase().includes(q) ||
      l.lead_name?.toLowerCase().includes(q) ||
      l.lead_phone?.includes(q) ||
      l.idea_category?.toLowerCase().includes(q)
    );
  }, [leads, searchQuery]);

  const filteredApps = useMemo(() => {
    if (!searchQuery) return applications;
    const q = searchQuery.toLowerCase();
    return applications.filter(a => {
      const name = a.participant_type === 'student' ? a.idea_name : a.startup_name;
      const leader = a.team_members?.find((m: any) => m.is_leader)?.full_name || '';
      return a.team_name?.toLowerCase().includes(q) ||
             name?.toLowerCase().includes(q) ||
             a.category?.toLowerCase().includes(q) ||
             leader.toLowerCase().includes(q);
    });
  }, [applications, searchQuery]);

  // --- Render Helpers ---
  const renderStatusBadge = (status: string) => {
    let colorClass = "bg-gray-500/20 text-gray-300 border-gray-500/30";
    if (status === 'shortlisted') colorClass = "bg-green-500/20 text-green-400 border-green-500/30";
    if (status === 'rejected') colorClass = "bg-red-500/20 text-red-400 border-red-500/30";
    
    return (
      <span className={`px-2.5 py-1 text-xs font-medium rounded-full border uppercase tracking-wider ${colorClass}`}>
        {status || 'pending'}
      </span>
    );
  };

  // ==========================================
  // AUTH UI
  // ==========================================
  if (authStatus === 'checking') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0A0A0A]">
        <Loader2 className="w-8 h-8 text-[#FF1744] animate-spin" />
      </div>
    );
  }

  if (authStatus === 'unauthenticated') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0A0A0A] p-4 relative overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#FF1744]/10 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-[100px] pointer-events-none" />
        
        <form 
          onSubmit={handleLogin}
          className="bg-white/5 backdrop-blur-xl border border-white/10 p-8 rounded-3xl w-full max-w-md shadow-2xl relative z-10"
        >
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-white mb-2 font-poppins">ECell <span className="text-[#FF1744]">MET</span></h1>
            <p className="text-gray-400 font-inter">Authorized Access Only</p>
          </div>

          {authError && (
            <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm flex items-center gap-2">
              <AlertCircle size={16} />
              {authError}
            </div>
          )}

          <div className="mb-6 relative">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
            <input
              type="password"
              placeholder="Admin Password"
              className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white focus:outline-none focus:border-[#FF1744] transition-colors"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isAuthenticating}
            />
          </div>

          <button
            type="submit"
            disabled={isAuthenticating || !password}
            className="w-full bg-[#FF1744] hover:bg-[#D50000] text-white py-3 rounded-xl font-medium transition-colors flex justify-center items-center gap-2 disabled:opacity-50"
          >
            {isAuthenticating ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Sign In'}
          </button>
        </form>
      </div>
    );
  }

  // ==========================================
  // DASHBOARD UI
  // ==========================================
  const currentData = activeTab === 'quick-leads' ? leads : applications;
  
  const totalNominations = currentData.length;
  
  const today = new Date().toISOString().split('T')[0];
  const newToday = currentData.filter(item => item.created_at?.startsWith(today)).length;
  
  const shortlistedCount = currentData.filter(item => item.admin_status === 'shortlisted').length;
  
  const withDocuments = activeTab === 'quick-leads' ? 0 : applications.filter(a => a.pitch_deck_url || (a.registration_proofs && a.registration_proofs.length > 0)).length;

  const pendingCount = currentData.filter(item => item.admin_status === 'pending' || !item.admin_status).length;
  
  // Deadline Logic (Assuming Aug 30, 2026)
  const deadlineDate = new Date('2026-08-30');
  const now = new Date();
  const timeDiff = deadlineDate.getTime() - now.getTime();
  const daysLeft = Math.max(0, Math.ceil(timeDiff / (1000 * 3600 * 24)));

  // Trend Data (Last 14 Days)
  const trendData = useMemo(() => {
    const data = [];
    for (let i = 13; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];
      const displayDate = d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
      const count = currentData.filter(item => item.created_at?.startsWith(dateStr)).length;
      data.push({ date: displayDate, submissions: count });
    }
    return data;
  }, [currentData]);

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-[#1A1A1A] border border-white/10 p-2 rounded-lg shadow-xl text-xs">
          <p className="text-white font-bold mb-1">{label}</p>
          <p className="text-gray-400">{payload[0].value} submission{payload[0].value !== 1 ? 's' : ''}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="min-h-screen bg-[#050505] flex flex-col font-inter">
      {/* Top Navigation */}
      <header className="sticky top-0 z-40 bg-[#050505]/80 backdrop-blur-md border-b border-white/5 px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <div className="text-xl font-bold text-white font-poppins">ECell <span className="text-[#FF1744]">MET</span></div>
          <span className="text-gray-500 px-2">|</span>
          <span className="text-sm tracking-widest uppercase text-gray-400 font-semibold">Admin</span>
        </div>

        <div className="flex bg-[#111] p-1 rounded-full border border-white/5">
          <button
            onClick={() => { setActiveTab('quick-leads'); setSearchQuery(''); setSelectedLead(null); setSelectedApp(null); }}
            className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${
              activeTab === 'quick-leads' 
                ? 'bg-white/10 text-white shadow-sm border-b-2 border-[#FF1744]' 
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Quick Leads
          </button>
          <button
            onClick={() => { setActiveTab('full-apps'); setSearchQuery(''); setSelectedLead(null); setSelectedApp(null); }}
            className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${
              activeTab === 'full-apps' 
                ? 'bg-white/10 text-white shadow-sm border-b-2 border-[#FF1744]' 
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Full Applications
          </button>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-xs font-medium bg-green-500/10 text-green-400 px-3 py-1.5 rounded-full border border-green-500/20">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
            </span>
            Live
          </div>
          <button
            onClick={handleLogout}
            className="p-2 text-gray-400 hover:text-white hover:bg-white/5 rounded-full transition-colors"
            title="Logout"
          >
            <LogOut size={18} />
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 p-6 flex flex-col max-w-7xl mx-auto w-full gap-4">
        
        {/* Bento Statistics Redesign */}
        
        {/* Top Row: 4 Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-[#111] border border-white/5 rounded-xl p-5 flex flex-col justify-between">
            <div className="text-[10px] text-gray-500 uppercase tracking-widest font-semibold mb-4">Total Nominations</div>
            <div>
              <div className="text-5xl font-bold text-[#FF1744] font-poppins tracking-wider leading-none mb-1">{totalNominations}</div>
              <div className="text-xs text-gray-500">all time</div>
            </div>
          </div>
          
          <div className="bg-[#111] border border-white/5 rounded-xl p-5 flex flex-col justify-between">
            <div className="text-[10px] text-gray-500 uppercase tracking-widest font-semibold mb-4">Today</div>
            <div>
              <div className="text-5xl font-bold text-white font-poppins tracking-wider leading-none mb-1">{newToday.toString().padStart(2, '0')}</div>
              <div className="text-xs text-gray-500">new today</div>
            </div>
          </div>
          
          <div className="bg-[#111] border border-white/5 rounded-xl p-5 flex flex-col justify-between">
            <div className="text-[10px] text-gray-500 uppercase tracking-widest font-semibold mb-4">Shortlisted</div>
            <div>
              <div className="text-5xl font-bold text-white font-poppins tracking-wider leading-none mb-1">{shortlistedCount.toString().padStart(2, '0')}</div>
              <div className="text-xs text-gray-500">{activeTab === 'quick-leads' ? 'leads' : 'teams'}</div>
            </div>
          </div>

          <div className="bg-[#111] border border-white/5 rounded-xl p-5 flex flex-col justify-between">
            <div className="text-[10px] text-gray-500 uppercase tracking-widest font-semibold mb-4">With Documents</div>
            <div>
              <div className="text-5xl font-bold text-white font-poppins tracking-wider leading-none mb-1">{withDocuments.toString().padStart(2, '0')}</div>
              <div className="text-xs text-gray-500">supporting files</div>
            </div>
          </div>
        </div>

        {/* Middle & Bottom Rows */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
          {/* Trend Chart */}
          <div className="md:col-span-9 bg-[#111] border border-white/5 rounded-xl p-5 h-48 flex flex-col">
            <div className="text-[10px] text-gray-500 uppercase tracking-widest font-semibold mb-4">Submissions Trend – Last 14 Days</div>
            <div className="flex-1 w-full h-full min-h-0">
              {mounted && (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={trendData} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                    <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255, 255, 255, 0.02)' }} />
                    <Bar dataKey="submissions" radius={[2, 2, 0, 0]}>
                      {trendData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill="#333" className="hover:fill-[#FF1744] transition-colors duration-300" />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>
          
          {/* Empty Space for masonry look in image, but let's make the chart span full width if we want, or match exactly. The image shows a wide chart and two cards below. Let's arrange them gracefully. */}
          <div className="md:col-span-3 bg-transparent hidden md:block"></div>
          
          {/* Bottom Cards */}
          <div className="md:col-span-6 bg-[#111] border border-white/5 rounded-xl p-5 flex flex-col justify-between">
            <div className="text-[10px] text-gray-500 uppercase tracking-widest font-semibold mb-4">Pending Review</div>
            <div>
              <div className="text-5xl font-bold text-white font-poppins tracking-wider leading-none mb-1">{pendingCount.toString().padStart(2, '0')}</div>
              <div className="text-xs text-gray-500">needs action</div>
            </div>
          </div>

          <div className="md:col-span-3 bg-[#111] border border-white/5 rounded-xl p-5 flex flex-col justify-between">
            <div className="text-[10px] text-gray-500 uppercase tracking-widest font-semibold mb-4">Deadline</div>
            <div>
              <div className="text-3xl font-bold text-white font-poppins tracking-wider leading-none mb-1">AUG 30</div>
              <div className="text-xs text-gray-500">{daysLeft} days left</div>
            </div>
          </div>
        </div>

        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row gap-4 justify-between items-center bg-white/5 p-2 rounded-2xl border border-white/10">
          <div className="relative w-full sm:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <input 
              type="text" 
              placeholder={`Search ${activeTab === 'quick-leads' ? 'leads' : 'applications'}...`}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-transparent border-none py-2 pl-10 pr-4 text-sm text-white focus:outline-none focus:ring-1 focus:ring-white/20 rounded-xl transition-all"
            />
          </div>
          <button 
            onClick={exportCSV}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium bg-white/10 hover:bg-white/20 text-white rounded-xl transition-colors w-full sm:w-auto justify-center"
          >
            <Download size={16} />
            Export CSV
          </button>
        </div>

        {/* Data Table */}
        <div className="flex-1 bg-white/5 border border-white/10 rounded-2xl overflow-hidden flex flex-col relative">
          {isLoadingData ? (
            <div className="absolute inset-0 flex items-center justify-center bg-[#0A0A0A]/50 backdrop-blur-sm z-10">
              <Loader2 className="w-8 h-8 text-[#FF1744] animate-spin" />
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-gray-300">
                <thead className="text-xs uppercase bg-white/5 text-gray-400 border-b border-white/10">
                  <tr>
                    <th className="px-6 py-4 font-semibold">Date</th>
                    <th className="px-6 py-4 font-semibold">Team Name</th>
                    {activeTab === 'quick-leads' ? (
                      <>
                        <th className="px-6 py-4 font-semibold">Lead Name</th>
                        <th className="px-6 py-4 font-semibold">Category</th>
                        <th className="px-6 py-4 font-semibold">Status</th>
                      </>
                    ) : (
                      <>
                        <th className="px-6 py-4 font-semibold">Idea/Startup</th>
                        <th className="px-6 py-4 font-semibold">Category</th>
                        <th className="px-6 py-4 font-semibold">Stage</th>
                        <th className="px-6 py-4 font-semibold">Status</th>
                      </>
                    )}
                  </tr>
                </thead>
                <tbody>
                  {activeTab === 'quick-leads' && filteredLeads.length === 0 && (
                    <tr><td colSpan={5} className="text-center py-12 text-gray-500">No quick leads found</td></tr>
                  )}
                  {activeTab === 'full-apps' && filteredApps.length === 0 && (
                    <tr><td colSpan={5} className="text-center py-12 text-gray-500">No applications found</td></tr>
                  )}

                  {activeTab === 'quick-leads' && filteredLeads.map(lead => (
                    <tr 
                      key={lead.id} 
                      onClick={() => setSelectedLead(lead)}
                      className="border-b border-white/5 hover:bg-red-500/10 hover:border-l-[3px] hover:border-l-[#FF1744] transition-colors cursor-pointer group"
                      style={{ borderLeftWidth: '3px', borderLeftColor: 'transparent' }}
                    >
                      <td className="px-6 py-4 whitespace-nowrap">{new Date(lead.created_at).toLocaleDateString()}</td>
                      <td className="px-6 py-4 font-medium text-white">{lead.team_name}</td>
                      <td className="px-6 py-4">{lead.lead_name}</td>
                      <td className="px-6 py-4">{lead.idea_category}</td>
                      <td className="px-6 py-4">{renderStatusBadge(lead.admin_status)}</td>
                    </tr>
                  ))}

                  {activeTab === 'full-apps' && filteredApps.map(app => (
                    <tr 
                      key={app.id} 
                      onClick={() => setSelectedApp(app)}
                      className="border-b border-white/5 hover:bg-red-500/10 hover:border-l-[3px] hover:border-l-[#FF1744] transition-colors cursor-pointer group"
                      style={{ borderLeftWidth: '3px', borderLeftColor: 'transparent' }}
                    >
                      <td className="px-6 py-4 whitespace-nowrap">{new Date(app.created_at).toLocaleDateString()}</td>
                      <td className="px-6 py-4 font-medium text-white">{app.team_name}</td>
                      <td className="px-6 py-4 max-w-[200px] truncate">{app.participant_type === 'student' ? app.idea_name : app.startup_name}</td>
                      <td className="px-6 py-4">{app.category}</td>
                      <td className="px-6 py-4">{app.current_stage}</td>
                      <td className="px-6 py-4">{renderStatusBadge(app.admin_status)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>

      {/* --- QUICK LEAD DETAIL PANEL --- */}
      {selectedLead && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setSelectedLead(null)} />
          <div className="relative w-full max-w-md h-full bg-[#121212] border-l border-white/10 shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
            <div className="flex items-center justify-between p-4 border-b border-white/10">
              <h2 className="text-lg font-bold text-white font-poppins">Lead Details</h2>
              <button onClick={() => setSelectedLead(null)} className="p-2 text-gray-400 hover:text-white rounded-full hover:bg-white/5">
                <X size={20} />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-6">
              <div>
                <div className="text-xs text-gray-500 uppercase tracking-wider mb-1">Status</div>
                <div className="flex gap-2">
                  <button 
                    onClick={() => updateRecord(selectedLead.id, 'lead', { admin_status: 'pending' })}
                    className={`flex-1 py-2 text-sm rounded-lg border ${selectedLead.admin_status === 'pending' || !selectedLead.admin_status ? 'bg-gray-700/50 border-gray-500 text-white' : 'border-white/10 text-gray-400 hover:bg-white/5'}`}
                  >
                    Pending
                  </button>
                  <button 
                    onClick={() => updateRecord(selectedLead.id, 'lead', { admin_status: 'shortlisted' })}
                    className={`flex-1 py-2 text-sm rounded-lg border ${selectedLead.admin_status === 'shortlisted' ? 'bg-green-500/20 border-green-500/50 text-green-400' : 'border-white/10 text-gray-400 hover:bg-white/5'}`}
                  >
                    Shortlist
                  </button>
                  <button 
                    onClick={() => updateRecord(selectedLead.id, 'lead', { admin_status: 'rejected' })}
                    className={`flex-1 py-2 text-sm rounded-lg border ${selectedLead.admin_status === 'rejected' ? 'bg-red-500/20 border-red-500/50 text-red-400' : 'border-white/10 text-gray-400 hover:bg-white/5'}`}
                  >
                    Reject
                  </button>
                </div>
              </div>

              <div className="space-y-4 bg-white/5 p-4 rounded-xl border border-white/5">
                <div>
                  <div className="text-xs text-gray-500 mb-1">Team Name</div>
                  <div className="text-base text-white font-medium">{selectedLead.team_name}</div>
                </div>
                <div>
                  <div className="text-xs text-gray-500 mb-1">Participant Type</div>
                  <div className="text-sm text-white capitalize">{selectedLead.participant_type}</div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-xs text-gray-500 mb-1">Category</div>
                    <div className="text-sm text-white">{selectedLead.idea_category}</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500 mb-1">Stage</div>
                    <div className="text-sm text-white">{selectedLead.idea_stage}</div>
                  </div>
                </div>
              </div>

              <div className="space-y-4 bg-white/5 p-4 rounded-xl border border-white/5">
                <h3 className="text-sm font-semibold text-white mb-2 flex items-center gap-2">
                  <User size={16} className="text-gray-400" /> Leader Info
                </h3>
                <div>
                  <div className="text-xs text-gray-500 mb-1">Name</div>
                  <div className="text-sm text-white">{selectedLead.lead_name}</div>
                </div>
                <div>
                  <div className="text-xs text-gray-500 mb-1">Email & Phone</div>
                  <div className="text-sm text-blue-400">{selectedLead.lead_email}</div>
                  <div className="text-sm text-white">{selectedLead.lead_phone} {selectedLead.lead_alt_phone && `/ ${selectedLead.lead_alt_phone}`}</div>
                </div>
                <div>
                  <div className="text-xs text-gray-500 mb-1">College</div>
                  <div className="text-sm text-white">{selectedLead.lead_college}</div>
                  <div className="text-sm text-gray-400 text-xs mt-1">{selectedLead.lead_branch} • Year {selectedLead.lead_year}</div>
                </div>
              </div>

              {selectedLead.members_names && (
                <div className="bg-white/5 p-4 rounded-xl border border-white/5">
                  <h3 className="text-sm font-semibold text-white mb-2">Other Members</h3>
                  <div className="text-sm text-gray-300">{selectedLead.members_names}</div>
                </div>
              )}

              <div>
                <div className="text-xs text-gray-500 uppercase tracking-wider mb-2">Internal Notes</div>
                <textarea 
                  className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-blue-500 min-h-[100px]"
                  placeholder="Add notes about this lead..."
                  defaultValue={selectedLead.internal_notes || ''}
                  onBlur={(e) => {
                    if (e.target.value !== selectedLead.internal_notes) {
                      updateRecord(selectedLead.id, 'lead', { internal_notes: e.target.value });
                    }
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* --- FULL APPLICATION DETAIL PANEL --- */}
      {selectedApp && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setSelectedApp(null)} />
          <div className="relative w-full max-w-2xl h-full bg-[#121212] border-l border-white/10 shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
            <div className="flex items-center justify-between p-4 border-b border-white/10 bg-[#0A0A0A]">
              <h2 className="text-lg font-bold text-white font-poppins">Application Details</h2>
              <button onClick={() => setSelectedApp(null)} className="p-2 text-gray-400 hover:text-white rounded-full hover:bg-white/5">
                <X size={20} />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-6">
              
              {/* Status Row */}
              <div className="flex flex-col sm:flex-row justify-between gap-4">
                <div className="flex-1">
                  <div className="text-xs text-gray-500 uppercase tracking-wider mb-1">Admin Status</div>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => updateRecord(selectedApp.id, 'application', { admin_status: 'pending' })}
                      className={`flex-1 py-2 text-sm rounded-lg border ${selectedApp.admin_status === 'pending' || !selectedApp.admin_status ? 'bg-gray-700/50 border-gray-500 text-white' : 'border-white/10 text-gray-400 hover:bg-white/5'}`}
                    >
                      Pending
                    </button>
                    <button 
                      onClick={() => updateRecord(selectedApp.id, 'application', { admin_status: 'shortlisted' })}
                      className={`flex-1 py-2 text-sm rounded-lg border ${selectedApp.admin_status === 'shortlisted' ? 'bg-green-500/20 border-green-500/50 text-green-400' : 'border-white/10 text-gray-400 hover:bg-white/5'}`}
                    >
                      Shortlist
                    </button>
                    <button 
                      onClick={() => updateRecord(selectedApp.id, 'application', { admin_status: 'rejected' })}
                      className={`flex-1 py-2 text-sm rounded-lg border ${selectedApp.admin_status === 'rejected' ? 'bg-red-500/20 border-red-500/50 text-red-400' : 'border-white/10 text-gray-400 hover:bg-white/5'}`}
                    >
                      Reject
                    </button>
                  </div>
                </div>
                <div className="flex-1">
                  <div className="text-xs text-gray-500 uppercase tracking-wider mb-1">Eureka Status</div>
                  <div className="bg-white/5 border border-white/10 rounded-lg p-2.5 text-sm text-gray-300 font-mono">
                    {selectedApp.status}
                  </div>
                </div>
              </div>

              {/* Idea Info */}
              <div className="space-y-4 bg-white/5 p-5 rounded-2xl border border-white/5">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-xl font-bold text-white mb-1 font-poppins">{selectedApp.participant_type === 'student' ? selectedApp.idea_name : selectedApp.startup_name}</h3>
                    <div className="text-sm text-gray-400 mb-2">Team: {selectedApp.team_name} • {selectedApp.participant_type}</div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-500 block mb-1">Category</span>
                    <span className="text-white">{selectedApp.category}</span>
                  </div>
                  <div>
                    <span className="text-gray-500 block mb-1">Stage</span>
                    <span className="text-white">{selectedApp.current_stage}</span>
                  </div>
                </div>
                <div className="pt-2 border-t border-white/10">
                  <div className="text-xs text-gray-500 mb-1">Short Description</div>
                  <p className="text-sm text-gray-300">{selectedApp.short_description}</p>
                </div>
                <div className="pt-2">
                  <div className="text-xs text-gray-500 mb-1">Problem Statement</div>
                  <p className="text-sm text-gray-300 whitespace-pre-wrap">{selectedApp.problem_statement}</p>
                </div>
                <div className="pt-2">
                  <div className="text-xs text-gray-500 mb-1">Solution</div>
                  <p className="text-sm text-gray-300 whitespace-pre-wrap">{selectedApp.solution_description}</p>
                </div>
                
                {(selectedApp.website_url || selectedApp.linkedin_url) && (
                  <div className="pt-4 flex gap-4">
                    {selectedApp.website_url && (
                      <a href={selectedApp.website_url} target="_blank" rel="noreferrer" className="text-blue-400 hover:text-blue-300 text-sm flex items-center gap-1">
                        <ExternalLink size={14} /> Website
                      </a>
                    )}
                    {selectedApp.linkedin_url && (
                      <a href={selectedApp.linkedin_url} target="_blank" rel="noreferrer" className="text-blue-400 hover:text-blue-300 text-sm flex items-center gap-1">
                        <ExternalLink size={14} /> LinkedIn
                      </a>
                    )}
                  </div>
                )}
              </div>

              {/* Documents */}
              <div className="space-y-3">
                <div className="text-xs text-gray-500 uppercase tracking-wider">Documents</div>
                <div className="grid sm:grid-cols-2 gap-3">
                  {selectedApp.pitch_deck_url ? (
                    <button 
                      onClick={() => getSignedUrl(selectedApp.pitch_deck_url)}
                      className="flex items-center gap-3 p-3 rounded-xl bg-[#1A6FF5]/10 border border-[#1A6FF5]/20 hover:bg-[#1A6FF5]/20 transition-colors text-left"
                    >
                      <div className="bg-[#1A6FF5]/20 p-2 rounded-lg text-[#1A6FF5]"><FileText size={20} /></div>
                      <div>
                        <div className="text-sm font-medium text-white">Pitch Deck</div>
                        <div className="text-xs text-blue-400">Click to view</div>
                      </div>
                    </button>
                  ) : (
                    <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/5 text-gray-500">
                      <div className="p-2"><FileText size={20} /></div>
                      <div className="text-sm">No Pitch Deck</div>
                    </div>
                  )}

                  {selectedApp.registration_proofs && selectedApp.registration_proofs.length > 0 ? (
                    <button 
                      onClick={() => getSignedUrl(selectedApp.registration_proofs[0].storage_path)}
                      className="flex items-center gap-3 p-3 rounded-xl bg-purple-500/10 border border-purple-500/20 hover:bg-purple-500/20 transition-colors text-left"
                    >
                      <div className="bg-purple-500/20 p-2 rounded-lg text-purple-400"><FileText size={20} /></div>
                      <div>
                        <div className="text-sm font-medium text-white">Eureka Proof</div>
                        <div className="text-xs text-purple-400">{selectedApp.eureka_registration_id}</div>
                      </div>
                    </button>
                  ) : (
                    <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/5 text-gray-500">
                      <div className="p-2"><FileText size={20} /></div>
                      <div className="text-sm">No Proof Uploaded</div>
                    </div>
                  )}
                </div>
              </div>

              {/* Team Members */}
              <div className="space-y-3">
                <div className="text-xs text-gray-500 uppercase tracking-wider">Team Members ({selectedApp.team_members?.length || 0})</div>
                <div className="grid gap-3">
                  {selectedApp.team_members?.sort((a:any, b:any) => a.member_order - b.member_order).map((member: any) => (
                    <div key={member.id} className="bg-white/5 p-4 rounded-xl border border-white/5 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-white text-sm">{member.full_name}</span>
                          {member.is_leader && <span className="bg-[#FF1744]/20 text-[#FF1744] text-[10px] uppercase px-1.5 py-0.5 rounded font-bold">Leader</span>}
                        </div>
                        <div className="text-xs text-gray-400 mt-1">{member.email} {member.mobile_number && `• ${member.mobile_number}`}</div>
                        <div className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                          <Building2 size={12} /> {member.institution}
                        </div>
                      </div>
                      <div className="text-xs bg-white/10 px-2 py-1 rounded text-gray-300">
                        {member.role === 'Other' ? member.custom_role : member.role}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Internal Notes */}
              <div>
                <div className="text-xs text-gray-500 uppercase tracking-wider mb-2">Internal Notes</div>
                <textarea 
                  className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-blue-500 min-h-[100px]"
                  placeholder="Add notes about this application..."
                  defaultValue={selectedApp.internal_notes || ''}
                  onBlur={(e) => {
                    if (e.target.value !== selectedApp.internal_notes) {
                      updateRecord(selectedApp.id, 'application', { internal_notes: e.target.value });
                    }
                  }}
                />
              </div>

            </div>
          </div>
        </div>
      )}

      {/* Toasts */}
      <div className="fixed bottom-6 right-6 flex flex-col gap-2 z-50 pointer-events-none">
        {toasts.map(toast => (
          <div 
            key={toast.id}
            className={`px-4 py-3 rounded-lg shadow-xl flex items-center gap-3 pointer-events-auto transition-all animate-in slide-in-from-bottom-5 ${
              toast.type === 'success' ? 'bg-green-900/90 text-green-100 border border-green-500/50' : 'bg-red-900/90 text-red-100 border border-red-500/50'
            }`}
          >
            {toast.type === 'success' ? <CheckCircle size={18} className="text-green-400" /> : <XCircle size={18} className="text-red-400" />}
            <span className="text-sm font-medium">{toast.message}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
