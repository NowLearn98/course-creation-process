import React from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Avatar,
  Rating,
  Chip,
  Divider,
} from "@mui/material";
import { MessageSquare, BookOpen, GraduationCap, Lock } from "lucide-react";

interface Review {
  id: string;
  studentName: string;
  studentAvatar: string;
  courseTitle: string;
  courseRating: number;
  courseReview: string;
  instructorReview: string;
  privateReview: string;
  submittedAt: string;
}

const sampleReviews: Review[] = [
  {
    id: "r1",
    studentName: "Sarah Johnson",
    studentAvatar: "SJ",
    courseTitle: "Python for Data Science",
    courseRating: 5,
    courseReview: "This course exceeded my expectations. The hands-on labs were incredibly well designed and the content was highly relevant to real-world scenarios.",
    instructorReview: "The instructor was very knowledgeable, patient, and always available for questions. Best teaching style I've experienced.",
    privateReview: "Maybe consider adding more advanced topics in the last module. Overall a fantastic experience.",
    submittedAt: "2025-11-20",
  },
  {
    id: "r2",
    studentName: "Michael Chen",
    studentAvatar: "MC",
    courseTitle: "Advanced Machine Learning",
    courseRating: 4,
    courseReview: "Great course with solid theoretical foundations and practical applications. The pacing was excellent for intermediate learners.",
    instructorReview: "Very engaging instructor who brings complex concepts to life with clear examples.",
    privateReview: "The assignment deadlines felt a bit tight given the complexity of the material.",
    submittedAt: "2025-12-05",
  },
  {
    id: "r3",
    studentName: "Emily Rodriguez",
    studentAvatar: "ER",
    courseTitle: "Web Development Bootcamp",
    courseRating: 5,
    courseReview: "Absolutely loved this bootcamp! Went from zero coding knowledge to building full-stack apps. The project-based approach is brilliant.",
    instructorReview: "Incredibly supportive and motivating instructor. Made even the toughest topics feel approachable.",
    privateReview: "Would love a follow-up advanced course!",
    submittedAt: "2026-01-10",
  },
  {
    id: "r4",
    studentName: "David Kim",
    studentAvatar: "DK",
    courseTitle: "Python for Data Science",
    courseRating: 4,
    courseReview: "Well-structured course. The Pandas and visualization modules were particularly strong. Would recommend to anyone starting in data science.",
    instructorReview: "Good pace and clear explanations. Appreciated the real-world dataset examples.",
    privateReview: "Some of the video recordings had audio issues in Module 2.",
    submittedAt: "2026-01-28",
  },
];

const getRatingLabel = (rating: number) => {
  if (rating === 5) return "Outstanding";
  if (rating === 4) return "Great";
  if (rating === 3) return "Good";
  if (rating === 2) return "Fair";
  return "Poor";
};

