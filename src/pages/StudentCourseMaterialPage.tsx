import React from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import {
  Box,
  Container,
  Typography,
  Button,
  Card,
  CardContent,
  Chip,
} from "@mui/material";
import { ArrowLeft, Presentation, FlaskConical, FileText, Clock, ClipboardList } from "lucide-react";
import { PublishedCourse } from "@/types/published";
import { getPublishedCourses } from "@/utils/publishedStorage";

const StudentCourseMaterialPage = () => {
  const { courseId, moduleIndex } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const materialType = searchParams.get("type") || "lecture";

  const courses = getPublishedCourses();
  const course = courses.find((c) => c.id === courseId);
  const modIdx = parseInt(moduleIndex || "0", 10);
  const module = course?.modules?.[modIdx];

  const isPresentations = materialType === "lecture";
  const isQuiz = materialType === "quiz";
  const icon = isPresentations ? (
    <Presentation className="w-6 h-6" />
  ) : isQuiz ? (
    <ClipboardList className="w-6 h-6" />
  ) : (
    <FlaskConical className="w-6 h-6" />
  );
  const color = isPresentations ? "hsl(260, 70%, 55%)" : isQuiz ? "hsl(30, 90%, 50%)" : "hsl(142, 60%, 40%)";
  const bgColor = isPresentations ? "hsl(260, 70%, 96%)" : isQuiz ? "hsl(30, 90%, 96%)" : "hsl(142, 60%, 96%)";
  const label = isPresentations ? "Presentation" : isQuiz ? "Quiz" : "Lab";

  if (!course || !module) {
    return (
      <Box sx={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <Box sx={{ textAlign: "center" }}>
          <Typography variant="h5" fontWeight={700} sx={{ mb: 1 }}>
            Material Not Found
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            The requested course material could not be found.
          </Typography>
          <Button variant="outlined" onClick={() => navigate("/student")} startIcon={<ArrowLeft className="w-4 h-4" />}>
            Back to Dashboard
          </Button>
        </Box>
      </Box>
    );
  }

  const subsections = module.subsections.filter((s) =>
    isPresentations ? s.type === "lecture" : s.type === "lab"
  );

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "linear-gradient(180deg, hsl(220, 60%, 97%) 0%, hsl(0, 0%, 100%) 50%)",
      }}
    >
      <Container maxWidth="lg" sx={{ py: { xs: 3, md: 5 } }}>
        {/* Header */}
        <Button
          variant="text"
          onClick={() => navigate("/student")}
          startIcon={<ArrowLeft className="w-4 h-4" />}
          sx={{ mb: 3, textTransform: "none", fontWeight: 600, color: "text.secondary" }}
        >
          Back to Dashboard
        </Button>

        <Box
          sx={{
            p: { xs: 3, md: 4 },
            borderRadius: 3,
            background: `linear-gradient(135deg, ${color}, ${isPresentations ? "hsl(260, 60%, 40%)" : "hsl(142, 50%, 30%)"})`,
            color: "white",
            mb: 4,
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 1.5 }}>
            <Box
              sx={{
                width: 44,
                height: 44,
                borderRadius: 2,
                bgcolor: "rgba(255,255,255,0.2)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {icon}
            </Box>
            <Chip
              label={label}
              size="small"
              sx={{ bgcolor: "rgba(255,255,255,0.2)", color: "white", fontWeight: 600 }}
            />
          </Box>
          <Typography variant="h4" fontWeight={800} sx={{ fontSize: { xs: "1.4rem", md: "1.75rem" }, mb: 0.5 }}>
            {module.title}
          </Typography>
          <Typography variant="body2" sx={{ color: "rgba(255,255,255,0.8)" }}>
            {course.title} — Module {modIdx + 1}
          </Typography>
        </Box>

        {/* Content */}
        {subsections.length > 0 ? (
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            {subsections.map((sub, idx) => (
              <Card
                key={idx}
                sx={{
                  borderRadius: 3,
                  border: "1px solid",
                  borderColor: "divider",
                  boxShadow: "0 1px 3px hsla(0,0%,0%,0.04)",
                  transition: "all 0.2s",
                  "&:hover": {
                    boxShadow: "0 4px 16px hsla(0,0%,0%,0.08)",
                    borderColor: color,
                  },
                }}
              >
                <CardContent sx={{ p: 3, "&:last-child": { pb: 3 } }}>
                  <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                    <Box sx={{ display: "flex", gap: 2, alignItems: "flex-start" }}>
                      <Box
                        sx={{
                          width: 40,
                          height: 40,
                          borderRadius: 2,
                          bgcolor: bgColor,
                          color: color,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          flexShrink: 0,
                          mt: 0.25,
                        }}
                      >
                        <FileText className="w-5 h-5" />
                      </Box>
                      <Box>
                        <Typography variant="subtitle1" fontWeight={700}>
                          {sub.title}
                        </Typography>
                        {sub.description && (
                          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5, lineHeight: 1.6 }}>
                            {sub.description}
                          </Typography>
                        )}
                      </Box>
                    </Box>
                    {sub.timeMinutes && (
                      <Chip
                        icon={<Clock className="w-3.5 h-3.5" />}
                        label={`${sub.timeMinutes} min`}
                        size="small"
                        sx={{
                          bgcolor: "hsl(220, 20%, 96%)",
                          fontWeight: 500,
                          fontSize: "0.75rem",
                          flexShrink: 0,
                          ml: 2,
                        }}
                      />
                    )}
                  </Box>
                </CardContent>
              </Card>
            ))}
          </Box>
        ) : (
          <Card
            sx={{
              borderRadius: 3,
              border: "2px dashed",
              borderColor: "hsl(220, 30%, 88%)",
              bgcolor: "hsl(220, 60%, 98%)",
              textAlign: "center",
              py: 6,
            }}
          >
            <CardContent>
              <Box
                sx={{
                  width: 56,
                  height: 56,
                  borderRadius: "50%",
                  bgcolor: bgColor,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  mx: "auto",
                  mb: 2,
                  color: color,
                }}
              >
                {icon}
              </Box>
              <Typography variant="h6" fontWeight={700} sx={{ mb: 0.5 }}>
                No {label}s Yet
              </Typography>
              <Typography variant="body2" color="text.secondary">
                No {label.toLowerCase()} materials have been added to this module.
              </Typography>
            </CardContent>
          </Card>
        )}
      </Container>
    </Box>
  );
};

export default StudentCourseMaterialPage;
