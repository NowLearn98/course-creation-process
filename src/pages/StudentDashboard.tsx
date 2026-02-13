import React, { useState, useEffect } from "react";
import {
  Box,
  Container,
  Typography,
  Button,
  Card,
  CardContent,
  Chip,
} from "@mui/material";
import { ArrowLeft, BookOpen, Clock, Calendar, MapPin, Users, Star, CheckCircle, Eye, GraduationCap, Sparkles, Presentation, FlaskConical } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { PublishedCourse } from "@/types/published";
import { getPublishedCourses } from "@/utils/publishedStorage";
import StudentAnnouncements from "@/components/StudentAnnouncements";
import StudentCourseDetailDialog from "@/components/StudentCourseDetailDialog";

const StudentDashboard = () => {
  const navigate = useNavigate();
  const [courses, setCourses] = useState<PublishedCourse[]>([]);

  useEffect(() => {
    const allCourses = getPublishedCourses();
    setCourses(allCourses.filter((c) => c.status === "active"));
  }, []);

  const classroomCourses = courses.filter((c) =>
    c.sessionTypes.includes("classroom")
  );
  const oneOnOneCourses = courses.filter((c) =>
    c.sessionTypes.includes("one-on-one")
  );

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "linear-gradient(180deg, hsl(220, 60%, 97%) 0%, hsl(0, 0%, 100%) 50%)",
      }}
    >
      <Container maxWidth="xl" sx={{ py: { xs: 3, md: 5 } }}>
        {/* Header */}
        <Box
          sx={{
            mb: { xs: 4, md: 5 },
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            alignItems: { xs: "flex-start", md: "center" },
            justifyContent: "space-between",
            gap: 2,
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Box
              sx={{
                width: 52,
                height: 52,
                borderRadius: 3,
                background: "linear-gradient(135deg, hsl(220, 100%, 50%) 0%, hsl(220, 80%, 40%) 100%)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 4px 14px hsla(220, 100%, 50%, 0.3)",
              }}
            >
              <GraduationCap className="w-6 h-6 text-white" />
            </Box>
            <Box>
              <Typography
                variant="h4"
                sx={{
                  fontWeight: 800,
                  color: "text.primary",
                  fontSize: { xs: "1.5rem", md: "2rem" },
                  letterSpacing: "-0.02em",
                }}
              >
                My Learning
              </Typography>
              <Typography
                variant="body2"
                sx={{ color: "text.secondary", mt: 0.25 }}
              >
                Track your courses and upcoming sessions
              </Typography>
            </Box>
          </Box>
          <Button
            variant="outlined"
            onClick={() => navigate("/")}
            startIcon={<ArrowLeft className="w-4 h-4" />}
            sx={{ borderRadius: 2, textTransform: "none", fontWeight: 600 }}
          >
            Back to Creator
          </Button>
        </Box>

        {/* Stats */}
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", sm: "repeat(3, 1fr)" },
            gap: 2.5,
            mb: 5,
          }}
        >
          <StatCard
            label="Enrolled Courses"
            value={courses.length}
            icon={<BookOpen className="w-5 h-5" />}
            color="hsl(220, 100%, 50%)"
            bgColor="hsl(220, 100%, 96%)"
          />
          <StatCard
            label="Upcoming Sessions"
            value={classroomCourses.length + oneOnOneCourses.length}
            icon={<Calendar className="w-5 h-5" />}
            color="hsl(260, 70%, 55%)"
            bgColor="hsl(260, 70%, 96%)"
          />
          <StatCard
            label="Completed"
            value={0}
            icon={<CheckCircle className="w-5 h-5" />}
            color="hsl(142, 70%, 40%)"
            bgColor="hsl(142, 70%, 96%)"
          />
        </Box>

        {/* Course Sections */}
        <Box sx={{ display: "flex", flexDirection: "column", gap: 4 }}>
          {classroomCourses.length > 0 && (
            <CourseSection
              title="Classroom Sessions"
              count={classroomCourses.length}
              color="hsl(220, 100%, 50%)"
              courses={classroomCourses}
              type="classroom"
            />
          )}

          {oneOnOneCourses.length > 0 && (
            <CourseSection
              title="One-on-One Sessions"
              count={oneOnOneCourses.length}
              color="hsl(260, 70%, 55%)"
              courses={oneOnOneCourses}
              type="one-on-one"
            />
          )}

          {courses.length === 0 && <EmptyState />}
        </Box>
      </Container>
    </Box>
  );
};

