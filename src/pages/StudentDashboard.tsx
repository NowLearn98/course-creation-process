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
import { ArrowLeft, BookOpen, Clock, Calendar, MapPin, Users, Star, CheckCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { PublishedCourse } from "@/types/published";
import { getPublishedCourses } from "@/utils/publishedStorage";

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
        background:
          "linear-gradient(to bottom right, hsl(0, 0%, 100%), hsl(220, 100%, 50%, 0.05), hsl(220, 14%, 96%, 0.1))",
      }}
    >
      <Container maxWidth="xl" sx={{ py: { xs: 3, md: 5 } }}>
        {/* Header */}
        <Box sx={{ mb: { xs: 4, md: 6 } }}>
          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", md: "row" },
              alignItems: { xs: "flex-start", md: "center" },
              justifyContent: "space-between",
              gap: 2,
            }}
          >
            <Box>
              <Typography
                variant="h1"
                sx={{
                  fontSize: { xs: "2rem", md: "3rem" },
                  fontWeight: 700,
                  background:
                    "linear-gradient(to right, #000, rgba(0, 0, 0, 0.7))",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  mb: 1,
                }}
              >
                Student Dashboard
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  fontSize: { xs: "1rem", md: "1.125rem" },
                  color: "text.secondary",
                }}
              >
                View your booked and enrolled courses
              </Typography>
            </Box>
            <Button
              variant="outlined"
              onClick={() => navigate("/")}
              startIcon={<ArrowLeft className="w-5 h-5" />}
            >
              Back to Creator
            </Button>
          </Box>
        </Box>
        {/* Completed Sessions Metric */}
        <Box sx={{ mb: 4 }}>
          <Card sx={{ boxShadow: 2, maxWidth: 280 }}>
            <CardContent>
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 1 }}>
                <Typography variant="body2" color="text.secondary" fontWeight={500}>
                  Completed Sessions
                </Typography>
                <CheckCircle className="h-4 w-4 text-green-500" />
              </Box>
              <Typography variant="h3" fontWeight={700}>0</Typography>
            </CardContent>
          </Card>
        </Box>


        {/* Course Sections */}
        <Box sx={{ display: "flex", flexDirection: "column", gap: 4 }}>
          {/* Classroom Courses */}
          {classroomCourses.length > 0 && (
            <Box>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
                <Box sx={{ height: 32, width: 4, bgcolor: "primary.main", borderRadius: 1 }} />
                <Typography variant="h5" fontWeight={700}>Classroom Sessions</Typography>
                <Typography variant="body2" color="text.secondary">({classroomCourses.length})</Typography>
              </Box>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                {classroomCourses.map((course) => (
                  <CourseCard key={course.id} course={course} type="classroom" />
                ))}
              </Box>
            </Box>
          )}

          {/* One-on-One Courses */}
          {oneOnOneCourses.length > 0 && (
            <Box>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
                <Box sx={{ height: 32, width: 4, bgcolor: "secondary.main", borderRadius: 1 }} />
                <Typography variant="h5" fontWeight={700}>One-on-One Sessions</Typography>
                <Typography variant="body2" color="text.secondary">({oneOnOneCourses.length})</Typography>
              </Box>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                {oneOnOneCourses.map((course) => (
                  <CourseCard key={course.id} course={course} type="one-on-one" />
                ))}
              </Box>
            </Box>
          )}


          {courses.length === 0 && (
            <Card sx={{ p: 6, textAlign: "center", border: "2px dashed", borderColor: "divider" }}>
              <CardContent>
                <BookOpen className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                <Typography variant="h6" fontWeight={600} sx={{ mb: 1 }}>
                  No Booked Courses Yet
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Browse available courses and enroll to see them here.
                </Typography>
              </CardContent>
            </Card>
          )}
        </Box>
      </Container>
    </Box>
  );
};

interface CourseCardProps {
  course: PublishedCourse;
  type: "classroom" | "one-on-one" | "self-paced";
}

const CourseCard: React.FC<CourseCardProps> = ({ course, type }) => {
  const session = type === "classroom" ? course.classroomSessions?.[0] : course.oneOnOneSessions?.[0];

  return (
    <Card
      sx={{
        boxShadow: 2,
        transition: "all 0.2s",
        "&:hover": { boxShadow: 4 },
      }}
    >
      <CardContent sx={{ p: { xs: 2, md: 3 } }}>
        <Box sx={{ display: "flex", flexDirection: { xs: "column", md: "row" }, gap: 2, justifyContent: "space-between" }}>
          <Box sx={{ flex: 1 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
              <Typography variant="h6" fontWeight={700}>{course.title}</Typography>
              <Chip
                label={course.level}
                size="small"
                color="primary"
                variant="outlined"
                sx={{ fontSize: "0.7rem" }}
              />
            </Box>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1.5 }}>
              {course.subtitle}
            </Typography>
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
              {type === "classroom" && session && "startDate" in session && (
                <>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                    <Calendar className="w-3.5 h-3.5 text-gray-500" />
                    <Typography variant="caption" color="text.secondary">
                      {session.startDate} – {(session as any).endDate}
                    </Typography>
                  </Box>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                    <Clock className="w-3.5 h-3.5 text-gray-500" />
                    <Typography variant="caption" color="text.secondary">
                      {(session as any).startTime} – {(session as any).endTime}
                    </Typography>
                  </Box>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                    <Users className="w-3.5 h-3.5 text-gray-500" />
                    <Typography variant="caption" color="text.secondary">
                      {(session as any).seatCapacity} seats
                    </Typography>
                  </Box>
                </>
              )}
              {type === "one-on-one" && session && (
                <>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                    <Calendar className="w-3.5 h-3.5 text-gray-500" />
                    <Typography variant="caption" color="text.secondary">
                      {(session as any).startDate} – {(session as any).endDate}
                    </Typography>
                  </Box>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                    <Clock className="w-3.5 h-3.5 text-gray-500" />
                    <Typography variant="caption" color="text.secondary">
                      {(session as any).intervalMinutes} min sessions
                    </Typography>
                  </Box>
                </>
              )}
              {type === "self-paced" && (
                <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                  <Clock className="w-3.5 h-3.5 text-gray-500" />
                  <Typography variant="caption" color="text.secondary">
                    {course.modules.length} modules
                  </Typography>
                </Box>
              )}
            </Box>
          </Box>

          {/* Right side metrics */}
          <Box sx={{ display: "flex", gap: 3, alignItems: "center", shrink: 0 }}>
            <Box sx={{ textAlign: "center" }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, justifyContent: "center" }}>
                <Star className="w-4 h-4 text-yellow-500" />
                <Typography variant="h6" fontWeight={700}>{course.rating}</Typography>
              </Box>
              <Typography variant="caption" color="text.secondary">{course.reviews} reviews</Typography>
            </Box>
            <Box sx={{ textAlign: "center" }}>
              <Typography variant="h6" fontWeight={700}>${course.price}</Typography>
              <Typography variant="caption" color="text.secondary">
                {type === "one-on-one" ? "per session" : "total"}
              </Typography>
            </Box>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

export default StudentDashboard;
