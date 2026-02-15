import React, { useState, useEffect } from "react";
import {
  Box,
  Container,
  Typography,
  Button,
  Card,
  CardContent,
  Chip,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  IconButton,
  Rating,
} from "@mui/material";
import { ArrowLeft, BookOpen, Clock, Calendar, MapPin, Users, Star, CheckCircle, Eye, GraduationCap, Sparkles, Presentation, FlaskConical, ChevronDown, Layers, MessageSquarePlus, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { PublishedCourse } from "@/types/published";
import { getPublishedCourses } from "@/utils/publishedStorage";
import StudentAnnouncements from "@/components/StudentAnnouncements";
import StudentCourseDetailDialog from "@/components/StudentCourseDetailDialog";
import StudentAttachments from "@/components/StudentAttachments";

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

  // Demo past courses
  const pastCourses: (PublishedCourse & { completedDate: string; sessionType: "classroom" | "one-on-one" })[] = [
    {
      id: "past-1",
      title: "Python for Data Science",
      subtitle: "A hands-on bootcamp covering data analysis with Python, Pandas, and visualization",
      description: "",
      objectives: "",
      requirements: "",
      level: "Intermediate",
      language: "English",
      category: "Technology",
      subcategory: "Data Science",
      modules: [
        {
          title: "Data Analysis with Pandas",
          subsections: [
            { title: "Introduction to Pandas", description: "DataFrames and Series", type: "lecture" as const, timeMinutes: "60" },
            { title: "Data Cleaning Lab", description: "Hands-on data wrangling", type: "lab" as const, timeMinutes: "90" },
          ],
        },
        {
          title: "Data Visualization",
          subsections: [
            { title: "Matplotlib & Seaborn", description: "Creating charts", type: "lecture" as const, timeMinutes: "45" },
          ],
        },
      ],
      format: "online",
      sessionTypes: ["classroom"],
      classroomSessions: [
        {
          startDate: "2025-10-01",
          endDate: "2025-10-15",
          startTime: "09:00",
          endTime: "13:00",
          timezone: "America/New_York",
          seatCapacity: 30,
          price: 299,
        },
      ],
      oneOnOneSessions: [],
      images: [],
      videos: [],
      publishedAt: "2025-09-15",
      enrollments: 28,
      rating: 4.7,
      reviews: 22,
      price: 299,
      clicks: 540,
      status: "active",
      completedDate: "2025-10-15",
      sessionType: "classroom",
    },
    {
      id: "past-2",
      title: "Spanish Conversation Practice",
      subtitle: "Personalized 1-on-1 Spanish lessons focused on real-world conversation skills",
      description: "",
      objectives: "",
      requirements: "",
      level: "Beginner",
      language: "English",
      category: "Language",
      subcategory: "Spanish",
      modules: [
        {
          title: "Everyday Conversations",
          subsections: [
            { title: "Greetings & Introductions", description: "Basic conversational phrases", type: "lecture" as const, timeMinutes: "30" },
            { title: "Ordering Food & Shopping", description: "Practical scenarios", type: "lecture" as const, timeMinutes: "30" },
          ],
        },
      ],
      format: "online",
      sessionTypes: ["one-on-one"],
      classroomSessions: [],
      oneOnOneSessions: [
        {
          startDate: "2025-11-01",
          endDate: "2025-12-20",
          daysOfWeek: ["Tuesday", "Thursday"],
          startTime: "18:00",
          endTime: "20:00",
          pricePerInterval: 40,
          intervalMinutes: 30,
        },
      ],
      images: [],
      videos: [],
      publishedAt: "2025-10-20",
      enrollments: 1,
      rating: 5.0,
      reviews: 1,
      price: 40,
      clicks: 120,
      status: "active",
      completedDate: "2025-12-20",
      sessionType: "one-on-one",
    },
  ];

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
            value={pastCourses.length}
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

          {courses.length === 0 && pastCourses.length === 0 && <EmptyState />}

          {/* Past Courses Section */}
          {pastCourses.length > 0 && (
            <Box>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 2.5 }}>
                <Box sx={{ height: 28, width: 4, bgcolor: "hsl(0, 0%, 55%)", borderRadius: 1 }} />
                <Typography variant="h6" fontWeight={700}>
                  Past Courses
                </Typography>
                <Chip
                  label={pastCourses.length}
                  size="small"
                  sx={{
                    bgcolor: "hsl(0, 0%, 92%)",
                    color: "hsl(0, 0%, 45%)",
                    fontWeight: 700,
                    fontSize: "0.75rem",
                    height: 24,
                  }}
                />
              </Box>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                {pastCourses.map((course) => (
                  <CourseCard key={course.id} course={course} type={course.sessionType} isPast />
                ))}
              </Box>
            </Box>
          )}
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
  isPast?: boolean;
}

