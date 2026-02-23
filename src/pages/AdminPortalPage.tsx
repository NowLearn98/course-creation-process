import React, { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft, Users, GraduationCap, BookOpen, DollarSign,
  Star, Clock, CheckCircle, BarChart3, Activity, TrendingUp,
  TrendingDown, ArrowUpRight, Crown,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
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
}

const StatCard = ({ label, value, icon: Icon, trend, description }: StatCardProps) => (
  <Card className="group hover:shadow-md transition-all duration-200 border-border/60">
    <CardContent className="p-5">
      <div className="flex items-start justify-between mb-3">
        <div className="p-2 rounded-lg bg-primary/10">
          <Icon className="w-4 h-4 text-primary" />
        </div>
        {trend && (
          <Badge variant={trend.positive ? "default" : "destructive"} className="text-[10px] px-1.5 py-0.5 font-medium">
            {trend.positive ? <TrendingUp className="w-3 h-3 mr-0.5" /> : <TrendingDown className="w-3 h-3 mr-0.5" />}
            {trend.value}
          </Badge>
        )}
      </div>
      <p className="text-2xl font-bold text-foreground tracking-tight">{value}</p>
      <p className="text-xs text-muted-foreground mt-0.5">{label}</p>
      {description && <p className="text-[10px] text-muted-foreground/70 mt-1">{description}</p>}
    </CardContent>
  </Card>
);

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

  const topInstructors = [
    { name: "Dr. Sarah Chen", initials: "SC", courses: 4, students: 520, revenue: 15600, rating: 4.9 },
    { name: "Prof. James Wilson", initials: "JW", courses: 3, students: 380, revenue: 11400, rating: 4.7 },
    { name: "Maria Garcia", initials: "MG", courses: 2, students: 210, revenue: 6300, rating: 4.8 },
    { name: "Alex Thompson", initials: "AT", courses: 2, students: 180, revenue: 5400, rating: 4.6 },
    { name: "Dr. Emily Park", initials: "EP", courses: 1, students: 95, revenue: 2850, rating: 4.5 },
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

  const revenuePerCourse = useMemo(() =>
    courses.map(c => ({
      name: c.title.length > 18 ? c.title.slice(0, 18) + "…" : c.title,
      revenue: (c.enrollments || 0) * (c.price || 0),
    })), [courses]
  );

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
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 mb-6">
          <StatCard label="Instructors" value={metrics.totalInstructors} icon={Users} trend={{ value: "+2", positive: true }} />
          <StatCard label="Students" value={metrics.totalStudents.toLocaleString()} icon={GraduationCap} trend={{ value: "+15%", positive: true }} />
          <StatCard label="Courses" value={metrics.totalCourses} icon={BookOpen} trend={{ value: "+3", positive: true }} />
          <StatCard label="Revenue" value={`$${metrics.totalRevenue.toLocaleString()}`} icon={DollarSign} trend={{ value: "+8%", positive: true }} />
          <StatCard label="Avg Rating" value={metrics.avgRating.toFixed(1)} icon={Star} description="Based on all reviews" />
          <StatCard label="Completion" value="72%" icon={CheckCircle} trend={{ value: "+5%", positive: true }} />
        </div>

        {/* Secondary KPIs */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-10">
          <StatCard label="Total Clicks" value={metrics.totalClicks.toLocaleString()} icon={Activity} />
          <StatCard label="Total Bookings" value={metrics.totalBookings.toLocaleString()} icon={Clock} />
          <StatCard label="Total Reviews" value={metrics.totalReviews.toLocaleString()} icon={Star} />
          <StatCard label="Active Courses" value={metrics.activeCourses} icon={BarChart3} />
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
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" className="stroke-border/40" />
                      <XAxis dataKey="month" tick={{ fontSize: 12 }} className="text-muted-foreground" />
                      <YAxis tick={{ fontSize: 12 }} className="text-muted-foreground" />
                      <Tooltip contentStyle={{ borderRadius: 8, border: "1px solid hsl(var(--border))", fontSize: 12 }} />
                      <Legend wrapperStyle={{ fontSize: 12 }} />
                      <Area type="monotone" dataKey="students" stroke="hsl(220, 90%, 56%)" fill="url(#gradStudents)" strokeWidth={2} />
                      <Line type="monotone" dataKey="instructors" stroke="hsl(160, 60%, 45%)" strokeWidth={2} dot={{ r: 3 }} />
                    </AreaChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card className="border-border/60">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base font-semibold">Revenue per Course</CardTitle>
                  <CardDescription>Lifetime revenue breakdown</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={280}>
                    <BarChart data={revenuePerCourse} barSize={32}>
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
                  {topInstructors.map((inst, i) => (
                    <div key={inst.name} className="flex items-center gap-4 p-4 rounded-lg border border-border/40 bg-muted/20 hover:bg-muted/40 transition-colors">
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
                        <p className="text-xs text-muted-foreground">{inst.courses} course{inst.courses !== 1 ? "s" : ""} published</p>
                      </div>
                      <div className="hidden sm:grid grid-cols-3 gap-8 text-center">
                        <div>
                          <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Students</p>
                          <p className="text-sm font-bold text-foreground">{inst.students.toLocaleString()}</p>
                        </div>
                        <div>
                          <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Revenue</p>
                          <p className="text-sm font-bold text-foreground">${inst.revenue.toLocaleString()}</p>
                        </div>
                        <div>
                          <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Rating</p>
                          <div className="flex items-center justify-center gap-0.5">
                            <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
                            <p className="text-sm font-bold text-foreground">{inst.rating}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="border-border/60">
                <CardContent className="p-5 flex flex-col items-center text-center">
                  <div className="p-2 rounded-lg bg-primary/10 mb-3">
                    <BookOpen className="w-4 h-4 text-primary" />
                  </div>
                  <p className="text-2xl font-bold text-foreground">{(metrics.totalCourses / metrics.totalInstructors).toFixed(1)}</p>
                  <p className="text-xs text-muted-foreground mt-1">Avg Courses / Instructor</p>
                </CardContent>
              </Card>
              <Card className="border-border/60">
                <CardContent className="p-5 flex flex-col items-center text-center">
                  <div className="p-2 rounded-lg bg-primary/10 mb-3">
                    <DollarSign className="w-4 h-4 text-primary" />
                  </div>
                  <p className="text-2xl font-bold text-foreground">${Math.round(metrics.totalRevenue / metrics.totalInstructors).toLocaleString()}</p>
                  <p className="text-xs text-muted-foreground mt-1">Avg Revenue / Instructor</p>
                </CardContent>
              </Card>
              <Card className="border-border/60">
                <CardContent className="p-5 flex flex-col items-center text-center">
                  <div className="p-2 rounded-lg bg-primary/10 mb-3">
                    <Clock className="w-4 h-4 text-primary" />
                  </div>
                  <p className="text-2xl font-bold text-foreground">2.4h</p>
                  <p className="text-xs text-muted-foreground mt-1">Avg Response Time</p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* ===== STUDENTS ===== */}
          <TabsContent value="students" className="space-y-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <StatCard label="Total Enrollments" value={metrics.totalStudents.toLocaleString()} icon={GraduationCap} trend={{ value: "+15%", positive: true }} />
              <StatCard label="Avg Completion" value="72%" icon={CheckCircle} trend={{ value: "+5%", positive: true }} />
              <StatCard label="Churn Rate" value="4.2%" icon={TrendingDown} trend={{ value: "-0.8%", positive: true }} />
              <StatCard label="Avg Time to Complete" value="6.3 wks" icon={Clock} />
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

            <Card className="border-border/60">
              <CardHeader className="pb-2">
                <CardTitle className="text-base font-semibold">Most Popular Courses</CardTitle>
                <CardDescription>Courses ranked by enrollment with completion progress</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {topCourses.map((course) => {
                    const completionRate = courseCompletionRates[course.id] || 70;
                    return (
                      <div key={course.id} className="p-4 rounded-lg border border-border/40 bg-muted/20 hover:bg-muted/40 transition-colors">
                        <div className="flex items-center justify-between mb-3">
                          <p className="text-sm font-semibold truncate">{course.title}</p>
                          <Badge variant="outline" className="text-[10px] shrink-0 ml-2">{course.enrollments} enrolled</Badge>
                        </div>
                        <div className="flex items-center gap-3">
                          <Progress value={completionRate} className="h-2 flex-1" />
                          <span className="text-xs font-medium text-muted-foreground w-10 text-right">{completionRate}%</span>
                        </div>
                      </div>
                    );
                  })}
                  {topCourses.length === 0 && (
                    <p className="text-muted-foreground text-center py-12 text-sm">No courses published yet</p>
                  )}
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
