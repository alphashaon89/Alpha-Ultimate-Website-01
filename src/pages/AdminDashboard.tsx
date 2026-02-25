import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard, Image, FileText, LogOut, Bot,
  Calendar, Users, DollarSign, CheckCircle,
  Clock, AlertCircle, BarChart2, Star,
  Settings, Menu, X, ChevronRight,
  Bell, Eye, Phone, MapPin,
  Package, Activity, Globe, Shield, Zap,
  Edit3, Plus, Download,
  ArrowUpRight, ArrowDownRight, Sparkles, Home,
  Wrench, Camera, Monitor, Hash, TrendingUp
} from 'lucide-react';
import FileUpload from '../components/FileUpload';
import ContentEditor from '../components/ContentEditor';
import { Search } from 'lucide-react';

// Types
type TabId = 'overview' | 'bookings' | 'analytics' | 'media' | 'content' | 'yusra' | 'settings';

interface NavItem { id: TabId; label: string; icon: React.ElementType; badge?: number; }

interface Booking {
  id: string; name: string; service: string; date: string; time: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  amount: string; phone: string; address: string;
}

// Mock data
const MOCK_BOOKINGS: Booking[] = [
  { id: 'ALF-001', name: 'Mohammed Al-Rashidi', service: 'Full Home Deep Clean', date: '2025-02-24', time: '09:00', status: 'confirmed', amount: 'SAR 650', phone: '+966 55 123 4567', address: 'Al Malqa, Riyadh' },
  { id: 'ALF-002', name: 'Fatima Al-Zahrani', service: 'Post-Construction', date: '2025-02-24', time: '14:00', status: 'pending', amount: 'SAR 900', phone: '+966 50 987 6543', address: 'Al Olaya, Riyadh' },
  { id: 'ALF-003', name: 'Abdullah Hassan', service: 'Move-In / Move-Out', date: '2025-02-25', time: '10:00', status: 'completed', amount: 'SAR 750', phone: '+966 54 456 7890', address: 'Al Nakheel, Riyadh' },
  { id: 'ALF-004', name: 'Sara Al-Mutairi', service: 'Full Home Deep Clean', date: '2025-02-25', time: '13:00', status: 'confirmed', amount: 'SAR 500', phone: '+966 56 321 0987', address: 'Al Yarmouk, Riyadh' },
  { id: 'ALF-005', name: 'Khalid Al-Dawsari', service: 'Post-Construction', date: '2025-02-26', time: '08:00', status: 'pending', amount: 'SAR 1200', phone: '+966 58 654 3210', address: 'Diplomatic Quarter, Riyadh' },
  { id: 'ALF-006', name: 'Nora Al-Harbi', service: 'Move-In / Move-Out', date: '2025-02-26', time: '11:00', status: 'cancelled', amount: 'SAR 600', phone: '+966 59 789 0123', address: 'Al Hamra, Riyadh' },
  { id: 'ALF-007', name: 'Omar Al-Shammari', service: 'Full Home Deep Clean', date: '2025-02-27', time: '09:30', status: 'confirmed', amount: 'SAR 480', phone: '+966 55 234 5678', address: 'King Fahd District, Riyadh' },
  { id: 'ALF-008', name: 'Reem Al-Qahtani', service: 'Post-Construction', date: '2025-02-28', time: '10:00', status: 'pending', amount: 'SAR 1050', phone: '+966 50 876 5432', address: 'Al Wadi, Riyadh' },
];

const WEEK_DATA = [
  { day: 'Sat', bookings: 5, revenue: 3200 },
  { day: 'Sun', bookings: 8, revenue: 5800 },
  { day: 'Mon', bookings: 6, revenue: 4100 },
  { day: 'Tue', bookings: 9, revenue: 6500 },
  { day: 'Wed', bookings: 4, revenue: 2900 },
  { day: 'Thu', bookings: 11, revenue: 7800 },
  { day: 'Fri', bookings: 3, revenue: 2100 },
];

const SERVICE_DIST = [
  { label: 'Full Home Deep Clean', pct: 42, color: '#2dd4bf' },
  { label: 'Post-Construction', pct: 31, color: '#06b6d4' },
  { label: 'Move-In / Move-Out', pct: 27, color: '#0891b2' },
];