/* --- Stat Card --- */
const StatCard: React.FC<{
  label: string;
  value: number;
  icon: React.ReactNode;
  color: string;
  bgColor: string;
}> = ({ label, value, icon, color, bgColor }) => (
  <Card
    sx={{
      borderRadius: 3,
      border: "1px solid",
      borderColor: "divider",
      boxShadow: "0 1px 3px hsla(0,0%,0%,0.04)",
      transition: "all 0.25s ease",
      "&:hover": {
        boxShadow: "0 4px 16px hsla(0,0%,0%,0.08)",
        transform: "translateY(-2px)",
      },
    }}
  >
    <CardContent sx={{ p: 3, "&:last-child": { pb: 3 } }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <Box>
          <Typography variant="body2" sx={{ color: "text.secondary", fontWeight: 500, mb: 1 }}>
            {label}
          </Typography>
          <Typography variant="h3" sx={{ fontWeight: 800, fontSize: "2rem", color: "text.primary" }}>
            {value}
          </Typography>
        </Box>
        <Box
          sx={{
            width: 44,
            height: 44,
            borderRadius: 2.5,
            bgcolor: bgColor,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: color,
          }}
        >
          {icon}
        </Box>
      </Box>
    </CardContent>
  </Card>
);

/* --- Course Section --- */
const CourseSection: React.FC<{
  title: string;
  count: number;
  color: string;
  courses: PublishedCourse[];
  type: "classroom" | "one-on-one";
}> = ({ title, count, color, courses, type }) => (
  <Box>
    <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 2.5 }}>
      <Box sx={{ height: 28, width: 4, bgcolor: color, borderRadius: 1 }} />
      <Typography variant="h6" fontWeight={700}>
        {title}
      </Typography>
      <Chip
        label={count}
        size="small"
        sx={{
          bgcolor: `${color}18`,
          color: color,
          fontWeight: 700,
          fontSize: "0.75rem",
          height: 24,
        }}
      />
    </Box>
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
      {courses.map((course) => (
        <CourseCard key={course.id} course={course} type={type} />
      ))}
    </Box>
  </Box>
);

/* --- Course Card --- */
interface CourseCardProps {
  course: PublishedCourse;
  type: "classroom" | "one-on-one" | "self-paced";
}

