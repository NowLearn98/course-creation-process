import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft, Users, GraduationCap, BookOpen, DollarSign,
  Star, Clock, CheckCircle, BarChart3, Activity, TrendingUp,
  TrendingDown, ArrowUpRight, Crown, Eye, ChevronDown, ChevronUp,
  MousePointerClick, Presentation, FlaskConical, ExternalLink, FileEdit,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
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
          </TabsContent>

          {/* ===== INSTRUCTORS ===== */}
          <TabsContent value="instructors" className="space-y-6">
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
                  {topInstructors.map((inst, i) => {
                    const isExpanded = expandedInstructor === inst.name;
                    return (
                      <div key={inst.name} className="rounded-lg border border-border/40 overflow-hidden">
                        <div className="flex items-center gap-4 p-4 bg-muted/20 hover:bg-muted/40 transition-colors">
                          <div className="relative shrink-0">
                            <Avatar className="w-10 h-10">
                              <AvatarFallback className="bg-primary/10 text-primary text-sm font-semibold">
                                {inst.initials}
                              </AvatarFallback>
                            </Avatar>
                            {i < 3 && (
                              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-amber-500 text-[9px] font-bold text-white flex items-center justify-center">
                                {i + 1}
                              </span>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold">{inst.name}</p>
                            <p className="text-xs text-muted-foreground">
                              {inst.courseDetails.filter(c => c.status === "published").length} published · {inst.courseDetails.filter(c => c.status === "draft").length} draft{inst.courseDetails.filter(c => c.status === "draft").length !== 1 ? "s" : ""}
                            </p>
                          </div>
                          <div className="hidden sm:grid grid-cols-6 gap-4 text-center">
                            <div>
                              <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Students</p>
                              <p className="text-sm font-bold text-foreground">{inst.students.toLocaleString()}</p>
                            </div>
                            <div>
                              <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Revenue</p>
                              <p className="text-sm font-bold text-foreground">${inst.revenue.toLocaleString()}</p>
                            </div>
                            <div>
                              <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Platform Profit</p>
                              <p className="text-sm font-bold text-emerald-600">${Math.round(inst.revenue * 0.3).toLocaleString()}</p>
                            </div>
                            <div>
                              <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Bookings</p>
                              <p className="text-sm font-bold text-foreground">{inst.courseDetails.filter(c => c.status === "published").reduce((sum, c) => sum + c.bookings, 0).toLocaleString()}</p>
                            </div>
                            <div>
                              <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Clicks</p>
                              <p className="text-sm font-bold text-foreground">{inst.courseDetails.filter(c => c.status === "published").reduce((sum, c) => sum + c.clicks, 0).toLocaleString()}</p>
                            </div>
                            <div>
                              <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Rating</p>
                              <div className="flex items-center justify-center gap-0.5">
                                <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
                                <p className="text-sm font-bold text-foreground">{inst.rating}</p>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2 shrink-0 ml-2">
                            <Button
                              variant="outline"
                              size="sm"
                              className="gap-1.5"
                              onClick={() => setExpandedInstructor(isExpanded ? null : inst.name)}
                            >
                              {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                              View Details
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              className="gap-1.5"
                            >
                              <Eye className="w-3.5 h-3.5" />
                              View Profile
                            </Button>
                          </div>
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

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              <Card className="border-border/60">
                <CardContent className="p-5 flex flex-col items-center text-center">
                  <div className="p-2 rounded-lg bg-primary/10 mb-3">
                    <BookOpen className="w-4 h-4 text-primary" />
                  </div>
                  <p className="text-2xl font-bold text-foreground">{(metrics.totalCourses / metrics.totalInstructors).toFixed(1)}</p>
                  <p className="text-xs text-muted-foreground mt-1">Avg Courses</p>
                </CardContent>
              </Card>
              <Card className="border-border/60">
                <CardContent className="p-5 flex flex-col items-center text-center">
                  <div className="p-2 rounded-lg bg-primary/10 mb-3">
                    <GraduationCap className="w-4 h-4 text-primary" />
                  </div>
                  <p className="text-2xl font-bold text-foreground">{Math.round(metrics.totalStudents / metrics.totalInstructors).toLocaleString()}</p>
                  <p className="text-xs text-muted-foreground mt-1">Avg Students</p>
                </CardContent>
              </Card>
              <Card className="border-border/60">
                <CardContent className="p-5 flex flex-col items-center text-center">
                  <div className="p-2 rounded-lg bg-primary/10 mb-3">
                    <DollarSign className="w-4 h-4 text-primary" />
                  </div>
                  <p className="text-2xl font-bold text-foreground">${Math.round(metrics.totalRevenue / metrics.totalInstructors).toLocaleString()}</p>
                  <p className="text-xs text-muted-foreground mt-1">Avg Revenue</p>
                </CardContent>
              </Card>
              <Card className="border-border/60">
                <CardContent className="p-5 flex flex-col items-center text-center">
                  <div className="p-2 rounded-lg bg-emerald-500/10 mb-3">
                    <TrendingUp className="w-4 h-4 text-emerald-600" />
                  </div>
                  <p className="text-2xl font-bold text-emerald-600">${Math.round(metrics.totalRevenue * 0.3 / metrics.totalInstructors).toLocaleString()}</p>
                  <p className="text-xs text-muted-foreground mt-1">Avg Platform Profit</p>
                </CardContent>
              </Card>
              <Card className="border-border/60">
                <CardContent className="p-5 flex flex-col items-center text-center">
                  <div className="p-2 rounded-lg bg-primary/10 mb-3">
                    <Clock className="w-4 h-4 text-primary" />
                  </div>
                  <p className="text-2xl font-bold text-foreground">{Math.round(metrics.totalBookings / metrics.totalInstructors).toLocaleString()}</p>
                  <p className="text-xs text-muted-foreground mt-1">Avg Bookings</p>
                </CardContent>
              </Card>
              <Card className="border-border/60">
                <CardContent className="p-5 flex flex-col items-center text-center">
                  <div className="p-2 rounded-lg bg-primary/10 mb-3">
                    <Activity className="w-4 h-4 text-primary" />
                  </div>
                  <p className="text-2xl font-bold text-foreground">{Math.round(metrics.totalClicks / metrics.totalInstructors).toLocaleString()}</p>
                  <p className="text-xs text-muted-foreground mt-1">Avg Clicks</p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* ===== STUDENTS ===== */}
          <TabsContent value="students" className="space-y-6">
            <div className="grid grid-cols-3 gap-4">
              <StatCard label="Total Enrollments" value={metrics.totalStudents.toLocaleString()} icon={GraduationCap} trend={{ value: "+15%", positive: true }} accent="blue" />
              <StatCard label="Total Bookings" value={metrics.totalBookings.toLocaleString()} icon={Clock} trend={{ value: "+12%", positive: true }} accent="violet" />
              <StatCard label="Avg Completion" value="72%" icon={CheckCircle} trend={{ value: "+5%", positive: true }} accent="emerald" />
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
                        <th className="text-center py-3 px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Presentations</th>
                        <th className="text-center py-3 px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Quizzes</th>
                        <th className="text-center py-3 px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Labs</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        { name: "Sarah Johnson", email: "sarah.johnson@example.com", bookings: 8, presentations: 12, quizzes: 15, labs: 6 },
                        { name: "Mike Chen", email: "mike.chen@example.com", bookings: 5, presentations: 9, quizzes: 11, labs: 4 },
                        { name: "Emma Williams", email: "emma.williams@example.com", bookings: 12, presentations: 18, quizzes: 22, labs: 9 },
                        { name: "James Brown", email: "james.brown@example.com", bookings: 3, presentations: 6, quizzes: 8, labs: 3 },
                        { name: "Lisa Garcia", email: "lisa.garcia@example.com", bookings: 7, presentations: 14, quizzes: 17, labs: 7 },
                        { name: "David Miller", email: "david.miller@example.com", bookings: 10, presentations: 16, quizzes: 20, labs: 8 },
                        { name: "Sofia Rodriguez", email: "sofia.rodriguez@example.com", bookings: 6, presentations: 10, quizzes: 13, labs: 5 },
                        { name: "Chris Lee", email: "chris.lee@example.com", bookings: 4, presentations: 7, quizzes: 9, labs: 3 },
                        { name: "Anna Taylor", email: "anna.taylor@example.com", bookings: 9, presentations: 15, quizzes: 19, labs: 8 },
                        { name: "Ryan Martinez", email: "ryan.martinez@example.com", bookings: 11, presentations: 17, quizzes: 21, labs: 10 },
                      ].map((student) => (
                        <tr key={student.email} className="border-b border-border/30 hover:bg-muted/30 transition-colors">
                          <td className="py-3 px-3 font-medium text-foreground">{student.name}</td>
                          <td className="py-3 px-3 text-muted-foreground">{student.email}</td>
                          <td className="py-3 px-3 text-center">
                            <Badge variant="outline" className="text-[10px] font-semibold">{student.bookings}</Badge>
                          </td>
                          <td className="py-3 px-3 text-center">
                            <Badge variant="outline" className="text-[10px] font-semibold">{student.presentations}</Badge>
                          </td>
                          <td className="py-3 px-3 text-center">
                            <Badge variant="outline" className="text-[10px] font-semibold">{student.quizzes}</Badge>
                          </td>
                          <td className="py-3 px-3 text-center">
                            <Badge variant="outline" className="text-[10px] font-semibold">{student.labs}</Badge>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminPortalPage;
