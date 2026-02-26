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
} from "@mui/material";

interface Props {
  open: boolean;
  onClose: () => void;
}

export const InstructorSurveyDialog: React.FC<Props> = ({ open, onClose }) => {
  const [courseRating, setCourseRating] = useState<number | null>(null);
  const [platformRating, setPlatformRating] = useState<number | null>(null);
  const [feedback, setFeedback] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = () => {
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setCourseRating(null);
      setPlatformRating(null);
      setFeedback("");
      onClose();
    }, 1500);
  };

  const handleClose = () => {
    if (!submitted) {
      setCourseRating(null);
      setPlatformRating(null);
      setFeedback("");
    }
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ fontWeight: 700 }}>Instructor Survey</DialogTitle>
      <DialogContent>
        {submitted ? (
          <Alert severity="success" sx={{ mt: 1 }}>Thank you for your feedback!</Alert>
        ) : (
          <Box sx={{ display: "flex", flexDirection: "column", gap: 3, mt: 1 }}>
            <Box>
              <Typography variant="body2" fontWeight={600} sx={{ mb: 0.5 }}>
                Rate your experience creating a course
              </Typography>
              <Rating
                value={courseRating}
                onChange={(_, v) => setCourseRating(v)}
                size="large"
              />
            </Box>
            <Box>
              <Typography variant="body2" fontWeight={600} sx={{ mb: 0.5 }}>
                Rate the platform overall
              </Typography>
              <Rating
                value={platformRating}
                onChange={(_, v) => setPlatformRating(v)}
                size="large"
              />
            </Box>
            <TextField
              label="Additional Feedback"
              multiline
              minRows={3}
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              placeholder="Share your thoughts on the platform..."
              fullWidth
            />
          </Box>
        )}
      </DialogContent>
      {!submitted && (
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={handleClose}>Cancel</Button>
          <Button
            variant="contained"
            onClick={handleSubmit}
            disabled={!courseRating && !platformRating}
          >
            Submit
          </Button>
        </DialogActions>
      )}
    </Dialog>
  );
};
