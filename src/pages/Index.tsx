import React, { useState, useEffect } from "react";
import {
  Box,
  Container,
  Typography,
  Button,
  Card,
  CardContent,
  Tabs,
  Tab,
} from "@mui/material";
import { Plus, BookOpen, Users, TrendingUp, Star, GraduationCap, MessageSquare } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { BookingModal } from "@/components/BookingModal";
import { DraftsList } from "@/components/DraftsList";
import CourseMetricsOverview from "@/components/CourseMetricsOverview";
import { DraftCourse } from "@/types/draft";
import { PublishedCourse } from "@/types/published";
import { createSamplePublishedCourses } from "@/utils/sampleData";

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`tabpanel-${index}`}
      aria-labelledby={`tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );
}

const Index = () => {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingDraft, setEditingDraft] = useState<DraftCourse | null>(null);
  const [editingPublished, setEditingPublished] = useState<PublishedCourse | null>(null);
  const [tabValue, setTabValue] = useState(0);

  useEffect(() => {
    createSamplePublishedCourses();
  }, []);

  const handleEditDraft = (draft: DraftCourse) => {
    setEditingDraft(draft);
    setEditingPublished(null);
    setIsModalOpen(true);
  };

  const handleEditPublished = (course: PublishedCourse) => {
    setEditingPublished(course);
    setEditingDraft(null);
    setIsModalOpen(true);
  };

  const handleModalClose = (open: boolean) => {
    setIsModalOpen(open);
    if (!open) {
      setEditingDraft(null);
      setEditingPublished(null);
    }
  };

  const handleCreateNew = () => {
    setEditingDraft(null);
    setEditingPublished(null);
    setIsModalOpen(true);
  };

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "linear-gradient(to bottom right, hsl(0, 0%, 100%), hsl(220, 100%, 50%, 0.05), hsl(220, 14%, 96%, 0.1))",
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
                  background: "linear-gradient(to right, #000, rgba(0, 0, 0, 0.7))",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  mb: 1,
                }}
              >
                Course Creator
              </Typography>
              <Typography
                variant="body1"
                sx={{ fontSize: { xs: "1rem", md: "1.125rem" }, color: "text.secondary" }}
              >
                Build and launch your courses with ease
              </Typography>
            </Box>
            <Box sx={{ display: "flex", gap: 2 }}>
              <Button
                variant="outlined"
                size="large"
                onClick={() => navigate("/reviews")}
                startIcon={<MessageSquare className="w-5 h-5" />}
              >
                Reviews
              </Button>
              <Button
                variant="outlined"
                size="large"
                onClick={() => navigate("/student")}
                startIcon={<GraduationCap className="w-5 h-5" />}
              >
                Student Dashboard
              </Button>
              <Button
                variant="contained"
                size="large"
                onClick={handleCreateNew}
                startIcon={<Plus className="w-5 h-5" />}
                sx={{
                  boxShadow: 2,
                  "&:hover": {
                    boxShadow: 6,
                  },
                }}
              >
                New Course
              </Button>
            </Box>
          </Box>
        </Box>

        {/* Main Content */}
        <Box>
          <Tabs
            value={tabValue}
            onChange={handleTabChange}
            sx={{
              borderBottom: 1,
              borderColor: "divider",
              mb: 2,
            }}
          >
            <Tab
              icon={<TrendingUp className="w-4 h-4" />}
              iconPosition="start"
              label="Overview"
            />
            <Tab
              icon={<BookOpen className="w-4 h-4" />}
              iconPosition="start"
              label="Drafts"
            />
          </Tabs>

          <TabPanel value={tabValue} index={0}>
            {/* Stats Cards */}
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: {
                  xs: "repeat(1, 1fr)",
                  sm: "repeat(2, 1fr)",
                  lg: "repeat(4, 1fr)",
                },
                gap: { xs: 2, md: 3 },
                mb: 3,
              }}
            >
              <Box>
                <Card
                  sx={{
                    position: "relative",
                    overflow: "hidden",
                    boxShadow: 2,
                    transition: "all 0.3s",
                    "&:hover": { boxShadow: 4 },
                    "&::before": {
                      content: '""',
                      position: "absolute",
                      inset: 0,
                      background: "linear-gradient(to bottom right, rgba(0, 90, 255, 0.05), transparent)",
                    },
                  }}
                >
                  <CardContent sx={{ position: "relative" }}>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "flex-start",
                        mb: 2,
                      }}
                    >
                      <Typography variant="body2" color="text.secondary" fontWeight={500}>
                        Total Courses
                      </Typography>
                      <Box
                        sx={{
                          p: 1,
                          bgcolor: "primary.main",
                          color: "primary.contrastText",
                          borderRadius: 1,
                          display: "flex",
                          opacity: 0.1,
                        }}
                      >
                        <BookOpen className="h-4 w-4" />
                      </Box>
                    </Box>
                    <Typography variant="h3" fontWeight={700} sx={{ mb: 0.5 }}>
                      12
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      +2 from last month
                    </Typography>
                  </CardContent>
                </Card>
              </Box>

              <Box>
                <Card
                  sx={{
                    position: "relative",
                    overflow: "hidden",
                    boxShadow: 2,
                    transition: "all 0.3s",
                    "&:hover": { boxShadow: 4 },
                    "&::before": {
                      content: '""',
                      position: "absolute",
                      inset: 0,
                      background: "linear-gradient(to bottom right, rgba(34, 197, 94, 0.05), transparent)",
                    },
                  }}
                >
                  <CardContent sx={{ position: "relative" }}>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "flex-start",
                        mb: 2,
                      }}
                    >
                      <Typography variant="body2" color="text.secondary" fontWeight={500}>
                        Total Students
                      </Typography>
                      <Box
                        sx={{
                          p: 1,
                          bgcolor: "success.main",
                          color: "success.contrastText",
                          borderRadius: 1,
                          display: "flex",
                          opacity: 0.1,
                        }}
                      >
                        <Users className="h-4 w-4" />
                      </Box>
                    </Box>
                    <Typography variant="h3" fontWeight={700} sx={{ mb: 0.5 }}>
                      1,234
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      +15% from last month
                    </Typography>
                  </CardContent>
                </Card>
              </Box>

              <Box>
                <Card
                  sx={{
                    position: "relative",
                    overflow: "hidden",
                    boxShadow: 2,
                    transition: "all 0.3s",
                    "&:hover": { boxShadow: 4 },
                    "&::before": {
                      content: '""',
                      position: "absolute",
                      inset: 0,
                      background: "linear-gradient(to bottom right, rgba(245, 158, 11, 0.05), transparent)",
                    },
                  }}
                >
                  <CardContent sx={{ position: "relative" }}>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "flex-start",
                        mb: 2,
                      }}
                    >
                      <Typography variant="body2" color="text.secondary" fontWeight={500}>
                        Avg. Rating
                      </Typography>
                      <Box
                        sx={{
                          p: 1,
                          bgcolor: "warning.main",
                          color: "warning.contrastText",
                          borderRadius: 1,
                          display: "flex",
                          opacity: 0.1,
                        }}
                      >
                        <Star className="h-4 w-4" />
                      </Box>
                    </Box>
                    <Typography variant="h3" fontWeight={700} sx={{ mb: 0.5 }}>
                      4.8
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Based on 256 reviews
                    </Typography>
                  </CardContent>
                </Card>
              </Box>

              <Box>
                <Card
                  sx={{
                    position: "relative",
                    overflow: "hidden",
                    boxShadow: 2,
                    transition: "all 0.3s",
                    "&:hover": { boxShadow: 4 },
                    "&::before": {
                      content: '""',
                      position: "absolute",
                      inset: 0,
                      background: "linear-gradient(to bottom right, rgba(0, 90, 255, 0.05), transparent)",
                    },
                  }}
                >
                  <CardContent sx={{ position: "relative" }}>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "flex-start",
                        mb: 2,
                      }}
                    >
                      <Typography variant="body2" color="text.secondary" fontWeight={500}>
                        Revenue
                      </Typography>
                      <Box
                        sx={{
                          p: 1,
                          bgcolor: "primary.main",
                          color: "primary.contrastText",
                          borderRadius: 1,
                          display: "flex",
                          opacity: 0.1,
                        }}
                      >
                        <TrendingUp className="h-4 w-4" />
                      </Box>
                    </Box>
                    <Typography variant="h3" fontWeight={700} sx={{ mb: 0.5 }}>
                      $12,345
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      +8% from last month
                    </Typography>
                  </CardContent>
                </Card>
              </Box>
            </Box>

            {/* Published Courses Section */}
            <Box>
              <Box sx={{ mb: 2 }}>
                <Typography variant="h2" fontWeight={700} sx={{ mb: 1 }}>
                  Published Courses
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Track performance metrics for each course
                </Typography>
              </Box>
              <CourseMetricsOverview onEditCourse={handleEditPublished} />
            </Box>
          </TabPanel>

          <TabPanel value={tabValue} index={1}>
            <Box
              sx={{
                display: "flex",
                flexDirection: { xs: "column", sm: "row" },
                alignItems: { xs: "flex-start", sm: "center" },
                justifyContent: "space-between",
                gap: 2,
                mb: 3,
              }}
            >
              <Box>
                <Typography variant="h2" fontWeight={700} sx={{ mb: 0.5 }}>
                  Course Drafts
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Continue where you left off
                </Typography>
              </Box>
              <Button
                variant="contained"
                onClick={handleCreateNew}
                startIcon={<Plus className="w-4 h-4" />}
                sx={{
                  boxShadow: 2,
                  "&:hover": {
                    boxShadow: 4,
                  },
                }}
              >
                New Draft
              </Button>
            </Box>
            <DraftsList onEditDraft={handleEditDraft} />
          </TabPanel>
        </Box>

        {/* Course Creation Modal */}
        <BookingModal
          open={isModalOpen}
          onOpenChange={handleModalClose}
          editingDraft={editingDraft}
          editingPublished={editingPublished}
        />
      </Container>
    </Box>
  );
};

export default Index;
