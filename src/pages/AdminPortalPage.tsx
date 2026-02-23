import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft, Users, GraduationCap, BookOpen, DollarSign,
  Star, Clock, CheckCircle, BarChart3, Activity, TrendingUp,
  TrendingDown, ArrowUpRight, Crown, Eye, ChevronDown, ChevronUp,
  MousePointerClick, Presentation, FlaskConical, ExternalLink, FileEdit,
  Trash2, Settings, Save, Sparkles, Bot, Zap, TicketCheck, MessageSquare, Briefcase, Search, ArrowDownAZ, ArrowUpAZ, Filter,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription,
} from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel,
  DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { getPublishedCourses } from "@/utils/publishedStorage";
import { PublishedCourse } from "@/types/published";
import {
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, AreaChart, Area,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from "recharts";

const COLORS = [
  "hsl(220, 90%, 56%)", "hsl(160, 60%, 45%)", "hsl(40, 90%, 55%)",
  "hsl(0, 70%, 55%)", "hsl(280, 60%, 55%)", "hsl(190, 70%, 50%)",
];

interface StatCardProps {
  label: string;
  value: string | number;
  icon: React.ElementType;
  trend?: { value: string; positive: boolean };
  description?: string;
  accent?: string;
}

const accentColors: Record<string, { bg: string; text: string; ring: string }> = {
  blue: { bg: "bg-blue-500/10", text: "text-blue-600 dark:text-blue-400", ring: "ring-blue-500/20" },
  emerald: { bg: "bg-emerald-500/10", text: "text-emerald-600 dark:text-emerald-400", ring: "ring-emerald-500/20" },
  violet: { bg: "bg-violet-500/10", text: "text-violet-600 dark:text-violet-400", ring: "ring-violet-500/20" },
  amber: { bg: "bg-amber-500/10", text: "text-amber-600 dark:text-amber-400", ring: "ring-amber-500/20" },
  rose: { bg: "bg-rose-500/10", text: "text-rose-600 dark:text-rose-400", ring: "ring-rose-500/20" },
  cyan: { bg: "bg-cyan-500/10", text: "text-cyan-600 dark:text-cyan-400", ring: "ring-cyan-500/20" },
  default: { bg: "bg-primary/10", text: "text-primary", ring: "ring-primary/20" },
};

const StatCard = ({ label, value, icon: Icon, trend, description, accent = "default" }: StatCardProps) => {
  const colors = accentColors[accent] || accentColors.default;
  return (
    <Card className="group relative overflow-hidden hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 border-border/50 bg-card/80 backdrop-blur-sm">
      <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${colors.bg}`} />
      <CardContent className="relative p-5">
        <div className="flex items-center gap-3 mb-3">
          <div className={`p-2.5 rounded-xl ${colors.bg} ring-1 ${colors.ring}`}>
            <Icon className={`w-4 h-4 ${colors.text}`} />
          </div>
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{label}</p>
        </div>
        <div className="flex items-end justify-between">
          <p className="text-2xl font-bold text-foreground tracking-tight">{value}</p>
          {trend && (
            <span className={`inline-flex items-center gap-0.5 text-xs font-semibold px-2 py-1 rounded-full ${
              trend.positive
                ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                : "bg-rose-500/10 text-rose-600 dark:text-rose-400"
            }`}>
              {trend.positive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
              {trend.value}
            </span>
          )}
        </div>
        {description && <p className="text-[10px] text-muted-foreground/70 mt-1.5">{description}</p>}
      </CardContent>
    </Card>
  );
};

const AdminPortalPage = () => {
  const navigate = useNavigate();
  const courses: PublishedCourse[] = getPublishedCourses();

  const metrics = useMemo(() => {
    const totalInstructors = 8;
    const totalStudents = courses.reduce((sum, c) => sum + (c.enrollments || 0), 0);
    const totalRevenue = courses.reduce((sum, c) => sum + (c.enrollments || 0) * (c.price || 0), 0);
    const totalCourses = courses.length;
    const activeCourses = courses.filter(c => c.status === "active").length;
    const avgRating = courses.length > 0
      ? courses.reduce((sum, c) => sum + (c.rating || 0), 0) / courses.length : 0;
    const totalClicks = courses.reduce((sum, c) => sum + (c.clicks || 0), 0);
    const totalReviews = courses.reduce((sum, c) => sum + (c.reviews || 0), 0);
    const totalBookings = courses.reduce(
      (sum, c) => sum + (c.metricsHistory || []).reduce((s, m) => s + m.bookings, 0), 0
    );
    return { totalInstructors, totalStudents, totalRevenue, totalCourses, activeCourses, avgRating, totalClicks, totalReviews, totalBookings };
  }, [courses]);

  const [expandedInstructor, setExpandedInstructor] = useState<string | null>(null);
  const [expandedStudent, setExpandedStudent] = useState<string | null>(null);
  const [removeDialog, setRemoveDialog] = useState<{ open: boolean; name: string; type: "instructor" | "student" }>({ open: false, name: "", type: "student" });
  const [removedUsers, setRemovedUsers] = useState<Set<string>>(new Set());
  const [viewDialog, setViewDialog] = useState<{ open: boolean; type: "project" | "forum"; title: string; clicks: number; responses: number } | null>(null);
  const [ticketDialog, setTicketDialog] = useState<{ open: boolean; ticket: any } | null>(null);

  // Support ticket filters
  const [ticketSearch, setTicketSearch] = useState("");
  const [ticketPriorityFilter, setTicketPriorityFilter] = useState<string>("all");
  const [ticketStatusFilter, setTicketStatusFilter] = useState<string>("all");
  const [ticketSortBy, setTicketSortBy] = useState<string>("date-desc");

  const handleRemove = () => {
    setRemovedUsers(prev => new Set(prev).add(removeDialog.name));
    setRemoveDialog({ open: false, name: "", type: "student" });
  };

  // Admin credentials (localStorage-based)
  const storedCreds = JSON.parse(localStorage.getItem("admin_credentials") || '{"username":"admin","password":"admin123"}');
  const [adminUsername, setAdminUsername] = useState(storedCreds.username);
  const [adminPassword, setAdminPassword] = useState("");
  const [adminPasswordConfirm, setAdminPasswordConfirm] = useState("");
  const [settingsSaved, setSettingsSaved] = useState(false);

  const handleSaveSettings = () => {
    const creds: any = { username: adminUsername, password: storedCreds.password };
    if (adminPassword && adminPassword === adminPasswordConfirm) {
      creds.password = adminPassword;
    }
    localStorage.setItem("admin_credentials", JSON.stringify(creds));
    setAdminPassword("");
    setAdminPasswordConfirm("");
    setSettingsSaved(true);
    setTimeout(() => setSettingsSaved(false), 2000);
  };

  const topInstructors = [
    { name: "Dr. Sarah Chen", initials: "SC", courses: 4, students: 520, revenue: 15600, rating: 4.9, courseDetails: [
      { title: "Advanced Machine Learning", revenue: 5200, bookings: 42, clicks: 1800, rating: 4.9, students: 180, presentations: ["Intro to ML Algorithms", "Supervised Learning Deep Dive", "Model Evaluation Techniques"], labs: ["Build a Classifier", "Neural Network from Scratch"], status: "published" as const },
      { title: "Data Science Fundamentals", revenue: 4100, bookings: 35, clicks: 1500, rating: 4.8, students: 140, presentations: ["Data Wrangling Basics", "Statistical Analysis"], labs: ["Pandas Workshop", "Data Visualization Lab"], status: "published" as const },
      { title: "Python for AI", revenue: 3800, bookings: 28, clicks: 1200, rating: 4.9, students: 120, presentations: ["Python Refresher"], labs: [], status: "published" as const },
      { title: "Neural Networks Deep Dive", revenue: 2500, bookings: 18, clicks: 900, rating: 5.0, students: 80, presentations: [], labs: ["CNN Image Classifier"], status: "published" as const },
      { title: "Reinforcement Learning Intro", revenue: 0, bookings: 0, clicks: 0, rating: 0, students: 0, presentations: ["RL Basics"], labs: [], status: "draft" as const },
    ]},
    { name: "Prof. James Wilson", initials: "JW", courses: 3, students: 380, revenue: 11400, rating: 4.7, courseDetails: [
      { title: "Web Development Bootcamp", revenue: 4800, bookings: 38, clicks: 1600, rating: 4.7, students: 160, presentations: ["HTML & CSS Foundations", "Responsive Design"], labs: ["Build a Portfolio Site", "CSS Grid Challenge"], status: "published" as const },
      { title: "React Masterclass", revenue: 3600, bookings: 30, clicks: 1300, rating: 4.8, students: 120, presentations: ["Component Architecture", "State Management"], labs: ["Todo App Lab"], status: "published" as const },
      { title: "JavaScript Essentials", revenue: 3000, bookings: 25, clicks: 1100, rating: 4.6, students: 100, presentations: ["ES6+ Features"], labs: [], status: "published" as const },
      { title: "TypeScript Advanced Patterns", revenue: 0, bookings: 0, clicks: 0, rating: 0, students: 0, presentations: [], labs: [], status: "draft" as const },
      { title: "Next.js Full Stack Guide", revenue: 0, bookings: 0, clicks: 0, rating: 0, students: 0, presentations: ["App Router Overview"], labs: ["API Routes Lab"], status: "draft" as const },
    ]},
    { name: "Maria Garcia", initials: "MG", courses: 2, students: 210, revenue: 6300, rating: 4.8, courseDetails: [
      { title: "UX Design Principles", revenue: 3500, bookings: 22, clicks: 950, rating: 4.9, students: 120, presentations: ["Design Thinking Workshop", "User Research Methods"], labs: ["Wireframing Lab"], status: "published" as const },
      { title: "Figma for Teams", revenue: 2800, bookings: 18, clicks: 800, rating: 4.7, students: 90, presentations: ["Figma Basics"], labs: ["Collaborative Design Lab"], status: "published" as const },
      { title: "Accessibility in Design", revenue: 0, bookings: 0, clicks: 0, rating: 0, students: 0, presentations: [], labs: [], status: "draft" as const },
    ]},
    { name: "Alex Thompson", initials: "AT", courses: 2, students: 180, revenue: 5400, rating: 4.6, courseDetails: [
      { title: "Cloud Architecture", revenue: 3200, bookings: 20, clicks: 850, rating: 4.6, students: 100, presentations: ["Cloud Fundamentals", "Microservices Overview"], labs: ["Deploy to AWS Lab"], status: "published" as const },
      { title: "AWS Certified Prep", revenue: 2200, bookings: 15, clicks: 700, rating: 4.6, students: 80, presentations: ["Exam Strategy"], labs: [], status: "published" as const },
    ]},
    { name: "Dr. Emily Park", initials: "EP", courses: 1, students: 95, revenue: 2850, rating: 4.5, courseDetails: [
      { title: "Intro to Cybersecurity", revenue: 2850, bookings: 12, clicks: 600, rating: 4.5, students: 95, presentations: ["Threat Landscape Overview"], labs: ["Penetration Testing Basics"], status: "published" as const },
      { title: "Ethical Hacking Fundamentals", revenue: 0, bookings: 0, clicks: 0, rating: 0, students: 0, presentations: ["Recon Techniques"], labs: ["Kali Linux Setup"], status: "draft" as const },
    ]},
  ];

  const topCourses = useMemo(() =>
    [...courses].sort((a, b) => (b.enrollments || 0) - (a.enrollments || 0)).slice(0, 5),
    [courses]
  );

  const categoryData = useMemo(() => {
    const map = courses.reduce((acc, c) => {
      const cat = c.category || "Uncategorized";
      acc[cat] = (acc[cat] || 0) + (c.enrollments || 0);
      return acc;
    }, {} as Record<string, number>);
    return Object.entries(map).map(([name, value]) => ({ name, value }));
  }, [courses]);

  const revenuePerCategory = useMemo(() => {
    const map = courses.reduce((acc, c) => {
      const cat = c.category || "Uncategorized";
      acc[cat] = (acc[cat] || 0) + (c.enrollments || 0) * (c.price || 0);
      return acc;
    }, {} as Record<string, number>);
    return Object.entries(map).map(([name, revenue]) => ({ name, revenue }));
  }, [courses]);

  const monthlyGrowth = [
    { month: "Jan", students: 120, instructors: 3, revenue: 3600 },
    { month: "Feb", students: 180, instructors: 4, revenue: 5400 },
    { month: "Mar", students: 250, instructors: 5, revenue: 7500 },
    { month: "Apr", students: 310, instructors: 5, revenue: 9300 },
    { month: "May", students: 420, instructors: 6, revenue: 12600 },
    { month: "Jun", students: metrics.totalStudents || 480, instructors: metrics.totalInstructors, revenue: metrics.totalRevenue || 14400 },
  ];

  // Stable completion rates per course
  const courseCompletionRates = useMemo(() => {
    const rates: Record<string, number> = {};
    topCourses.forEach((c, i) => { rates[c.id] = [78, 65, 82, 71, 88][i] || 70; });
    return rates;
  }, [topCourses]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-10">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-10">
          <Button variant="outline" size="icon" onClick={() => navigate("/")} className="self-start">
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-1">
              <h1 className="text-2xl md:text-3xl font-bold text-foreground tracking-tight">Admin Portal</h1>
              <Badge variant="secondary" className="text-[10px]">Live</Badge>
            </div>
            <p className="text-sm text-muted-foreground">
              Monitor platform health, instructor performance, and student engagement — all in one place.
            </p>
          </div>
        </div>

        {/* Primary KPIs */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
          <StatCard label="Instructors" value={metrics.totalInstructors} icon={Users} trend={{ value: "+2", positive: true }} accent="violet" />
          <StatCard label="Students" value={metrics.totalStudents.toLocaleString()} icon={GraduationCap} trend={{ value: "+15%", positive: true }} accent="blue" />
          <StatCard label="Courses" value={metrics.totalCourses} icon={BookOpen} trend={{ value: "+3", positive: true }} accent="cyan" />
          <StatCard label="Revenue" value={`$${metrics.totalRevenue.toLocaleString()}`} icon={DollarSign} trend={{ value: "+8%", positive: true }} accent="emerald" />
          <StatCard label="Avg Rating" value={metrics.avgRating.toFixed(1)} icon={Star} description="Based on all reviews" accent="amber" />
          <StatCard label="Platform Profit" value={`$${Math.round(metrics.totalRevenue * 0.15).toLocaleString()}`} icon={TrendingUp} trend={{ value: "+10%", positive: true }} accent="emerald" />
        </div>

        {/* Secondary KPIs */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          <StatCard label="Total Clicks" value={metrics.totalClicks.toLocaleString()} icon={Activity} accent="blue" />
          <StatCard label="Total Bookings" value={metrics.totalBookings.toLocaleString()} icon={Clock} accent="violet" />
          <StatCard label="Total Reviews" value={metrics.totalReviews.toLocaleString()} icon={Star} accent="amber" />
          <StatCard label="Active Courses" value={metrics.activeCourses} icon={BarChart3} accent="cyan" />
        </div>

        <Separator className="mb-8" />

        {/* Tabs */}
        <Tabs defaultValue="overview" className="space-y-8">
          <TabsList className="bg-muted/50 p-1">
            <TabsTrigger value="overview" className="data-[state=active]:bg-background data-[state=active]:shadow-sm">
              <BarChart3 className="w-4 h-4 mr-1.5" /> Overview
            </TabsTrigger>
            <TabsTrigger value="instructors" className="data-[state=active]:bg-background data-[state=active]:shadow-sm">
              <Users className="w-4 h-4 mr-1.5" /> Instructors
            </TabsTrigger>
            <TabsTrigger value="students" className="data-[state=active]:bg-background data-[state=active]:shadow-sm">
              <GraduationCap className="w-4 h-4 mr-1.5" /> Students
            </TabsTrigger>
            <TabsTrigger value="support" className="data-[state=active]:bg-background data-[state=active]:shadow-sm">
              <TicketCheck className="w-4 h-4 mr-1.5" /> Support
            </TabsTrigger>
            <TabsTrigger value="settings" className="data-[state=active]:bg-background data-[state=active]:shadow-sm">
              <Settings className="w-4 h-4 mr-1.5" /> Settings
            </TabsTrigger>
          </TabsList>

          {/* ===== OVERVIEW ===== */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-3 gap-4">
              <StatCard label="Explore Page Clicks" value={(Math.floor(Math.random() * 5000) + 8000).toLocaleString()} icon={MousePointerClick} trend={{ value: "+12%", positive: true }} accent="blue" />
              <StatCard label="Projects Page Clicks" value={(Math.floor(Math.random() * 3000) + 4500).toLocaleString()} icon={Presentation} trend={{ value: "+9%", positive: true }} accent="violet" />
              <StatCard label="Forum Posts" value={(Math.floor(Math.random() * 500) + 1200).toLocaleString()} icon={FileEdit} trend={{ value: "+18%", positive: true }} accent="amber" />
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="border-border/60">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base font-semibold">Platform Growth</CardTitle>
                  <CardDescription>Monthly student & instructor growth</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={280}>
                    <AreaChart data={monthlyGrowth}>
                      <defs>
                        <linearGradient id="gradStudents" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="hsl(220, 90%, 56%)" stopOpacity={0.2} />
                          <stop offset="95%" stopColor="hsl(220, 90%, 56%)" stopOpacity={0} />
                        </linearGradient>
                        <linearGradient id="gradInstructors" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="hsl(160, 60%, 45%)" stopOpacity={0.2} />
                          <stop offset="95%" stopColor="hsl(160, 60%, 45%)" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" className="stroke-border/40" />
                      <XAxis dataKey="month" tick={{ fontSize: 12 }} className="text-muted-foreground" />
                      <YAxis tick={{ fontSize: 12 }} className="text-muted-foreground" />
                      <Tooltip contentStyle={{ borderRadius: 8, border: "1px solid hsl(var(--border))", fontSize: 12 }} />
                      <Legend wrapperStyle={{ fontSize: 12 }} />
                      <Area type="monotone" dataKey="students" stroke="hsl(220, 90%, 56%)" fill="url(#gradStudents)" strokeWidth={2} name="Students Joined" />
                      <Area type="monotone" dataKey="instructors" stroke="hsl(160, 60%, 45%)" fill="url(#gradInstructors)" strokeWidth={2} name="Instructors Joined" />
                    </AreaChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card className="border-border/60">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base font-semibold">Revenue per Category</CardTitle>
                  <CardDescription>Lifetime revenue by course category</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={280}>
                    <BarChart data={revenuePerCategory} barSize={32}>
                      <CartesianGrid strokeDasharray="3 3" className="stroke-border/40" />
                      <XAxis dataKey="name" tick={{ fontSize: 10 }} className="text-muted-foreground" />
                      <YAxis tick={{ fontSize: 12 }} className="text-muted-foreground" />
                      <Tooltip contentStyle={{ borderRadius: 8, border: "1px solid hsl(var(--border))", fontSize: 12 }} formatter={(v: number) => `$${v.toLocaleString()}`} />
                      <Bar dataKey="revenue" fill="hsl(220, 90%, 56%)" radius={[6, 6, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card className="border-border/60">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base font-semibold">Enrollment by Category</CardTitle>
                  <CardDescription>Where your students are learning</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={280}>
                    <PieChart>
                      <Pie data={categoryData} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={60} outerRadius={100} paddingAngle={4} label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                        {categoryData.map((_, i) => (
                          <Cell key={i} fill={COLORS[i % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip contentStyle={{ borderRadius: 8, border: "1px solid hsl(var(--border))", fontSize: 12 }} />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card className="border-border/60">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base font-semibold">Projects & Applicants by Category</CardTitle>
                  <CardDescription>Number of projects posted and applicants per category</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={280}>
                    <BarChart data={[
                      { category: "Technology", projects: 42, applicants: 185 },
                      { category: "Marketing", projects: 28, applicants: 120 },
                      { category: "Design", projects: 35, applicants: 155 },
                      { category: "Data Science", projects: 22, applicants: 98 },
                      { category: "Business", projects: 18, applicants: 72 },
                      { category: "Health", projects: 15, applicants: 58 },
                    ]} barSize={20}>
                      <CartesianGrid strokeDasharray="3 3" className="stroke-border/40" />
                      <XAxis dataKey="category" tick={{ fontSize: 10 }} className="text-muted-foreground" />
                      <YAxis tick={{ fontSize: 12 }} className="text-muted-foreground" />
                      <Tooltip contentStyle={{ borderRadius: 8, border: "1px solid hsl(var(--border))", fontSize: 12 }} />
                      <Legend wrapperStyle={{ fontSize: 12 }} />
                      <Bar dataKey="projects" fill="hsl(280, 60%, 55%)" radius={[6, 6, 0, 0]} name="Projects Posted" />
                      <Bar dataKey="applicants" fill="hsl(190, 70%, 50%)" radius={[6, 6, 0, 0]} name="Applicants" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card className="border-border/60">
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-base font-semibold">Top Courses</CardTitle>
                      <CardDescription>By enrollment count</CardDescription>
                    </div>
                    <Crown className="w-4 h-4 text-amber-500" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {topCourses.map((course, i) => (
                      <div key={course.id} className="flex items-center gap-3 p-3 rounded-lg border border-border/40 bg-muted/20 hover:bg-muted/40 transition-colors">
                        <span className="flex items-center justify-center w-7 h-7 rounded-full bg-primary/10 text-primary text-xs font-bold shrink-0">
                          {i + 1}
                        </span>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">{course.title}</p>
                          <p className="text-xs text-muted-foreground">{course.enrollments} students · ${((course.enrollments || 0) * (course.price || 0)).toLocaleString()}</p>
                        </div>
                        <div className="flex items-center gap-1 shrink-0">
                          <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                          <span className="text-sm font-semibold">{course.rating?.toFixed(1) || "–"}</span>
                        </div>
                      </div>
                    ))}
                    {topCourses.length === 0 && (
                      <p className="text-muted-foreground text-center py-12 text-sm">No courses published yet</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* AI Metrics Section */}
            <Separator />
            <div>
              <h3 className="text-base font-semibold text-foreground mb-4 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-violet-500" /> AI Usage Metrics
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <StatCard label="Total AI Prompts" value="3,842" icon={Bot} trend={{ value: "+22%", positive: true }} accent="violet" />
                <StatCard label="AI Button Clicks" value="5,610" icon={Zap} trend={{ value: "+18%", positive: true }} accent="amber" />
                <StatCard label="Avg Prompts / User" value="4.8" icon={Sparkles} accent="cyan" />
                <StatCard label="AI Success Rate" value="94%" icon={CheckCircle} trend={{ value: "+3%", positive: true }} accent="emerald" />
              </div>
              <Card className="border-border/60">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base font-semibold">AI Prompts by Feature</CardTitle>
                  <CardDescription>Breakdown of AI usage across creation tools</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={280}>
                    <BarChart data={[
                      { feature: "Course Creation", prompts: 1420, clicks: 2100 },
                      { feature: "Profile Creation", prompts: 890, clicks: 1350 },
                      { feature: "Lab Creation", prompts: 680, clicks: 980 },
                      { feature: "Presentation Creation", prompts: 852, clicks: 1180 },
                    ]} barSize={24}>
                      <CartesianGrid strokeDasharray="3 3" className="stroke-border/40" />
                      <XAxis dataKey="feature" tick={{ fontSize: 11 }} className="text-muted-foreground" />
                      <YAxis tick={{ fontSize: 12 }} className="text-muted-foreground" />
                      <Tooltip contentStyle={{ borderRadius: 8, border: "1px solid hsl(var(--border))", fontSize: 12 }} />
                      <Legend wrapperStyle={{ fontSize: 12 }} />
                      <Bar dataKey="prompts" fill="hsl(280, 60%, 55%)" radius={[6, 6, 0, 0]} name="Prompts Used" />
                      <Bar dataKey="clicks" fill="hsl(40, 90%, 55%)" radius={[6, 6, 0, 0]} name="AI Button Clicks" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* ===== INSTRUCTORS ===== */}
          <TabsContent value="instructors" className="space-y-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <StatCard label="Total Quizzes" value="128" icon={CheckCircle} trend={{ value: "+10%", positive: true }} accent="blue" />
              <StatCard label="Total Assignments" value="95" icon={FileEdit} trend={{ value: "+8%", positive: true }} accent="amber" />
              <StatCard label="Total Labs" value="64" icon={FlaskConical} trend={{ value: "+14%", positive: true }} accent="emerald" />
              <StatCard label="Total Presentations" value="112" icon={Presentation} trend={{ value: "+11%", positive: true }} accent="violet" />
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              <StatCard label="Avg Courses" value={(metrics.totalCourses / metrics.totalInstructors).toFixed(1)} icon={BookOpen} accent="blue" />
              <StatCard label="Avg Students" value={Math.round(metrics.totalStudents / metrics.totalInstructors).toLocaleString()} icon={GraduationCap} accent="cyan" />
              <StatCard label="Avg Revenue" value={`$${Math.round(metrics.totalRevenue / metrics.totalInstructors).toLocaleString()}`} icon={DollarSign} accent="emerald" />
              <StatCard label="Avg Profit" value={`$${Math.round(metrics.totalRevenue * 0.3 / metrics.totalInstructors).toLocaleString()}`} icon={TrendingUp} accent="emerald" />
              <StatCard label="Avg Bookings" value={Math.round(metrics.totalBookings / metrics.totalInstructors).toLocaleString()} icon={Clock} accent="violet" />
              <StatCard label="Avg Clicks" value={Math.round(metrics.totalClicks / metrics.totalInstructors).toLocaleString()} icon={Activity} accent="amber" />
            </div>
            <Card className="border-border/60">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-base font-semibold">Instructor Leaderboard</CardTitle>
                    <CardDescription>Top performers by revenue and ratings</CardDescription>
                  </div>
                  <Crown className="w-4 h-4 text-amber-500" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {topInstructors.filter(inst => !removedUsers.has(inst.name)).map((inst, i) => {
                    const isExpanded = expandedInstructor === inst.name;
                    return (
                      <div key={inst.name} className="rounded-xl border border-border/40 overflow-hidden">
                        {/* Top row: Name + Actions */}
                        <div className="flex items-center justify-between gap-3 px-5 py-3 bg-muted/30">
                          <div className="min-w-0">
                            <p className="text-sm font-bold text-foreground">{inst.name}</p>
                            <p className="text-[11px] text-muted-foreground">
                              {inst.courseDetails.filter(c => c.status === "published").length} published · {inst.courseDetails.filter(c => c.status === "draft").length} draft{inst.courseDetails.filter(c => c.status === "draft").length !== 1 ? "s" : ""}
                            </p>
                          </div>
                          <div className="flex items-center gap-1.5 shrink-0">
                            <Button variant="outline" size="sm" className="gap-1 h-7 text-xs" onClick={() => setExpandedInstructor(isExpanded ? null : inst.name)}>
                              {isExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                              Details
                            </Button>
                            <Button variant="outline" size="sm" className="gap-1 h-7 text-xs">
                              <Eye className="w-3 h-3" /> Profile
                            </Button>
                            <Button
                              variant="outline" size="sm"
                              className="gap-1 h-7 text-xs text-destructive hover:bg-destructive/10 hover:text-destructive border-destructive/30"
                              onClick={() => setRemoveDialog({ open: true, name: inst.name, type: "instructor" })}
                            >
                              <Trash2 className="w-3 h-3" /> Remove
                            </Button>
                          </div>
                        </div>
                        {/* Bottom row: Metrics */}
                        <div className="grid grid-cols-3 sm:grid-cols-6 gap-px bg-border/30">
                          {[
                            { label: "Students", value: inst.students.toLocaleString() },
                            { label: "Revenue", value: `$${inst.revenue.toLocaleString()}` },
                            { label: "Profit", value: `$${Math.round(inst.revenue * 0.3).toLocaleString()}`, highlight: true },
                            { label: "Bookings", value: inst.courseDetails.filter(c => c.status === "published").reduce((s, c) => s + c.bookings, 0).toLocaleString() },
                            { label: "Clicks", value: inst.courseDetails.filter(c => c.status === "published").reduce((s, c) => s + c.clicks, 0).toLocaleString() },
                            { label: "Rating", value: inst.rating.toString(), icon: true },
                          ].map((m) => (
                            <div key={m.label} className="bg-background px-4 py-3 text-center">
                              <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-0.5">{m.label}</p>
                              <div className="flex items-center justify-center gap-1">
                                {m.icon && <Star className="w-3 h-3 text-amber-500 fill-amber-500" />}
                                <p className={`text-sm font-bold ${m.highlight ? "text-emerald-600 dark:text-emerald-400" : "text-foreground"}`}>{m.value}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                        {isExpanded && (
                          <div className="border-t border-border/40 bg-background p-4 space-y-4">
                            {(() => {
                              const published = inst.courseDetails.filter(c => c.status === "published");
                              const drafts = inst.courseDetails.filter(c => c.status === "draft");
                              return (
                                <>
                                  {published.length > 0 && (
                                    <div className="space-y-2">
                                      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Published Courses ({published.length})</p>
                                      {published.map((course) => (
                                        <div key={course.title} className="p-3 rounded-lg border border-border/30 bg-muted/10 hover:bg-muted/30 transition-colors space-y-3">
                                          <div className="flex items-center gap-2">
                                            <p className="text-sm font-medium">{course.title}</p>
                                            <Badge variant="default" className="text-[9px] px-1.5 py-0">Published</Badge>
                                          </div>
                                          <div className="grid grid-cols-6 gap-3">
                                            <div className="text-center">
                                              <p className="text-[10px] text-muted-foreground">Revenue</p>
                                              <p className="text-sm font-bold text-foreground">${course.revenue.toLocaleString()}</p>
                                            </div>
                                            <div className="text-center">
                                              <p className="text-[10px] text-muted-foreground">Platform Profit</p>
                                              <p className="text-sm font-bold text-emerald-600">${Math.round(course.revenue * 0.3).toLocaleString()}</p>
                                            </div>
                                            <div className="text-center">
                                              <p className="text-[10px] text-muted-foreground">Students</p>
                                              <p className="text-sm font-bold text-foreground">{course.students}</p>
                                            </div>
                                            <div className="text-center">
                                              <p className="text-[10px] text-muted-foreground">Bookings</p>
                                              <p className="text-sm font-bold text-foreground">{course.bookings}</p>
                                            </div>
                                            <div className="text-center">
                                              <p className="text-[10px] text-muted-foreground">Clicks</p>
                                              <p className="text-sm font-bold text-foreground">{course.clicks.toLocaleString()}</p>
                                            </div>
                                            <div className="text-center">
                                              <p className="text-[10px] text-muted-foreground">Rating</p>
                                              <div className="flex items-center justify-center gap-0.5">
                                                <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
                                                <p className="text-sm font-bold text-foreground">{course.rating}</p>
                                              </div>
                                            </div>
                                          </div>
                                          <div className="flex items-center gap-2 pt-2 border-t border-border/30">
                                            <DropdownMenu>
                                              <DropdownMenuTrigger asChild>
                                                <Button variant="outline" size="sm" className="gap-1.5 text-xs">
                                                  <Presentation className="w-3.5 h-3.5" />
                                                  Presentations ({course.presentations.length})
                                                  <ChevronDown className="w-3 h-3" />
                                                </Button>
                                              </DropdownMenuTrigger>
                                              <DropdownMenuContent align="start" className="w-64 bg-popover z-50">
                                                <DropdownMenuLabel className="text-xs">Presentations</DropdownMenuLabel>
                                                <DropdownMenuSeparator />
                                                {course.presentations.length > 0 ? course.presentations.map((p) => (
                                                  <DropdownMenuItem key={p} className="flex items-center justify-between gap-2 cursor-pointer">
                                                    <span className="text-xs truncate">{p}</span>
                                                    <ExternalLink className="w-3 h-3 text-muted-foreground shrink-0" />
                                                  </DropdownMenuItem>
                                                )) : (
                                                  <DropdownMenuItem disabled className="text-xs italic text-muted-foreground">No presentations created</DropdownMenuItem>
                                                )}
                                              </DropdownMenuContent>
                                            </DropdownMenu>
                                            <DropdownMenu>
                                              <DropdownMenuTrigger asChild>
                                                <Button variant="outline" size="sm" className="gap-1.5 text-xs">
                                                  <FlaskConical className="w-3.5 h-3.5" />
                                                  Labs ({course.labs.length})
                                                  <ChevronDown className="w-3 h-3" />
                                                </Button>
                                              </DropdownMenuTrigger>
                                              <DropdownMenuContent align="start" className="w-64 bg-popover z-50">
                                                <DropdownMenuLabel className="text-xs">Labs</DropdownMenuLabel>
                                                <DropdownMenuSeparator />
                                                {course.labs.length > 0 ? course.labs.map((l) => (
                                                  <DropdownMenuItem key={l} className="flex items-center justify-between gap-2 cursor-pointer">
                                                    <span className="text-xs truncate">{l}</span>
                                                    <ExternalLink className="w-3 h-3 text-muted-foreground shrink-0" />
                                                  </DropdownMenuItem>
                                                )) : (
                                                  <DropdownMenuItem disabled className="text-xs italic text-muted-foreground">No labs created</DropdownMenuItem>
                                                )}
                                              </DropdownMenuContent>
                                            </DropdownMenu>
                                          </div>
                                        </div>
                                      ))}
                                    </div>
                                  )}

                                  {drafts.length > 0 && (
                                    <div className="space-y-2">
                                      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Draft Courses ({drafts.length})</p>
                                      {drafts.map((course) => (
                                        <div key={course.title} className="p-3 rounded-lg border border-dashed border-border/50 bg-muted/5 hover:bg-muted/20 transition-colors space-y-3">
                                          <div className="flex items-center gap-2">
                                            <FileEdit className="w-3.5 h-3.5 text-muted-foreground" />
                                            <p className="text-sm font-medium text-muted-foreground">{course.title}</p>
                                            <Badge variant="outline" className="text-[9px] px-1.5 py-0 border-amber-500/50 text-amber-600">Draft</Badge>
                                          </div>
                                          <p className="text-xs text-muted-foreground/70 italic">Not yet published — no metrics available</p>
                                          {(course.presentations.length > 0 || course.labs.length > 0) && (
                                            <div className="flex items-center gap-2 pt-2 border-t border-border/20">
                                              {course.presentations.length > 0 && (
                                                <DropdownMenu>
                                                  <DropdownMenuTrigger asChild>
                                                    <Button variant="outline" size="sm" className="gap-1.5 text-xs">
                                                      <Presentation className="w-3.5 h-3.5" />
                                                      Presentations ({course.presentations.length})
                                                      <ChevronDown className="w-3 h-3" />
                                                    </Button>
                                                  </DropdownMenuTrigger>
                                                  <DropdownMenuContent align="start" className="w-64 bg-popover z-50">
                                                    <DropdownMenuLabel className="text-xs">Presentations</DropdownMenuLabel>
                                                    <DropdownMenuSeparator />
                                                    {course.presentations.map((p) => (
                                                      <DropdownMenuItem key={p} className="flex items-center justify-between gap-2 cursor-pointer">
                                                        <span className="text-xs truncate">{p}</span>
                                                        <ExternalLink className="w-3 h-3 text-muted-foreground shrink-0" />
                                                      </DropdownMenuItem>
                                                    ))}
                                                  </DropdownMenuContent>
                                                </DropdownMenu>
                                              )}
                                              {course.labs.length > 0 && (
                                                <DropdownMenu>
                                                  <DropdownMenuTrigger asChild>
                                                    <Button variant="outline" size="sm" className="gap-1.5 text-xs">
                                                      <FlaskConical className="w-3.5 h-3.5" />
                                                      Labs ({course.labs.length})
                                                      <ChevronDown className="w-3 h-3" />
                                                    </Button>
                                                  </DropdownMenuTrigger>
                                                  <DropdownMenuContent align="start" className="w-64 bg-popover z-50">
                                                    <DropdownMenuLabel className="text-xs">Labs</DropdownMenuLabel>
                                                    <DropdownMenuSeparator />
                                                    {course.labs.map((l) => (
                                                      <DropdownMenuItem key={l} className="flex items-center justify-between gap-2 cursor-pointer">
                                                        <span className="text-xs truncate">{l}</span>
                                                        <ExternalLink className="w-3 h-3 text-muted-foreground shrink-0" />
                                                      </DropdownMenuItem>
                                                    ))}
                                                  </DropdownMenuContent>
                                                </DropdownMenu>
                                              )}
                                            </div>
                                          )}
                                        </div>
                                      ))}
                                    </div>
                                  )}
                                </>
                              );
                            })()}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* ===== STUDENTS ===== */}
          <TabsContent value="students" className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <StatCard label="Total Enrollments" value={metrics.totalStudents.toLocaleString()} icon={GraduationCap} trend={{ value: "+15%", positive: true }} accent="blue" />
              <StatCard label="Total Bookings" value={metrics.totalBookings.toLocaleString()} icon={Clock} trend={{ value: "+12%", positive: true }} accent="violet" />
            </div>

            <Card className="border-border/60">
              <CardHeader className="pb-2">
                <CardTitle className="text-base font-semibold">Enrollment Trends</CardTitle>
                <CardDescription>Monthly new student enrollments</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={monthlyGrowth}>
                    <defs>
                      <linearGradient id="gradEnroll" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="hsl(160, 60%, 45%)" stopOpacity={0.2} />
                        <stop offset="95%" stopColor="hsl(160, 60%, 45%)" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-border/40" />
                    <XAxis dataKey="month" tick={{ fontSize: 12 }} className="text-muted-foreground" />
                    <YAxis tick={{ fontSize: 12 }} className="text-muted-foreground" />
                    <Tooltip contentStyle={{ borderRadius: 8, border: "1px solid hsl(var(--border))", fontSize: 12 }} />
                    <Area type="monotone" dataKey="students" stroke="hsl(160, 60%, 45%)" fill="url(#gradEnroll)" strokeWidth={2} name="New Students" />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            {/* Student List */}
            <Card className="border-border/60">
              <CardHeader className="pb-2">
                <CardTitle className="text-base font-semibold">All Students</CardTitle>
                <CardDescription>Student activity breakdown across courses</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-border/50">
                        <th className="text-left py-3 px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Name</th>
                        <th className="text-left py-3 px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Email</th>
                        <th className="text-center py-3 px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Bookings</th>
                        <th className="text-center py-3 px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Projects</th>
                        <th className="text-center py-3 px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Quizzes</th>
                        <th className="text-center py-3 px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Labs</th>
                        <th className="text-center py-3 px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        { name: "Sarah Johnson", email: "sarah.johnson@example.com", bookings: 8, projects: 3, quizzes: 15, labs: 6, forumPosts: 5,
                          projectDetails: [
                            { title: "E-commerce Dashboard", clicks: 142, responses: 18 },
                            { title: "Weather App Redesign", clicks: 98, responses: 12 },
                            { title: "Portfolio Website", clicks: 67, responses: 8 },
                          ],
                          forumDetails: [
                            { title: "Best practices for React state management?", clicks: 230, responses: 24 },
                            { title: "How to optimize API calls in useEffect?", clicks: 180, responses: 19 },
                            { title: "CSS Grid vs Flexbox for layouts", clicks: 156, responses: 15 },
                            { title: "TypeScript generics explained", clicks: 120, responses: 11 },
                            { title: "Deploying to Vercel tips", clicks: 95, responses: 7 },
                          ]
                        },
                        { name: "Mike Chen", email: "mike.chen@example.com", bookings: 5, projects: 1, quizzes: 11, labs: 4, forumPosts: 2,
                          projectDetails: [{ title: "Chat Application", clicks: 85, responses: 9 }],
                          forumDetails: [
                            { title: "WebSocket vs SSE for real-time?", clicks: 112, responses: 14 },
                            { title: "MongoDB aggregation pipeline help", clicks: 78, responses: 6 },
                          ]
                        },
                        { name: "Emma Williams", email: "emma.williams@example.com", bookings: 12, projects: 5, quizzes: 22, labs: 9, forumPosts: 8,
                          projectDetails: [
                            { title: "Task Management Tool", clicks: 210, responses: 25 },
                            { title: "Recipe Sharing Platform", clicks: 175, responses: 20 },
                            { title: "Fitness Tracker App", clicks: 130, responses: 14 },
                            { title: "Blog CMS", clicks: 95, responses: 10 },
                            { title: "Budget Calculator", clicks: 60, responses: 5 },
                          ],
                          forumDetails: [
                            { title: "Next.js 14 app router confusion", clicks: 340, responses: 32 },
                            { title: "Tailwind CSS dark mode setup", clicks: 210, responses: 18 },
                            { title: "How to structure a monorepo?", clicks: 185, responses: 16 },
                            { title: "Testing React components best approach?", clicks: 150, responses: 13 },
                            { title: "Prisma vs Drizzle ORM", clicks: 120, responses: 11 },
                            { title: "Docker for beginners tips", clicks: 95, responses: 8 },
                            { title: "CI/CD pipeline setup guide", clicks: 80, responses: 6 },
                            { title: "Responsive design patterns", clicks: 70, responses: 5 },
                          ]
                        },
                        { name: "James Brown", email: "james.brown@example.com", bookings: 3, projects: 0, quizzes: 8, labs: 3, forumPosts: 1,
                          projectDetails: [],
                          forumDetails: [{ title: "Getting started with Git?", clicks: 45, responses: 4 }]
                        },
                        { name: "Lisa Garcia", email: "lisa.garcia@example.com", bookings: 7, projects: 2, quizzes: 17, labs: 7, forumPosts: 3,
                          projectDetails: [
                            { title: "Social Media Dashboard", clicks: 155, responses: 16 },
                            { title: "Inventory System", clicks: 110, responses: 12 },
                          ],
                          forumDetails: [
                            { title: "Authentication patterns in React", clicks: 190, responses: 20 },
                            { title: "Supabase RLS policies help", clicks: 140, responses: 15 },
                            { title: "Best UI libraries for 2025", clicks: 105, responses: 9 },
                          ]
                        },
                        { name: "David Miller", email: "david.miller@example.com", bookings: 10, projects: 4, quizzes: 20, labs: 8, forumPosts: 6,
                          projectDetails: [
                            { title: "AI Image Generator", clicks: 280, responses: 30 },
                            { title: "Music Player App", clicks: 165, responses: 18 },
                            { title: "Real-time Collaboration Tool", clicks: 140, responses: 15 },
                            { title: "API Gateway Service", clicks: 95, responses: 8 },
                          ],
                          forumDetails: [
                            { title: "OpenAI API integration tips", clicks: 420, responses: 38 },
                            { title: "Streaming responses in Node.js", clicks: 250, responses: 22 },
                            { title: "Edge functions vs serverless", clicks: 180, responses: 16 },
                            { title: "Rate limiting strategies", clicks: 130, responses: 11 },
                            { title: "GraphQL vs REST in 2025", clicks: 110, responses: 9 },
                            { title: "Caching strategies for APIs", clicks: 90, responses: 7 },
                          ]
                        },
                        { name: "Sofia Rodriguez", email: "sofia.rodriguez@example.com", bookings: 6, projects: 1, quizzes: 13, labs: 5, forumPosts: 0,
                          projectDetails: [{ title: "Language Learning App", clicks: 120, responses: 13 }],
                          forumDetails: []
                        },
                        { name: "Chris Lee", email: "chris.lee@example.com", bookings: 4, projects: 0, quizzes: 9, labs: 3, forumPosts: 0,
                          projectDetails: [],
                          forumDetails: []
                        },
                        { name: "Anna Taylor", email: "anna.taylor@example.com", bookings: 9, projects: 3, quizzes: 19, labs: 8, forumPosts: 4,
                          projectDetails: [
                            { title: "Event Planning Platform", clicks: 190, responses: 22 },
                            { title: "Study Group Finder", clicks: 145, responses: 16 },
                            { title: "Habit Tracker", clicks: 88, responses: 7 },
                          ],
                          forumDetails: [
                            { title: "React Native vs Flutter?", clicks: 310, responses: 28 },
                            { title: "Best practices for form validation", clicks: 175, responses: 15 },
                            { title: "Zustand vs Redux Toolkit", clicks: 140, responses: 12 },
                            { title: "Accessibility checklist for web apps", clicks: 110, responses: 9 },
                          ]
                        },
                        { name: "Ryan Martinez", email: "ryan.martinez@example.com", bookings: 11, projects: 2, quizzes: 21, labs: 10, forumPosts: 7,
                          projectDetails: [
                            { title: "DevOps Dashboard", clicks: 230, responses: 26 },
                            { title: "Kubernetes Visualizer", clicks: 185, responses: 20 },
                          ],
                          forumDetails: [
                            { title: "Kubernetes vs Docker Swarm", clicks: 280, responses: 25 },
                            { title: "Terraform best practices", clicks: 210, responses: 19 },
                            { title: "AWS Lambda cold start optimization", clicks: 175, responses: 15 },
                            { title: "GitOps workflow setup", clicks: 140, responses: 12 },
                            { title: "Monitoring with Prometheus", clicks: 120, responses: 10 },
                            { title: "Service mesh explained", clicks: 95, responses: 8 },
                            { title: "Infrastructure as Code tips", clicks: 80, responses: 6 },
                          ]
                        },
                      ].filter(s => !removedUsers.has(s.name)).map((student) => (
                        <React.Fragment key={student.email}>
                          <tr className="border-b border-border/30 hover:bg-muted/30 transition-colors">
                            <td className="py-3 px-3 font-medium text-foreground">{student.name}</td>
                            <td className="py-3 px-3 text-muted-foreground">{student.email}</td>
                            <td className="py-3 px-3 text-center">
                              <Badge variant="outline" className="text-[10px] font-semibold">{student.bookings}</Badge>
                            </td>
                            <td className="py-3 px-3 text-center">
                              <Badge variant="outline" className="text-[10px] font-semibold">{student.projects}</Badge>
                            </td>
                            <td className="py-3 px-3 text-center">
                              <Badge variant="outline" className="text-[10px] font-semibold">{student.quizzes}</Badge>
                            </td>
                            <td className="py-3 px-3 text-center">
                              <Badge variant="outline" className="text-[10px] font-semibold">{student.labs}</Badge>
                            </td>
                            <td className="py-3 px-3 text-center flex items-center justify-center gap-1.5">
                              <Button
                                variant="outline"
                                size="sm"
                                className="gap-1 text-xs"
                                onClick={() => setExpandedStudent(expandedStudent === student.name ? null : student.name)}
                              >
                                <Eye className="w-3 h-3" />
                                Details
                                {expandedStudent === student.name ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                className="gap-1 text-destructive hover:bg-destructive/10 hover:text-destructive border-destructive/30 text-xs"
                                onClick={() => setRemoveDialog({ open: true, name: student.name, type: "student" })}
                              >
                                <Trash2 className="w-3 h-3" />
                              </Button>
                            </td>
                          </tr>
                          {expandedStudent === student.name && (
                            <tr>
                              <td colSpan={7} className="p-0">
                                <div className="bg-muted/20 border-b border-border/30 px-6 py-4 space-y-4">
                                  {/* Projects Section */}
                                  <div>
                                    <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 flex items-center gap-1.5">
                                      <Presentation className="w-3.5 h-3.5" />
                                      Projects Posted ({student.projects})
                                    </h4>
                                    {student.projectDetails.length > 0 ? (
                                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                                         {student.projectDetails.map((proj) => (
                                          <div key={proj.title} className="flex items-center justify-between bg-background rounded-lg border border-border/50 px-3 py-2">
                                            <span className="text-xs font-medium text-foreground truncate mr-2">{proj.title}</span>
                                            <div className="flex items-center gap-2 shrink-0">
                                              <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                                                <MousePointerClick className="w-3 h-3" /> {proj.clicks}
                                              </span>
                                              <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                                                <ArrowUpRight className="w-3 h-3" /> {proj.responses}
                                              </span>
                                              <Button variant="ghost" size="sm" className="h-6 px-2 text-[10px] gap-1" onClick={() => setViewDialog({ open: true, type: "project", title: proj.title, clicks: proj.clicks, responses: proj.responses })}>
                                                <Eye className="w-3 h-3" /> View
                                              </Button>
                                            </div>
                                          </div>
                                        ))}
                                      </div>
                                    ) : (
                                      <p className="text-xs text-muted-foreground italic">No projects posted yet</p>
                                    )}
                                  </div>
                                  {/* Forum Posts Section */}
                                  <div>
                                    <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 flex items-center gap-1.5">
                                      <FileEdit className="w-3.5 h-3.5" />
                                      Forum Posts ({student.forumPosts})
                                    </h4>
                                    {student.forumDetails.length > 0 ? (
                                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                                        {student.forumDetails.map((post) => (
                                          <div key={post.title} className="flex items-center justify-between bg-background rounded-lg border border-border/50 px-3 py-2">
                                            <span className="text-xs font-medium text-foreground truncate mr-2">{post.title}</span>
                                            <div className="flex items-center gap-2 shrink-0">
                                              <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                                                <MousePointerClick className="w-3 h-3" /> {post.clicks}
                                              </span>
                                              <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                                                <ArrowUpRight className="w-3 h-3" /> {post.responses}
                                              </span>
                                              <Button variant="ghost" size="sm" className="h-6 px-2 text-[10px] gap-1" onClick={() => setViewDialog({ open: true, type: "forum", title: post.title, clicks: post.clicks, responses: post.responses })}>
                                                <Eye className="w-3 h-3" /> View
                                              </Button>
                                            </div>
                                          </div>
                                        ))}
                                      </div>
                                    ) : (
                                      <p className="text-xs text-muted-foreground italic">No forum posts yet</p>
                                    )}
                                  </div>
                                </div>
                              </td>
                            </tr>
                          )}
                        </React.Fragment>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* ===== SETTINGS ===== */}
          <TabsContent value="settings" className="space-y-6">
            <Card className="border-border/60 max-w-lg">
              <CardHeader className="pb-4">
                <CardTitle className="text-base font-semibold">Admin Login Credentials</CardTitle>
                <CardDescription>Update your username and password for admin portal access</CardDescription>
              </CardHeader>
              <CardContent className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="admin-username">Username</Label>
                  <Input
                    id="admin-username"
                    value={adminUsername}
                    onChange={(e) => setAdminUsername(e.target.value)}
                    placeholder="Enter username"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="admin-password">New Password</Label>
                  <Input
                    id="admin-password"
                    type="password"
                    value={adminPassword}
                    onChange={(e) => setAdminPassword(e.target.value)}
                    placeholder="Leave blank to keep current"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="admin-password-confirm">Confirm New Password</Label>
                  <Input
                    id="admin-password-confirm"
                    type="password"
                    value={adminPasswordConfirm}
                    onChange={(e) => setAdminPasswordConfirm(e.target.value)}
                    placeholder="Re-enter new password"
                  />
                  {adminPassword && adminPasswordConfirm && adminPassword !== adminPasswordConfirm && (
                    <p className="text-xs text-destructive">Passwords do not match</p>
                  )}
                </div>
                <Button
                  onClick={handleSaveSettings}
                  disabled={!adminUsername.trim() || (!!adminPassword && adminPassword !== adminPasswordConfirm)}
                  className="gap-2"
                >
                  <Save className="w-4 h-4" />
                  {settingsSaved ? "Saved!" : "Save Changes"}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* ===== SUPPORT TICKETS ===== */}
          <TabsContent value="support" className="space-y-6">
            <div className="grid grid-cols-3 gap-4">
              <StatCard label="Student Tickets" value="48" icon={GraduationCap} trend={{ value: "+5", positive: false }} accent="blue" />
              <StatCard label="Instructor Tickets" value="23" icon={Users} trend={{ value: "-3", positive: true }} accent="violet" />
              <StatCard label="Investor Relations" value="7" icon={Briefcase} trend={{ value: "+2", positive: true }} accent="emerald" />
            </div>

            {/* Filter & Sort Controls */}
            <Card className="border-border/60">
              <CardContent className="p-4">
                <div className="flex flex-wrap items-center gap-3">
                  <div className="relative flex-1 min-w-[200px]">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      placeholder="Search tickets..."
                      value={ticketSearch}
                      onChange={(e) => setTicketSearch(e.target.value)}
                      className="pl-9 h-9 text-sm"
                    />
                  </div>
                  <Select value={ticketPriorityFilter} onValueChange={setTicketPriorityFilter}>
                    <SelectTrigger className="w-[130px] h-9 text-xs">
                      <Filter className="w-3.5 h-3.5 mr-1" />
                      <SelectValue placeholder="Priority" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Priorities</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="low">Low</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={ticketStatusFilter} onValueChange={setTicketStatusFilter}>
                    <SelectTrigger className="w-[130px] h-9 text-xs">
                      <Filter className="w-3.5 h-3.5 mr-1" />
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Statuses</SelectItem>
                      <SelectItem value="open">Open</SelectItem>
                      <SelectItem value="in-progress">In Progress</SelectItem>
                      <SelectItem value="resolved">Resolved</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={ticketSortBy} onValueChange={setTicketSortBy}>
                    <SelectTrigger className="w-[140px] h-9 text-xs">
                      <ArrowDownAZ className="w-3.5 h-3.5 mr-1" />
                      <SelectValue placeholder="Sort" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="date-desc">Newest First</SelectItem>
                      <SelectItem value="date-asc">Oldest First</SelectItem>
                      <SelectItem value="priority-desc">Priority: High→Low</SelectItem>
                      <SelectItem value="priority-asc">Priority: Low→High</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            <Tabs defaultValue="student-tickets" className="space-y-4">
              <TabsList className="bg-muted/50 p-1">
                <TabsTrigger value="student-tickets" className="data-[state=active]:bg-background data-[state=active]:shadow-sm text-xs">
                  <GraduationCap className="w-3.5 h-3.5 mr-1" /> Student Tickets
                </TabsTrigger>
                <TabsTrigger value="instructor-tickets" className="data-[state=active]:bg-background data-[state=active]:shadow-sm text-xs">
                  <Users className="w-3.5 h-3.5 mr-1" /> Instructor Tickets
                </TabsTrigger>
                <TabsTrigger value="investor-tickets" className="data-[state=active]:bg-background data-[state=active]:shadow-sm text-xs">
                  <Briefcase className="w-3.5 h-3.5 mr-1" /> Investor Relations
                </TabsTrigger>
              </TabsList>

              {(() => {
                type Ticket = { id: string; subject: string; from: string; email: string; date: string; priority: string; status: string; category: string; message: string };
                const priorityOrder: Record<string, number> = { high: 3, medium: 2, low: 1 };
                const filterAndSort = (tickets: Ticket[]) => {
                  return tickets
                    .filter(t => {
                      const matchesSearch = !ticketSearch || t.subject.toLowerCase().includes(ticketSearch.toLowerCase()) || t.from.toLowerCase().includes(ticketSearch.toLowerCase()) || t.id.toLowerCase().includes(ticketSearch.toLowerCase());
                      const matchesPriority = ticketPriorityFilter === "all" || t.priority === ticketPriorityFilter;
                      const matchesStatus = ticketStatusFilter === "all" || t.status === ticketStatusFilter;
                      return matchesSearch && matchesPriority && matchesStatus;
                    })
                    .sort((a, b) => {
                      if (ticketSortBy === "date-desc") return b.date.localeCompare(a.date);
                      if (ticketSortBy === "date-asc") return a.date.localeCompare(b.date);
                      if (ticketSortBy === "priority-desc") return (priorityOrder[b.priority] || 0) - (priorityOrder[a.priority] || 0);
                      if (ticketSortBy === "priority-asc") return (priorityOrder[a.priority] || 0) - (priorityOrder[b.priority] || 0);
                      return 0;
                    });
                };
                const renderTickets = (tickets: Ticket[]) => {
                  const filtered = filterAndSort(tickets);
                  if (filtered.length === 0) return <p className="text-sm text-muted-foreground text-center py-8">No tickets match your filters</p>;
                  return (
                    <div className="space-y-2">
                      {filtered.map((ticket) => (
                        <div key={ticket.id} className="rounded-lg border border-border/40 overflow-hidden">
                          <div className="flex items-center gap-3 p-3 bg-muted/20 hover:bg-muted/40 transition-colors">
                            <span className="text-xs font-mono text-muted-foreground shrink-0">{ticket.id}</span>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-foreground truncate">{ticket.subject}</p>
                              <p className="text-xs text-muted-foreground">{ticket.from} · {ticket.date}</p>
                            </div>
                            <Badge variant="outline" className="text-[10px] shrink-0">{ticket.category}</Badge>
                            <Badge variant="outline" className={`text-[10px] shrink-0 ${
                              ticket.priority === "high" ? "border-destructive/50 text-destructive" :
                              ticket.priority === "medium" ? "border-amber-500/50 text-amber-600" :
                              "border-border text-muted-foreground"
                            }`}>{ticket.priority}</Badge>
                            <Badge className={`text-[10px] shrink-0 ${
                              ticket.status === "open" ? "bg-blue-500/10 text-blue-600 hover:bg-blue-500/20" :
                              ticket.status === "in-progress" ? "bg-amber-500/10 text-amber-600 hover:bg-amber-500/20" :
                              "bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20"
                            }`}>{ticket.status}</Badge>
                            <Button variant="outline" size="sm" className="h-7 px-2.5 text-xs gap-1" onClick={() => setTicketDialog(ticketDialog?.ticket?.id === ticket.id ? null : { open: true, ticket })}>
                              <Eye className="w-3 h-3" />
                              {ticketDialog?.ticket?.id === ticket.id ? "Hide" : "View"}
                              {ticketDialog?.ticket?.id === ticket.id ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                            </Button>
                          </div>
                          {ticketDialog?.ticket?.id === ticket.id && (
                            <div className="border-t border-border/40 bg-background px-5 py-4 space-y-4">
                              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                <div className="space-y-1">
                                  <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Full Name</p>
                                  <p className="text-sm font-medium text-foreground">{ticket.from}</p>
                                </div>
                                <div className="space-y-1">
                                  <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Email</p>
                                  <p className="text-sm text-foreground">{ticket.email}</p>
                                </div>
                                <div className="space-y-1">
                                  <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Category</p>
                                  <Badge variant="outline" className="text-xs">{ticket.category}</Badge>
                                </div>
                                <div className="space-y-1">
                                  <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Date</p>
                                  <p className="text-sm text-foreground">{ticket.date}</p>
                                </div>
                                <div className="space-y-1">
                                  <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Priority</p>
                                  <Badge variant="outline" className={`text-xs ${
                                    ticket.priority === "high" ? "border-destructive/50 text-destructive" :
                                    ticket.priority === "medium" ? "border-amber-500/50 text-amber-600" :
                                    "border-border text-muted-foreground"
                                  }`}>{ticket.priority}</Badge>
                                </div>
                                <div className="space-y-1">
                                  <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Status</p>
                                  <Badge className={`text-xs ${
                                    ticket.status === "open" ? "bg-blue-500/10 text-blue-600" :
                                    ticket.status === "in-progress" ? "bg-amber-500/10 text-amber-600" :
                                    "bg-emerald-500/10 text-emerald-600"
                                  }`}>{ticket.status}</Badge>
                                </div>
                              </div>
                              <Separator />
                              <div className="space-y-1.5">
                                <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Subject</p>
                                <p className="text-sm font-medium text-foreground">{ticket.subject}</p>
                              </div>
                              <div className="space-y-1.5">
                                <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Message</p>
                                <div className="bg-muted/30 rounded-lg border border-border/50 p-3">
                                  <p className="text-sm text-foreground leading-relaxed">{ticket.message}</p>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  );
                };
                return (
                  <>
                    <TabsContent value="student-tickets">
                      <Card className="border-border/60">
                        <CardHeader className="pb-2">
                          <CardTitle className="text-base font-semibold">Student Support Tickets</CardTitle>
                          <CardDescription>Issues and requests from enrolled students</CardDescription>
                        </CardHeader>
                        <CardContent>
                          {renderTickets([
                            { id: "ST-001", subject: "Cannot access course materials", from: "Sarah Johnson", email: "sarah.johnson@example.com", date: "2026-02-22", priority: "high", status: "open", category: "Course Access", message: "Hi, I enrolled in the React Development Masterclass two days ago but I still cannot access any of the course materials. The page shows a blank screen when I try to open Module 1. I've tried clearing my cache and using a different browser but the issue persists. Please help resolve this as soon as possible." },
                            { id: "ST-002", subject: "Payment not reflecting in account", from: "Mike Chen", email: "mike.chen@example.com", date: "2026-02-21", priority: "high", status: "open", category: "Billing", message: "I made a payment of $149 for the Web Development Bootcamp on February 19th but it hasn't reflected in my account yet. My bank statement shows the charge was processed. Transaction ID: TXN-8847291. Could you please verify and update my enrollment status?" },
                            { id: "ST-003", subject: "Quiz score not saved properly", from: "Emma Williams", email: "emma.williams@example.com", date: "2026-02-21", priority: "medium", status: "in-progress", category: "Technical Issue", message: "I completed the Module 2 quiz for Data Science Fundamentals and scored 92%, but when I went back to check my progress, it shows as 0%. I have a screenshot of the completion page showing my score. This is the second time this has happened." },
                            { id: "ST-004", subject: "Certificate not generated after completion", from: "James Brown", email: "james.brown@example.com", date: "2026-02-20", priority: "medium", status: "open", category: "Course Access", message: "I finished all modules and assignments for the Digital Marketing Fundamentals course. My progress shows 100% but no certificate has been generated. The 'Download Certificate' button is grayed out. I need this certificate for my job application deadline next week." },
                            { id: "ST-005", subject: "Video playback issues on mobile", from: "Lisa Garcia", email: "lisa.garcia@example.com", date: "2026-02-20", priority: "low", status: "in-progress", category: "Technical Issue", message: "Videos in the UX Design Principles course buffer constantly on my iPhone 14 using Safari. The same videos play fine on my laptop. I've tried both WiFi and cellular data. My internet speed is 50 Mbps so bandwidth shouldn't be an issue." },
                            { id: "ST-006", subject: "Request to change enrolled email", from: "David Miller", email: "david.miller@example.com", date: "2026-02-19", priority: "low", status: "resolved", category: "Account", message: "I'd like to change my enrolled email from david.miller@oldcompany.com to david.miller@example.com as I've switched employers. Please update all my course enrollments and certificates to reflect the new email address." },
                            { id: "ST-007", subject: "Booking session not showing in calendar", from: "Anna Taylor", email: "anna.taylor@example.com", date: "2026-02-18", priority: "medium", status: "resolved", category: "Other", message: "I booked a one-on-one session with Dr. Sarah Chen for February 25th at 2:00 PM but it's not showing in my calendar view. I received a confirmation email so the booking went through. Could you check if there's a sync issue with the calendar?" },
                          ])}
                        </CardContent>
                      </Card>
                    </TabsContent>
                    <TabsContent value="instructor-tickets">
                      <Card className="border-border/60">
                        <CardHeader className="pb-2">
                          <CardTitle className="text-base font-semibold">Instructor Support Tickets</CardTitle>
                          <CardDescription>Issues and requests from instructors</CardDescription>
                        </CardHeader>
                        <CardContent>
                          {renderTickets([
                            { id: "IT-001", subject: "Revenue payout delay for January", from: "Dr. Sarah Chen", email: "sarah.chen@university.edu", date: "2026-02-22", priority: "high", status: "open", category: "Revenue", message: "My January revenue payout of $4,200 hasn't been processed yet. Previous months were always paid by the 15th. Please investigate and process the payment as soon as possible." },
                            { id: "IT-002", subject: "Course analytics not updating", from: "Prof. James Wilson", email: "j.wilson@techacademy.com", date: "2026-02-21", priority: "medium", status: "in-progress", category: "Technical", message: "The analytics dashboard for my React Masterclass hasn't updated since February 15th. Click and enrollment data appears frozen. Other instructors have reported similar issues." },
                            { id: "IT-003", subject: "Need help with new course module layout", from: "Maria Garcia", email: "maria.garcia@designstudio.com", date: "2026-02-20", priority: "medium", status: "open", category: "Course Creation", message: "I'm having trouble with the new course builder layout. I can't find the option to add interactive lab components. Could you provide a guide or jump on a quick call?" },
                            { id: "IT-004", subject: "Updating content for React 19", from: "Alex Thompson", email: "alex.t@cloudacademy.io", date: "2026-02-19", priority: "low", status: "in-progress", category: "Content Update", message: "I'm planning to update my React course for version 19. Are there any platform-specific guidelines for major content refreshes or can I just start swapping out videos?" },
                            { id: "IT-005", subject: "Request for bulk upload feature", from: "Dr. Emily Park", email: "emily.park@cybersec.edu", date: "2026-02-18", priority: "low", status: "resolved", category: "Other", message: "I have 50+ lab exercises that I need to upload for my new Ethical Hacking course. Is there a bulk upload feature, or do I need to add them one by one? A CSV import would be very helpful." },
                          ])}
                        </CardContent>
                      </Card>
                    </TabsContent>
                    <TabsContent value="investor-tickets">
                      <Card className="border-border/60">
                        <CardHeader className="pb-2">
                          <CardTitle className="text-base font-semibold">Investor Relations Tickets</CardTitle>
                          <CardDescription>Inquiries and requests from investors and stakeholders</CardDescription>
                        </CardHeader>
                        <CardContent>
                          {renderTickets([
                            { id: "IR-001", subject: "Q4 2025 financial report request", from: "Capital Ventures LLC", email: "relations@capitalventures.com", date: "2026-02-22", priority: "high", status: "open", category: "Financial Information", message: "Please share the Q4 2025 financial report including revenue breakdown by category, platform growth metrics, and profit margins. We need this for our quarterly portfolio review meeting scheduled for March 5th." },
                            { id: "IR-002", subject: "Series B Investment Inquiry", from: "Horizon Partners", email: "invest@horizonpartners.com", date: "2026-02-20", priority: "high", status: "in-progress", category: "Investment Inquiry", message: "We've been tracking your platform's growth and are interested in discussing potential participation in your upcoming Series B round. We'd like to schedule a call with the founders." },
                            { id: "IR-003", subject: "Partnership proposal - corporate training", from: "TechCorp Inc.", email: "partnerships@techcorp.com", date: "2026-02-18", priority: "medium", status: "open", category: "Partnership", message: "We're interested in a corporate training partnership to provide your platform's courses to our 5,000+ employees. We'd like to discuss volume licensing, custom course creation, and SSO integration options." },
                            { id: "IR-004", subject: "Board meeting scheduling for March", from: "Angel Fund Group", email: "board@angelfund.com", date: "2026-02-17", priority: "medium", status: "resolved", category: "General Inquiry", message: "We need to schedule the Q1 board meeting for the second week of March. Please confirm availability of the founding team and prepare the standard board deck with updated KPIs." },
                          ])}
                        </CardContent>
                      </Card>
                    </TabsContent>
                  </>
                );
              })()}
            </Tabs>
          </TabsContent>
        </Tabs>
      </div>

      <AlertDialog open={removeDialog.open} onOpenChange={(open) => !open && setRemoveDialog({ ...removeDialog, open: false })}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove {removeDialog.type === "instructor" ? "Instructor" : "Student"}</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to remove <span className="font-semibold text-foreground">{removeDialog.name}</span> from the platform? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={handleRemove}
            >
              Remove
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* View Project/Forum Dialog */}
      <Dialog open={!!viewDialog?.open} onOpenChange={(open) => !open && setViewDialog(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-base">
              {viewDialog?.type === "project" ? <Presentation className="w-4 h-4" /> : <FileEdit className="w-4 h-4" />}
              {viewDialog?.type === "project" ? "Project" : "Forum Post"}
            </DialogTitle>
            <DialogDescription className="text-sm">{viewDialog?.title}</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 pt-2">
            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col items-center p-4 rounded-lg border border-border/50 bg-muted/20">
                <MousePointerClick className="w-5 h-5 text-muted-foreground mb-1.5" />
                <span className="text-2xl font-bold text-foreground">{viewDialog?.clicks}</span>
                <span className="text-xs text-muted-foreground">Total Clicks</span>
              </div>
              <div className="flex flex-col items-center p-4 rounded-lg border border-border/50 bg-muted/20">
                <ArrowUpRight className="w-5 h-5 text-muted-foreground mb-1.5" />
                <span className="text-2xl font-bold text-foreground">{viewDialog?.responses}</span>
                <span className="text-xs text-muted-foreground">Responses</span>
              </div>
            </div>
            {viewDialog?.type === "project" && (
              <p className="text-xs text-muted-foreground">This project was posted by the student and is visible on the projects page.</p>
            )}
            {viewDialog?.type === "forum" && (
              <p className="text-xs text-muted-foreground">This forum post is publicly visible and open for community discussion.</p>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminPortalPage;
