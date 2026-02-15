import React, { useState } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Avatar,
  Rating,
  Chip,
  Divider,
  Tabs,
  Tab,
  TextField,
  Button,
} from "@mui/material";
import { MessageSquare, BookOpen, GraduationCap, Lock, Send, CheckCircle } from "lucide-react";

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
  courseReplyFromInstructor?: string;
  instructorReplyFromInstructor?: string;
}

const initialReviews: Review[] = [
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
    courseReplyFromInstructor: "Thank you so much, Emily! We're thrilled you enjoyed the project-based approach. Stay tuned for our advanced course launching soon!",
    instructorReplyFromInstructor: "Your kind words mean a lot! It was a pleasure having you in the class.",
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
    courseReplyFromInstructor: "Thanks David! We've noted the audio issues and will have them fixed in the next update.",
    instructorReplyFromInstructor: "Glad you found the real-world examples useful. That's always been our focus!",
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
  const [reviews, setReviews] = useState<Review[]>(initialReviews);
  const [tabValue, setTabValue] = useState(0);
  const [replyDrafts, setReplyDrafts] = useState<Record<string, { course: string; instructor: string }>>({});

  const pendingReviews = reviews.filter((r) => !r.courseReplyFromInstructor && !r.instructorReplyFromInstructor);
  const completedReviews = reviews.filter((r) => r.courseReplyFromInstructor || r.instructorReplyFromInstructor);
  const displayedReviews = tabValue === 0 ? pendingReviews : completedReviews;

  const avgRating = reviews.reduce((sum, r) => sum + r.courseRating, 0) / reviews.length;

  const handleReplyChange = (reviewId: string, field: "course" | "instructor", value: string) => {
    setReplyDrafts((prev) => ({
      ...prev,
      [reviewId]: { ...prev[reviewId], [field]: value },
    }));
  };

  const handleSubmitReply = (reviewId: string) => {
    const draft = replyDrafts[reviewId];
    if (!draft?.course && !draft?.instructor) return;
    setReviews((prev) =>
      prev.map((r) =>
        r.id === reviewId
          ? { ...r, courseReplyFromInstructor: draft?.course || "", instructorReplyFromInstructor: draft?.instructor || "" }
          : r
      )
    );
    setReplyDrafts((prev) => {
      const next = { ...prev };
      delete next[reviewId];
      return next;
    });
  };

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
            {reviews.length} reviews
          </Typography>
        </Box>
        <Divider orientation="vertical" flexItem sx={{ display: { xs: "none", sm: "block" } }} />
        <Box>
          <Typography variant="h6" fontWeight={600}>
            Student Reviews
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {pendingReviews.length} awaiting your response · {completedReviews.length} completed
          </Typography>
        </Box>
      </Box>

      {/* Tabs */}
      <Tabs
        value={tabValue}
        onChange={(_, v) => setTabValue(v)}
        sx={{ borderBottom: 1, borderColor: "divider", mb: 3 }}
      >
        <Tab
          icon={<MessageSquare className="w-4 h-4" />}
          iconPosition="start"
          label={`Reviews (${pendingReviews.length})`}
        />
        <Tab
          icon={<CheckCircle className="w-4 h-4" />}
          iconPosition="start"
          label={`Completed Feedback (${completedReviews.length})`}
        />
      </Tabs>

      {/* Reviews List */}
      {displayedReviews.length === 0 ? (
        <Box sx={{ textAlign: "center", py: 6 }}>
          <Typography variant="h6" color="text.secondary">
            {tabValue === 0 ? "No pending reviews — you're all caught up! 🎉" : "No completed feedback yet."}
          </Typography>
        </Box>
      ) : (
        <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
          {displayedReviews.map((review) => (
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
                  {/* Instructor reply for course review */}
                  {review.courseReplyFromInstructor && (
                    <Box
                      sx={{
                        ml: 3.5,
                        mt: 1.5,
                        p: 2,
                        borderRadius: 2,
                        bgcolor: "hsl(220, 60%, 97%)",
                        borderLeft: "3px solid hsl(220, 100%, 50%)",
                      }}
                    >
                      <Typography variant="caption" fontWeight={600} color="hsl(220, 100%, 40%)" sx={{ mb: 0.5, display: "block" }}>
                        Your Reply
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.7 }}>
                        {review.courseReplyFromInstructor}
                      </Typography>
                    </Box>
                  )}
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
                  {/* Instructor reply for instructor review */}
                  {review.instructorReplyFromInstructor && (
                    <Box
                      sx={{
                        ml: 3.5,
                        mt: 1.5,
                        p: 2,
                        borderRadius: 2,
                        bgcolor: "hsl(262, 40%, 97%)",
                        borderLeft: "3px solid hsl(262, 80%, 55%)",
                      }}
                    >
                      <Typography variant="caption" fontWeight={600} color="hsl(262, 80%, 45%)" sx={{ mb: 0.5, display: "block" }}>
                        Your Reply
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.7 }}>
                        {review.instructorReplyFromInstructor}
                      </Typography>
                    </Box>
                  )}
                </Box>

                {/* Private Feedback */}
                <Box
                  sx={{
                    p: 2,
                    borderRadius: 2,
                    bgcolor: "hsl(220, 60%, 97%)",
                    border: "1px dashed hsl(220, 40%, 85%)",
                    mb: tabValue === 0 ? 2.5 : 0,
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

                {/* Reply Section (only for pending reviews) */}
                {tabValue === 0 && (
                  <Box
                    sx={{
                      p: 2.5,
                      borderRadius: 2.5,
                      bgcolor: "hsl(220, 30%, 98%)",
                      border: "1px solid hsl(220, 30%, 90%)",
                    }}
                  >
                    <Typography variant="subtitle2" fontWeight={700} sx={{ mb: 2, display: "flex", alignItems: "center", gap: 1 }}>
                      <Send className="w-4 h-4" style={{ color: "hsl(220, 100%, 50%)" }} />
                      Write Your Replies
                    </Typography>
                    <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                      <TextField
                        label="Reply to Course Review"
                        placeholder="Share your thoughts on the student's course feedback..."
                        multiline
                        minRows={2}
                        size="small"
                        value={replyDrafts[review.id]?.course || ""}
                        onChange={(e) => handleReplyChange(review.id, "course", e.target.value)}
                        sx={{
                          "& .MuiOutlinedInput-root": { borderRadius: 2 },
                        }}
                      />
                      <TextField
                        label="Reply to Instructor Review"
                        placeholder="Respond to the student's instructor feedback..."
                        multiline
                        minRows={2}
                        size="small"
                        value={replyDrafts[review.id]?.instructor || ""}
                        onChange={(e) => handleReplyChange(review.id, "instructor", e.target.value)}
                        sx={{
                          "& .MuiOutlinedInput-root": { borderRadius: 2 },
                        }}
                      />
                      <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
                        <Button
                          variant="contained"
                          size="small"
                          startIcon={<Send className="w-4 h-4" />}
                          disabled={!replyDrafts[review.id]?.course && !replyDrafts[review.id]?.instructor}
                          onClick={() => handleSubmitReply(review.id)}
                          sx={{
                            borderRadius: 2,
                            textTransform: "none",
                            fontWeight: 600,
                            background: "linear-gradient(135deg, hsl(220, 100%, 50%), hsl(220, 100%, 40%))",
                          }}
                        >
                          Submit Reply
                        </Button>
                      </Box>
                    </Box>
                  </Box>
                )}
              </CardContent>
            </Card>
          ))}
        </Box>
      )}
    </Box>
  );
};

export default ReviewsTab;