// Status badge
function StatusBadge({ status }: { status: Booking['status'] }) {
  const map: Record<Booking['status'], string> = {
    pending:   'bg-amber-400/10 text-amber-400 border-amber-400/20',
    confirmed: 'bg-teal-400/10 text-teal-400 border-teal-400/20',
    completed: 'bg-emerald-400/10 text-emerald-400 border-emerald-400/20',
    cancelled: 'bg-red-400/10 text-red-400 border-red-400/20',
  };
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${map[status]}`}>
      <span className="w-1.5 h-1.5 rounded-full bg-current" />
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
}

// ── Overview Tab ─────────────────────────────────────────────────
function OverviewTab({ setActiveTab }: { setActiveTab: (t: TabId) => void }) {
  const stats = [
    { label: 'Revenue (Month)', value: 'SAR 48,250', change: '+18.4%', positive: true, icon: DollarSign, color: '#2dd4bf' },
    { label: 'Bookings (Month)',  value: '87',         change: '+12.7%', positive: true, icon: Calendar,   color: '#06b6d4' },
    { label: 'Active Clients',   value: '214',         change: '+5.2%',  positive: true, icon: Users,      color: '#0891b2' },
    { label: 'Avg. Rating',      value: '4.93 ★',     change: '+0.08',  positive: true, icon: Star,       color: '#f59e0b' },
  ];

  const pending = MOCK_BOOKINGS.filter(b => b.status === 'pending');
  const maxRev  = Math.max(...WEEK_DATA.map(d => d.revenue));

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {stats.map((s, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}
            className="bg-[#141414] border border-gray-800 rounded-2xl p-5 hover:border-teal-500/30 transition-all">
            <div className="flex items-start justify-between mb-4">
              <div className="w-11 h-11 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${s.color}15` }}>
                <s.icon size={20} style={{ color: s.color }} />
              </div>
              <span className={`flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-full ${s.positive ? 'text-emerald-400 bg-emerald-400/10' : 'text-red-400 bg-red-400/10'}`}>
                {s.positive ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />} {s.change}
              </span>
            </div>
            <div className="text-2xl font-bold text-white mb-1">{s.value}</div>
            <div className="text-sm text-gray-500">{s.label}</div>
          </motion.div>
        ))}
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Revenue bar chart */}
        <div className="xl:col-span-2 bg-[#141414] border border-gray-800 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-6 flex-wrap gap-2">
            <div>
              <h3 className="font-bold text-white text-lg">Weekly Revenue</h3>
              <p className="text-gray-500 text-sm">Last 7 days</p>
            </div>
            <span className="text-xs text-teal-400 bg-teal-400/10 border border-teal-400/20 px-3 py-1 rounded-full font-semibold">SAR 32,400 total</span>
          </div>
          <div className="flex items-end gap-2 sm:gap-3 h-36">
            {WEEK_DATA.map((d, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-2">
                <div className="w-full relative group cursor-pointer" style={{ height: '120px' }}>
                  <div
                    className="absolute bottom-0 w-full rounded-t-lg bg-gradient-to-t from-teal-700 to-teal-400 transition-all duration-500 hover:to-teal-300"
                    style={{ height: `${(d.revenue / maxRev) * 100}%`, minHeight: '8px' }}
                  />
                  <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-900 text-teal-400 text-xs px-2 py-1 rounded font-bold opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-10">
                    SAR {d.revenue.toLocaleString()}
                  </div>
                </div>
                <span className="text-xs text-gray-500">{d.day}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Service split */}
        <div className="bg-[#141414] border border-gray-800 rounded-2xl p-6">
          <h3 className="font-bold text-white text-lg mb-1">Service Split</h3>
          <p className="text-gray-500 text-sm mb-6">This month</p>
          <div className="space-y-4">
            {SERVICE_DIST.map((s, i) => (
              <div key={i}>
                <div className="flex justify-between text-sm mb-1.5">
                  <span className="text-gray-300 truncate pr-2 text-xs sm:text-sm">{s.label}</span>
                  <span className="font-bold text-white shrink-0">{s.pct}%</span>
                </div>
                <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }} animate={{ width: `${s.pct}%` }} transition={{ duration: 0.8, delay: i * 0.15 }}
                    className="h-full rounded-full" style={{ backgroundColor: s.color }}
                  />
                </div>
              </div>
            ))}
          </div>
          <div className="mt-6 pt-4 border-t border-gray-800 flex justify-between text-sm">
            <span className="text-gray-500">Total bookings</span>
            <span className="font-bold text-white">87</span>
          </div>
        </div>
      </div>

      {/* Pending */}
      <div className="bg-[#141414] border border-gray-800 rounded-2xl p-6">
        <div className="flex items-center justify-between mb-5 flex-wrap gap-2">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-amber-400/10 rounded-lg flex items-center justify-center">
              <Clock size={16} className="text-amber-400" />
            </div>
            <div>
              <h3 className="font-bold text-white">Pending Approvals</h3>
              <p className="text-gray-500 text-sm">{pending.length} need attention</p>
            </div>
          </div>
          <button onClick={() => setActiveTab('bookings')} className="text-xs text-teal-400 hover:text-teal-300 flex items-center gap-1 transition-colors">
            View all <ChevronRight size={14} />
          </button>
        </div>
        <div className="space-y-3">
          {pending.map(b => (
            <div key={b.id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 glass rounded-xl border border-gray-800 hover:border-amber-400/20 transition-all">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-9 h-9 bg-teal-500/10 rounded-full flex items-center justify-center shrink-0">
                  <span className="text-teal-400 font-bold text-sm">{b.name.charAt(0)}</span>
                </div>
                <div className="min-w-0">
                  <p className="font-semibold text-white text-sm truncate">{b.name}</p>
                  <p className="text-gray-500 text-xs truncate">{b.service} · {b.date} at {b.time}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <span className="text-white font-bold text-sm">{b.amount}</span>
                <StatusBadge status={b.status} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'Bookings', icon: Plus, tab: 'bookings' as TabId, color: '#2dd4bf' },
          { label: 'Edit Content', icon: Edit3, tab: 'content' as TabId, color: '#06b6d4' },
          { label: 'Upload Media', icon: Camera, tab: 'media' as TabId, color: '#0891b2' },
          { label: 'Settings', icon: Settings, tab: 'settings' as TabId, color: '#6366f1' },
        ].map((a, i) => (
          <button key={i} onClick={() => setActiveTab(a.tab)}
            className="flex flex-col items-center gap-2 p-4 bg-[#141414] border border-gray-800 rounded-2xl hover:border-teal-500/30 transition-all group">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center transition-all group-hover:scale-110" style={{ backgroundColor: `${a.color}15` }}>
              <a.icon size={18} style={{ color: a.color }} />
            </div>
            <span className="text-xs text-gray-400 group-hover:text-white transition-colors font-medium">{a.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

// ── Bookings Tab ─────────────────────────────────────────────────
function BookingsTab() {
  const [filter, setFilter] = useState<'all' | Booking['status']>('all');
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<Booking | null>(null);

  const filtered = MOCK_BOOKINGS.filter(b => {
    const mf = filter === 'all' || b.status === filter;
    const ms = b.name.toLowerCase().includes(search.toLowerCase()) ||
               b.service.toLowerCase().includes(search.toLowerCase()) ||
               b.id.toLowerCase().includes(search.toLowerCase());
    return mf && ms;
  });

  const counts: Record<string, number> = {
    all: MOCK_BOOKINGS.length,
    pending:   MOCK_BOOKINGS.filter(b => b.status === 'pending').length,
    confirmed: MOCK_BOOKINGS.filter(b => b.status === 'confirmed').length,
    completed: MOCK_BOOKINGS.filter(b => b.status === 'completed').length,
    cancelled: MOCK_BOOKINGS.filter(b => b.status === 'cancelled').length,
  };

  return (
    <div className="space-y-5">
      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
          <input type="text" placeholder="Search bookings..." value={search} onChange={e => setSearch(e.target.value)}
            className="w-full bg-[#141414] border border-gray-800 rounded-xl pl-9 pr-4 py-2.5 text-sm text-gray-300 placeholder-gray-600 focus:outline-none focus:border-teal-500/50 transition-all" />
        </div>
        <div className="flex gap-2 flex-wrap">
          {(['all','pending','confirmed','completed','cancelled'] as const).map(f => (
            <button key={f} onClick={() => setFilter(f)}
              className={`px-3 py-2 rounded-xl text-xs font-semibold transition-all whitespace-nowrap ${filter === f ? 'bg-teal-500 text-black' : 'bg-[#141414] border border-gray-800 text-gray-400 hover:border-teal-500/30'}`}>
              {f.charAt(0).toUpperCase() + f.slice(1)} ({counts[f]})
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="bg-[#141414] border border-gray-800 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[680px]">
            <thead>
              <tr className="border-b border-gray-800">
                {['Booking ID','Client','Service','Date / Time','Amount','Status',''].map(h => (
                  <th key={h} className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-5 py-3.5">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800/40">
              {filtered.length === 0 ? (
                <tr><td colSpan={7} className="text-center py-12 text-gray-500 text-sm">No bookings found.</td></tr>
              ) : filtered.map(b => (
                <tr key={b.id} className="hover:bg-white/[0.02] transition-colors group">
                  <td className="px-5 py-4 text-xs font-mono text-teal-400">{b.id}</td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-teal-500/10 rounded-full flex items-center justify-center shrink-0">
                        <span className="text-teal-400 font-bold text-xs">{b.name.charAt(0)}</span>
                      </div>
                      <span className="text-sm text-white font-medium whitespace-nowrap">{b.name}</span>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-sm text-gray-400 whitespace-nowrap">{b.service}</td>
                  <td className="px-5 py-4 text-sm text-gray-400 whitespace-nowrap">{b.date} · {b.time}</td>
                  <td className="px-5 py-4 text-sm font-bold text-white whitespace-nowrap">{b.amount}</td>
                  <td className="px-5 py-4"><StatusBadge status={b.status} /></td>
                  <td className="px-5 py-4">
                    <button onClick={() => setSelected(b)}
                      className="opacity-0 group-hover:opacity-100 text-xs text-teal-400 hover:text-teal-300 transition-all flex items-center gap-1 whitespace-nowrap">
                      <Eye size={13} /> View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="px-5 py-3 border-t border-gray-800 flex flex-wrap items-center justify-between gap-2 text-xs text-gray-500">
          <span>Showing {filtered.length} of {MOCK_BOOKINGS.length} bookings</span>
          <span className="text-teal-400/60">Demo data — connect a database for live bookings</span>
        </div>
      </div>

      {/* Detail modal */}
      <AnimatePresence>
        {selected && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-4"
            onClick={() => setSelected(null)}>
            <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 40 }}
              className="bg-[#141414] border border-gray-800 rounded-2xl p-6 w-full max-w-md" onClick={e => e.stopPropagation()}>
              <div className="flex items-center justify-between mb-5">
                <h3 className="font-bold text-white text-lg">Booking Details</h3>
                <button onClick={() => setSelected(null)} className="p-1.5 rounded-lg hover:bg-gray-800 text-gray-400 transition-colors"><X size={18} /></button>
              </div>
              <div className="space-y-2.5">
                {[
                  { icon: Hash, label: 'ID', value: selected.id },
                  { icon: Users, label: 'Client', value: selected.name },
                  { icon: Package, label: 'Service', value: selected.service },
                  { icon: Calendar, label: 'Date & Time', value: `${selected.date} at ${selected.time}` },
                  { icon: DollarSign, label: 'Amount', value: selected.amount },
                  { icon: Phone, label: 'Phone', value: selected.phone },
                  { icon: MapPin, label: 'Address', value: selected.address },
                ].map(({ icon: Icon, label, value }) => (
                  <div key={label} className="flex items-start gap-3 p-3 glass rounded-xl">
                    <Icon size={15} className="text-teal-400 mt-0.5 shrink-0" />
                    <div className="min-w-0">
                      <p className="text-xs text-gray-500">{label}</p>
                      <p className="text-sm text-white font-medium break-words">{value}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex gap-2 mt-5">
                <button className="flex-1 bg-teal-500 text-black font-bold py-2.5 rounded-xl hover:bg-teal-400 transition-colors text-sm">Confirm</button>
                <button className="flex-1 bg-red-500/10 border border-red-500/20 text-red-400 font-bold py-2.5 rounded-xl hover:bg-red-500/20 transition-colors text-sm">Cancel</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ── Analytics Tab ─────────────────────────────────────────────────
function AnalyticsTab() {
  const maxB = Math.max(...WEEK_DATA.map(d => d.bookings));
  const kpis = [
    { label: 'Conversion Rate',    value: '68%',      icon: TrendingUp, color: '#2dd4bf' },
    { label: 'Avg. Booking Value', value: 'SAR 555',  icon: DollarSign, color: '#f59e0b' },
    { label: 'Repeat Clients',     value: '41%',      icon: Users,      color: '#06b6d4' },
    { label: 'Avg. Response Time', value: '< 2 hrs',  icon: Clock,      color: '#8b5cf6' },
  ];
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((k, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}
            className="bg-[#141414] border border-gray-800 rounded-2xl p-4">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center mb-3" style={{ backgroundColor: `${k.color}15` }}>
              <k.icon size={17} style={{ color: k.color }} />
            </div>
            <div className="text-xl sm:text-2xl font-bold text-white">{k.value}</div>
            <div className="text-xs text-gray-500 mt-0.5">{k.label}</div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Daily bookings */}
        <div className="bg-[#141414] border border-gray-800 rounded-2xl p-6">
          <h3 className="font-bold text-white mb-1">Daily Bookings</h3>
          <p className="text-gray-500 text-sm mb-5">Count per weekday</p>
          <div className="flex items-end gap-2 sm:gap-3 h-36">
            {WEEK_DATA.map((d, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-2">
                <span className="text-xs text-gray-500">{d.bookings}</span>
                <div className="w-full relative" style={{ height: '100px' }}>
                  <div className="absolute bottom-0 w-full rounded-t-lg bg-gradient-to-t from-cyan-700 to-cyan-400 hover:to-cyan-300 transition-all"
                    style={{ height: `${(d.bookings / maxB) * 100}%`, minHeight: '6px' }} />
                </div>
                <span className="text-xs text-gray-500">{d.day}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Top services */}
        <div className="bg-[#141414] border border-gray-800 rounded-2xl p-6">
          <h3 className="font-bold text-white mb-1">Top Services</h3>
          <p className="text-gray-500 text-sm mb-5">By revenue</p>
          <div className="space-y-4">
            {[
              { name: 'Full Home Deep Clean', revenue: 'SAR 20,300', pct: 42, color: '#2dd4bf' },
              { name: 'Post-Construction',    revenue: 'SAR 17,850', pct: 37, color: '#06b6d4' },
              { name: 'Move-In / Move-Out',   revenue: 'SAR 10,100', pct: 21, color: '#0891b2' },
            ].map((s, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="w-2 h-10 rounded-full shrink-0" style={{ backgroundColor: s.color }} />
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-300 truncate pr-2 text-xs sm:text-sm">{s.name}</span>
                    <span className="font-bold text-white shrink-0 text-xs sm:text-sm">{s.revenue}</span>
                  </div>
                  <div className="h-1.5 bg-gray-800 rounded-full overflow-hidden">
                    <motion.div initial={{ width: 0 }} animate={{ width: `${s.pct}%` }} transition={{ duration: 0.8, delay: i * 0.15 }}
                      className="h-full rounded-full" style={{ backgroundColor: s.color }} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Activity feed */}
      <div className="bg-[#141414] border border-gray-800 rounded-2xl p-6">
        <h3 className="font-bold text-white mb-5">Recent Activity</h3>
        <div className="space-y-4">
          {[
            { action: 'New booking received',  detail: 'Reem Al-Qahtani — Post-Construction',              time: '5 min ago',  icon: Calendar,      color: '#2dd4bf' },
            { action: 'Booking confirmed',     detail: 'Mohammed Al-Rashidi — Full Home Deep Clean',       time: '23 min ago', icon: CheckCircle,   color: '#10b981' },
            { action: 'Booking completed',     detail: 'Abdullah Hassan — Move-In / Move-Out',             time: '1 hr ago',   icon: CheckCircle,   color: '#10b981' },
            { action: 'Booking cancelled',     detail: 'Nora Al-Harbi — Move-In / Move-Out',               time: '2 hr ago',   icon: AlertCircle,   color: '#ef4444' },
            { action: 'New client registered', detail: 'Khalid Al-Dawsari via website',                    time: '3 hr ago',   icon: Users,         color: '#06b6d4' },
          ].map((a, i) => (
            <div key={i} className="flex items-start gap-4">
              <div className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0 mt-0.5" style={{ backgroundColor: `${a.color}15` }}>
                <a.icon size={15} style={{ color: a.color }} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-white font-medium">{a.action}</p>
                <p className="text-xs text-gray-500 truncate">{a.detail}</p>
              </div>
              <span className="text-xs text-gray-600 whitespace-nowrap shrink-0">{a.time}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Media Tab ─────────────────────────────────────────────────────
function MediaTab() {
  const [activeMedia, setActiveMedia] = useState<'logo'|'gallery'|'yusra'|'promo'>('logo');

  const opts = [
    { id: 'logo'    as const, label: 'Site Logo',       icon: Home,     desc: 'PNG/SVG 200×200px',             endpoint: '/api/admin/upload/logo' },
    { id: 'gallery' as const, label: 'Gallery Media',   icon: Camera,   desc: 'JPG/PNG/MP4 up to 10 MB',      endpoint: '/api/admin/upload/graphics' },
    { id: 'yusra'   as const, label: 'Yusra Avatar',    icon: Bot,      desc: 'PNG with transparency',         endpoint: '/api/admin/upload/yusra-icon' },
    { id: 'promo'   as const, label: 'Promotional',     icon: Sparkles, desc: 'Banners, hero graphics',        endpoint: '/api/admin/upload/graphics' },
  ];
  const active = opts.find(o => o.id === activeMedia)!;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {opts.map(o => (
          <button key={o.id} onClick={() => setActiveMedia(o.id)}
            className={`flex flex-col items-center gap-2 p-4 rounded-2xl border transition-all ${activeMedia === o.id ? 'border-teal-500 bg-teal-500/10 text-teal-400' : 'border-gray-800 bg-[#141414] text-gray-500 hover:border-teal-500/30'}`}>
            <o.icon size={22} />
            <span className="text-xs font-semibold text-center">{o.label}</span>
          </button>
        ))}
      </div>

      <div className="bg-[#141414] border border-gray-800 rounded-2xl p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-teal-500/10 rounded-xl flex items-center justify-center">
            <active.icon size={18} className="text-teal-400" />
          </div>
          <div>
            <h3 className="font-bold text-white">{active.label}</h3>
            <p className="text-gray-500 text-sm">{active.desc}</p>
          </div>
        </div>
        <FileUpload endpoint={active.endpoint} />
      </div>

      <div className="bg-[#141414] border border-gray-800 rounded-2xl p-6">
        <h3 className="font-bold text-white mb-4">Current Assets</h3>
        <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-3">
          {['before-1.png','before-2.png','after-1.png','after-2.png','gallery-kitchen-1.png','gallery-whole-home-1.png'].map(f => (
            <div key={f} className="glass border border-gray-800 rounded-xl p-3 flex flex-col items-center gap-2 hover:border-teal-500/30 transition-all">
              <div className="w-full aspect-square bg-gray-800 rounded-lg flex items-center justify-center text-gray-600">
                <Image size={18} />
              </div>
              <span className="text-xs text-gray-500 text-center truncate w-full">{f}</span>
            </div>
          ))}
        </div>
        <p className="text-xs text-gray-600 mt-4 text-center">Assets served from <code className="text-teal-500/60">/public/assets/</code></p>
      </div>
    </div>
  );
}

// ── Yusra Tab ─────────────────────────────────────────────────────
function YusraTab() {
  return (
    <div className="space-y-6 max-w-2xl">
      <div className="bg-[#141414] border border-teal-500/20 rounded-2xl p-6">
        <div className="flex flex-wrap items-center gap-4 mb-5">
          <div className="w-14 h-14 bg-teal-500/10 rounded-2xl flex items-center justify-center">
            <Bot size={28} className="text-teal-400" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-white text-xl">Yusra AI Assistant</h3>
            <p className="text-teal-400 text-sm">Powered by Google Gemini</p>
          </div>
          <span className="flex items-center gap-1.5 text-xs text-emerald-400 bg-emerald-400/10 border border-emerald-400/20 px-3 py-1 rounded-full font-semibold shrink-0">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" /> Active
          </span>
        </div>
        <p className="text-gray-400 text-sm leading-relaxed">
          Yusra is Alpha Ultimate's multilingual AI assistant, fluent in English, Arabic, and Bangla. She handles customer inquiries about pricing, bookings, and services — providing instant responses 24/7.
        </p>
      </div>

      <div className="bg-[#141414] border border-gray-800 rounded-2xl p-6">
        <h3 className="font-bold text-white mb-4 flex items-center gap-2"><Sparkles size={16} className="text-teal-400" /> Capabilities</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {['Pricing enquiries','Booking assistance','Service explanations','EN / AR / BN support','Voice mode (TTS)','Quick-reply suggestions','Business hours awareness','WhatsApp handoff'].map((c, i) => (
            <div key={i} className="flex items-center gap-2.5 p-3 glass rounded-xl">
              <CheckCircle size={14} className="text-teal-400 shrink-0" />
              <span className="text-sm text-gray-300">{c}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-[#141414] border border-gray-800 rounded-2xl p-6">
        <h3 className="font-bold text-white mb-2 flex items-center gap-2"><Zap size={16} className="text-teal-400" /> Upload Avatar</h3>
        <p className="text-gray-500 text-sm mb-5">Replace Yusra's avatar (PNG with transparency recommended).</p>
        <FileUpload endpoint="/api/admin/upload/yusra-icon" />
      </div>
    </div>
  );
}

// ── Settings Tab ──────────────────────────────────────────────────
function SettingsTab() {
  const [saved, setSaved] = useState(false);
  const handleSave = () => { setSaved(true); setTimeout(() => setSaved(false), 2500); };

  return (
    <div className="space-y-6 max-w-2xl">
      {/* Business info */}
      <div className="bg-[#141414] border border-gray-800 rounded-2xl p-6">
        <h3 className="font-bold text-white text-lg mb-5 flex items-center gap-2"><Wrench size={18} className="text-teal-400" /> Business Settings</h3>
        <div className="space-y-4">
          {[
            { label: 'Business Name',    value: 'Alpha Ultimate Cleaning', type: 'text' },
            { label: 'WhatsApp Number',  value: '+966 56 3906822',          type: 'text' },
            { label: 'Contact Email',    value: 'info@alpha-ultimate.com',  type: 'email' },
            { label: 'City / Region',    value: 'Riyadh, Saudi Arabia',    type: 'text' },
          ].map(f => (
            <div key={f.label}>
              <label className="block text-sm font-medium text-gray-400 mb-1.5">{f.label}</label>
              <input type={f.type} defaultValue={f.value}
                className="w-full glass border border-gray-800 rounded-xl px-4 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-teal-500/50 focus:ring-1 focus:ring-teal-500/20 transition-all" />
            </div>
          ))}
        </div>
      </div>

      {/* Notifications */}
      <div className="bg-[#141414] border border-gray-800 rounded-2xl p-6">
        <h3 className="font-bold text-white text-lg mb-5 flex items-center gap-2"><Bell size={18} className="text-teal-400" /> Notifications</h3>
        <div className="space-y-5">
          {[
            { label: 'Email on new booking',  desc: 'Get emailed when a new booking is submitted' },
            { label: 'WhatsApp alerts',        desc: 'Receive WhatsApp messages for pending bookings' },
            { label: 'Daily summary report',   desc: 'Receive a daily summary of bookings and revenue' },
          ].map((n, i) => (
            <div key={i} className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm text-white font-medium">{n.label}</p>
                <p className="text-xs text-gray-500">{n.desc}</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer shrink-0">
                <input type="checkbox" defaultChecked={i < 2} className="sr-only peer" />
                <div className="w-10 h-5 bg-gray-700 rounded-full peer peer-checked:bg-teal-500 transition-colors" />
                <div className="absolute left-0.5 top-0.5 w-4 h-4 bg-white rounded-full transition-all peer-checked:translate-x-5 shadow-sm" />
              </label>
            </div>
          ))}
        </div>
      </div>

      {/* Security */}
      <div className="bg-[#141414] border border-gray-800 rounded-2xl p-6">
        <h3 className="font-bold text-white text-lg mb-5 flex items-center gap-2"><Shield size={18} className="text-teal-400" /> Security</h3>
        <div className="space-y-4">
          {['Current Password','New Password'].map(l => (
            <div key={l}>
              <label className="block text-sm font-medium text-gray-400 mb-1.5">{l}</label>
              <input type="password" placeholder="••••••••"
                className="w-full glass border border-gray-800 rounded-xl px-4 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-teal-500/50 focus:ring-1 focus:ring-teal-500/20 transition-all" />
            </div>
          ))}
        </div>
        <p className="text-xs text-amber-400/70 mt-3 flex items-center gap-1.5">
          <AlertCircle size={12} /> Password changes require updating the <code className="font-mono">ADMIN_PASSWORD</code> env var in Vercel.
        </p>
      </div>

      {/* Deployment */}
      <div className="bg-[#141414] border border-gray-800 rounded-2xl p-6">
        <h3 className="font-bold text-white text-lg mb-4 flex items-center gap-2"><Globe size={18} className="text-teal-400" /> Deployment Info</h3>
        <div className="space-y-2 text-sm">
          {[
            { k: 'Platform',   v: 'Vercel Serverless' },
            { k: 'Framework',  v: 'React + Vite' },
            { k: 'Auth',       v: 'JWT (8-hour session)' },
            { k: 'Database',   v: 'Not configured — add Vercel KV or Supabase for persistence' },
          ].map(({ k, v }) => (
            <div key={k} className="flex gap-3">
              <span className="text-gray-500 w-24 shrink-0">{k}</span>
              <span className="text-gray-300 break-words">{v}</span>
            </div>
          ))}
        </div>
      </div>

      <button onClick={handleSave}
        className={`w-full py-3 rounded-xl font-bold transition-all duration-300 text-sm ${saved ? 'bg-emerald-500 text-white' : 'bg-teal-500 text-black hover:bg-teal-400 shadow-[0_0_20px_rgba(45,212,191,0.3)]'}`}>
        {saved ? '✓ Settings Saved!' : 'Save Settings'}
      </button>
    </div>
  );
}

// ── Main ──────────────────────────────────────────────────────────
export default function AdminDashboard() {
  const [activeTab, setActiveTab]   = useState<TabId>('overview');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);
  const navigate = useNavigate();

  // WebSocket — localhost only
  useEffect(() => {
    const isLocal = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
    if (!isLocal) return;
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const ws = new WebSocket(`${protocol}//${window.location.host}`);
    ws.onmessage = e => { setNotification(e.data); setTimeout(() => setNotification(null), 5000); };
    ws.onerror = () => {};
    return () => { if (ws.readyState === WebSocket.OPEN || ws.readyState === WebSocket.CONNECTING) ws.close(); };
  }, []);

  // Close sidebar on tab change (mobile)
  useEffect(() => { setSidebarOpen(false); }, [activeTab]);

  const handleLogout = useCallback(() => {
    localStorage.removeItem('admin_token');
    navigate('/admin/login');
  }, [navigate]);

  const pendingCount = MOCK_BOOKINGS.filter(b => b.status === 'pending').length;

  const navItems: NavItem[] = [
    { id: 'overview',  label: 'Overview',   icon: LayoutDashboard },
    { id: 'bookings',  label: 'Bookings',   icon: Calendar, badge: pendingCount },
    { id: 'analytics', label: 'Analytics',  icon: BarChart2 },
    { id: 'media',     label: 'Media',      icon: Image },
    { id: 'content',   label: 'Content',    icon: FileText },
    { id: 'yusra',     label: 'Yusra AI',   icon: Bot },
    { id: 'settings',  label: 'Settings',   icon: Settings },
  ];

  const tabTitles: Record<TabId, string> = {
    overview:  'Dashboard Overview',
    bookings:  'Booking Management',
    analytics: 'Analytics & Reports',
    media:     'Media Library',
    content:   'Content Editor',
    yusra:     'Yusra AI Assistant',
    settings:  'Settings',
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'overview':  return <OverviewTab setActiveTab={setActiveTab} />;
      case 'bookings':  return <BookingsTab />;
      case 'analytics': return <AnalyticsTab />;
      case 'media':     return <MediaTab />;
      case 'content':   return <ContentEditor />;
      case 'yusra':     return <YusraTab />;
      case 'settings':  return <SettingsTab />;
    }
  };

  return (
    <div className="bg-[#070712] text-white min-h-screen flex overflow-x-hidden">

      {/* Mobile overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40 lg:hidden"
            onClick={() => setSidebarOpen(false)} />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <aside className={`
        fixed top-0 left-0 h-full w-64 bg-[#0f0f0f] border-r border-gray-800/60 flex flex-col z-50
        transition-transform duration-300 ease-in-out
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0 lg:static lg:flex
      `}>
        {/* Logo */}
        <div className="flex items-center justify-between px-5 py-5 border-b border-gray-800/60">
          <div className="flex items-center gap-3">
            <img src="/assets/alpha-logo.png" alt="Alpha" className="w-8 h-8 object-contain" />
            <div>
              <p className="font-bold text-white text-sm tracking-wider">ALPHA</p>
              <p className="text-teal-400 text-xs">Admin Panel</p>
            </div>
          </div>
          <button onClick={() => setSidebarOpen(false)} className="lg:hidden p-1.5 rounded-lg hover:bg-gray-800 text-gray-400 transition-colors">
            <X size={16} />
          </button>
        </div>

        {/* Nav items */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto scrollbar-thin">
          {navItems.map(item => {
            const active = activeTab === item.id;
            return (
              <button key={item.id} onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group ${active ? 'bg-teal-500/10 text-teal-400 border border-teal-500/20' : 'text-gray-500 hover:bg-gray-800/50 hover:text-gray-200'}`}>
                <item.icon size={17} className={`shrink-0 ${active ? 'text-teal-400' : 'text-gray-600 group-hover:text-gray-300'}`} />
                <span className="flex-1 text-left truncate">{item.label}</span>
                {item.badge ? (
                  <span className="w-5 h-5 bg-amber-400 text-black text-xs font-bold rounded-full flex items-center justify-center shrink-0">{item.badge}</span>
                ) : active ? (
                  <ChevronRight size={13} className="text-teal-400 shrink-0" />
                ) : null}
              </button>
            );
          })}
        </nav>

        {/* User + logout */}
        <div className="px-3 py-4 border-t border-gray-800/60">
          <div className="flex items-center gap-3 px-3 py-2 mb-2">
            <div className="w-8 h-8 bg-teal-500/10 rounded-full flex items-center justify-center shrink-0">
              <span className="text-teal-400 font-bold text-xs">A</span>
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-white truncate">Admin</p>
              <p className="text-xs text-gray-500 truncate">alpha@ultimate.com</p>
            </div>
          </div>
          <button onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-red-400 hover:bg-red-400/10 transition-all">
            <LogOut size={16} className="shrink-0" />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Topbar */}
        <header className="sticky top-0 z-30 bg-[#070712]/80 backdrop-blur-md border-b border-gray-800/60 px-4 sm:px-6 py-3.5 flex items-center gap-4">
          <button onClick={() => setSidebarOpen(true)} className="lg:hidden p-2 rounded-xl hover:bg-gray-800 text-gray-400 transition-colors">
            <Menu size={20} />
          </button>
          <div className="flex-1 min-w-0">
            <h1 className="font-bold text-white text-base sm:text-lg truncate">{tabTitles[activeTab]}</h1>
            <p className="text-xs text-gray-500 hidden sm:block">
              {new Date().toLocaleDateString('en-SA', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <div className="hidden sm:flex items-center gap-1.5 text-xs text-emerald-400 bg-emerald-400/10 border border-emerald-400/20 px-2.5 py-1.5 rounded-full">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="font-medium">Live</span>
            </div>
            <button className="relative p-2 rounded-xl hover:bg-gray-800 text-gray-400 transition-colors">
              <Bell size={18} />
              {pendingCount > 0 && <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-amber-400 rounded-full" />}
            </button>
            <a href="/" target="_blank" rel="noopener noreferrer"
              className="hidden sm:flex items-center gap-1.5 text-xs font-medium text-teal-400 hover:text-teal-300 bg-teal-500/10 border border-teal-500/20 px-3 py-1.5 rounded-xl transition-all hover:bg-teal-500/15">
              <Monitor size={13} /> View Site
            </a>
          </div>
        </header>

        {/* Toast */}
        <AnimatePresence>
          {notification && (
            <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
              className="mx-4 mt-4 bg-teal-500 text-black font-bold py-3 px-5 rounded-xl shadow-lg text-sm">
              {notification}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Content */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6">
          <AnimatePresence mode="wait">
            <motion.div key={activeTab} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.22 }}>
              {renderContent()}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}
