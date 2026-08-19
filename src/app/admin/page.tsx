'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { createClient } from '@supabase/supabase-js';
import { 
  Search, Lock, LogOut, CheckCircle, XCircle, FileText, Download,
  X, AlertCircle, Loader2, User, Building2,
  ExternalLink
} from 'lucide-react';
import {
  BarChart, Bar, Tooltip, ResponsiveContainer, Cell,
  PieChart, Pie
} from 'recharts';

// --- Types ---
type Tab = 'quick-leads' | 'full-apps' | 'feedback';

interface FeedbackEntry {
  id: string;
  overall_experience: number;
  organization_rating: number;
  best_parts: string[];
  would_participate_again: string;
  communication_rating: number | null;
  venue_rating: number | null;
  improvement_suggestion: string | null;
  participant_name: string | null;
  created_at: string;
}

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

// --- Components ---
const CustomTooltip = ({ active, payload, label }: { active?: boolean; payload?: any[]; label?: string }) => {
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

// Supabase Anon Client for Realtime
// The env variables must be set correctly in .env.local
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
// Only create client if variables exist to prevent crash
const supabaseClient = supabaseUrl && supabaseAnonKey ? createClient(supabaseUrl, supabaseAnonKey) : null;

export default function AdminDashboard() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    // eslint-disable-next-line
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
  
  const [showExportMenu, setShowExportMenu] = useState(false);
  const [selectedFields, setSelectedFields] = useState<string[]>([]);
  
  const [feedbackData, setFeedbackData] = useState<FeedbackEntry[]>([]);
  const [isLoadingFeedback, setIsLoadingFeedback] = useState(false);
  const [feedbackSearchQuery, setFeedbackSearchQuery] = useState('');

  const [toasts, setToasts] = useState<{ id: number; message: string; type: 'success' | 'error' }[]>([]);

  // --- Auth Check ---
  useEffect(() => {
    checkSession();
  }, []);

  async function checkSession() {
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
  }

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
    setFeedbackData([]);
    setPassword('');
  };

  // --- Data Fetching ---
  async function fetchData() {
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
    // Also fetch feedback
    fetchFeedback();
  }

  async function fetchFeedback() {
    setIsLoadingFeedback(true);
    try {
      const res = await fetch('/api/feedback');
      if (res.ok) {
        const result = await res.json();
        setFeedbackData(result.data || []);
      }
    } catch (error) {
      console.error('Error fetching feedback:', error);
    } finally {
      setIsLoadingFeedback(false);
    }
  }

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
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'event_feedback' }, (payload) => {
        setFeedbackData((prev) => [payload.new as FeedbackEntry, ...prev]);
        showToast('New Feedback Received!', 'success');
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

  function showToast(message: string, type: 'success' | 'error') {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 3000);
  }

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
      
      filteredLeads.forEach(lead => {
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
      const headers = ['Date', 'Participant Type', 'Team Name', 'Idea/Startup Name', 'Category', 'Stage', 'Eureka Status', 'Admin Status', 'Leader Name', 'Leader Email', 'Leader College'];
      csvContent += headers.join(",") + "\r\n";
      
      filteredApps.forEach(app => {
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
          leader?.email || '',
          `"${(leader?.institution || '').replace(/"/g, '""')}"`
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

  const QUICK_LEADS_FIELDS = [
    { id: 'date', label: 'Date' },
    { id: 'participant_type', label: 'Participant Type' },
    { id: 'team_name', label: 'Team Name' },
    { id: 'lead_name', label: 'Leader Name' },
    { id: 'lead_phone', label: 'Leader Phone' },
    { id: 'lead_email', label: 'Leader Email' },
    { id: 'lead_college', label: 'College' },
    { id: 'idea_category', label: 'Category' },
    { id: 'members_names', label: 'Other Members' },
    { id: 'admin_status', label: 'Status' }
  ];

  const FULL_APPS_FIELDS = [
    { id: 'date', label: 'Date' },
    { id: 'team_name', label: 'Team Name' },
    { id: 'idea_startup_name', label: 'Idea/Startup Name' },
    { id: 'leader_name', label: 'Leader Name' },
    { id: 'leader_phone', label: 'Leader Phone' },
    { id: 'leader_email', label: 'Leader Email' },
    { id: 'leader_college', label: 'College' },
    { id: 'category', label: 'Category' },
    { id: 'current_stage', label: 'Stage' },
    { id: 'member_2', label: 'Member 2' },
    { id: 'member_3', label: 'Member 3' },
    { id: 'member_4', label: 'Member 4' },
    { id: 'admin_status', label: 'Status' }
  ];

  const currentAvailableFields = activeTab === 'quick-leads' ? QUICK_LEADS_FIELDS : FULL_APPS_FIELDS;

  const toggleExportMenu = () => {
    if (!showExportMenu) {
      // Set default fields when opening
      const defaultFields = ['team_name', 'lead_name', 'leader_name', 'lead_phone', 'leader_phone', 'members_names', 'member_2', 'member_3', 'member_4'];
      const initialFields = currentAvailableFields.filter(f => defaultFields.includes(f.id)).map(f => f.id);
      setSelectedFields(initialFields);
    }
    setShowExportMenu(!showExportMenu);
  };

  const exportGateListCSV = () => {
    if (selectedFields.length === 0) {
      showToast('Please select at least one field', 'error');
      return;
    }

    let csvContent = "data:text/csv;charset=utf-8,";
    
    // Add Headers
    const selectedHeaders = currentAvailableFields
      .filter(f => selectedFields.includes(f.id))
      .map(f => f.label);
    csvContent += selectedHeaders.join(",") + "\r\n";
    
    if (activeTab === 'quick-leads') {
      filteredLeads.forEach(lead => {
        const row = selectedFields.map(field => {
          let val: any = '';
          switch (field) {
            case 'date': val = new Date(lead.created_at).toLocaleDateString(); break;
            case 'participant_type': val = lead.participant_type; break;
            case 'team_name': val = lead.team_name; break;
            case 'lead_name': val = lead.lead_name; break;
            case 'lead_phone': val = lead.lead_phone; break;
            case 'lead_email': val = lead.lead_email; break;
            case 'lead_college': val = lead.lead_college; break;
            case 'idea_category': val = lead.idea_category; break;
            case 'members_names': val = lead.members_names; break;
            case 'admin_status': val = lead.admin_status || 'pending'; break;
          }
          return `"${(val || '').toString().replace(/"/g, '""')}"`;
        });
        csvContent += row.join(",") + "\r\n";
      });
    } else {
      filteredApps.forEach(app => {
        const members = app.team_members || [];
        const leader = members.find((m: any) => m.is_leader);
        const others = members.filter((m: any) => !m.is_leader);
        
        const name = app.participant_type === 'student' ? app.idea_name : app.startup_name;
        
        const row = selectedFields.map(field => {
          let val: any = '';
          switch (field) {
            case 'date': val = new Date(app.created_at).toLocaleDateString(); break;
            case 'team_name': val = app.team_name; break;
            case 'idea_startup_name': val = name; break;
            case 'leader_name': val = leader?.full_name; break;
            case 'leader_phone': val = leader?.phone_number; break;
            case 'leader_email': val = leader?.email; break;
            case 'leader_college': val = leader?.institution; break;
            case 'category': val = app.category; break;
            case 'current_stage': val = app.current_stage; break;
            case 'member_2': val = others[0]?.full_name; break;
            case 'member_3': val = others[1]?.full_name; break;
            case 'member_4': val = others[2]?.full_name; break;
            case 'admin_status': val = app.admin_status || 'pending'; break;
          }
          return `"${(val || '').toString().replace(/"/g, '""')}"`;
        });
        csvContent += row.join(",") + "\r\n";
      });
    }
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `eureka-custom-list-${activeTab}-${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setShowExportMenu(false);
  };

  // --- Filtering ---
  const filteredLeads = useMemo(() => {
    if (!searchQuery) return leads;
    const q = searchQuery.toLowerCase();
    return leads.filter(l => 
      l.team_name?.toLowerCase().includes(q) ||
      l.lead_name?.toLowerCase().includes(q) ||
      l.lead_phone?.includes(q) ||
      l.idea_category?.toLowerCase().includes(q) ||
      l.lead_college?.toLowerCase().includes(q)
    );
  }, [leads, searchQuery]);

  const filteredApps = useMemo(() => {
    if (!searchQuery) return applications;
    const q = searchQuery.toLowerCase();
    return applications.filter(a => {
      const name = a.participant_type === 'student' ? a.idea_name : a.startup_name;
      const leader = a.team_members?.find((m: any) => m.is_leader)?.full_name || '';
      const leaderCollege = a.team_members?.find((m: any) => m.is_leader)?.institution || '';
      return a.team_name?.toLowerCase().includes(q) ||
             name?.toLowerCase().includes(q) ||
             a.category?.toLowerCase().includes(q) ||
             leader.toLowerCase().includes(q) ||
             leaderCollege.toLowerCase().includes(q);
    });
  }, [applications, searchQuery]);

  // ==========================================
  // DASHBOARD CALCULATIONS
  // ==========================================
  const currentData = activeTab === 'quick-leads' ? leads : applications;
  
  const totalNominations = currentData.length;
  
  const today = new Date().toISOString().split('T')[0];
  const newToday = currentData.filter(item => item.created_at?.startsWith(today)).length;
  
  const shortlistedCount = currentData.filter(item => item.admin_status === 'shortlisted').length;
  
  const withDocuments = activeTab === 'quick-leads' ? 0 : applications.filter(a => a.pitch_deck_url || (a.registration_proofs && a.registration_proofs.length > 0)).length;

  const pendingCount = currentData.filter(item => item.admin_status === 'pending' || !item.admin_status).length;
  
  const totalParticipants = activeTab === 'quick-leads' 
    ? leads.reduce((sum, lead) => {
        let memberCount = 0;
        if (lead.members_names) {
          const lower = lead.members_names.trim().toLowerCase();
          if (!['na', 'n/a', 'none', 'no', '-', 'nil', 'null'].includes(lower)) {
            const parts = lead.members_names.split(/,| and |&|\n/i);
            memberCount = parts.map((p: string) => p.trim()).filter((p: string) => p.length > 0 && !['na', 'none', '-'].includes(p.toLowerCase())).length;
          }
        }
        return sum + 1 + memberCount;
      }, 0)
    : applications.reduce((sum, app) => sum + (app.team_members?.length || 0), 0);
  
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
      const displayDate = d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
      const targetDateStr = d.toLocaleDateString('en-GB');
      
      const count = currentData.filter(item => {
        // Use submitted_at for full apps if available, otherwise fallback to created_at
        const dateString = activeTab === 'full-apps' ? (item.submitted_at || item.created_at) : item.created_at;
        if (!dateString) return false;
        
        // Exclude drafts for full apps trend
        if (activeTab === 'full-apps' && item.status && item.status !== 'SUBMITTED') return false;

        const itemDate = new Date(dateString);
        return itemDate.toLocaleDateString('en-GB') === targetDateStr;
      }).length;
      
      data.push({ date: displayDate, submissions: count });
    }
    return data;
  }, [currentData, activeTab]);

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
            <h1 className="text-2xl font-bold text-white mb-2 font-poppins">ECell <span className="text-[#FF1744]">MET</span></h1>
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
          <button
            onClick={() => { setActiveTab('feedback'); setSearchQuery(''); setSelectedLead(null); setSelectedApp(null); }}
            className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${
              activeTab === 'feedback' 
                ? 'bg-white/10 text-white shadow-sm border-b-2 border-[#00E5FF]' 
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Feedback
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
        
        {activeTab !== 'feedback' ? (
        <>
        {/* Bento Statistics Redesign */}
        
        {/* Top Row: 4 Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-[#111] border border-white/5 rounded-xl p-4 flex flex-col justify-between">
            <div className="text-[10px] text-gray-500 uppercase tracking-widest font-semibold mb-4">Total Nominations</div>
            <div>
              <div className="text-3xl font-bold text-[#FF1744] font-poppins tracking-wider leading-none mb-1">{totalNominations}</div>
              <div className="text-xs text-gray-500">all time</div>
            </div>
          </div>
          
          <div className="bg-[#111] border border-white/5 rounded-xl p-4 flex flex-col justify-between">
            <div className="text-[10px] text-gray-500 uppercase tracking-widest font-semibold mb-4">Today</div>
            <div>
              <div className="text-2xl font-bold text-white font-poppins tracking-wider leading-none mb-1">{newToday.toString().padStart(2, '0')}</div>
              <div className="text-xs text-gray-500">new today</div>
            </div>
          </div>
          
          <div className="bg-[#111] border border-white/5 rounded-xl p-4 flex flex-col justify-between">
            <div className="text-[10px] text-gray-500 uppercase tracking-widest font-semibold mb-4">Shortlisted</div>
            <div>
              <div className="text-2xl font-bold text-white font-poppins tracking-wider leading-none mb-1">{shortlistedCount.toString().padStart(2, '0')}</div>
              <div className="text-xs text-gray-500">{activeTab === 'quick-leads' ? 'leads' : 'teams'}</div>
            </div>
          </div>

          <div className="bg-[#111] border border-white/5 rounded-xl p-4 flex flex-col justify-between">
            <div className="text-[10px] text-gray-500 uppercase tracking-widest font-semibold mb-4">With Documents</div>
            <div>
              <div className="text-2xl font-bold text-white font-poppins tracking-wider leading-none mb-1">{withDocuments.toString().padStart(2, '0')}</div>
              <div className="text-xs text-gray-500">supporting files</div>
            </div>
          </div>
        </div>

        {/* Middle Row (Cards only now) */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
          <div className="md:col-span-4 bg-[#111] border border-white/5 rounded-xl p-4 flex flex-col justify-between">
            <div className="text-[10px] text-gray-500 uppercase tracking-widest font-semibold mb-4">Pending Review</div>
            <div>
              <div className="text-2xl font-bold text-white font-poppins tracking-wider leading-none mb-1">{pendingCount.toString().padStart(2, '0')}</div>
              <div className="text-xs text-gray-500">needs action</div>
            </div>
          </div>

          <div className="md:col-span-4 bg-[#111] border border-white/5 rounded-xl p-4 flex flex-col justify-between">
            <div className="text-[10px] text-gray-500 uppercase tracking-widest font-semibold mb-4">Deadline</div>
            <div>
              <div className="text-2xl font-bold text-white font-poppins tracking-wider leading-none mb-1">AUG 30</div>
              <div className="text-xs text-gray-500">{daysLeft} days left</div>
            </div>
          </div>

          <div className="md:col-span-4 bg-[#111] border border-white/5 rounded-xl p-4 flex flex-col justify-between">
            <div className="text-[10px] text-[#00E5FF] uppercase tracking-widest font-semibold mb-4">Total Participants</div>
            <div>
              <div className="text-3xl font-bold text-[#00E5FF] font-poppins tracking-wider leading-none mb-1">{totalParticipants}</div>
              <div className="text-xs text-gray-500">across all teams</div>
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
          <div className="relative">
            <button 
              onClick={toggleExportMenu}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium bg-[#00E5FF]/10 hover:bg-[#00E5FF]/20 text-[#00E5FF] border border-[#00E5FF]/30 rounded-xl transition-colors w-full sm:w-auto justify-center"
            >
              <Download size={16} />
              Gate List (CSV)
            </button>
            
            {showExportMenu && (
              <div className="absolute right-0 mt-2 w-64 bg-[#111] border border-white/10 rounded-xl shadow-2xl p-4 z-50">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-white font-medium text-sm">Select Export Fields</h3>
                  <button onClick={() => setShowExportMenu(false)} className="text-gray-400 hover:text-white">
                    <X size={16} />
                  </button>
                </div>
                <div className="space-y-2 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
                  {currentAvailableFields.map((field) => (
                    <label key={field.id} className="flex items-center gap-3 cursor-pointer group">
                      <div className="relative flex items-center">
                        <input
                          type="checkbox"
                          className="peer sr-only"
                          checked={selectedFields.includes(field.id)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedFields([...selectedFields, field.id]);
                            } else {
                              setSelectedFields(selectedFields.filter(f => f !== field.id));
                            }
                          }}
                        />
                        <div className="w-4 h-4 border border-white/20 rounded bg-white/5 peer-checked:bg-[#00E5FF] peer-checked:border-[#00E5FF] transition-all flex items-center justify-center">
                          <CheckCircle className="w-3 h-3 text-[#111] opacity-0 peer-checked:opacity-100 transition-opacity" />
                        </div>
                      </div>
                      <span className="text-sm text-gray-300 group-hover:text-white transition-colors select-none">
                        {field.label}
                      </span>
                    </label>
                  ))}
                </div>
                <button
                  onClick={exportGateListCSV}
                  className="w-full mt-4 bg-[#00E5FF] hover:bg-[#00B3CC] text-[#111] font-semibold py-2 rounded-lg transition-colors text-sm"
                >
                  Download Selected
                </button>
              </div>
            )}
          </div>
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
        </>
        ) : (
        /* ====== FEEDBACK TAB CONTENT ====== */
        <>
          {/* Feedback Summary Cards */}
          {(() => {
            const totalResponses = feedbackData.length;
            const avgOverall = totalResponses > 0 ? (feedbackData.reduce((s, f) => s + f.overall_experience, 0) / totalResponses) : 0;
            const avgOrg = totalResponses > 0 ? (feedbackData.reduce((s, f) => s + f.organization_rating, 0) / totalResponses) : 0;
            const defCount = feedbackData.filter(f => f.would_participate_again === 'definitely').length;
            const maybeCount = feedbackData.filter(f => f.would_participate_again === 'maybe').length;
            const noCount = feedbackData.filter(f => f.would_participate_again === 'probably_not').length;

            const emojiForRating = (r: number) => {
              if (r >= 4.5) return '😍';
              if (r >= 3.5) return '🙂';
              if (r >= 2.5) return '😐';
              if (r >= 1.5) return '🙁';
              return '😠';
            };

            // Best parts chart data
            const partsCount: Record<string, number> = {};
            feedbackData.forEach(f => {
              f.best_parts?.forEach(p => {
                partsCount[p] = (partsCount[p] || 0) + 1;
              });
            });
            const bestPartsChartData = Object.entries(partsCount)
              .map(([name, count]) => ({ name: name.replace(/^[^\s]+\s/, ''), fullName: name, count }))
              .sort((a, b) => b.count - a.count);

            const participateChartData = [
              { name: 'Definitely 🚀', value: defCount, color: '#22c55e' },
              { name: 'Maybe 🤔', value: maybeCount, color: '#eab308' },
              { name: 'Probably Not 😅', value: noCount, color: '#ef4444' },
            ].filter(d => d.value > 0);

            // Star distribution for organization
            const orgDistribution = [1, 2, 3, 4, 5].map(star => ({
              star: `${star}★`,
              count: feedbackData.filter(f => f.organization_rating === star).length
            }));

            // Filtered feedback for table
            const filteredFeedback = feedbackSearchQuery.trim()
              ? feedbackData.filter(f =>
                  (f.participant_name || '').toLowerCase().includes(feedbackSearchQuery.toLowerCase()) ||
                  (f.improvement_suggestion || '').toLowerCase().includes(feedbackSearchQuery.toLowerCase())
                )
              : feedbackData;

            return (
              <>
                {/* Top Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-[#111] border border-white/5 rounded-xl p-4 flex flex-col justify-between">
                    <div className="text-[10px] text-gray-500 uppercase tracking-widest font-semibold mb-4">Total Responses</div>
                    <div>
                      <div className="text-3xl font-bold text-[#00E5FF] font-poppins tracking-wider leading-none mb-1">{totalResponses}</div>
                      <div className="text-xs text-gray-500">feedback entries</div>
                    </div>
                  </div>
                  <div className="bg-[#111] border border-white/5 rounded-xl p-4 flex flex-col justify-between">
                    <div className="text-[10px] text-gray-500 uppercase tracking-widest font-semibold mb-4">Avg. Experience</div>
                    <div>
                      <div className="text-3xl font-bold text-white font-poppins tracking-wider leading-none mb-1">{avgOverall.toFixed(1)} {emojiForRating(avgOverall)}</div>
                      <div className="text-xs text-gray-500">out of 5</div>
                    </div>
                  </div>
                  <div className="bg-[#111] border border-white/5 rounded-xl p-4 flex flex-col justify-between">
                    <div className="text-[10px] text-gray-500 uppercase tracking-widest font-semibold mb-4">Avg. Organization</div>
                    <div>
                      <div className="text-3xl font-bold text-yellow-400 font-poppins tracking-wider leading-none mb-1">{avgOrg.toFixed(1)} ★</div>
                      <div className="text-xs text-gray-500">out of 5</div>
                    </div>
                  </div>
                  <div className="bg-[#111] border border-white/5 rounded-xl p-4 flex flex-col justify-between">
                    <div className="text-[10px] text-gray-500 uppercase tracking-widest font-semibold mb-4">Would Return</div>
                    <div>
                      <div className="text-3xl font-bold text-green-400 font-poppins tracking-wider leading-none mb-1">{totalResponses > 0 ? Math.round((defCount / totalResponses) * 100) : 0}%</div>
                      <div className="text-xs text-gray-500">said definitely</div>
                    </div>
                  </div>
                </div>

                {/* Charts Row */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                  {/* Best Parts Bar Chart */}
                  <div className="md:col-span-5 bg-[#111] border border-white/5 rounded-xl p-4">
                    <div className="text-[10px] text-gray-500 uppercase tracking-widest font-semibold mb-4">What Participants Enjoyed Most</div>
                    {bestPartsChartData.length > 0 ? (
                      <ResponsiveContainer width="100%" height={200}>
                        <BarChart data={bestPartsChartData} layout="vertical" margin={{ left: 10, right: 10 }}>
                          <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.03)' }} />
                          <Bar dataKey="count" radius={[0, 6, 6, 0]}>
                            {bestPartsChartData.map((_, index) => (
                              <Cell key={index} fill={['#1A6FF5', '#00E5FF', '#FF1744', '#22c55e', '#eab308', '#a855f7'][index % 6]} />
                            ))}
                          </Bar>
                        </BarChart>
                      </ResponsiveContainer>
                    ) : (
                      <div className="h-[200px] flex items-center justify-center text-gray-500 text-sm">No data yet</div>
                    )}
                  </div>

                  {/* Participate Again Pie Chart */}
                  <div className="md:col-span-3 bg-[#111] border border-white/5 rounded-xl p-4">
                    <div className="text-[10px] text-gray-500 uppercase tracking-widest font-semibold mb-4">Would Participate Again?</div>
                    {participateChartData.length > 0 ? (
                      <div>
                        <ResponsiveContainer width="100%" height={150}>
                          <PieChart>
                            <Pie
                              data={participateChartData}
                              cx="50%" cy="50%"
                              innerRadius={35} outerRadius={60}
                              dataKey="value"
                              stroke="none"
                            >
                              {participateChartData.map((entry, index) => (
                                <Cell key={index} fill={entry.color} />
                              ))}
                            </Pie>
                            <Tooltip />
                          </PieChart>
                        </ResponsiveContainer>
                        <div className="flex flex-wrap gap-2 mt-2 justify-center">
                          {participateChartData.map((d, i) => (
                            <div key={i} className="flex items-center gap-1.5 text-xs text-gray-400">
                              <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: d.color }} />
                              {d.name} ({d.value})
                            </div>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <div className="h-[150px] flex items-center justify-center text-gray-500 text-sm">No data yet</div>
                    )}
                  </div>

                  {/* Organization Star Distribution */}
                  <div className="md:col-span-4 bg-[#111] border border-white/5 rounded-xl p-4">
                    <div className="text-[10px] text-gray-500 uppercase tracking-widest font-semibold mb-4">Organization Rating Distribution</div>
                    <ResponsiveContainer width="100%" height={200}>
                      <BarChart data={orgDistribution}>
                        <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.03)' }} />
                        <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                          {orgDistribution.map((_, index) => (
                            <Cell key={index} fill={['#ef4444', '#f97316', '#eab308', '#84cc16', '#22c55e'][index]} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Feedback Table Toolbar */}
                <div className="flex flex-col sm:flex-row gap-4 justify-between items-center bg-white/5 p-2 rounded-2xl border border-white/10">
                  <div className="relative w-full sm:w-96">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                    <input
                      type="text"
                      placeholder="Search by name or suggestion..."
                      value={feedbackSearchQuery}
                      onChange={(e) => setFeedbackSearchQuery(e.target.value)}
                      className="w-full bg-transparent border-none py-2 pl-10 pr-4 text-sm text-white focus:outline-none focus:ring-1 focus:ring-white/20 rounded-xl transition-all"
                    />
                  </div>
                  <button
                    onClick={() => {
                      const headers = ['#', 'Name', 'Overall', 'Organization', 'Best Parts', 'Participate Again', 'Communication', 'Venue', 'Suggestion', 'Date'];
                      const rows = filteredFeedback.map((f, i) => [
                        i + 1,
                        f.participant_name || '-',
                        f.overall_experience,
                        f.organization_rating,
                        (f.best_parts || []).join('; '),
                        f.would_participate_again,
                        f.communication_rating || '-',
                        f.venue_rating || '-',
                        f.improvement_suggestion || '-',
                        new Date(f.created_at).toLocaleDateString()
                      ]);
                      const csv = [headers.join(','), ...rows.map(r => r.map(c => `"${c}"`).join(','))].join('\n');
                      const blob = new Blob([csv], { type: 'text/csv' });
                      const url = URL.createObjectURL(blob);
                      const link = document.createElement('a');
                      link.href = url;
                      link.setAttribute('download', `eureka-feedback-${new Date().toISOString().split('T')[0]}.csv`);
                      document.body.appendChild(link);
                      link.click();
                      link.remove();
                    }}
                    className="flex items-center gap-2 px-4 py-2 text-sm font-medium bg-white/10 hover:bg-white/20 text-white rounded-xl transition-colors w-full sm:w-auto justify-center"
                  >
                    <Download size={16} />
                    Export CSV
                  </button>
                </div>

                {/* Feedback Table */}
                <div className="flex-1 bg-white/5 border border-white/10 rounded-2xl overflow-hidden flex flex-col relative">
                  {isLoadingFeedback ? (
                    <div className="absolute inset-0 flex items-center justify-center bg-[#0A0A0A]/50 backdrop-blur-sm z-10">
                      <Loader2 className="w-8 h-8 text-[#00E5FF] animate-spin" />
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-sm text-gray-300">
                        <thead className="text-xs uppercase bg-white/5 text-gray-400 border-b border-white/10">
                          <tr>
                            <th className="px-4 py-4 font-semibold">#</th>
                            <th className="px-4 py-4 font-semibold">Name</th>
                            <th className="px-4 py-4 font-semibold">Overall</th>
                            <th className="px-4 py-4 font-semibold">Org.</th>
                            <th className="px-4 py-4 font-semibold">Best Parts</th>
                            <th className="px-4 py-4 font-semibold">Return?</th>
                            <th className="px-4 py-4 font-semibold">Suggestion</th>
                            <th className="px-4 py-4 font-semibold">Date</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                          {filteredFeedback.length === 0 ? (
                            <tr>
                              <td colSpan={8} className="px-6 py-16 text-center text-gray-500">
                                {feedbackSearchQuery ? 'No matching feedback found.' : 'No feedback received yet.'}
                              </td>
                            </tr>
                          ) : (
                            filteredFeedback.map((f, i) => {
                              const emojiMap: Record<number, string> = { 1: '😠', 2: '🙁', 3: '😐', 4: '🙂', 5: '😍' };
                              const returnMap: Record<string, { label: string; color: string }> = {
                                'definitely': { label: '🚀 Yes', color: 'text-green-400' },
                                'maybe': { label: '🤔 Maybe', color: 'text-yellow-400' },
                                'probably_not': { label: '😅 No', color: 'text-red-400' },
                              };
                              return (
                                <tr key={f.id} className="hover:bg-white/5 transition-colors">
                                  <td className="px-4 py-3 text-gray-500">{i + 1}</td>
                                  <td className="px-4 py-3 font-medium text-white">{f.participant_name || <span className="text-gray-500 italic">Anonymous</span>}</td>
                                  <td className="px-4 py-3 text-xl">{emojiMap[f.overall_experience] || f.overall_experience}</td>
                                  <td className="px-4 py-3 text-yellow-400">{'★'.repeat(f.organization_rating)}{'☆'.repeat(5 - f.organization_rating)}</td>
                                  <td className="px-4 py-3 max-w-[200px]">
                                    <div className="flex flex-wrap gap-1">
                                      {(f.best_parts || []).map((p, j) => (
                                        <span key={j} className="text-xs bg-[#1A6FF5]/15 text-[#1A6FF5] px-1.5 py-0.5 rounded-md">{p.replace(/^[^\s]+\s/, '')}</span>
                                      ))}
                                    </div>
                                  </td>
                                  <td className={`px-4 py-3 font-medium ${returnMap[f.would_participate_again]?.color || 'text-gray-400'}`}>
                                    {returnMap[f.would_participate_again]?.label || f.would_participate_again}
                                  </td>
                                  <td className="px-4 py-3 max-w-[200px] truncate text-gray-400">{f.improvement_suggestion || '-'}</td>
                                  <td className="px-4 py-3 whitespace-nowrap text-gray-500">{new Date(f.created_at).toLocaleDateString()}</td>
                                </tr>
                              );
                            })
                          )}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </>
            );
          })()}
        </>
        )}
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
                <div className="flex-1">
                  <div className="text-xs text-gray-500 uppercase tracking-wider mb-1">Eureka Reg ID</div>
                  <div className="bg-white/5 border border-white/10 rounded-lg p-2.5 text-sm text-gray-300 font-mono">
                    {selectedApp.eureka_registration_id || 'N/A'}
                  </div>
                </div>
              </div>

              {/* Timestamp & Codes */}
              <div className="flex flex-col sm:flex-row justify-between gap-4">
                <div className="flex-1">
                  <div className="text-xs text-gray-500 uppercase tracking-wider mb-1">Reference Code</div>
                  <div className="bg-white/5 border border-white/10 rounded-lg p-2.5 text-sm text-gray-300 font-mono">
                    {selectedApp.reference_code || 'N/A'}
                  </div>
                </div>
                <div className="flex-1">
                  <div className="text-xs text-gray-500 uppercase tracking-wider mb-1">Submission Date</div>
                  <div className="bg-white/5 border border-white/10 rounded-lg p-2.5 text-sm text-gray-300">
                    {selectedApp.submitted_at ? new Date(selectedApp.submitted_at).toLocaleString() : 'Not Submitted'}
                  </div>
                </div>
                <div className="flex-1">
                  <div className="text-xs text-gray-500 uppercase tracking-wider mb-1">Reg. Link Clicked</div>
                  <div className={`border rounded-lg p-2.5 text-sm font-mono ${selectedApp.eureka_link_clicked ? 'bg-green-500/10 border-green-500/30 text-green-400' : 'bg-red-500/10 border-red-500/30 text-red-400'}`}>
                    {selectedApp.eureka_link_clicked ? 'Yes' : 'No'}
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
                  {selectedApp.team_members?.sort((a:any, b:any) => (a.member_order as number) - (b.member_order as number)).map((member: any) => (
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