const CourseCard: React.FC<CourseCardProps> = ({ course, type }) => {
  const [detailOpen, setDetailOpen] = useState(false);
  const session =
    type === "classroom"
      ? course.classroomSessions?.[0]
      : course.oneOnOneSessions?.[0];

  return (
    <>
      <Card
        sx={{
          borderRadius: 3,
          border: "1px solid",
          borderColor: "divider",
          boxShadow: "0 1px 3px hsla(0,0%,0%,0.04)",
          transition: "all 0.25s ease",
          overflow: "visible",
          "&:hover": {
            boxShadow: "0 6px 24px hsla(0,0%,0%,0.08)",
            borderColor: "primary.light",
          },
        }}
      >
        <CardContent sx={{ p: { xs: 2.5, md: 3 }, "&:last-child": { pb: { xs: 2.5, md: 3 } } }}>
          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", lg: "row" },
              gap: 2.5,
            }}
          >
            {/* Course Info */}
            <Box sx={{ flex: 1 }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 0.75, flexWrap: "wrap" }}>
                <Typography variant="h6" fontWeight={700} sx={{ fontSize: "1.05rem" }}>
                  {course.title}
                </Typography>
                <Chip
                  label={course.level}
                  size="small"
                  sx={{
                    fontSize: "0.7rem",
                    fontWeight: 600,
                    height: 22,
                    bgcolor: "hsl(220, 100%, 96%)",
                    color: "hsl(220, 100%, 45%)",
                    border: "1px solid hsl(220, 80%, 90%)",
                  }}
                />
              </Box>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ mb: 2, lineHeight: 1.6 }}
              >
                {course.subtitle}
              </Typography>

              {/* Session Info Pills */}
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mb: 2 }}>
                {type === "classroom" && session && "startDate" in session && (
                  <>
                    <InfoPill icon={<Calendar className="w-3.5 h-3.5" />} label={`${session.startDate} – ${(session as any).endDate}`} />
                    <InfoPill icon={<Clock className="w-3.5 h-3.5" />} label={`${(session as any).startTime} – ${(session as any).endTime}`} />
                    <InfoPill icon={<Users className="w-3.5 h-3.5" />} label={`${(session as any).seatCapacity} seats`} />
                  </>
                )}
                {type === "one-on-one" && session && (
                  <>
                    <InfoPill icon={<Calendar className="w-3.5 h-3.5" />} label={`${(session as any).startDate} – ${(session as any).endDate}`} />
                    <InfoPill icon={<Clock className="w-3.5 h-3.5" />} label={`${(session as any).intervalMinutes} min sessions`} />
                  </>
                )}
                {type === "self-paced" && (
                  <InfoPill icon={<Clock className="w-3.5 h-3.5" />} label={`${course.modules.length} modules`} />
                )}
              </Box>

              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1.5 }}>
                <Button
                  variant="contained"
                  size="small"
                  disableElevation
                  startIcon={<Eye className="w-4 h-4" />}
                  onClick={() => setDetailOpen(true)}
                  sx={{
                    borderRadius: 2,
                    textTransform: "none",
                    fontWeight: 600,
                    px: 2.5,
                    background: "linear-gradient(135deg, hsl(220, 100%, 50%), hsl(220, 80%, 42%))",
                    "&:hover": {
                      background: "linear-gradient(135deg, hsl(220, 100%, 45%), hsl(220, 80%, 38%))",
                    },
                  }}
                >
                  View Details
                </Button>
                <Button
                  variant="outlined"
                  size="small"
                  startIcon={<Presentation className="w-4 h-4" />}
                  sx={{
                    borderRadius: 2,
                    textTransform: "none",
                    fontWeight: 600,
                    px: 2.5,
                    borderColor: "hsl(260, 70%, 60%)",
                    color: "hsl(260, 70%, 50%)",
                    "&:hover": {
                      borderColor: "hsl(260, 70%, 45%)",
                      bgcolor: "hsl(260, 70%, 97%)",
                    },
                  }}
                >
                  Presentations
                </Button>
                <Button
                  variant="outlined"
                  size="small"
                  startIcon={<FlaskConical className="w-4 h-4" />}
                  sx={{
                    borderRadius: 2,
                    textTransform: "none",
                    fontWeight: 600,
                    px: 2.5,
                    borderColor: "hsl(142, 60%, 45%)",
                    color: "hsl(142, 60%, 35%)",
                    "&:hover": {
                      borderColor: "hsl(142, 60%, 35%)",
                      bgcolor: "hsl(142, 60%, 97%)",
                    },
                  }}
                >
                  Labs
                </Button>
              </Box>
            </Box>

            {/* Announcements */}
            <Box
              sx={{
                width: { xs: "100%", lg: 280 },
                maxHeight: { lg: 220 },
                flexShrink: 0,
              }}
            >
              <StudentAnnouncements courseId={course.id} />
            </Box>
          </Box>
        </CardContent>
      </Card>
      <StudentCourseDetailDialog
        course={course}
        open={detailOpen}
        onClose={() => setDetailOpen(false)}
        type={type}
      />
    </>
  );
};

/* --- Info Pill --- */
const InfoPill: React.FC<{ icon: React.ReactNode; label: string }> = ({ icon, label }) => (
  <Box
    sx={{
      display: "inline-flex",
      alignItems: "center",
      gap: 0.75,
      px: 1.5,
      py: 0.5,
      borderRadius: 2,
      bgcolor: "hsl(220, 20%, 96%)",
      border: "1px solid hsl(220, 20%, 92%)",
      color: "text.secondary",
    }}
  >
    {icon}
    <Typography variant="caption" fontWeight={500} sx={{ fontSize: "0.75rem" }}>
      {label}
    </Typography>
  </Box>
);

/* --- Empty State --- */
const EmptyState = () => (
  <Card
    sx={{
      borderRadius: 3,
      border: "2px dashed",
      borderColor: "hsl(220, 30%, 88%)",
      bgcolor: "hsl(220, 60%, 98%)",
      textAlign: "center",
      py: 8,
    }}
  >
    <CardContent>
      <Box
        sx={{
          width: 72,
          height: 72,
          borderRadius: "50%",
          bgcolor: "hsl(220, 100%, 95%)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          mx: "auto",
          mb: 2.5,
        }}
      >
        <Sparkles className="w-8 h-8" style={{ color: "hsl(220, 100%, 60%)" }} />
      </Box>
      <Typography variant="h6" fontWeight={700} sx={{ mb: 1, color: "text.primary" }}>
        No Booked Courses Yet
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 320, mx: "auto" }}>
        Browse available courses and enroll to start your learning journey.
      </Typography>
    </CardContent>
  </Card>
);

export default StudentDashboard;