const CourseCard: React.FC<CourseCardProps> = ({ course, type, isPast = false }) => {
  const navigate = useNavigate();
  const [detailOpen, setDetailOpen] = useState(false);
  const [presAnchor, setPresAnchor] = useState<null | HTMLElement>(null);
  const [labsAnchor, setLabsAnchor] = useState<null | HTMLElement>(null);
  const [reviewOpen, setReviewOpen] = useState(false);
  const [reviewRating, setReviewRating] = useState<number | null>(null);
  const [courseReview, setCourseReview] = useState("");
  const [instructorReview, setInstructorReview] = useState("");
  const [reviewSubmitted, setReviewSubmitted] = useState(false);
  const session =
    type === "classroom"
      ? course.classroomSessions?.[0]
      : course.oneOnOneSessions?.[0];

  const modulesWithPresentations = course.modules
    .map((mod, idx) => ({ mod, idx }))
    .filter(({ mod }) => mod.subsections.some((s) => s.type === "lecture"));

  const modulesWithLabs = course.modules
    .map((mod, idx) => ({ mod, idx }))
    .filter(({ mod }) => mod.subsections.some((s) => s.type === "lab"));

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
                  endIcon={<ChevronDown className="w-3.5 h-3.5" />}
                  onClick={(e) => setPresAnchor(e.currentTarget)}
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
                <Menu
                  anchorEl={presAnchor}
                  open={Boolean(presAnchor)}
                  onClose={() => setPresAnchor(null)}
                  PaperProps={{
                    sx: {
                      borderRadius: 2,
                      boxShadow: "0 8px 24px hsla(0,0%,0%,0.12)",
                      minWidth: 220,
                      bgcolor: "background.paper",
                      mt: 0.5,
                    },
                  }}
                >
                  {modulesWithPresentations.length > 0 ? (
                    modulesWithPresentations.map(({ mod, idx }) => (
                      <MenuItem
                        key={idx}
                        onClick={() => {
                          setPresAnchor(null);
                          navigate(`/student/course/${course.id}/module/${idx}?type=lecture`);
                        }}
                        sx={{ borderRadius: 1, mx: 0.5, py: 1 }}
                      >
                        <ListItemIcon sx={{ color: "hsl(260, 70%, 55%)" }}>
                          <Layers className="w-4 h-4" />
                        </ListItemIcon>
                        <ListItemText
                          primary={mod.title}
                          secondary={`Module ${idx + 1}`}
                          primaryTypographyProps={{ variant: "body2", fontWeight: 600 }}
                          secondaryTypographyProps={{ variant: "caption" }}
                        />
                      </MenuItem>
                    ))
                  ) : (
                    <MenuItem disabled sx={{ py: 1.5 }}>
                      <Typography variant="body2" color="text.secondary">
                        No presentations available
                      </Typography>
                    </MenuItem>
                  )}
                </Menu>

                <Button
                  variant="outlined"
                  size="small"
                  startIcon={<FlaskConical className="w-4 h-4" />}
                  endIcon={<ChevronDown className="w-3.5 h-3.5" />}
                  onClick={(e) => setLabsAnchor(e.currentTarget)}
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
                <Menu
                  anchorEl={labsAnchor}
                  open={Boolean(labsAnchor)}
                  onClose={() => setLabsAnchor(null)}
                  PaperProps={{
                    sx: {
                      borderRadius: 2,
                      boxShadow: "0 8px 24px hsla(0,0%,0%,0.12)",
                      minWidth: 220,
                      bgcolor: "background.paper",
                      mt: 0.5,
                    },
                  }}
                >
                  {modulesWithLabs.length > 0 ? (
                    modulesWithLabs.map(({ mod, idx }) => (
                      <MenuItem
                        key={idx}
                        onClick={() => {
                          setLabsAnchor(null);
                          navigate(`/student/course/${course.id}/module/${idx}?type=lab`);
                        }}
                        sx={{ borderRadius: 1, mx: 0.5, py: 1 }}
                      >
                        <ListItemIcon sx={{ color: "hsl(142, 60%, 40%)" }}>
                          <Layers className="w-4 h-4" />
                        </ListItemIcon>
                        <ListItemText
                          primary={mod.title}
                          secondary={`Module ${idx + 1}`}
                          primaryTypographyProps={{ variant: "body2", fontWeight: 600 }}
                          secondaryTypographyProps={{ variant: "caption" }}
                        />
                      </MenuItem>
                    ))
                  ) : (
                    <MenuItem disabled sx={{ py: 1.5 }}>
                      <Typography variant="body2" color="text.secondary">
                        No labs available
                      </Typography>
                    </MenuItem>
                  )}
                </Menu>
                {isPast && (
                  <Button
                    variant="outlined"
                    size="small"
                    startIcon={reviewSubmitted ? <CheckCircle className="w-4 h-4" /> : <MessageSquarePlus className="w-4 h-4" />}
                    onClick={() => !reviewSubmitted && setReviewOpen(true)}
                    disabled={reviewSubmitted}
                    sx={{
                      borderRadius: 2,
                      textTransform: "none",
                      fontWeight: 600,
                      px: 2.5,
                      borderColor: reviewSubmitted ? "hsl(142, 60%, 45%)" : "hsl(30, 90%, 50%)",
                      color: reviewSubmitted ? "hsl(142, 60%, 35%)" : "hsl(30, 90%, 40%)",
                      "&:hover": {
                        borderColor: reviewSubmitted ? "hsl(142, 60%, 45%)" : "hsl(30, 90%, 40%)",
                        bgcolor: reviewSubmitted ? "hsl(142, 60%, 97%)" : "hsl(30, 90%, 97%)",
                      },
                      "&.Mui-disabled": {
                        borderColor: "hsl(142, 60%, 45%)",
                        color: "hsl(142, 60%, 35%)",
                        opacity: 0.8,
                      },
                    }}
                  >
                    {reviewSubmitted ? "Review Submitted" : "Submit a Review"}
                  </Button>
                )}
              </Box>
            </Box>

            {/* Announcements & Attachments */}
            <Box
              sx={{
                display: "flex",
                flexDirection: { xs: "column", sm: "row" },
                gap: 2,
                width: { xs: "100%", lg: 540 },
                flexShrink: 0,
              }}
            >
              <Box sx={{ flex: 1, maxHeight: { sm: 220 } }}>
                <StudentAnnouncements courseId={course.id} />
              </Box>
              <Box sx={{ flex: 1, maxHeight: { sm: 220 } }}>
                <StudentAttachments courseId={course.id} />
              </Box>
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

      {/* Review Dialog */}
      <Dialog
        open={reviewOpen}
        onClose={() => setReviewOpen(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 3,
            p: 1,
          },
        }}
      >
        <DialogTitle sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", pb: 1 }}>
          <Box>
            <Typography variant="h6" fontWeight={700}>
              Submit a Review
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {course.title}
            </Typography>
          </Box>
          <IconButton onClick={() => setReviewOpen(false)} size="small">
            <X className="w-5 h-5" />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ pt: 2 }}>
          {/* Star Rating */}
          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 1 }}>
              Overall Rating
            </Typography>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
              <Rating
                value={reviewRating}
                onChange={(_, newValue) => setReviewRating(newValue)}
                size="large"
                sx={{
                  "& .MuiRating-iconFilled": { color: "hsl(40, 95%, 50%)" },
                  "& .MuiRating-iconHover": { color: "hsl(40, 95%, 55%)" },
                }}
              />
              {reviewRating && (
                <Typography variant="body2" fontWeight={600} color="text.secondary">
                  {reviewRating}/5
                </Typography>
              )}
            </Box>
          </Box>

          {/* Course Review */}
          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 1 }}>
              Course Review
            </Typography>
            <Typography variant="caption" color="text.secondary" sx={{ display: "block", mb: 1 }}>
              Share your experience about the course content, materials, and structure.
            </Typography>
            <TextField
              multiline
              rows={3}
              fullWidth
              placeholder="What did you think about the course content?"
              value={courseReview}
              onChange={(e) => setCourseReview(e.target.value)}
              sx={{
                "& .MuiOutlinedInput-root": { borderRadius: 2 },
              }}
            />
          </Box>

          {/* Instructor Review */}
          <Box>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
              <Typography variant="subtitle2" fontWeight={600}>
                Instructor Review
              </Typography>
              <Chip
                label="Private"
                size="small"
                icon={<span style={{ fontSize: 14, marginLeft: 8 }}>🔒</span>}
                sx={{
                  bgcolor: "rgba(0,0,0,0.06)",
                  fontSize: "0.7rem",
                  height: 22,
                  fontWeight: 500,
                }}
              />
            </Box>
            <Typography variant="caption" color="text.secondary" sx={{ display: "block", mb: 1 }}>
              This review is private and will only be shared with the instructor, not visible to other students.
            </Typography>
            <TextField
              multiline
              rows={3}
              fullWidth
              placeholder="How was the instructor's teaching?"
              value={instructorReview}
              onChange={(e) => setInstructorReview(e.target.value)}
              sx={{
                "& .MuiOutlinedInput-root": { borderRadius: 2 },
              }}
            />
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2.5 }}>
          <Button
            variant="outlined"
            onClick={() => setReviewOpen(false)}
            sx={{ borderRadius: 2, textTransform: "none", fontWeight: 600 }}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            disableElevation
            disabled={!reviewRating}
            onClick={() => {
              setReviewSubmitted(true);
              setReviewOpen(false);
            }}
            sx={{
              borderRadius: 2,
              textTransform: "none",
              fontWeight: 600,
              background: "linear-gradient(135deg, hsl(220, 100%, 50%), hsl(220, 80%, 42%))",
              "&:hover": {
                background: "linear-gradient(135deg, hsl(220, 100%, 45%), hsl(220, 80%, 38%))",
              },
            }}
          >
            Submit Review
          </Button>
        </DialogActions>
      </Dialog>
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
