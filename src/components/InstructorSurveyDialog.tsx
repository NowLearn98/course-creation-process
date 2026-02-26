import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Rating,
  TextField,
  Box,
  Alert,
  IconButton,
} from "@mui/material";
import { X, Sparkles } from "lucide-react";

interface Props {
  open: boolean;
  onClose: () => void;
}

const ratingLabels: Record<number, string> = {
  1: "Poor",
  2: "Fair",
  3: "Good",
  4: "Great",
  5: "Excellent",
};

export const InstructorSurveyDialog: React.FC<Props> = ({ open, onClose }) => {
  const [rating, setRating] = useState<number | null>(null);
  const [hover, setHover] = useState(-1);
  const [feedback, setFeedback] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = () => {
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setRating(null);
      setHover(-1);
      setFeedback("");
      onClose();
    }, 2000);
  };

  const handleClose = () => {
    if (!submitted) {
      setRating(null);
      setHover(-1);
      setFeedback("");
    }
    onClose();
  };

  const activeVal = hover !== -1 ? hover : rating;

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
          overflow: "hidden",
        },
      }}
    >
      {/* Gradient header */}
      <Box
        sx={{
          background: "linear-gradient(135deg, #1976d2 0%, #1565c0 50%, #0d47a1 100%)",
          color: "#fff",
          px: 3,
          py: 2.5,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
          <Sparkles className="w-5 h-5" />
          <Typography variant="h6" fontWeight={700}>
            Instructor Survey
          </Typography>
        </Box>
        <IconButton size="small" onClick={handleClose} sx={{ color: "rgba(255,255,255,0.8)", "&:hover": { color: "#fff" } }}>
          <X className="w-5 h-5" />
        </IconButton>
      </Box>

      <DialogContent sx={{ px: 3, pt: 3, pb: 1 }}>
        {submitted ? (
          <Box sx={{ textAlign: "center", py: 4 }}>
            <Typography variant="h4" sx={{ mb: 1 }}>🎉</Typography>
            <Alert severity="success" sx={{ justifyContent: "center", fontWeight: 600 }}>
              Thank you for your feedback!
            </Alert>
          </Box>
        ) : (
          <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
            <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.6 }}>
              We'd love to hear how your experience has been — from creating your course to using the platform overall.
            </Typography>

            {/* Rating section */}
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 1,
                py: 2,
                px: 2,
                bgcolor: "rgba(25, 118, 210, 0.04)",
                borderRadius: 2,
                border: "1px solid",
                borderColor: "divider",
              }}
            >
              <Typography variant="body2" fontWeight={600}>
                How would you rate your overall experience?
              </Typography>
              <Rating
                value={rating}
                onChange={(_, v) => setRating(v)}
                onChangeActive={(_, v) => setHover(v)}
                size="large"
                sx={{
                  fontSize: "2.5rem",
                  "& .MuiRating-iconFilled": { color: "#f59e0b" },
                  "& .MuiRating-iconHover": { color: "#f59e0b" },
                }}
              />
              <Typography
                variant="body2"
                fontWeight={500}
                sx={{
                  color: activeVal ? "text.primary" : "text.disabled",
                  minHeight: 22,
                }}
              >
                {activeVal ? ratingLabels[activeVal] : "Select a rating"}
              </Typography>
            </Box>

            {/* Feedback */}
            <TextField
              label="Tell us more (optional)"
              multiline
              minRows={3}
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              placeholder="What did you enjoy? What could be improved?"
              fullWidth
              variant="outlined"
            />
          </Box>
        )}
      </DialogContent>

      {!submitted && (
        <DialogActions sx={{ px: 3, pb: 2.5, pt: 1 }}>
          <Button onClick={handleClose} sx={{ color: "text.secondary" }}>
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleSubmit}
            disabled={!rating}
            sx={{
              px: 4,
              borderRadius: 2,
              textTransform: "none",
              fontWeight: 600,
              boxShadow: 2,
            }}
          >
            Submit Feedback
          </Button>
        </DialogActions>
      )}
    </Dialog>
  );
};
