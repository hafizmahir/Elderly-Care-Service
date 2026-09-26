import React, { useState, useEffect } from 'react';
import { useRouter, Link } from '../router/Router.js';
import { useAuth } from '../context/AuthContext.js';
import { useTheme } from '../context/ThemeContext.js';
import { usePageMetadata } from '../utils/metadata.js';
import { 
  Heart,
  LayoutDashboard,
  Users as UsersIcon, 
  CalendarCheck, 
  CreditCard, 
  UserCheck, 
  Briefcase, 
  FileBarChart, 
  Settings as SettingsIcon, 
  LogOut, 
  Clock, 
  CheckCircle2, 
  RefreshCw, 
  Search, 
  Filter, 
  Menu, 
  X, 
  ShieldCheck, 
  Plus, 
  Trash2, 
  Edit, 
  Phone, 
  Mail, 
  MapPin, 
  Check, 
  Download, 
  Database, 
  Sparkles,
  ChevronRight,
  Eye,
  AlertCircle,
  Moon,
  Sun
} from 'lucide-react';
import { Caregiver, Service, User, Booking } from '../types/index.js';

export const AdminDashboardPage: React.FC = () => {
  const { user, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const { navigate } = useRouter();
  const [activeMenu, setActiveMenu] = useState('dashboard');
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  usePageMetadata({
    title: 'Admin Dashboard - Care.xyz',
    description: 'Care.xyz Admin management console with full live MongoDB & Firebase oversight.'
  });

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // 1. Stats State
  const [stats, setStats] = useState({
    totalBookings: 245,
    totalRevenue: '1,25,430',
    pendingCount: 32,
    completedCount: 187
  });

  // 2. Users State
  const [usersList, setUsersList] = useState<User[]>([]);
  const [userSearch, setUserSearch] = useState('');
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [newUserData, setNewUserData] = useState({
    nid: '',
    name: '',
    email: '',
    contact: '',
    role: 'user' as 'user' | 'admin'
  });

  // 3. Bookings State
  const [bookingsList, setBookingsList] = useState<any[]>([]);
  const [bookingFilterStatus, setBookingFilterStatus] = useState('All');
  const [bookingSearch, setBookingSearch] = useState('');
  const [selectedBookingDetails, setSelectedBookingDetails] = useState<any | null>(null);

  // 4. Payments State
  const [paymentsList, setPaymentsList] = useState<any[]>([]);

  // 5. Caregivers State
  const [caregiversList, setCaregiversList] = useState<Caregiver[]>([]);
  const [showAddCaregiverModal, setShowAddCaregiverModal] = useState(false);
  const [newCaregiverData, setNewCaregiverData] = useState({
    name: '',
    phone: '',
    email: '',
    role: 'Certified Caregiver',
    badge: 'Verified Caregiver',
    experience: '3 Years Experience',
    service: 'Baby Care'
  });

  // 6. Services State
  const [servicesList, setServicesList] = useState<Service[]>([]);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [editRates, setEditRates] = useState({ hourlyRate: 300, dailyRate: 2400 });

  // 7. Reports State
  const [reportsData, setReportsData] = useState<any>(null);

  // 8. Settings State
  const [settingsData, setSettingsData] = useState<any>({
    platformName: 'Care.xyz',
    supportPhone: '+880 9610-0000',
    supportEmail: 'support@care.xyz',
    mongoUriMasked: 'mongodb+srv://CareService:****@cluster0.owqcpnx.mongodb.net/care_service',
    firebaseProject: 'care-service-d94f7',
    zapShiftSyncActive: true,
    emailInvoiceActive: true
  });

  // Fetch initial data
  const fetchAllData = async () => {
    setLoading(true);
    try {
      const parseJsonSafe = async (res: Response) => {
        const ct = res.headers.get('content-type') || '';
        if (res.ok && ct.includes('application/json')) {
          return await res.json();
        }
        return null;
      };

      // Stats
      const statsRes = await fetch('/api/admin/stats');
      const statsData = await parseJsonSafe(statsRes);
      if (statsData?.stats) {
        setStats(statsData.stats);
      }

      // Users
      const usersRes = await fetch('/api/admin/users');
      const usersData = await parseJsonSafe(usersRes);
      if (usersData?.users) {
        setUsersList(usersData.users);
      }

      // Bookings
      const bookingsRes = await fetch('/api/admin/bookings');
      const bookingsData = await parseJsonSafe(bookingsRes);
      if (bookingsData?.bookings) {
        setBookingsList(bookingsData.bookings);
      }

      // Payments
      const paymentsRes = await fetch('/api/admin/payments');
      const paymentsData = await parseJsonSafe(paymentsRes);
      if (paymentsData?.payments) {
        setPaymentsList(paymentsData.payments);
      }

      // Caregivers
      const cgRes = await fetch('/api/admin/caregivers');
      const cgData = await parseJsonSafe(cgRes);
      if (cgData?.caregivers) {
        setCaregiversList(cgData.caregivers);
      }

      // Services
      const svcRes = await fetch('/api/admin/services');
      const svcData = await parseJsonSafe(svcRes);
      if (svcData?.services) {
        setServicesList(svcData.services);
      }

      // Reports
      const repRes = await fetch('/api/admin/reports');
      const repData = await parseJsonSafe(repRes);
      if (repData?.reports) {
        setReportsData(repData.reports);
      }

      // Settings
      const setRes = await fetch('/api/admin/settings');
      const setData = await parseJsonSafe(setRes);
      if (setData?.settings) {
        setSettingsData(setData.settings);
      }
    } catch (err) {
      console.warn('Error fetching admin data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  // Handlers for Users
  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/admin/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newUserData)
      });
      if (res.ok) {
        const data = await res.json();
        setUsersList(prev => [data.user, ...prev]);
        setShowAddUserModal(false);
        setNewUserData({ nid: '', name: '', email: '', contact: '', role: 'user' });
        showToast('User created successfully in database.');
      }
    } catch {
      showToast('Failed to create user.');
    }
  };

  const handleToggleUserRole = async (userId: string, currentRole: 'admin' | 'user') => {
    const nextRole = currentRole === 'admin' ? 'user' : 'admin';
    try {
      const res = await fetch(`/api/admin/users/${userId}/role`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role: nextRole })
      });
      if (res.ok) {
        setUsersList(prev => prev.map(u => u.id === userId ? { ...u, role: nextRole } : u));
        showToast(`User role updated to ${nextRole}.`);
      }
    } catch {
      showToast('Failed to update role.');
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (!window.confirm('Are you sure you want to remove this user?')) return;
    try {
      const res = await fetch(`/api/admin/users/${userId}`, { method: 'DELETE' });
      if (res.ok) {
        setUsersList(prev => prev.filter(u => u.id !== userId));
        showToast('User removed.');
      }
    } catch {
      showToast('Failed to delete user.');
    }
  };

  // Handlers for Bookings
  const handleUpdateBookingStatus = async (bookingId: string, newStatus: string) => {
    try {
      const res = await fetch(`/api/admin/bookings/${bookingId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
      if (res.ok) {
        setBookingsList(prev => prev.map(b => b.id === bookingId ? { ...b, status: newStatus } : b));
        showToast(`Booking status updated to ${newStatus}.`);
      }
    } catch {
      showToast('Failed to update status.');
    }
  };

  const handleDeleteBooking = async (bookingId: string) => {
    if (!window.confirm('Delete this booking record?')) return;
    try {
      const res = await fetch(`/api/admin/bookings/${bookingId}`, { method: 'DELETE' });
      if (res.ok) {
        setBookingsList(prev => prev.filter(b => b.id !== bookingId));
        showToast('Booking deleted.');
      }
    } catch {
      showToast('Failed to delete booking.');
    }
  };

  // Handlers for Caregivers
  const handleCreateCaregiver = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/admin/caregivers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...newCaregiverData,
          services: [newCaregiverData.service]
        })
      });
      if (res.ok) {
        const data = await res.json();
        setCaregiversList(prev => [data.caregiver, ...prev]);
        setShowAddCaregiverModal(false);
        setNewCaregiverData({
          name: '',
          phone: '',
          email: '',
          role: 'Certified Caregiver',
          badge: 'Verified Caregiver',
          experience: '3 Years Experience',
          service: 'Baby Care'
        });
        showToast('New caregiver added to directory.');
      }
    } catch {
      showToast('Failed to add caregiver.');
    }
  };

  const handleToggleCaregiverStatus = async (cgId: string, currentStatus: string) => {
    const nextStatus = currentStatus === 'active' ? 'busy' : 'active';
    try {
      const res = await fetch(`/api/admin/caregivers/${cgId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: nextStatus })
      });
      if (res.ok) {
        setCaregiversList(prev => prev.map(c => c.id === cgId ? { ...c, status: nextStatus as any } : c));
        showToast(`Caregiver marked as ${nextStatus}.`);
      }
    } catch {
      showToast('Failed to update caregiver.');
    }
  };

  const handleDeleteCaregiver = async (cgId: string) => {
    if (!window.confirm('Remove this caregiver?')) return;
    try {
      const res = await fetch(`/api/admin/caregivers/${cgId}`, { method: 'DELETE' });
      if (res.ok) {
        setCaregiversList(prev => prev.filter(c => c.id !== cgId));
        showToast('Caregiver removed.');
      }
    } catch {
      showToast('Failed to remove caregiver.');
    }
  };

  // Handlers for Services
  const handleUpdateServiceRate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingService) return;
    try {
      const res = await fetch(`/api/admin/services/${editingService.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          hourlyRate: Number(editRates.hourlyRate),
          dailyRate: Number(editRates.dailyRate)
        })
      });
      if (res.ok) {
        setServicesList(prev => prev.map(s => s.id === editingService.id ? { ...s, hourlyRate: Number(editRates.hourlyRate), dailyRate: Number(editRates.dailyRate) } : s));
        setEditingService(null);
        showToast('Service rates updated in MongoDB & Memory.');
      }
    } catch {
      showToast('Failed to update service rates.');
    }
  };

  // Download Report Summary
  const handleDownloadReport = () => {
    const headers = ['Booking ID,User,Service,Total Amount (৳),Status,Date\n'];
    const rows = bookingsList.map(b => `${b.id},"${b.userName || b.user}","${b.serviceName || b.service}",${b.totalCost || b.amount},${b.status},${b.startDate || b.date}`);
    const blob = new Blob([headers.join('') + rows.join('\n')], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `care_xyz_admin_report_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    showToast('Admin Report exported as CSV.');
  };

  const navMenuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'users', label: 'Users', icon: UsersIcon, count: usersList.length },
    { id: 'bookings', label: 'Bookings', icon: CalendarCheck, count: bookingsList.length },
    { id: 'payments', label: 'Payments', icon: CreditCard, count: paymentsList.length },
    { id: 'caregivers', label: 'Caregivers', icon: UserCheck, count: caregiversList.length },
    { id: 'services', label: 'Services', icon: Briefcase, count: servicesList.length },
    { id: 'reports', label: 'Reports', icon: FileBarChart },
    { id: 'settings', label: 'Settings', icon: SettingsIcon },
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Pending':
        return 'bg-[#fffbeb] text-[#d97706] border border-[#fde68a]';
      case 'Confirmed':
      case 'Paid':
      case 'active':
        return 'bg-[#ecfdf5] text-[#059669] border border-[#a7f3d0]';
      case 'Completed':
        return 'bg-[#eff6ff] text-[#2563eb] border border-[#bfdbfe]';
      case 'Cancelled':
      case 'Refunded':
      case 'busy':
        return 'bg-[#fff1f2] text-[#e11d48] border border-[#fecdd3]';
      default:
        return 'bg-slate-100 text-slate-700';
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] dark:bg-[#070d12] flex flex-col md:flex-row font-sans transition-colors duration-200">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-5 right-5 z-50 bg-slate-900 dark:bg-slate-800 text-white text-xs px-4 py-3 rounded-xl shadow-lg border border-slate-700 dark:border-slate-600 flex items-center gap-2 animate-bounce">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Mobile Drawer Backdrop */}
      {mobileSidebarOpen && (
        <div 
          onClick={() => setMobileSidebarOpen(false)}
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs md:hidden"
        />
      )}

      {/* Dark Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-[#0c1a24] text-slate-300 flex flex-col justify-between shrink-0 py-5 px-3 border-r border-slate-800 transition-transform duration-300 ease-in-out
        md:static md:translate-x-0 md:min-h-screen
        ${mobileSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
        
        {/* Brand & Nav */}
        <div className="space-y-6">
          <div className="flex items-center justify-between px-3">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-full bg-emerald-500 flex items-center justify-center text-white shadow-xs">
                <Heart className="w-3.5 h-3.5 fill-white text-white" />
              </div>
              <span className="text-base font-bold tracking-tight text-white font-display">
                Care<span className="text-emerald-400">.xyz</span> <span className="text-xs text-slate-400 font-normal">Admin</span>
              </span>
            </Link>

            <button 
              onClick={() => setMobileSidebarOpen(false)}
              className="md:hidden p-1 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1 text-xs font-medium">
            {navMenuItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeMenu === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveMenu(item.id);
                    setMobileSidebarOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-lg transition-colors text-left ${
                    isActive
                      ? 'bg-[#008774] text-white font-semibold shadow-xs'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </div>
                  {item.count !== undefined && (
                    <span className={`text-[10px] px-2 py-0.5 rounded-full ${isActive ? 'bg-white/20 text-white' : 'bg-slate-800 text-slate-400'}`}>
                      {item.count}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Bottom Actions: View Client Site & Logout */}
        <div className="pt-4 border-t border-slate-800/80 space-y-2">
          <Link
            href="/my-bookings"
            className="w-full flex items-center gap-2.5 px-3.5 py-2 rounded-lg text-xs font-medium text-emerald-400 hover:bg-slate-800/60 transition-colors"
          >
            <CalendarCheck className="w-4 h-4" />
            <span>Customer Portal</span>
          </Link>

          <button
            onClick={() => {
              logout();
              navigate('/');
            }}
            className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-xs font-medium text-slate-400 hover:text-rose-400 hover:bg-slate-800/60 transition-colors text-left"
          >
            <LogOut className="w-4 h-4" />
            <span>Logout</span>
          </button>
        </div>

      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-4 sm:p-6 lg:p-8 space-y-6 sm:space-y-8 overflow-y-auto">
        
        {/* Top Header Bar */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileSidebarOpen(true)}
              className="p-2 -ml-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 md:hidden"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-xl sm:text-2xl font-bold font-display text-slate-900 dark:text-white capitalize">
                {activeMenu} Management
              </h1>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Connected to MongoDB Atlas & Firebase Auth with real CRUD operations.
              </p>
            </div>
          </div>

          {/* Database and Role Badges */}
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <div className="flex items-center gap-1.5 px-2.5 py-1 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 rounded-lg font-semibold text-[11px]">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>MongoDB: users · services · bookings</span>
            </div>

            <div className="flex items-center gap-1.5 px-2.5 py-1 bg-sky-50 dark:bg-sky-950/40 border border-sky-200 dark:border-sky-800 text-sky-800 dark:text-sky-300 rounded-lg font-semibold text-[11px]">
              <span className="w-2 h-2 rounded-full bg-sky-500"></span>
              <span>Firebase Auth: care-service-d94f7</span>
            </div>

            <button
              onClick={fetchAllData}
              title="Refresh all data from MongoDB"
              className="p-1.5 bg-white dark:bg-[#111c26] border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-emerald-600' : ''}`} />
            </button>

            <button
              onClick={toggleTheme}
              title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
              className="p-1.5 bg-white dark:bg-[#111c26] border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
              aria-label="Toggle Dark Mode"
            >
              {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600 dark:text-slate-400" />}
            </button>

            <button
              onClick={() => navigate('/my-bookings')}
              className="px-3 py-1.5 bg-white dark:bg-[#111c26] border border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 rounded-full font-semibold transition-colors shadow-2xs"
            >
              Customer View
            </button>
          </div>
        </div>

        {/* ==========================================
            VIEW 1: DASHBOARD
        =========================================== */}
        {activeMenu === 'dashboard' && (
          <div className="space-y-6">
            {/* 4 Stat Cards matching image.png */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
              
              {/* Total Bookings */}
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs hover:shadow-md hover:-translate-y-1 transition-all duration-300 flex items-center justify-between">
                <div className="space-y-1">
                  <span className="text-xs text-slate-500 font-medium">Total Bookings</span>
                  <p className="text-2xl font-bold font-display text-slate-900 tabular-nums">
                    {stats.totalBookings}
                  </p>
                </div>
                <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center">
                  <CalendarCheck className="w-4 h-4" />
                </div>
              </div>

              {/* Total Revenue */}
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs hover:shadow-md hover:-translate-y-1 transition-all duration-300 flex items-center justify-between">
                <div className="space-y-1">
                  <span className="text-xs text-slate-500 font-medium">Total Revenue</span>
                  <p className="text-2xl font-bold font-display text-slate-900 tabular-nums">
                    ৳ {stats.totalRevenue}
                  </p>
                </div>
                <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center">
                  <CreditCard className="w-4 h-4" />
                </div>
              </div>

              {/* Pending */}
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs hover:shadow-md hover:-translate-y-1 transition-all duration-300 flex items-center justify-between">
                <div className="space-y-1">
                  <span className="text-xs text-slate-500 font-medium">Pending</span>
                  <p className="text-2xl font-bold font-display text-slate-900 tabular-nums">
                    {stats.pendingCount}
                  </p>
                </div>
                <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center">
                  <Clock className="w-4 h-4" />
                </div>
              </div>

              {/* Completed */}
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs hover:shadow-md hover:-translate-y-1 transition-all duration-300 flex items-center justify-between">
                <div className="space-y-1">
                  <span className="text-xs text-slate-500 font-medium">Completed</span>
                  <p className="text-2xl font-bold font-display text-slate-900 tabular-nums">
                    {stats.completedCount}
                  </p>
                </div>
                <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
              </div>

            </div>

            {/* Two Tables Side by Side matching image.png */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              
              {/* Left Table: Recent Bookings (7 cols) */}
              <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 shadow-2xs p-5 sm:p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-sm font-bold text-slate-900 font-display">
                    Recent Bookings
                  </h2>
                  <button 
                    onClick={() => setActiveMenu('bookings')}
                    className="text-[11px] text-emerald-700 font-semibold hover:underline flex items-center gap-1"
                  >
                    <span>View All ({bookingsList.length})</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-slate-100 text-slate-400">
                        <th className="pb-3 font-medium">User</th>
                        <th className="pb-3 font-medium">Service</th>
                        <th className="pb-3 font-medium">Amount</th>
                        <th className="pb-3 font-medium">Status</th>
                        <th className="pb-3 font-medium text-right">Date</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {bookingsList.slice(0, 5).map((b) => (
                        <tr key={b.id} className="hover:bg-slate-50/60 transition-colors">
                          <td className="py-3 font-semibold text-slate-800 whitespace-nowrap">
                            {b.userName || b.user}
                          </td>
                          <td className="py-3 text-slate-600 whitespace-nowrap">
                            {b.serviceName || b.service}
                          </td>
                          <td className="py-3 font-semibold text-slate-900 tabular-nums whitespace-nowrap">
                            ৳{b.totalCost?.toLocaleString() || b.amount}
                          </td>
                          <td className="py-3 whitespace-nowrap">
                            <button
                              onClick={() => {
                                const nextStatus = b.status === 'Pending' ? 'Confirmed' : b.status === 'Confirmed' ? 'Completed' : 'Pending';
                                handleUpdateBookingStatus(b.id, nextStatus);
                              }}
                              title="Click to toggle status"
                              className={`text-[10px] font-semibold px-2.5 py-0.5 rounded-full transition-transform active:scale-95 cursor-pointer ${getStatusBadge(b.status)}`}
                            >
                              {b.status}
                            </button>
                          </td>
                          <td className="py-3 text-right text-slate-400 tabular-nums whitespace-nowrap">
                            {b.startDate || b.date}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Right Table: Payment History (5 cols) */}
              <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200 shadow-2xs p-5 sm:p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-sm font-bold text-slate-900 font-display">
                    Payment History
                  </h2>
                  <button 
                    onClick={() => setActiveMenu('payments')}
                    className="text-[11px] text-emerald-700 font-semibold hover:underline flex items-center gap-1"
                  >
                    <span>View All ({paymentsList.length})</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-slate-100 text-slate-400">
                        <th className="pb-3 font-medium">User</th>
                        <th className="pb-3 font-medium">Amount</th>
                        <th className="pb-3 font-medium text-right">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {paymentsList.slice(0, 5).map((p, idx) => (
                        <tr key={idx} className="hover:bg-slate-50/60 transition-colors">
                          <td className="py-3 font-semibold text-slate-800 whitespace-nowrap">
                            {p.user}
                          </td>
                          <td className="py-3 font-semibold text-slate-900 tabular-nums whitespace-nowrap">
                            {p.amount}
                          </td>
                          <td className="py-3 text-right whitespace-nowrap">
                            <span className={`text-[10px] font-semibold px-2.5 py-0.5 rounded-full ${getStatusBadge(p.status)}`}>
                              {p.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>
          </div>
        )}

        {/* ==========================================
            VIEW 2: USERS MANAGEMENT
        =========================================== */}
        {activeMenu === 'users' && (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs p-5 sm:p-6 space-y-5">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div>
                <h2 className="text-base font-bold text-slate-900 font-display">
                  All Registered Users (MongoDB Collection: `users`)
                </h2>
                <p className="text-xs text-slate-500">
                  Manage user accounts, roles, verified NID, and contact credentials.
                </p>
              </div>

              <div className="flex items-center gap-3 w-full sm:w-auto">
                <div className="relative flex-1 sm:w-64">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    value={userSearch}
                    onChange={(e) => setUserSearch(e.target.value)}
                    placeholder="Search name, email, NID..."
                    className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-lg text-xs focus:ring-1 focus:ring-emerald-600 focus:outline-none"
                  />
                </div>

                <button
                  onClick={() => setShowAddUserModal(true)}
                  className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors shrink-0 shadow-2xs"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add User</span>
                </button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-500 bg-slate-50/50">
                    <th className="py-2.5 px-3 font-semibold">User Info</th>
                    <th className="py-2.5 px-3 font-semibold">Verified NID</th>
                    <th className="py-2.5 px-3 font-semibold">Contact Phone</th>
                    <th className="py-2.5 px-3 font-semibold">Role</th>
                    <th className="py-2.5 px-3 font-semibold">Registered</th>
                    <th className="py-2.5 px-3 font-semibold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {usersList
                    .filter(u => 
                      u.name?.toLowerCase().includes(userSearch.toLowerCase()) ||
                      u.email?.toLowerCase().includes(userSearch.toLowerCase()) ||
                      u.nid?.toLowerCase().includes(userSearch.toLowerCase())
                    )
                    .map((u) => (
                      <tr key={u.id} className="hover:bg-slate-50/70 transition-colors">
                        <td className="py-3 px-3">
                          <p className="font-semibold text-slate-900">{u.name}</p>
                          <p className="text-slate-500 text-[11px]">{u.email}</p>
                        </td>
                        <td className="py-3 px-3 font-mono text-slate-700">
                          {u.nid || 'N/A'}
                        </td>
                        <td className="py-3 px-3 text-slate-700">
                          {u.contact || '+8801700000000'}
                        </td>
                        <td className="py-3 px-3">
                          <button
                            onClick={() => handleToggleUserRole(u.id, u.role)}
                            title="Click to toggle between user and admin"
                            className={`text-[10px] font-semibold px-2.5 py-0.5 rounded-full uppercase tracking-wider cursor-pointer ${
                              u.role === 'admin' ? 'bg-amber-100 text-amber-800 border border-amber-300' : 'bg-slate-100 text-slate-700 border border-slate-300'
                            }`}
                          >
                            {u.role}
                          </button>
                        </td>
                        <td className="py-3 px-3 text-slate-500">
                          {u.createdAt ? new Date(u.createdAt).toLocaleDateString() : 'Active'}
                        </td>
                        <td className="py-3 px-3 text-right">
                          <button
                            onClick={() => handleDeleteUser(u.id)}
                            title="Delete user"
                            className="p-1.5 text-slate-400 hover:text-rose-600 rounded-md hover:bg-rose-50 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ==========================================
            VIEW 3: BOOKINGS MANAGEMENT
        =========================================== */}
        {activeMenu === 'bookings' && (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs p-5 sm:p-6 space-y-5">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-base font-bold text-slate-900 font-display">
                  Bookings Master (MongoDB Collection: `bookings`)
                </h2>
                <p className="text-xs text-slate-500">
                  Real-time status management, duration, cost, location, and caregiver assignment.
                </p>
              </div>

              {/* Status Filter Buttons */}
              <div className="flex flex-wrap items-center gap-1.5 text-xs">
                {['All', 'Pending', 'Confirmed', 'Completed', 'Cancelled'].map((st) => (
                  <button
                    key={st}
                    onClick={() => setBookingFilterStatus(st)}
                    className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
                      bookingFilterStatus === st
                        ? 'bg-slate-900 text-white font-semibold'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-500 bg-slate-50/50">
                    <th className="py-2.5 px-3 font-semibold">Booking ID</th>
                    <th className="py-2.5 px-3 font-semibold">Client Name</th>
                    <th className="py-2.5 px-3 font-semibold">Service</th>
                    <th className="py-2.5 px-3 font-semibold">Location (ZapShift)</th>
                    <th className="py-2.5 px-3 font-semibold">Duration & Shift</th>
                    <th className="py-2.5 px-3 font-semibold">Amount</th>
                    <th className="py-2.5 px-3 font-semibold">Status</th>
                    <th className="py-2.5 px-3 font-semibold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {bookingsList
                    .filter(b => bookingFilterStatus === 'All' || b.status === bookingFilterStatus)
                    .map((b) => (
                      <tr key={b.id} className="hover:bg-slate-50/70 transition-colors">
                        <td className="py-3 px-3 font-mono font-semibold text-emerald-800">
                          {b.id}
                        </td>
                        <td className="py-3 px-3">
                          <p className="font-semibold text-slate-900">{b.userName || b.user}</p>
                          <p className="text-[11px] text-slate-400">{b.userContact || b.userEmail}</p>
                        </td>
                        <td className="py-3 px-3 font-medium text-slate-800">
                          {b.serviceName || b.service}
                        </td>
                        <td className="py-3 px-3 text-slate-600 max-w-[180px] truncate">
                          {b.location?.area ? `${b.location.area}, ${b.location.city}` : 'Dhanmondi, Dhaka'}
                        </td>
                        <td className="py-3 px-3 text-slate-600">
                          {b.durationValue || 4} {b.durationUnit || 'hours'} ({b.shiftType || 'Day'})
                        </td>
                        <td className="py-3 px-3 font-bold text-slate-900 tabular-nums">
                          ৳{(b.totalCost || b.amount)?.toLocaleString()}
                        </td>
                        <td className="py-3 px-3">
                          <select
                            value={b.status}
                            onChange={(e) => handleUpdateBookingStatus(b.id, e.target.value)}
                            className={`text-[11px] font-semibold px-2 py-1 rounded-md border focus:outline-none ${getStatusBadge(b.status)}`}
                          >
                            <option value="Pending">Pending</option>
                            <option value="Confirmed">Confirmed</option>
                            <option value="Completed">Completed</option>
                            <option value="Cancelled">Cancelled</option>
                          </select>
                        </td>
                        <td className="py-3 px-3 text-right flex items-center justify-end gap-1">
                          <button
                            onClick={() => setSelectedBookingDetails(b)}
                            title="View full booking & recipient details"
                            className="p-1.5 text-slate-400 hover:text-emerald-600 rounded-md hover:bg-emerald-50 transition-colors"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteBooking(b.id)}
                            title="Delete booking"
                            className="p-1.5 text-slate-400 hover:text-rose-600 rounded-md hover:bg-rose-50 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ==========================================
            VIEW 4: PAYMENTS MANAGEMENT
        =========================================== */}
        {activeMenu === 'payments' && (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs p-5 sm:p-6 space-y-5">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div>
                <h2 className="text-base font-bold text-slate-900 font-display">
                  Payments & Invoicing Logs
                </h2>
                <p className="text-xs text-slate-500">
                  Track billing transactions, payment gateways, and invoice transmissions.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleDownloadReport}
                  className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-2xs"
                >
                  <Download className="w-4 h-4" />
                  <span>Export Transactions</span>
                </button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-500 bg-slate-50/50">
                    <th className="py-2.5 px-3 font-semibold">Payment ID</th>
                    <th className="py-2.5 px-3 font-semibold">User</th>
                    <th className="py-2.5 px-3 font-semibold">Service</th>
                    <th className="py-2.5 px-3 font-semibold">Amount</th>
                    <th className="py-2.5 px-3 font-semibold">Method</th>
                    <th className="py-2.5 px-3 font-semibold">Status</th>
                    <th className="py-2.5 px-3 font-semibold text-right">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {paymentsList.map((p, idx) => (
                    <tr key={idx} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3 px-3 font-mono text-emerald-800 font-medium">
                        PAY-{1000 + idx}
                      </td>
                      <td className="py-3 px-3 font-semibold text-slate-900">
                        {p.user}
                      </td>
                      <td className="py-3 px-3 text-slate-600">
                        {p.service || 'Care Service'}
                      </td>
                      <td className="py-3 px-3 font-bold text-slate-900 tabular-nums">
                        {p.amount}
                      </td>
                      <td className="py-3 px-3 capitalize text-slate-600">
                        {p.method ? p.method.replace('_', ' ') : 'Stripe / COD'}
                      </td>
                      <td className="py-3 px-3">
                        <span className={`text-[10px] font-semibold px-2.5 py-0.5 rounded-full ${getStatusBadge(p.status)}`}>
                          {p.status}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-right text-slate-400">
                        {p.date || '2025-09-20'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ==========================================
            VIEW 5: CAREGIVERS DIRECTORY
        =========================================== */}
        {activeMenu === 'caregivers' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div>
                <h2 className="text-base font-bold text-slate-900 font-display">
                  Caregivers Directory ({caregiversList.length} Certified Staff)
                </h2>
                <p className="text-xs text-slate-500">
                  National ID verified nannies, geriatric companions, and clinical nurses.
                </p>
              </div>

              <button
                onClick={() => setShowAddCaregiverModal(true)}
                className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-2xs"
              >
                <Plus className="w-4 h-4" />
                <span>Add Caregiver</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {caregiversList.map((cg) => (
                <div key={cg.id} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs hover:shadow-md transition-all space-y-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-11 h-11 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-sm">
                        {cg.name.split(' ').map(n => n[0]).slice(0, 2).join('')}
                      </div>
                      <div>
                        <h3 className="font-bold text-slate-900 text-sm">{cg.name}</h3>
                        <p className="text-xs text-emerald-700 font-medium">{cg.role}</p>
                      </div>
                    </div>

                    <button
                      onClick={() => handleToggleCaregiverStatus(cg.id, cg.status)}
                      className={`text-[10px] font-semibold px-2.5 py-0.5 rounded-full capitalize cursor-pointer ${getStatusBadge(cg.status)}`}
                    >
                      {cg.status}
                    </button>
                  </div>

                  <div className="text-xs text-slate-600 space-y-1.5 border-t border-b border-slate-100 py-3">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400">Experience:</span>
                      <span className="font-medium text-slate-800">{cg.experience}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400">Badge:</span>
                      <span className="font-medium text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded text-[11px]">{cg.badge}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400">Completed Sessions:</span>
                      <span className="font-bold text-slate-900">{cg.completedJobs || 120}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400">Direct Phone:</span>
                      <span className="font-mono text-slate-700">{cg.phone}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    <span className="text-[11px] text-slate-400">⭐ {cg.rating} Rating</span>
                    <button
                      onClick={() => handleDeleteCaregiver(cg.id)}
                      className="text-xs text-rose-600 hover:text-rose-700 hover:underline flex items-center gap-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Remove</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ==========================================
            VIEW 6: SERVICES MANAGEMENT
        =========================================== */}
        {activeMenu === 'services' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-base font-bold text-slate-900 font-display">
                Care Services (MongoDB Collection: `services`)
              </h2>
              <p className="text-xs text-slate-500">
                Adjust pricing in Bangladeshi Taka (৳), hourly & daily rates, and service overviews.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {servicesList.map((svc) => (
                <div key={svc.id} className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden flex flex-col justify-between">
                  <div className="p-5 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 bg-emerald-50 text-emerald-800 rounded">
                        {svc.category}
                      </span>
                      <span className="text-xs text-slate-400 font-semibold">⭐ {svc.rating}</span>
                    </div>

                    <h3 className="font-bold text-base text-slate-900">{svc.name}</h3>
                    <p className="text-xs text-slate-500 line-clamp-2">{svc.description}</p>

                    <div className="pt-3 border-t border-slate-100 space-y-1">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-slate-500">Hourly Rate:</span>
                        <span className="font-bold text-emerald-700 text-sm">৳{svc.hourlyRate}</span>
                      </div>
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-slate-500">Daily Rate (8-12h):</span>
                        <span className="font-bold text-slate-900 text-sm">৳{svc.dailyRate}</span>
                      </div>
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-slate-500">Completed Sessions:</span>
                        <span className="font-semibold text-slate-700">{svc.completedCareSessions || 4200}+</span>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
                    <Link href={`/services#${svc.id}`} className="text-xs text-slate-600 hover:text-slate-900 font-medium">
                      View Public Page
                    </Link>
                    <button
                      onClick={() => {
                        setEditingService(svc);
                        setEditRates({ hourlyRate: svc.hourlyRate, dailyRate: svc.dailyRate });
                      }}
                      className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors"
                    >
                      <Edit className="w-3.5 h-3.5" />
                      <span>Edit Rates</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ==========================================
            VIEW 7: REPORTS & ANALYTICS
        =========================================== */}
        {activeMenu === 'reports' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div>
                <h2 className="text-base font-bold text-slate-900 font-display">
                  Financial & Operational Reports
                </h2>
                <p className="text-xs text-slate-500">
                  Revenue aggregated across Baby Care, Elderly Care, and Clinical Nursing.
                </p>
              </div>

              <button
                onClick={handleDownloadReport}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-2xs"
              >
                <Download className="w-4 h-4" />
                <span>Export CSV Report</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <div className="bg-white p-5 rounded-2xl border border-slate-200 space-y-2">
                <span className="text-xs text-slate-400 font-medium uppercase tracking-wider">Gross Revenue</span>
                <p className="text-3xl font-bold font-display text-emerald-800">৳ {reportsData?.totalRevenue?.toLocaleString() || stats.totalRevenue}</p>
                <p className="text-xs text-emerald-700 font-medium">Live sync with MongoDB Atlas</p>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-200 space-y-2">
                <span className="text-xs text-slate-400 font-medium uppercase tracking-wider">Completion Rate</span>
                <p className="text-3xl font-bold font-display text-slate-900">92.4%</p>
                <p className="text-xs text-slate-500">{stats.completedCount} bookings completed successfully</p>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-200 space-y-2">
                <span className="text-xs text-slate-400 font-medium uppercase tracking-wider">Monthly Projection</span>
                <p className="text-3xl font-bold font-display text-slate-900">৳ {(reportsData?.monthlyProjection || 169330).toLocaleString()}</p>
                <p className="text-xs text-slate-500">Forecasted next 30 days growth</p>
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 space-y-4">
              <h3 className="font-bold text-sm text-slate-900 font-display">Revenue Breakdown by Care Service</h3>
              
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-xs font-medium text-slate-700 mb-1">
                    <span>Baby Care (Babysitting & Nanny)</span>
                    <span>42% (৳ 52,680)</span>
                  </div>
                  <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-500 rounded-full" style={{ width: '42%' }}></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs font-medium text-slate-700 mb-1">
                    <span>Elderly Service (Companionship & Vital Monitoring)</span>
                    <span>36% (৳ 45,150)</span>
                  </div>
                  <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-teal-500 rounded-full" style={{ width: '36%' }}></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs font-medium text-slate-700 mb-1">
                    <span>Sick People Service (Clinical Care Nurse)</span>
                    <span>22% (৳ 27,600)</span>
                  </div>
                  <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-sky-500 rounded-full" style={{ width: '22%' }}></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ==========================================
            VIEW 8: SETTINGS & INTEGRATIONS
        =========================================== */}
        {activeMenu === 'settings' && (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs p-6 space-y-6">
            <div>
              <h2 className="text-base font-bold text-slate-900 font-display">
                Platform Configuration & Integrations
              </h2>
              <p className="text-xs text-slate-500">
                Manage MongoDB Atlas, Firebase Auth, ZapShift locations, and automated email invoice dispatch.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* MongoDB Atlas Info */}
              <div className="p-5 rounded-xl bg-emerald-50/60 border border-emerald-200 space-y-2.5">
                <div className="flex items-center gap-2">
                  <Database className="w-5 h-5 text-emerald-700" />
                  <h3 className="font-bold text-slate-900 text-sm">MongoDB Atlas Connection</h3>
                </div>
                <p className="text-xs text-slate-600">
                  Cluster: <span className="font-mono text-emerald-900 font-semibold">cluster0.owqcpnx.mongodb.net</span>
                </p>
                <p className="text-xs text-slate-600">
                  Database: <span className="font-mono font-semibold">care_service</span>
                </p>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  <span className="text-[10px] font-bold px-2 py-0.5 bg-emerald-200/60 text-emerald-900 rounded">Collection: users</span>
                  <span className="text-[10px] font-bold px-2 py-0.5 bg-emerald-200/60 text-emerald-900 rounded">Collection: services</span>
                  <span className="text-[10px] font-bold px-2 py-0.5 bg-emerald-200/60 text-emerald-900 rounded">Collection: bookings</span>
                </div>
              </div>

              {/* Firebase Info */}
              <div className="p-5 rounded-xl bg-sky-50/60 border border-sky-200 space-y-2.5">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-sky-700" />
                  <h3 className="font-bold text-slate-900 text-sm">Firebase Authentication</h3>
                </div>
                <p className="text-xs text-slate-600">
                  Project ID: <span className="font-mono text-sky-900 font-semibold">care-service-d94f7</span>
                </p>
                <p className="text-xs text-slate-600">
                  Auth Domain: <span className="font-mono font-semibold">care-service-d94f7.firebaseapp.com</span>
                </p>
                <p className="text-xs text-sky-800 font-medium pt-1">
                  Google Popup Sign-In & Email/Password verified.
                </p>
              </div>

            </div>

            {/* Editable Contact Info */}
            <div className="pt-4 border-t border-slate-100 space-y-4">
              <h3 className="font-bold text-sm text-slate-900">Support & Communication Settings</h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="space-y-1">
                  <label className="font-semibold text-slate-700">Platform Brand Name</label>
                  <input
                    type="text"
                    value={settingsData.platformName}
                    onChange={(e) => setSettingsData({ ...settingsData, platformName: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-1 focus:ring-emerald-600 focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-slate-700">Customer Support Hotline</label>
                  <input
                    type="text"
                    value={settingsData.supportPhone}
                    onChange={(e) => setSettingsData({ ...settingsData, supportPhone: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-1 focus:ring-emerald-600 focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-slate-700">Support Email (Invoice Sender)</label>
                  <input
                    type="text"
                    value={settingsData.supportEmail}
                    onChange={(e) => setSettingsData({ ...settingsData, supportEmail: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-1 focus:ring-emerald-600 focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-slate-700">ZapShift External Location Sync</label>
                  <div className="flex items-center gap-2 pt-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                    <span className="text-slate-800 font-semibold">Active (Dhaka, Chittagong, Rajshahi, Sylhet)</span>
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={async () => {
                  try {
                    await fetch('/api/admin/settings', {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify(settingsData)
                    });
                    showToast('Settings saved successfully.');
                  } catch {
                    showToast('Failed to save settings.');
                  }
                }}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold transition-colors"
              >
                Save Settings
              </button>
            </div>
          </div>
        )}

      </main>

      {/* ==========================================
          MODALS
      =========================================== */}

      {/* 1. Add User Modal */}
      {showAddUserModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 shadow-xl">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="font-bold text-slate-900 text-sm">Add New User to MongoDB</h3>
              <button onClick={() => setShowAddUserModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateUser} className="space-y-3 text-xs">
              <div className="space-y-1">
                <label className="font-semibold text-slate-700">NID Number</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 19922694589001234"
                  value={newUserData.nid}
                  onChange={(e) => setNewUserData({ ...newUserData, nid: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-1 focus:ring-emerald-600 focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-700">Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Tanvir Hasan"
                  value={newUserData.name}
                  onChange={(e) => setNewUserData({ ...newUserData, name: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-1 focus:ring-emerald-600 focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-700">Email Address</label>
                <input
                  type="email"
                  required
                  placeholder="e.g. tanvir@example.com"
                  value={newUserData.email}
                  onChange={(e) => setNewUserData({ ...newUserData, email: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-1 focus:ring-emerald-600 focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-700">Contact Number</label>
                <input
                  type="text"
                  placeholder="+8801700112233"
                  value={newUserData.contact}
                  onChange={(e) => setNewUserData({ ...newUserData, contact: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-1 focus:ring-emerald-600 focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-700">Role</label>
                <select
                  value={newUserData.role}
                  onChange={(e) => setNewUserData({ ...newUserData, role: e.target.value as any })}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-1 focus:ring-emerald-600 focus:outline-none"
                >
                  <option value="user">User (Customer)</option>
                  <option value="admin">Admin</option>
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setShowAddUserModal(false)}
                  className="px-4 py-2 border border-slate-300 rounded-lg text-slate-700 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-semibold"
                >
                  Create User
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 2. Add Caregiver Modal */}
      {showAddCaregiverModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 shadow-xl">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="font-bold text-slate-900 text-sm">Add Certified Caregiver</h3>
              <button onClick={() => setShowAddCaregiverModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateCaregiver} className="space-y-3 text-xs">
              <div className="space-y-1">
                <label className="font-semibold text-slate-700">Caregiver Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Rasheda Begum"
                  value={newCaregiverData.name}
                  onChange={(e) => setNewCaregiverData({ ...newCaregiverData, name: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-1 focus:ring-emerald-600 focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-700">Phone Number</label>
                <input
                  type="text"
                  required
                  placeholder="+8801811223344"
                  value={newCaregiverData.phone}
                  onChange={(e) => setNewCaregiverData({ ...newCaregiverData, phone: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-1 focus:ring-emerald-600 focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-700">Role Designation</label>
                <input
                  type="text"
                  placeholder="e.g. Senior Geriatric Aide"
                  value={newCaregiverData.role}
                  onChange={(e) => setNewCaregiverData({ ...newCaregiverData, role: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-1 focus:ring-emerald-600 focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-700">Certification Badge</label>
                <input
                  type="text"
                  placeholder="e.g. Registered Nurse / CPR Certified"
                  value={newCaregiverData.badge}
                  onChange={(e) => setNewCaregiverData({ ...newCaregiverData, badge: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-1 focus:ring-emerald-600 focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-700">Assigned Service</label>
                <select
                  value={newCaregiverData.service}
                  onChange={(e) => setNewCaregiverData({ ...newCaregiverData, service: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-1 focus:ring-emerald-600 focus:outline-none"
                >
                  <option value="Baby Care">Baby Care</option>
                  <option value="Elderly Service">Elderly Service</option>
                  <option value="Sick People Service">Sick People Service</option>
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setShowAddCaregiverModal(false)}
                  className="px-4 py-2 border border-slate-300 rounded-lg text-slate-700 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-semibold"
                >
                  Save Caregiver
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 3. Edit Service Rates Modal */}
      {editingService && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 space-y-4 shadow-xl">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="font-bold text-slate-900 text-sm">Edit Rates: {editingService.name}</h3>
              <button onClick={() => setEditingService(null)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleUpdateServiceRate} className="space-y-3 text-xs">
              <div className="space-y-1">
                <label className="font-semibold text-slate-700">Hourly Rate (৳ / hour)</label>
                <input
                  type="number"
                  required
                  value={editRates.hourlyRate}
                  onChange={(e) => setEditRates({ ...editRates, hourlyRate: Number(e.target.value) })}
                  className="w-full px-3 py-2 border rounded-lg font-bold text-slate-900 focus:ring-1 focus:ring-emerald-600 focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-700">Daily Rate (৳ / day)</label>
                <input
                  type="number"
                  required
                  value={editRates.dailyRate}
                  onChange={(e) => setEditRates({ ...editRates, dailyRate: Number(e.target.value) })}
                  className="w-full px-3 py-2 border rounded-lg font-bold text-slate-900 focus:ring-1 focus:ring-emerald-600 focus:outline-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setEditingService(null)}
                  className="px-4 py-2 border border-slate-300 rounded-lg text-slate-700 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-semibold"
                >
                  Save Rates
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 4. Booking Details Modal */}
      {selectedBookingDetails && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-xl">
            <div className="flex items-center justify-between border-b pb-3">
              <div>
                <h3 className="font-bold text-slate-900 text-sm">Booking {selectedBookingDetails.id}</h3>
                <p className="text-xs text-slate-400">Created: {selectedBookingDetails.createdAt || selectedBookingDetails.startDate}</p>
              </div>
              <button onClick={() => setSelectedBookingDetails(null)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="text-xs space-y-3">
              <div className="grid grid-cols-2 gap-3 bg-slate-50 p-3 rounded-xl border border-slate-100">
                <div>
                  <span className="text-slate-400">Service:</span>
                  <p className="font-bold text-slate-900">{selectedBookingDetails.serviceName || selectedBookingDetails.service}</p>
                </div>
                <div>
                  <span className="text-slate-400">Total Price:</span>
                  <p className="font-bold text-emerald-700">৳{(selectedBookingDetails.totalCost || selectedBookingDetails.amount)?.toLocaleString()}</p>
                </div>
                <div>
                  <span className="text-slate-400">Recipient Name:</span>
                  <p className="font-semibold text-slate-900">{selectedBookingDetails.recipient?.name || selectedBookingDetails.userName || selectedBookingDetails.user}</p>
                </div>
                <div>
                  <span className="text-slate-400">Recipient Age:</span>
                  <p className="font-semibold text-slate-900">{selectedBookingDetails.recipient?.age || 'Standard'}</p>
                </div>
              </div>

              <div>
                <span className="text-slate-400">ZapShift Location & Address:</span>
                <p className="font-semibold text-slate-800">{selectedBookingDetails.location?.fullAddress || `${selectedBookingDetails.location?.area || 'Dhanmondi'}, ${selectedBookingDetails.location?.city || 'Dhaka'}`}</p>
              </div>

              <div>
                <span className="text-slate-400">Assigned Caregiver:</span>
                <p className="font-semibold text-emerald-800">{selectedBookingDetails.caregiver?.name || 'Farzana Sultana (Certified Nanny)'}</p>
              </div>

              <div>
                <span className="text-slate-400">Special Requirements:</span>
                <p className="text-slate-600">{selectedBookingDetails.recipient?.specialRequirements || 'No special requirements noted'}</p>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setSelectedBookingDetails(null)}
                className="px-4 py-2 bg-slate-900 text-white rounded-lg text-xs font-semibold"
              >
                Close Details
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
