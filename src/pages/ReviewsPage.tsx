import React from "react";
import { Box, Container, Typography, Button } from "@mui/material";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import ReviewsTab from "@/components/ReviewsTab";

const ReviewsPage = () => {
  const navigate = useNavigate();

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
            Student Reviews
          </Typography>
          <Typography variant="body1" sx={{ fontSize: { xs: "1rem", md: "1.125rem" }, color: "text.secondary" }}>
            Feedback from students who completed your courses
          </Typography>
        </Box>
        <ReviewsTab />
      </Container>
    </Box>
  );
};

export default ReviewsPage;
