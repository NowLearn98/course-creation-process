import React, { useState, useEffect } from "react";
import { Box, Container, Typography, Button } from "@mui/material";
import { ArrowLeft, TrendingUp, DollarSign, Users, MousePointerClick, Star, BookOpen } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PublishedCourse } from "@/types/published";
import { getPublishedCourses } from "@/utils/publishedStorage";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, BarChart, Bar, PieChart, Pie, Cell } from "recharts";

const COLORS = ["hsl(221, 83%, 53%)", "hsl(142, 71%, 45%)", "hsl(38, 92%, 50%)", "hsl(0, 84%, 60%)", "hsl(262, 83%, 58%)"];

const PerformancePage = () => {
  const navigate = useNavigate();
  const [courses, setCourses] = useState<PublishedCourse[]>([]);

  useEffect(() => {
    setCourses(getPublishedCourses());
  }, []);

  const totalRevenue = courses.reduce((sum, c) => sum + (c.enrollments || 0) * (c.price || 0), 0);
  const totalStudents = courses.reduce((sum, c) => sum + (c.enrollments || 0), 0);
  const totalClicks = courses.reduce((sum, c) => sum + (c.clicks || 0), 0);
  const avgRating = courses.length > 0
    ? courses.reduce((sum, c) => sum + (c.rating || 0), 0) / courses.length
    : 0;

  // Aggregate metrics history across all courses
  const aggregatedMetrics = courses.reduce((acc, course) => {
    (course.metricsHistory || []).forEach((m) => {
      if (!acc[m.date]) acc[m.date] = { date: m.date, clicks: 0, bookings: 0 };
      acc[m.date].clicks += m.clicks;
      acc[m.date].bookings += m.bookings;
    });
    return acc;
  }, {} as Record<string, { date: string; clicks: number; bookings: number }>);

  const metricsData = Object.values(aggregatedMetrics).sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  // Revenue per course for bar chart
  const revenuePerCourse = courses.map((c) => ({
    name: c.title.length > 20 ? c.title.slice(0, 20) + "…" : c.title,
    revenue: (c.enrollments || 0) * (c.price || 0),
    students: c.enrollments || 0,
  }));

  // Enrollment distribution for pie chart
  const enrollmentData = courses.map((c) => ({
    name: c.title.length > 15 ? c.title.slice(0, 15) + "…" : c.title,
    value: c.enrollments || 0,
  }));

  const stats = [
    { label: "Total Revenue", value: `$${totalRevenue.toLocaleString()}`, icon: DollarSign, color: "hsl(142, 71%, 45%)" },
    { label: "Total Students", value: totalStudents.toLocaleString(), icon: Users, color: "hsl(221, 83%, 53%)" },
    { label: "Total Clicks", value: totalClicks.toLocaleString(), icon: MousePointerClick, color: "hsl(262, 83%, 58%)" },
    { label: "Avg. Rating", value: avgRating > 0 ? avgRating.toFixed(1) : "N/A", icon: Star, color: "hsl(38, 92%, 50%)" },
    { label: "Active Courses", value: courses.filter((c) => c.status === "active").length.toString(), icon: BookOpen, color: "hsl(0, 84%, 60%)" },
  ];

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "linear-gradient(to bottom right, hsl(0, 0%, 100%), hsl(220, 100%, 50%, 0.05), hsl(220, 14%, 96%, 0.1))",
      }}
    >
      <Container maxWidth="xl" sx={{ py: { xs: 3, md: 5 } }}>
        <Box sx={{ mb: { xs: 4, md: 6 } }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 1 }}>
            <Button
              variant="outlined"
              size="small"
              onClick={() => navigate("/")}
              startIcon={<ArrowLeft className="w-4 h-4" />}
            >
              Back
            </Button>
          </Box>
          <Typography
            variant="h1"
            sx={{
              fontSize: { xs: "2rem", md: "3rem" },
              fontWeight: 700,
              background: "linear-gradient(to right, #000, rgba(0, 0, 0, 0.7))",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              mb: 1,
            }}
          >
            Performance Analytics
          </Typography>
          <Typography variant="body1" sx={{ fontSize: { xs: "1rem", md: "1.125rem" }, color: "text.secondary" }}>
            Track your overall instructor performance across all courses
          </Typography>
        </Box>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
          {stats.map((stat) => (
            <Card key={stat.label} className="relative overflow-hidden">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-medium text-muted-foreground">{stat.label}</span>
                  <stat.icon className="w-4 h-4" style={{ color: stat.color }} />
                </div>
                <p className="text-2xl font-bold text-foreground">{stat.value}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Clicks & Bookings Over Time */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Clicks & Bookings Over Time</CardTitle>
            </CardHeader>
            <CardContent>
              {metricsData.length > 0 ? (
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={metricsData}>
                      <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                      <XAxis
                        dataKey="date"
                        tick={{ fontSize: 12 }}
                        tickFormatter={(v) => new Date(v).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                      />
                      <YAxis tick={{ fontSize: 12 }} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "hsl(var(--popover))",
                          border: "1px solid hsl(var(--border))",
                          borderRadius: "8px",
                        }}
                        labelFormatter={(v) => new Date(v).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
                      />
                      <Legend />
                      <Line type="monotone" dataKey="clicks" stroke="#ef4444" strokeWidth={2} name="Clicks" dot={{ fill: "#ef4444" }} />
                      <Line type="monotone" dataKey="bookings" stroke="#3b82f6" strokeWidth={2} name="Bookings" dot={{ fill: "#3b82f6" }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <p className="text-muted-foreground text-center py-12">No metrics data available yet</p>
              )}
            </CardContent>
          </Card>

          {/* Revenue Per Course */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Revenue Per Course</CardTitle>
            </CardHeader>
            <CardContent>
              {revenuePerCourse.length > 0 ? (
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={revenuePerCourse}>
                      <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                      <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                      <YAxis tick={{ fontSize: 12 }} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "hsl(var(--popover))",
                          border: "1px solid hsl(var(--border))",
                          borderRadius: "8px",
                        }}
                      />
                      <Bar dataKey="revenue" fill="hsl(221, 83%, 53%)" radius={[4, 4, 0, 0]} name="Revenue ($)" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <p className="text-muted-foreground text-center py-12">No courses published yet</p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Enrollment Distribution */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Enrollment Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              {enrollmentData.length > 0 ? (
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={enrollmentData} cx="50%" cy="50%" outerRadius={100} dataKey="value" label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}>
                        {enrollmentData.map((_, i) => (
                          <Cell key={i} fill={COLORS[i % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <p className="text-muted-foreground text-center py-12">No enrollment data yet</p>
              )}
            </CardContent>
          </Card>

          {/* Course Metrics Table */}
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle className="text-lg">Course Breakdown</CardTitle>
            </CardHeader>
            <CardContent>
              {courses.length > 0 ? (
                <div className="space-y-3">
                  {courses.map((course) => {
                    const revenue = (course.enrollments || 0) * (course.price || 0);
                    const bookings = (course.metricsHistory || []).reduce((sum, m) => sum + m.bookings, 0);
                    return (
                      <div key={course.id} className="p-3 rounded-lg border bg-muted/30 space-y-2">
                        <p className="text-sm font-semibold text-foreground truncate">{course.title}</p>
                        <div className="grid grid-cols-5 gap-2">
                          <div className="text-center">
                            <p className="text-xs text-muted-foreground">Revenue</p>
                            <p className="text-sm font-bold text-foreground">${revenue.toLocaleString()}</p>
                          </div>
                          <div className="text-center">
                            <p className="text-xs text-muted-foreground">Students</p>
                            <p className="text-sm font-bold text-foreground">{(course.enrollments || 0).toLocaleString()}</p>
                          </div>
                          <div className="text-center">
                            <p className="text-xs text-muted-foreground">Clicks</p>
                            <p className="text-sm font-bold text-foreground">{(course.clicks || 0).toLocaleString()}</p>
                          </div>
                          <div className="text-center">
                            <p className="text-xs text-muted-foreground">Rating</p>
                            <div className="flex items-center justify-center gap-0.5">
                              <Star className="w-3 h-3 text-warning fill-warning" />
                              <p className="text-sm font-bold text-foreground">{course.rating > 0 ? course.rating.toFixed(1) : "–"}</p>
                            </div>
                          </div>
                          <div className="text-center">
                            <p className="text-xs text-muted-foreground">Bookings</p>
                            <p className="text-sm font-bold text-foreground">{bookings.toLocaleString()}</p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p className="text-muted-foreground text-center py-12">No courses published yet</p>
              )}
            </CardContent>
          </Card>
        </div>
      </Container>
    </Box>
  );
};

export default PerformancePage;
