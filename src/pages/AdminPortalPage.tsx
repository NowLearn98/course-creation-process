import React from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Users, GraduationCap, BookOpen, DollarSign, TrendingUp, Star, Clock, CheckCircle, BarChart3, Activity } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getPublishedCourses } from "@/utils/publishedStorage";
import { PublishedCourse } from "@/types/published";
import {
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from "recharts";

const COLORS = ["hsl(220, 90%, 56%)", "hsl(160, 60%, 45%)", "hsl(40, 90%, 55%)", "hsl(0, 70%, 55%)", "hsl(280, 60%, 55%)"];

const AdminPortalPage = () => {
  const navigate = useNavigate();
  const courses: PublishedCourse[] = getPublishedCourses();

  // Platform-wide calculations
  const totalInstructors = 8;
  const totalStudents = courses.reduce((sum, c) => sum + (c.enrollments || 0), 0);
  const totalRevenue = courses.reduce((sum, c) => sum + (c.enrollments || 0) * (c.price || 0), 0);
  const totalCourses = courses.length;
  const activeCourses = courses.filter(c => c.status === "active").length;
  const avgRating = courses.length > 0
    ? courses.reduce((sum, c) => sum + (c.rating || 0), 0) / courses.length
    : 0;
  const totalClicks = courses.reduce((sum, c) => sum + (c.clicks || 0), 0);
  const totalReviews = courses.reduce((sum, c) => sum + (c.reviews || 0), 0);
  const totalBookings = courses.reduce(
    (sum, c) => sum + (c.metricsHistory || []).reduce((s, m) => s + m.bookings, 0), 0
  );
  const avgCompletionRate = 72;

  // Chart data
  const enrollmentByCategory = courses.reduce((acc, c) => {
    const cat = c.category || "Uncategorized";
    acc[cat] = (acc[cat] || 0) + (c.enrollments || 0);
    return acc;
  }, {} as Record<string, number>);
  const categoryData = Object.entries(enrollmentByCategory).map(([name, value]) => ({ name, value }));

  const revenuePerCourse = courses.map(c => ({
    name: c.title.length > 20 ? c.title.slice(0, 20) + "…" : c.title,
    revenue: (c.enrollments || 0) * (c.price || 0),
  }));

  const monthlyGrowth = [
    { month: "Jan", students: 120, instructors: 3 },
    { month: "Feb", students: 180, instructors: 4 },
    { month: "Mar", students: 250, instructors: 5 },
    { month: "Apr", students: 310, instructors: 5 },
    { month: "May", students: 420, instructors: 6 },
    { month: "Jun", students: totalStudents, instructors: totalInstructors },
  ];

  // Top instructors (simulated)
  const topInstructors = [
    { name: "Dr. Sarah Chen", courses: 4, students: 520, revenue: 15600, rating: 4.9 },
    { name: "Prof. James Wilson", courses: 3, students: 380, revenue: 11400, rating: 4.7 },
    { name: "Maria Garcia", courses: 2, students: 210, revenue: 6300, rating: 4.8 },
    { name: "Alex Thompson", courses: 2, students: 180, revenue: 5400, rating: 4.6 },
    { name: "Dr. Emily Park", courses: 1, students: 95, revenue: 2850, rating: 4.5 },
  ];

  // Top courses
  const topCourses = [...courses]
    .sort((a, b) => (b.enrollments || 0) - (a.enrollments || 0))
    .slice(0, 5);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-background">
      <div className="max-w-7xl mx-auto px-4 py-6 md:py-10">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button variant="ghost" size="icon" onClick={() => navigate("/")}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-foreground">Admin Portal</h1>
            <p className="text-sm text-muted-foreground">Platform-wide analytics for instructors and students</p>
          </div>
        </div>

        {/* Platform Overview Cards */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 mb-8">
          {[
            { label: "Instructors", value: totalInstructors, icon: Users, color: "text-blue-500" },
            { label: "Students", value: totalStudents.toLocaleString(), icon: GraduationCap, color: "text-emerald-500" },
            { label: "Courses", value: totalCourses, icon: BookOpen, color: "text-violet-500" },
            { label: "Revenue", value: `$${totalRevenue.toLocaleString()}`, icon: DollarSign, color: "text-amber-500" },
            { label: "Avg Rating", value: avgRating.toFixed(1), icon: Star, color: "text-yellow-500" },
            { label: "Completion", value: `${avgCompletionRate}%`, icon: CheckCircle, color: "text-green-500" },
          ].map((stat) => (
            <Card key={stat.label}>
              <CardContent className="p-4 flex flex-col items-center text-center gap-1">
                <stat.icon className={`w-5 h-5 ${stat.color}`} />
                <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                <p className="text-xs text-muted-foreground">{stat.label}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Secondary Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
          {[
            { label: "Total Clicks", value: totalClicks.toLocaleString(), icon: Activity },
            { label: "Total Bookings", value: totalBookings.toLocaleString(), icon: Clock },
            { label: "Total Reviews", value: totalReviews.toLocaleString(), icon: Star },
            { label: "Active Courses", value: activeCourses, icon: BarChart3 },
          ].map((stat) => (
            <Card key={stat.label}>
              <CardContent className="p-3 flex items-center gap-3">
                <stat.icon className="w-4 h-4 text-muted-foreground" />
                <div>
                  <p className="text-lg font-bold text-foreground">{stat.value}</p>
                  <p className="text-xs text-muted-foreground">{stat.label}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="instructors">Instructors</TabsTrigger>
            <TabsTrigger value="students">Students</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Growth Chart */}
              <Card>
                <CardHeader><CardTitle className="text-lg">Platform Growth</CardTitle></CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={280}>
                    <LineChart data={monthlyGrowth}>
                      <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                      <XAxis dataKey="month" className="text-xs" />
                      <YAxis className="text-xs" />
                      <Tooltip />
                      <Legend />
                      <Line type="monotone" dataKey="students" stroke="hsl(220, 90%, 56%)" strokeWidth={2} dot={{ r: 4 }} />
                      <Line type="monotone" dataKey="instructors" stroke="hsl(160, 60%, 45%)" strokeWidth={2} dot={{ r: 4 }} />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Revenue per Course */}
              <Card>
                <CardHeader><CardTitle className="text-lg">Revenue per Course</CardTitle></CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={280}>
                    <BarChart data={revenuePerCourse}>
                      <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                      <XAxis dataKey="name" className="text-xs" tick={{ fontSize: 10 }} />
                      <YAxis className="text-xs" />
                      <Tooltip />
                      <Bar dataKey="revenue" fill="hsl(220, 90%, 56%)" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Enrollment Distribution */}
              <Card>
                <CardHeader><CardTitle className="text-lg">Enrollment by Category</CardTitle></CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={280}>
                    <PieChart>
                      <Pie data={categoryData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} label>
                        {categoryData.map((_, i) => (
                          <Cell key={i} fill={COLORS[i % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Top Courses */}
              <Card>
                <CardHeader><CardTitle className="text-lg">Top Courses</CardTitle></CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {topCourses.map((course, i) => (
                      <div key={course.id} className="flex items-center justify-between p-3 rounded-lg border bg-muted/30">
                        <div className="flex items-center gap-3 min-w-0">
                          <span className="text-sm font-bold text-muted-foreground w-5">#{i + 1}</span>
                          <div className="min-w-0">
                            <p className="text-sm font-semibold truncate">{course.title}</p>
                            <p className="text-xs text-muted-foreground">{course.enrollments} students · ${((course.enrollments || 0) * (course.price || 0)).toLocaleString()}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-1">
                          <Star className="w-3.5 h-3.5 text-yellow-500 fill-yellow-500" />
                          <span className="text-sm font-semibold">{course.rating?.toFixed(1) || "–"}</span>
                        </div>
                      </div>
                    ))}
                    {topCourses.length === 0 && (
                      <p className="text-muted-foreground text-center py-8">No courses yet</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Instructors Tab */}
          <TabsContent value="instructors" className="space-y-6">
            <Card>
              <CardHeader><CardTitle className="text-lg">Instructor Leaderboard</CardTitle></CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {topInstructors.map((inst, i) => (
                    <div key={inst.name} className="flex items-center justify-between p-4 rounded-lg border bg-muted/30">
                      <div className="flex items-center gap-3">
                        <span className="text-lg font-bold text-muted-foreground w-6">#{i + 1}</span>
                        <div>
                          <p className="text-sm font-semibold">{inst.name}</p>
                          <p className="text-xs text-muted-foreground">{inst.courses} courses</p>
                        </div>
                      </div>
                      <div className="grid grid-cols-3 gap-6 text-center">
                        <div>
                          <p className="text-xs text-muted-foreground">Students</p>
                          <p className="text-sm font-bold">{inst.students}</p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">Revenue</p>
                          <p className="text-sm font-bold">${inst.revenue.toLocaleString()}</p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">Rating</p>
                          <div className="flex items-center justify-center gap-0.5">
                            <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                            <p className="text-sm font-bold">{inst.rating}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Instructor Metrics Summary */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardContent className="p-4 text-center">
                  <p className="text-xs text-muted-foreground mb-1">Avg Courses per Instructor</p>
                  <p className="text-2xl font-bold text-foreground">{(totalCourses / totalInstructors).toFixed(1)}</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <p className="text-xs text-muted-foreground mb-1">Avg Revenue per Instructor</p>
                  <p className="text-2xl font-bold text-foreground">${Math.round(totalRevenue / totalInstructors).toLocaleString()}</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <p className="text-xs text-muted-foreground mb-1">Avg Response Time</p>
                  <p className="text-2xl font-bold text-foreground">2.4h</p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Students Tab */}
          <TabsContent value="students" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-4 text-center">
                  <p className="text-xs text-muted-foreground mb-1">Total Enrollments</p>
                  <p className="text-2xl font-bold text-foreground">{totalStudents.toLocaleString()}</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <p className="text-xs text-muted-foreground mb-1">Avg Completion Rate</p>
                  <p className="text-2xl font-bold text-foreground">{avgCompletionRate}%</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <p className="text-xs text-muted-foreground mb-1">Churn Rate</p>
                  <p className="text-2xl font-bold text-foreground">4.2%</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <p className="text-xs text-muted-foreground mb-1">Avg Time to Complete</p>
                  <p className="text-2xl font-bold text-foreground">6.3 wks</p>
                </CardContent>
              </Card>
            </div>

            {/* Enrollment Trends */}
            <Card>
              <CardHeader><CardTitle className="text-lg">Enrollment Trends</CardTitle></CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={monthlyGrowth}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                    <XAxis dataKey="month" className="text-xs" />
                    <YAxis className="text-xs" />
                    <Tooltip />
                    <Line type="monotone" dataKey="students" stroke="hsl(160, 60%, 45%)" strokeWidth={2} dot={{ r: 4 }} name="New Students" />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Most Popular Courses */}
            <Card>
              <CardHeader><CardTitle className="text-lg">Most Popular Courses</CardTitle></CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {topCourses.map((course) => {
                    const completionRate = Math.floor(Math.random() * 30) + 60;
                    return (
                      <div key={course.id} className="p-3 rounded-lg border bg-muted/30">
                        <div className="flex items-center justify-between mb-2">
                          <p className="text-sm font-semibold truncate">{course.title}</p>
                          <span className="text-xs text-muted-foreground">{course.enrollments} enrolled</span>
                        </div>
                        <div className="w-full bg-muted rounded-full h-2">
                          <div
                            className="bg-primary h-2 rounded-full transition-all"
                            style={{ width: `${completionRate}%` }}
                          />
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">{completionRate}% avg completion</p>
                      </div>
                    );
                  })}
                  {topCourses.length === 0 && (
                    <p className="text-muted-foreground text-center py-8">No courses yet</p>
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