const ReviewsTab: React.FC = () => {
  const avgRating = sampleReviews.reduce((sum, r) => sum + r.courseRating, 0) / sampleReviews.length;

  return (
    <Box>
      {/* Summary */}
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", sm: "row" },
          alignItems: { xs: "flex-start", sm: "center" },
          gap: 3,
          mb: 4,
          p: 3,
          borderRadius: 3,
          background: "linear-gradient(135deg, hsl(220, 60%, 97%), hsl(220, 100%, 95%))",
          border: "1px solid hsl(220, 60%, 90%)",
        }}
      >
        <Box sx={{ textAlign: { xs: "left", sm: "center" } }}>
          <Typography variant="h2" fontWeight={700} sx={{ fontSize: "2.5rem", color: "hsl(220, 100%, 40%)" }}>
            {avgRating.toFixed(1)}
          </Typography>
          <Rating value={avgRating} precision={0.1} readOnly size="medium" />
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
            {sampleReviews.length} reviews
          </Typography>
        </Box>
        <Divider orientation="vertical" flexItem sx={{ display: { xs: "none", sm: "block" } }} />
        <Box>
          <Typography variant="h6" fontWeight={600}>
            Student Reviews
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Reviews submitted by students who completed your courses
          </Typography>
        </Box>
      </Box>

      {/* Reviews List */}
      <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
        {sampleReviews.map((review) => (
          <Card
            key={review.id}
            sx={{
              borderRadius: 3,
              boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
              transition: "all 0.2s",
              "&:hover": { boxShadow: "0 4px 20px rgba(0,0,0,0.1)" },
              overflow: "visible",
            }}
          >
            <CardContent sx={{ p: 3 }}>
              {/* Header */}
              <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 2.5 }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                  <Avatar
                    sx={{
                      width: 44,
                      height: 44,
                      bgcolor: "hsl(220, 100%, 50%)",
                      fontSize: "0.9rem",
                      fontWeight: 600,
                    }}
                  >
                    {review.studentAvatar}
                  </Avatar>
                  <Box>
                    <Typography fontWeight={600} sx={{ fontSize: "1rem" }}>
                      {review.studentName}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {new Date(review.submittedAt).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
                    </Typography>
                  </Box>
                </Box>
                <Chip
                  label={review.courseTitle}
                  size="small"
                  icon={<BookOpen className="w-3.5 h-3.5" />}
                  sx={{
                    bgcolor: "hsl(220, 60%, 95%)",
                    color: "hsl(220, 100%, 40%)",
                    fontWeight: 500,
                    fontSize: "0.75rem",
                  }}
                />
              </Box>

              {/* Rating */}
              <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 2.5 }}>
                <Rating value={review.courseRating} readOnly size="small" />
                <Chip
                  label={getRatingLabel(review.courseRating)}
                  size="small"
                  sx={{
                    bgcolor: review.courseRating >= 4 ? "hsl(142, 60%, 93%)" : "hsl(45, 80%, 93%)",
                    color: review.courseRating >= 4 ? "hsl(142, 60%, 30%)" : "hsl(45, 80%, 30%)",
                    fontWeight: 600,
                    fontSize: "0.7rem",
                  }}
                />
              </Box>

              {/* Course Review */}
              <Box sx={{ mb: 2.5 }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
                  <BookOpen className="w-4 h-4" style={{ color: "hsl(220, 100%, 50%)" }} />
                  <Typography variant="subtitle2" fontWeight={600}>
                    Course Review
                  </Typography>
                </Box>
                <Typography variant="body2" color="text.secondary" sx={{ pl: 3.5, lineHeight: 1.7 }}>
                  {review.courseReview}
                </Typography>
              </Box>

              {/* Instructor Review */}
              <Box sx={{ mb: 2.5 }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
                  <GraduationCap className="w-4 h-4" style={{ color: "hsl(262, 80%, 55%)" }} />
                  <Typography variant="subtitle2" fontWeight={600}>
                    Instructor Review
                  </Typography>
                </Box>
                <Typography variant="body2" color="text.secondary" sx={{ pl: 3.5, lineHeight: 1.7 }}>
                  {review.instructorReview}
                </Typography>
              </Box>

              {/* Private Feedback */}
              <Box
                sx={{
                  p: 2,
                  borderRadius: 2,
                  bgcolor: "hsl(220, 60%, 97%)",
                  border: "1px dashed hsl(220, 40%, 85%)",
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
                  <Lock className="w-4 h-4" style={{ color: "hsl(220, 60%, 50%)" }} />
                  <Typography variant="subtitle2" fontWeight={600}>
                    Private Feedback
                  </Typography>
                  <Chip
                    label="Only you can see this"
                    size="small"
                    sx={{
                      height: 20,
                      fontSize: "0.65rem",
                      bgcolor: "hsl(220, 60%, 92%)",
                      color: "hsl(220, 60%, 40%)",
                    }}
                  />
                </Box>
                <Typography variant="body2" color="text.secondary" sx={{ pl: 3.5, lineHeight: 1.7 }}>
                  {review.privateReview}
                </Typography>
              </Box>
            </CardContent>
          </Card>
        ))}
      </Box>
    </Box>
  );
};

export default ReviewsTab;
