import React, { useEffect, useState, useMemo } from "react";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import api from "../configs/api";
import toast from "react-hot-toast";
import {
  Users,
  FileText,
  Globe,
  Activity,
  ShieldCheck,
  RefreshCw,
  Search,
  Trash2,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  TrendingUp,
  Sparkles,
  ArrowUpRight,
  UserCheck,
  UserX,
  Layers,
  Award,
  Briefcase,
  AlertTriangle,
  X,
  CheckCircle2,
  Calendar,
} from "lucide-react";

const AdminDashboard = () => {
  const { user, token } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  // Active Tab: 'overview' | 'users' | 'resumes'
  const [activeTab, setActiveTab] = useState("overview");

  // Stats State
  const [stats, setStats] = useState(null);
  const [loadingStats, setLoadingStats] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Users Management State
  const [users, setUsers] = useState([]);
  const [userSearch, setUserSearch] = useState("");
  const [userRoleFilter, setUserRoleFilter] = useState("");
  const [userPage, setUserPage] = useState(1);
  const [userTotalPages, setUserTotalPages] = useState(1);
  const [userTotalCount, setUserTotalCount] = useState(0);
  const [loadingUsers, setLoadingUsers] = useState(false);

  // Resumes Management State
  const [resumes, setResumes] = useState([]);
  const [resumeSearch, setResumeSearch] = useState("");
  const [resumeTemplateFilter, setResumeTemplateFilter] = useState("");
  const [resumePublicFilter, setResumePublicFilter] = useState("");
  const [resumePage, setResumePage] = useState(1);
  const [resumeTotalPages, setResumeTotalPages] = useState(1);
  const [resumeTotalCount, setResumeTotalCount] = useState(0);
  const [loadingResumes, setLoadingResumes] = useState(false);

  // Modal State for Confirmations
  const [deleteModal, setDeleteModal] = useState({
    isOpen: false,
    type: "", // 'user' | 'resume'
    id: null,
    title: "",
    warning: "",
  });
  const [actionLoading, setActionLoading] = useState(false);

  // Chart Metric Filter: 'both' | 'users' | 'resumes'
  const [chartMetric, setChartMetric] = useState("both");

  // Load Dashboard Stats
  const loadStats = async (isManualRefresh = false) => {
    try {
      if (isManualRefresh) setRefreshing(true);
      else setLoadingStats(true);

      const { data } = await api.get("/api/admin/stats", {
        headers: { Authorization: token },
      });

      if (data.success) {
        setStats(data.stats);
        if (isManualRefresh) toast.success("Statistics refreshed!");
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to load admin stats");
    } finally {
      setLoadingStats(false);
      setRefreshing(false);
    }
  };

  // Load Users List
  const loadUsers = async (page = 1) => {
    try {
      setLoadingUsers(true);
      const params = new URLSearchParams({
        page: page.toString(),
        limit: "10",
      });
      if (userSearch) params.append("search", userSearch);
      if (userRoleFilter) params.append("role", userRoleFilter);

      const { data } = await api.get(`/api/admin/users?${params.toString()}`, {
        headers: { Authorization: token },
      });

      if (data.success) {
        setUsers(data.users);
        setUserPage(data.currentPage);
        setUserTotalPages(data.totalPages);
        setUserTotalCount(data.totalUsers);
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to fetch users");
    } finally {
      setLoadingUsers(false);
    }
  };

  // Load Resumes List
  const loadResumes = async (page = 1) => {
    try {
      setLoadingResumes(true);
      const params = new URLSearchParams({
        page: page.toString(),
        limit: "10",
      });
      if (resumeSearch) params.append("search", resumeSearch);
      if (resumeTemplateFilter) params.append("template", resumeTemplateFilter);
      if (resumePublicFilter) params.append("public", resumePublicFilter);

      const { data } = await api.get(`/api/admin/resumes?${params.toString()}`, {
        headers: { Authorization: token },
      });

      if (data.success) {
        setResumes(data.resumes);
        setResumePage(data.currentPage);
        setResumeTotalPages(data.totalPages);
        setResumeTotalCount(data.totalResumes);
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to fetch resumes");
    } finally {
      setLoadingResumes(false);
    }
  };

  // Initial stats fetch
  useEffect(() => {
    loadStats();
  }, []);

  // Fetch users when tab or filters change
  useEffect(() => {
    if (activeTab === "users") {
      loadUsers(userPage);
    }
  }, [activeTab, userPage, userRoleFilter]);

  // Fetch resumes when tab or filters change
  useEffect(() => {
    if (activeTab === "resumes") {
      loadResumes(resumePage);
    }
  }, [activeTab, resumePage, resumeTemplateFilter, resumePublicFilter]);

  // Handle user search debounce
  useEffect(() => {
    if (activeTab !== "users") return;
    const timeout = setTimeout(() => {
      setUserPage(1);
      loadUsers(1);
    }, 400);
    return () => clearTimeout(timeout);
  }, [userSearch]);

  // Handle resume search debounce
  useEffect(() => {
    if (activeTab !== "resumes") return;
    const timeout = setTimeout(() => {
      setResumePage(1);
      loadResumes(1);
    }, 400);
    return () => clearTimeout(timeout);
  }, [resumeSearch]);

  // Handle User Role Toggle
  const handleToggleRole = async (targetUser) => {
    const newRole = targetUser.role === "admin" ? "user" : "admin";
    try {
      const { data } = await api.put(
        `/api/admin/users/${targetUser._id}/role`,
        { role: newRole },
        { headers: { Authorization: token } }
      );

      if (data.success) {
        toast.success(`User role updated to ${newRole}`);
        setUsers(
          users.map((u) => (u._id === targetUser._id ? { ...u, role: newRole } : u))
        );
        loadStats(); // refresh counts
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to update user role");
    }
  };

  // Confirm Delete Action
  const executeDelete = async () => {
    if (!deleteModal.id) return;
    try {
      setActionLoading(true);
      if (deleteModal.type === "user") {
        const { data } = await api.delete(`/api/admin/users/${deleteModal.id}`, {
          headers: { Authorization: token },
        });
        toast.success(data.message || "User deleted successfully");
        setUsers(users.filter((u) => u._id !== deleteModal.id));
        setUserTotalCount((prev) => Math.max(0, prev - 1));
      } else if (deleteModal.type === "resume") {
        const { data } = await api.delete(`/api/admin/resumes/${deleteModal.id}`, {
          headers: { Authorization: token },
        });
        toast.success(data.message || "Resume deleted successfully");
        setResumes(resumes.filter((r) => r._id !== deleteModal.id));
        setResumeTotalCount((prev) => Math.max(0, prev - 1));
      }
      setDeleteModal({ isOpen: false, type: "", id: null, title: "", warning: "" });
      loadStats();
    } catch (error) {
      toast.error(error?.response?.data?.message || "Delete operation failed");
    } finally {
      setActionLoading(false);
    }
  };

  // Maximum value calculation for timeline chart scaling
  const maxTrendVal = useMemo(() => {
    if (!stats?.timeline || stats.timeline.length === 0) return 10;
    const maxVal = Math.max(
      ...stats.timeline.map((d) => Math.max(d.users, d.resumes))
    );
    return Math.max(maxVal + 2, 8);
  }, [stats?.timeline]);

  return (
    <div className="min-h-screen bg-[#07090e] text-gray-100 font-sans pb-20 selection:bg-emerald-500/30 selection:text-emerald-300">
      {/* Top Navbar */}
      <header className="sticky top-0 z-40 w-full border-b border-white/5 backdrop-blur-xl bg-[#07090e]/85">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
          {/* Brand & Admin Badge */}
          <div className="flex items-center gap-4">
            <Link to="/app" className="flex items-center gap-3 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-emerald-400 p-[1px] shadow-lg shadow-emerald-500/20">
                <div className="w-full h-full bg-[#07090e] rounded-[11px] flex items-center justify-center group-hover:bg-transparent transition-all duration-300">
                  <ShieldCheck className="w-5 h-5 text-emerald-400 group-hover:text-white" />
                </div>
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-2">
                  <span className="text-xl font-extrabold tracking-wider text-white">
                    TALVIX
                  </span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                    Admin Portal
                  </span>
                </div>
                <span className="text-[10px] text-gray-400 tracking-wider uppercase font-semibold">
                  Executive Intelligence & Metrics
                </span>
              </div>
            </Link>
          </div>

          {/* Quick Actions */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => loadStats(true)}
              disabled={refreshing}
              className="px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-medium text-gray-300 hover:text-white transition-all flex items-center gap-2"
              title="Refresh Data"
            >
              <RefreshCw className={`w-3.5 h-3.5 text-emerald-400 ${refreshing ? "animate-spin" : ""}`} />
              <span className="hidden sm:inline">Refresh</span>
            </button>

            <Link
              to="/app"
              className="glow-button bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-[#07090e] font-bold px-4 py-2 rounded-xl text-xs transition-all flex items-center gap-1.5"
            >
              <span>User App</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        {/* Navigation Tabs */}
        <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-8 overflow-x-auto">
          <div className="flex items-center gap-2 sm:gap-4 min-w-max">
            <button
              onClick={() => setActiveTab("overview")}
              className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all flex items-center gap-2 ${
                activeTab === "overview"
                  ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 shadow-lg shadow-emerald-500/10"
                  : "text-gray-400 hover:text-white hover:bg-white/5 border border-transparent"
              }`}
            >
              <Activity className="w-4 h-4" />
              <span>Overview & Analytics</span>
            </button>

            <button
              onClick={() => setActiveTab("users")}
              className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all flex items-center gap-2 ${
                activeTab === "users"
                  ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 shadow-lg shadow-emerald-500/10"
                  : "text-gray-400 hover:text-white hover:bg-white/5 border border-transparent"
              }`}
            >
              <Users className="w-4 h-4" />
              <span>Users Directory</span>
              {stats?.totals?.users !== undefined && (
                <span className="ml-1 px-2 py-0.5 rounded-full text-[11px] bg-white/10 text-gray-300">
                  {stats.totals.users}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab("resumes")}
              className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all flex items-center gap-2 ${
                activeTab === "resumes"
                  ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 shadow-lg shadow-emerald-500/10"
                  : "text-gray-400 hover:text-white hover:bg-white/5 border border-transparent"
              }`}
            >
              <FileText className="w-4 h-4" />
              <span>Resumes Explorer</span>
              {stats?.totals?.resumes !== undefined && (
                <span className="ml-1 px-2 py-0.5 rounded-full text-[11px] bg-white/10 text-gray-300">
                  {stats.totals.resumes}
                </span>
              )}
            </button>
          </div>

          <div className="hidden lg:flex items-center gap-2 text-xs text-gray-400">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>Live MongoDB Metrics</span>
          </div>
        </div>

        {/* ===================== TAB 1: OVERVIEW & ANALYTICS ===================== */}
        {activeTab === "overview" && (
          <div className="space-y-8">
            {/* Top Stat Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {/* Card 1: Users */}
              <div className="glass-card p-6 rounded-2xl border border-white/10 relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-28 h-28 bg-emerald-500/10 rounded-full blur-2xl group-hover:bg-emerald-500/20 transition-all"></div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                    Total Registered Users
                  </span>
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                    <Users className="w-5 h-5" />
                  </div>
                </div>
                <div className="flex items-baseline gap-3">
                  <span className="text-3xl font-extrabold text-white tracking-tight">
                    {loadingStats ? "..." : stats?.totals?.users ?? 0}
                  </span>
                  <span className="text-xs font-semibold text-emerald-400 flex items-center">
                    +{stats?.activity?.usersThisWeek ?? 0} this week
                  </span>
                </div>
                <div className="mt-3 pt-3 border-t border-white/5 flex items-center justify-between text-[11px] text-gray-400">
                  <span>Today: +{stats?.activity?.usersToday ?? 0}</span>
                  <span>This Month: +{stats?.activity?.usersThisMonth ?? 0}</span>
                </div>
              </div>

              {/* Card 2: Resumes */}
              <div className="glass-card p-6 rounded-2xl border border-white/10 relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-28 h-28 bg-cyan-500/10 rounded-full blur-2xl group-hover:bg-cyan-500/20 transition-all"></div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                    Total Resumes Created
                  </span>
                  <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
                    <FileText className="w-5 h-5" />
                  </div>
                </div>
                <div className="flex items-baseline gap-3">
                  <span className="text-3xl font-extrabold text-white tracking-tight">
                    {loadingStats ? "..." : stats?.totals?.resumes ?? 0}
                  </span>
                  <span className="text-xs font-semibold text-cyan-400 flex items-center">
                    +{stats?.activity?.resumesThisWeek ?? 0} this week
                  </span>
                </div>
                <div className="mt-3 pt-3 border-t border-white/5 flex items-center justify-between text-[11px] text-gray-400">
                  <span>Today: +{stats?.activity?.resumesToday ?? 0}</span>
                  <span>Avg/User: {stats?.totals?.avgResumesPerUser ?? 0}</span>
                </div>
              </div>

              {/* Card 3: Public vs Private */}
              <div className="glass-card p-6 rounded-2xl border border-white/10 relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-28 h-28 bg-purple-500/10 rounded-full blur-2xl group-hover:bg-purple-500/20 transition-all"></div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                    Public Share Rate
                  </span>
                  <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
                    <Globe className="w-5 h-5" />
                  </div>
                </div>
                <div className="flex items-baseline gap-3">
                  <span className="text-3xl font-extrabold text-white tracking-tight">
                    {loadingStats ? "..." : `${stats?.totals?.publicShareRate ?? 0}%`}
                  </span>
                  <span className="text-xs text-gray-400">
                    {stats?.totals?.publicResumes ?? 0} Public
                  </span>
                </div>
                {/* Visual Ratio Bar */}
                <div className="mt-4 w-full h-2 rounded-full bg-gray-800 overflow-hidden flex">
                  <div
                    style={{ width: `${stats?.totals?.publicShareRate ?? 0}%` }}
                    className="h-full bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full transition-all duration-500"
                  ></div>
                </div>
                <div className="mt-2 flex items-center justify-between text-[11px] text-gray-400">
                  <span>{stats?.totals?.publicResumes ?? 0} Public</span>
                  <span>{stats?.totals?.privateResumes ?? 0} Private</span>
                </div>
              </div>

              {/* Card 4: Admins & System */}
              <div className="glass-card p-6 rounded-2xl border border-white/10 relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-28 h-28 bg-amber-500/10 rounded-full blur-2xl group-hover:bg-amber-500/20 transition-all"></div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                    System Administrators
                  </span>
                  <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                </div>
                <div className="flex items-baseline gap-3">
                  <span className="text-3xl font-extrabold text-white tracking-tight">
                    {loadingStats ? "..." : stats?.totals?.admins ?? 0}
                  </span>
                  <span className="text-xs font-semibold text-amber-400">
                    RBAC Protected
                  </span>
                </div>
                <div className="mt-3 pt-3 border-t border-white/5 flex items-center justify-between text-[11px] text-gray-400">
                  <span>Current: {user?.email}</span>
                  <span className="text-emerald-400">Active</span>
                </div>
              </div>
            </div>

            {/* Middle Section: 14-Day Trends Chart & Template Distribution */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* 14-Day Timeline Chart (2 cols) */}
              <div className="lg:col-span-2 glass-panel p-6 rounded-2xl border border-white/10">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                  <div>
                    <h3 className="text-lg font-bold text-white flex items-center gap-2">
                      <TrendingUp className="w-5 h-5 text-emerald-400" />
                      14-Day Growth & Creation Trends
                    </h3>
                    <p className="text-xs text-gray-400 mt-1">
                      Daily user signups vs. resumes generated across the platform
                    </p>
                  </div>

                  {/* Chart Metric Selector */}
                  <div className="flex items-center bg-white/5 p-1 rounded-xl border border-white/10 text-xs">
                    <button
                      onClick={() => setChartMetric("both")}
                      className={`px-3 py-1.5 rounded-lg transition-colors font-medium ${
                        chartMetric === "both"
                          ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                          : "text-gray-400 hover:text-white"
                      }`}
                    >
                      Combined
                    </button>
                    <button
                      onClick={() => setChartMetric("users")}
                      className={`px-3 py-1.5 rounded-lg transition-colors font-medium ${
                        chartMetric === "users"
                          ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                          : "text-gray-400 hover:text-white"
                      }`}
                    >
                      Users
                    </button>
                    <button
                      onClick={() => setChartMetric("resumes")}
                      className={`px-3 py-1.5 rounded-lg transition-colors font-medium ${
                        chartMetric === "resumes"
                          ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/30"
                          : "text-gray-400 hover:text-white"
                      }`}
                    >
                      Resumes
                    </button>
                  </div>
                </div>

                {/* SVG Visual Bar/Area Chart */}
                <div className="relative pt-6 pb-2">
                  <div className="h-64 flex items-end justify-between gap-2 border-b border-white/10 pb-2">
                    {stats?.timeline && stats.timeline.length > 0 ? (
                      stats.timeline.map((item, index) => {
                        const userHeightPct = Math.min(100, Math.round((item.users / maxTrendVal) * 100));
                        const resumeHeightPct = Math.min(100, Math.round((item.resumes / maxTrendVal) * 100));

                        return (
                          <div
                            key={index}
                            className="flex-1 flex flex-col items-center justify-end h-full group relative"
                          >
                            {/* Hover Tooltip */}
                            <div className="absolute -top-12 z-20 hidden group-hover:flex flex-col items-center bg-slate-900 border border-white/20 text-[10px] text-white py-1 px-2 rounded-lg shadow-xl pointer-events-none whitespace-nowrap">
                              <span className="font-bold text-gray-300">{item.label}</span>
                              <div className="flex gap-2 mt-0.5">
                                <span className="text-emerald-400 font-semibold">Users: {item.users}</span>
                                <span className="text-cyan-400 font-semibold">Resumes: {item.resumes}</span>
                              </div>
                            </div>

                            {/* Dual Bars */}
                            <div className="w-full flex items-end justify-center gap-1 h-full">
                              {(chartMetric === "both" || chartMetric === "users") && (
                                <div
                                  style={{ height: `${Math.max(userHeightPct, 4)}%` }}
                                  className="w-full max-w-[12px] bg-gradient-to-t from-emerald-600 to-emerald-400 rounded-t-md opacity-80 group-hover:opacity-100 transition-all duration-300 shadow-sm shadow-emerald-500/20"
                                ></div>
                              )}
                              {(chartMetric === "both" || chartMetric === "resumes") && (
                                <div
                                  style={{ height: `${Math.max(resumeHeightPct, 4)}%` }}
                                  className="w-full max-w-[12px] bg-gradient-to-t from-cyan-600 to-cyan-400 rounded-t-md opacity-80 group-hover:opacity-100 transition-all duration-300 shadow-sm shadow-cyan-500/20"
                                ></div>
                              )}
                            </div>

                            {/* Date Label */}
                            <span className="text-[10px] text-gray-500 mt-2 truncate max-w-[36px] text-center">
                              {item.label.split(" ")[1]}
                            </span>
                          </div>
                        );
                      })
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-500 text-sm">
                        No timeline activity data recorded yet
                      </div>
                    )}
                  </div>

                  {/* Chart Legend */}
                  <div className="flex items-center justify-center gap-6 mt-4 text-xs text-gray-400">
                    <div className="flex items-center gap-2">
                      <span className="w-3 h-3 rounded-full bg-emerald-400"></span>
                      <span>User Signups</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-3 h-3 rounded-full bg-cyan-400"></span>
                      <span>Resumes Created</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Template Popularity Breakdown (1 col) */}
              <div className="glass-panel p-6 rounded-2xl border border-white/10 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-bold text-white flex items-center gap-2">
                      <Layers className="w-5 h-5 text-emerald-400" />
                      Template Distribution
                    </h3>
                    <span className="text-xs text-gray-400">Popularity</span>
                  </div>
                  <p className="text-xs text-gray-400 mb-6">
                    Breakdown of template choices chosen by candidates
                  </p>

                  <div className="space-y-4">
                    {stats?.templates && stats.templates.length > 0 ? (
                      stats.templates.map((tpl, i) => (
                        <div key={i} className="space-y-1.5">
                          <div className="flex items-center justify-between text-xs">
                            <span className="font-semibold text-gray-200 capitalize">
                              {tpl.template}
                            </span>
                            <span className="text-gray-400">
                              {tpl.count} ({tpl.percentage}%)
                            </span>
                          </div>
                          <div className="w-full h-2 rounded-full bg-white/5 overflow-hidden">
                            <div
                              style={{ width: `${Math.max(tpl.percentage, 5)}%` }}
                              className={`h-full rounded-full ${
                                i === 0
                                  ? "bg-gradient-to-r from-emerald-500 to-teal-400"
                                  : i === 1
                                  ? "bg-gradient-to-r from-cyan-500 to-blue-400"
                                  : i === 2
                                  ? "bg-gradient-to-r from-purple-500 to-pink-400"
                                  : "bg-gradient-to-r from-amber-500 to-orange-400"
                              }`}
                            ></div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-xs text-gray-500">No resumes created yet.</p>
                    )}
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-white/5 text-[11px] text-gray-400 flex items-center justify-between">
                  <span>Total Templates In Use: {stats?.templates?.length ?? 0}</span>
                  <span className="text-emerald-400 font-semibold">Live Metrics</span>
                </div>
              </div>
            </div>

            {/* Lower Section: Top Skills Cloud & Top Professions */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Top Skills Cloud */}
              <div className="glass-panel p-6 rounded-2xl border border-white/10">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    <Award className="w-5 h-5 text-emerald-400" />
                    Top Listed Skills
                  </h3>
                  <span className="text-xs text-emerald-400 font-medium">Platform Radar</span>
                </div>
                <p className="text-xs text-gray-400 mb-5">
                  Most frequently listed technical and soft skills across candidate resumes
                </p>

                <div className="flex flex-wrap gap-2">
                  {stats?.skills && stats.skills.length > 0 ? (
                    stats.skills.map((s, idx) => (
                      <span
                        key={idx}
                        className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 hover:border-emerald-500/40 hover:bg-emerald-500/20 transition-all flex items-center gap-1.5"
                      >
                        <span>{s.skill}</span>
                        <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-emerald-500/20 text-emerald-200">
                          {s.count}
                        </span>
                      </span>
                    ))
                  ) : (
                    <p className="text-xs text-gray-500">No skills aggregated yet.</p>
                  )}
                </div>
              </div>

              {/* Top Professions */}
              <div className="glass-panel p-6 rounded-2xl border border-white/10">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    <Briefcase className="w-5 h-5 text-cyan-400" />
                    Top Candidate Professions
                  </h3>
                  <span className="text-xs text-cyan-400 font-medium">Demographics</span>
                </div>
                <p className="text-xs text-gray-400 mb-5">
                  Target job titles most often specified in user resumes
                </p>

                <div className="space-y-3">
                  {stats?.professions && stats.professions.length > 0 ? (
                    stats.professions.map((p, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between p-2.5 rounded-xl bg-white/5 border border-white/5 hover:border-white/10 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <span className="w-6 h-6 rounded-lg bg-cyan-500/10 text-cyan-400 text-xs font-bold flex items-center justify-center">
                            #{idx + 1}
                          </span>
                          <span className="text-xs font-semibold text-gray-200">
                            {p.profession}
                          </span>
                        </div>
                        <span className="text-xs text-gray-400 font-medium">
                          {p.count} candidates
                        </span>
                      </div>
                    ))
                  ) : (
                    <p className="text-xs text-gray-500">No professions registered yet.</p>
                  )}
                </div>
              </div>
            </div>

            {/* Bottom Section: Recent Feeds */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Recent Users */}
              <div className="glass-panel p-6 rounded-2xl border border-white/10">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <Users className="w-4 h-4 text-emerald-400" />
                    Recently Joined Users
                  </h3>
                  <button
                    onClick={() => setActiveTab("users")}
                    className="text-xs text-emerald-400 hover:text-emerald-300 font-medium flex items-center gap-1"
                  >
                    <span>View all</span>
                    <ArrowUpRight className="w-3 h-3" />
                  </button>
                </div>

                <div className="space-y-3">
                  {stats?.recent?.users && stats.recent.users.length > 0 ? (
                    stats.recent.users.map((u) => (
                      <div
                        key={u._id}
                        className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/5"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-[#07090e] font-bold text-sm flex items-center justify-center">
                            {u.name ? u.name.charAt(0).toUpperCase() : "U"}
                          </div>
                          <div>
                            <p className="text-xs font-semibold text-white">{u.name}</p>
                            <p className="text-[11px] text-gray-400">{u.email}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                              u.role === "admin"
                                ? "bg-amber-500/10 text-amber-300 border border-amber-500/30"
                                : "bg-white/5 text-gray-300 border border-white/10"
                            }`}
                          >
                            {u.role}
                          </span>
                          <p className="text-[10px] text-gray-500 mt-1">
                            {new Date(u.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-xs text-gray-500">No users found.</p>
                  )}
                </div>
              </div>

              {/* Recent Resumes */}
              <div className="glass-panel p-6 rounded-2xl border border-white/10">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <FileText className="w-4 h-4 text-cyan-400" />
                    Latest Resumes Created
                  </h3>
                  <button
                    onClick={() => setActiveTab("resumes")}
                    className="text-xs text-cyan-400 hover:text-cyan-300 font-medium flex items-center gap-1"
                  >
                    <span>View all</span>
                    <ArrowUpRight className="w-3 h-3" />
                  </button>
                </div>

                <div className="space-y-3">
                  {stats?.recent?.resumes && stats.recent.resumes.length > 0 ? (
                    stats.recent.resumes.map((r) => (
                      <div
                        key={r._id}
                        className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/5"
                      >
                        <div className="flex items-center gap-3">
                          <div
                            style={{ backgroundColor: r.accent_color || "#10b981" }}
                            className="w-2.5 h-8 rounded-full"
                          ></div>
                          <div>
                            <p className="text-xs font-semibold text-white truncate max-w-[180px]">
                              {r.title || "Untitled Resume"}
                            </p>
                            <p className="text-[11px] text-gray-400">
                              By {r.userId?.name || "Unknown"}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                              r.public
                                ? "bg-emerald-500/10 text-emerald-300 border border-emerald-500/30"
                                : "bg-white/5 text-gray-400 border border-white/10"
                            }`}
                          >
                            {r.public ? "Public" : "Private"}
                          </span>
                          <p className="text-[10px] text-gray-500 mt-1 capitalize">
                            {r.template || "classic"}
                          </p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-xs text-gray-500">No resumes found.</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ===================== TAB 2: USERS DIRECTORY ===================== */}
        {activeTab === "users" && (
          <div className="space-y-6">
            {/* Search and Filters Bar */}
            <div className="glass-panel p-4 rounded-2xl border border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="relative w-full sm:w-80">
                <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search by name or email..."
                  value={userSearch}
                  onChange={(e) => setUserSearch(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 rounded-xl bg-white/5 border border-white/10 text-xs text-white placeholder-gray-500 focus:border-emerald-500/50 outline-none"
                />
              </div>

              <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
                <select
                  value={userRoleFilter}
                  onChange={(e) => {
                    setUserRoleFilter(e.target.value);
                    setUserPage(1);
                  }}
                  className="px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-xs text-gray-200 outline-none focus:border-emerald-500/50"
                >
                  <option value="" className="bg-slate-900 text-gray-300">All Roles</option>
                  <option value="user" className="bg-slate-900 text-gray-300">Standard Users</option>
                  <option value="admin" className="bg-slate-900 text-gray-300">Administrators</option>
                </select>

                <button
                  onClick={() => loadUsers(userPage)}
                  className="px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs text-gray-300 transition-colors"
                >
                  Refresh
                </button>
              </div>
            </div>

            {/* Users Table */}
            <div className="glass-panel rounded-2xl border border-white/10 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-white/5 border-b border-white/10 text-gray-400 uppercase tracking-wider font-semibold">
                    <tr>
                      <th className="py-3.5 px-6">User</th>
                      <th className="py-3.5 px-6">Email</th>
                      <th className="py-3.5 px-6">Joined</th>
                      <th className="py-3.5 px-6 text-center">Resumes</th>
                      <th className="py-3.5 px-6 text-center">Role</th>
                      <th className="py-3.5 px-6 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {loadingUsers ? (
                      <tr>
                        <td colSpan="6" className="py-12 text-center text-gray-400">
                          <RefreshCw className="w-5 h-5 animate-spin mx-auto mb-2 text-emerald-400" />
                          Loading users...
                        </td>
                      </tr>
                    ) : users.length === 0 ? (
                      <tr>
                        <td colSpan="6" className="py-12 text-center text-gray-500">
                          No users matched your query.
                        </td>
                      </tr>
                    ) : (
                      users.map((u) => {
                        const isSelf = u._id === user?._id;
                        return (
                          <tr key={u._id} className="hover:bg-white/[0.02] transition-colors">
                            <td className="py-4 px-6">
                              <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-[#07090e] font-bold text-xs flex items-center justify-center">
                                  {u.name ? u.name.charAt(0).toUpperCase() : "U"}
                                </div>
                                <span className="font-semibold text-white">
                                  {u.name} {isSelf && <span className="text-[10px] text-emerald-400">(You)</span>}
                                </span>
                              </div>
                            </td>
                            <td className="py-4 px-6 text-gray-400 font-mono text-[11px]">
                              {u.email}
                            </td>
                            <td className="py-4 px-6 text-gray-400">
                              {new Date(u.createdAt).toLocaleDateString("en-US", {
                                year: "numeric",
                                month: "short",
                                day: "numeric",
                              })}
                            </td>
                            <td className="py-4 px-6 text-center">
                              <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-white/5 border border-white/10 text-gray-200">
                                {u.resumesCount ?? 0}
                              </span>
                            </td>
                            <td className="py-4 px-6 text-center">
                              <span
                                className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                                  u.role === "admin"
                                    ? "bg-emerald-500/10 text-emerald-300 border border-emerald-500/40"
                                    : "bg-white/5 text-gray-400 border border-white/10"
                                }`}
                              >
                                {u.role}
                              </span>
                            </td>
                            <td className="py-4 px-6 text-right">
                              <div className="flex items-center justify-end gap-2">
                                {/* Toggle Role Button */}
                                {!isSelf && (
                                  <button
                                    onClick={() => handleToggleRole(u)}
                                    className={`px-2.5 py-1.5 rounded-lg text-[11px] font-medium transition-all flex items-center gap-1.5 ${
                                      u.role === "admin"
                                        ? "bg-amber-500/10 text-amber-300 hover:bg-amber-500/20 border border-amber-500/20"
                                        : "bg-emerald-500/10 text-emerald-300 hover:bg-emerald-500/20 border border-emerald-500/20"
                                    }`}
                                    title={u.role === "admin" ? "Demote to User" : "Promote to Admin"}
                                  >
                                    {u.role === "admin" ? (
                                      <>
                                        <UserX className="w-3.5 h-3.5" />
                                        <span>Demote</span>
                                      </>
                                    ) : (
                                      <>
                                        <UserCheck className="w-3.5 h-3.5" />
                                        <span>Make Admin</span>
                                      </>
                                    )}
                                  </button>
                                )}

                                {/* Delete User Button */}
                                {!isSelf && (
                                  <button
                                    onClick={() =>
                                      setDeleteModal({
                                        isOpen: true,
                                        type: "user",
                                        id: u._id,
                                        title: `Delete User "${u.name}"?`,
                                        warning: `This action will permanently delete user ${u.email} and all ${u.resumesCount || 0} resumes created by this user. This cannot be undone.`,
                                      })
                                    }
                                    className="p-1.5 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 border border-red-500/20 transition-colors"
                                    title="Delete User"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                )}
                              </div>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>

              {/* Users Pagination */}
              <div className="p-4 border-t border-white/10 flex items-center justify-between text-xs text-gray-400">
                <span>
                  Showing {users.length} of {userTotalCount} users
                </span>
                <div className="flex items-center gap-2">
                  <button
                    disabled={userPage <= 1}
                    onClick={() => setUserPage((p) => Math.max(1, p - 1))}
                    className="p-1.5 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed text-white"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <span className="px-2">
                    Page {userPage} of {userTotalPages}
                  </span>
                  <button
                    disabled={userPage >= userTotalPages}
                    onClick={() => setUserPage((p) => p + 1)}
                    className="p-1.5 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed text-white"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ===================== TAB 3: RESUMES EXPLORER ===================== */}
        {activeTab === "resumes" && (
          <div className="space-y-6">
            {/* Search and Filters Bar */}
            <div className="glass-panel p-4 rounded-2xl border border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="relative w-full sm:w-80">
                <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search resume title..."
                  value={resumeSearch}
                  onChange={(e) => setResumeSearch(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 rounded-xl bg-white/5 border border-white/10 text-xs text-white placeholder-gray-500 focus:border-emerald-500/50 outline-none"
                />
              </div>

              <div className="flex items-center gap-3 w-full sm:w-auto justify-end flex-wrap">
                <select
                  value={resumeTemplateFilter}
                  onChange={(e) => {
                    setResumeTemplateFilter(e.target.value);
                    setResumePage(1);
                  }}
                  className="px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-xs text-gray-200 outline-none focus:border-emerald-500/50"
                >
                  <option value="" className="bg-slate-900 text-gray-300">All Templates</option>
                  <option value="classic" className="bg-slate-900 text-gray-300">Classic</option>
                  <option value="modern" className="bg-slate-900 text-gray-300">Modern</option>
                  <option value="minimal" className="bg-slate-900 text-gray-300">Minimal</option>
                </select>

                <select
                  value={resumePublicFilter}
                  onChange={(e) => {
                    setResumePublicFilter(e.target.value);
                    setResumePage(1);
                  }}
                  className="px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-xs text-gray-200 outline-none focus:border-emerald-500/50"
                >
                  <option value="" className="bg-slate-900 text-gray-300">All Visibility</option>
                  <option value="true" className="bg-slate-900 text-gray-300">Public Only</option>
                  <option value="false" className="bg-slate-900 text-gray-300">Private Only</option>
                </select>

                <button
                  onClick={() => loadResumes(resumePage)}
                  className="px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs text-gray-300 transition-colors"
                >
                  Refresh
                </button>
              </div>
            </div>

            {/* Resumes Table */}
            <div className="glass-panel rounded-2xl border border-white/10 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-white/5 border-b border-white/10 text-gray-400 uppercase tracking-wider font-semibold">
                    <tr>
                      <th className="py-3.5 px-6">Resume Title</th>
                      <th className="py-3.5 px-6">Author</th>
                      <th className="py-3.5 px-6">Template</th>
                      <th className="py-3.5 px-6 text-center">Visibility</th>
                      <th className="py-3.5 px-6">Updated</th>
                      <th className="py-3.5 px-6 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {loadingResumes ? (
                      <tr>
                        <td colSpan="6" className="py-12 text-center text-gray-400">
                          <RefreshCw className="w-5 h-5 animate-spin mx-auto mb-2 text-cyan-400" />
                          Loading resumes...
                        </td>
                      </tr>
                    ) : resumes.length === 0 ? (
                      <tr>
                        <td colSpan="6" className="py-12 text-center text-gray-500">
                          No resumes found matching your filter criteria.
                        </td>
                      </tr>
                    ) : (
                      resumes.map((r) => (
                        <tr key={r._id} className="hover:bg-white/[0.02] transition-colors">
                          <td className="py-4 px-6">
                            <div className="flex items-center gap-3">
                              <div
                                style={{ backgroundColor: r.accent_color || "#10b981" }}
                                className="w-2.5 h-8 rounded-full"
                              ></div>
                              <div>
                                <p className="font-semibold text-white">
                                  {r.title || "Untitled Resume"}
                                </p>
                                <span className="text-[10px] text-gray-500 font-mono">
                                  ID: {r._id.slice(-6)}
                                </span>
                              </div>
                            </div>
                          </td>
                          <td className="py-4 px-6">
                            <p className="font-medium text-gray-200">
                              {r.userId?.name || "Unknown Author"}
                            </p>
                            <p className="text-[11px] text-gray-500">
                              {r.userId?.email || "No email"}
                            </p>
                          </td>
                          <td className="py-4 px-6 capitalize">
                            <span className="px-2.5 py-1 rounded-md bg-white/5 text-gray-300 border border-white/10 text-[11px]">
                              {r.template || "classic"}
                            </span>
                          </td>
                          <td className="py-4 px-6 text-center">
                            <span
                              className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                                r.public
                                  ? "bg-emerald-500/10 text-emerald-300 border border-emerald-500/30"
                                  : "bg-white/5 text-gray-400 border border-white/10"
                              }`}
                            >
                              {r.public ? "Public" : "Private"}
                            </span>
                          </td>
                          <td className="py-4 px-6 text-gray-400 text-[11px]">
                            {new Date(r.updatedAt || r.createdAt).toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            })}
                          </td>
                          <td className="py-4 px-6 text-right">
                            <div className="flex items-center justify-end gap-2">
                              {/* Preview Link */}
                              <Link
                                to={`/view/${r._id}`}
                                target="_blank"
                                rel="noreferrer"
                                className="p-1.5 rounded-lg bg-white/5 text-gray-300 hover:bg-white/10 hover:text-white border border-white/10 transition-colors"
                                title="Open Live Preview"
                              >
                                <ExternalLink className="w-3.5 h-3.5" />
                              </Link>

                              {/* Delete Resume */}
                              <button
                                onClick={() =>
                                  setDeleteModal({
                                    isOpen: true,
                                    type: "resume",
                                    id: r._id,
                                    title: `Delete Resume "${r.title || "Untitled"}"?`,
                                    warning:
                                      "This resume will be permanently removed from the database.",
                                  })
                                }
                                className="p-1.5 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 border border-red-500/20 transition-colors"
                                title="Delete Resume"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              {/* Resumes Pagination */}
              <div className="p-4 border-t border-white/10 flex items-center justify-between text-xs text-gray-400">
                <span>
                  Showing {resumes.length} of {resumeTotalCount} resumes
                </span>
                <div className="flex items-center gap-2">
                  <button
                    disabled={resumePage <= 1}
                    onClick={() => setResumePage((p) => Math.max(1, p - 1))}
                    className="p-1.5 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed text-white"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <span className="px-2">
                    Page {resumePage} of {resumeTotalPages}
                  </span>
                  <button
                    disabled={resumePage >= resumeTotalPages}
                    onClick={() => setResumePage((p) => p + 1)}
                    className="p-1.5 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed text-white"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Confirmation Modal */}
      {deleteModal.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
          <div className="max-w-md w-full glass-panel border border-red-500/30 rounded-2xl p-6 shadow-2xl relative">
            <button
              onClick={() =>
                setDeleteModal({ isOpen: false, type: "", id: null, title: "", warning: "" })
              }
              className="absolute top-4 right-4 text-gray-400 hover:text-white p-1"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-3 text-red-400 mb-4">
              <div className="w-10 h-10 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <h4 className="text-base font-bold text-white">{deleteModal.title}</h4>
            </div>

            <p className="text-xs text-gray-300 leading-relaxed mb-6">
              {deleteModal.warning}
            </p>

            <div className="flex items-center justify-end gap-3">
              <button
                onClick={() =>
                  setDeleteModal({ isOpen: false, type: "", id: null, title: "", warning: "" })
                }
                className="px-4 py-2 rounded-xl text-xs font-medium text-gray-300 hover:bg-white/5 border border-white/10 transition-colors"
              >
                Cancel
              </button>

              <button
                onClick={executeDelete}
                disabled={actionLoading}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-red-500 hover:bg-red-600 text-white transition-colors flex items-center gap-2 shadow-lg shadow-red-500/20"
              >
                {actionLoading && <RefreshCw className="w-3.5 h-3.5 animate-spin" />}
                <span>Confirm Delete</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
