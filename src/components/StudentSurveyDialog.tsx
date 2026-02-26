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

export const StudentSurveyDialog: React.FC<Props> = ({ open, onClose }) => {
  const [sessionRating, setSessionRating] = useState<number | null>(null);
  const [feedback, setFeedback] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = () => {
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setSessionRating(null);
      setFeedback("");
      onClose();
    }, 1500);
  };

  const handleClose = () => {
    if (!submitted) {
      setSessionRating(null);
      setFeedback("");
    }
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ fontWeight: 700 }}>Student Survey</DialogTitle>
      <DialogContent>
        {submitted ? (
          <Alert severity="success" sx={{ mt: 1 }}>Thank you for your feedback!</Alert>
        ) : (
          <Box sx={{ display: "flex", flexDirection: "column", gap: 3, mt: 1 }}>
            <Box>
              <Typography variant="body2" fontWeight={600} sx={{ mb: 0.5 }}>
                Rate your experience after completing your first session
              </Typography>
              <Rating
                value={sessionRating}
                onChange={(_, v) => setSessionRating(v)}
                size="large"
              />
            </Box>
            <TextField
              label="Additional Feedback"
              multiline
              minRows={3}
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              placeholder="Tell us about your experience..."
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
            disabled={!sessionRating}
          >
            Submit
          </Button>
        </DialogActions>
      )}
    </Dialog>
  );
};
