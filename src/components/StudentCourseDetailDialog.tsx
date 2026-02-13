import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Typography,
  Box,
  Chip,
  Divider,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from "@mui/material";
import { X, ChevronDown, BookOpen, Clock, Calendar, Users, Globe, Target, AlertCircle } from "lucide-react";
import { PublishedCourse } from "@/types/published";

interface StudentCourseDetailDialogProps {
  course: PublishedCourse | null;
  open: boolean;
  onClose: () => void;
  type: "classroom" | "one-on-one" | "self-paced";
}

const StudentCourseDetailDialog: React.FC<StudentCourseDetailDialogProps> = ({
  course,
  open,
  onClose,
  type,
}) => {
  if (!course) return null;

  const sessions =
    type === "classroom" ? course.classroomSessions : course.oneOnOneSessions;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth scroll="paper">
      <DialogTitle sx={{ pr: 6, pb: 1 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1, flexWrap: "wrap" }}>
          <Typography variant="h5" fontWeight={700} component="span">
            {course.title}
          </Typography>
          <Chip label={course.level} size="small" color="primary" variant="outlined" />
        </Box>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
          {course.subtitle}
        </Typography>
        <IconButton
          onClick={onClose}
          sx={{ position: "absolute", right: 8, top: 8 }}
        >
          <X className="w-5 h-5" />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers>
        {/* General Details */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle1" fontWeight={700} sx={{ mb: 1.5 }}>
            About This Course
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2, whiteSpace: "pre-line" }}>
            {course.description}
          </Typography>

          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2, mb: 2 }}>
            <DetailChip icon={<Globe className="w-4 h-4" />} label={course.language} />
            <DetailChip icon={<BookOpen className="w-4 h-4" />} label={`${course.category} / ${course.subcategory}`} />
            <DetailChip icon={<Clock className="w-4 h-4" />} label={`${course.modules.length} modules`} />
          </Box>
        </Box>

        {/* Objectives */}
        {course.objectives && (
          <Box sx={{ mb: 3 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
              <Target className="w-4 h-4 text-green-600" />
              <Typography variant="subtitle1" fontWeight={700}>
                Learning Objectives
              </Typography>
            </Box>
            <Typography variant="body2" color="text.secondary" sx={{ whiteSpace: "pre-line" }}>
              {course.objectives}
            </Typography>
          </Box>
        )}

        {/* Requirements */}
        {course.requirements && (
          <Box sx={{ mb: 3 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
              <AlertCircle className="w-4 h-4 text-orange-500" />
              <Typography variant="subtitle1" fontWeight={700}>
                Requirements
              </Typography>
            </Box>
            <Typography variant="body2" color="text.secondary" sx={{ whiteSpace: "pre-line" }}>
              {course.requirements}
            </Typography>
          </Box>
        )}

        <Divider sx={{ my: 2 }} />

        {/* Schedule */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle1" fontWeight={700} sx={{ mb: 1.5 }}>
            Schedule & Timings
          </Typography>
          {sessions && sessions.length > 0 ? (
            <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
              {sessions.map((session, idx) => (
                <Box
                  key={idx}
                  sx={{
                    p: 2,
                    border: "1px solid",
                    borderColor: "divider",
                    borderRadius: 2,
                    bgcolor: "action.hover",
                  }}
                >
                  <Typography variant="body2" fontWeight={600} sx={{ mb: 1 }}>
                    Session {idx + 1}
                  </Typography>
                  <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                      <Calendar className="w-3.5 h-3.5 text-gray-500" />
                      <Typography variant="caption" color="text.secondary">
                        {session.startDate} – {session.endDate}
                      </Typography>
                    </Box>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                      <Clock className="w-3.5 h-3.5 text-gray-500" />
                      <Typography variant="caption" color="text.secondary">
                        {session.startTime} – {session.endTime}
                      </Typography>
                    </Box>
                    {type === "classroom" && "seatCapacity" in session && (
                      <>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                          <Users className="w-3.5 h-3.5 text-gray-500" />
                          <Typography variant="caption" color="text.secondary">
                            {(session as any).seatCapacity} seats
                          </Typography>
                        </Box>
                        {"timezone" in session && (
                          <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                            <Globe className="w-3.5 h-3.5 text-gray-500" />
                            <Typography variant="caption" color="text.secondary">
                              {(session as any).timezone}
                            </Typography>
                          </Box>
                        )}
                      </>
                    )}
                    {type === "one-on-one" && "intervalMinutes" in session && (
                      <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                        <Clock className="w-3.5 h-3.5 text-gray-500" />
                        <Typography variant="caption" color="text.secondary">
                          {(session as any).intervalMinutes} min intervals
                        </Typography>
                      </Box>
                    )}
                    {type === "one-on-one" && "daysOfWeek" in session && (session as any).daysOfWeek?.length > 0 && (
                      <Typography variant="caption" color="text.secondary">
                        Days: {(session as any).daysOfWeek.join(", ")}
                      </Typography>
                    )}
                  </Box>
                </Box>
              ))}
            </Box>
          ) : (
            <Typography variant="body2" color="text.secondary">
              No sessions scheduled yet.
            </Typography>
          )}
        </Box>

        <Divider sx={{ my: 2 }} />

        {/* Course Outline */}
        <Box>
          <Typography variant="subtitle1" fontWeight={700} sx={{ mb: 1.5 }}>
            Course Outline
          </Typography>
          {course.modules.length > 0 ? (
            course.modules.map((mod, idx) => (
              <Accordion key={idx} disableGutters sx={{ boxShadow: "none", "&:before": { display: "none" } }}>
                <AccordionSummary expandIcon={<ChevronDown className="w-4 h-4" />}>
                  <Typography variant="body2" fontWeight={600}>
                    Module {idx + 1}: {mod.title}
                  </Typography>
                </AccordionSummary>
                <AccordionDetails sx={{ pt: 0 }}>
                  {mod.subsections.length > 0 ? (
                    <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                      {mod.subsections.map((sub, sIdx) => (
                        <Box
                          key={sIdx}
                          sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            p: 1,
                            borderRadius: 1,
                            bgcolor: "action.hover",
                          }}
                        >
                          <Box>
                            <Typography variant="body2">{sub.title}</Typography>
                            {sub.description && (
                              <Typography variant="caption" color="text.secondary">
                                {sub.description}
                              </Typography>
                            )}
                          </Box>
                          <Box sx={{ display: "flex", alignItems: "center", gap: 1, shrink: 0 }}>
                            <Chip label={sub.type} size="small" variant="outlined" sx={{ fontSize: "0.65rem" }} />
                            {sub.timeMinutes && (
                              <Typography variant="caption" color="text.secondary">
                                {sub.timeMinutes} min
                              </Typography>
                            )}
                          </Box>
                        </Box>
                      ))}
                    </Box>
                  ) : (
                    <Typography variant="caption" color="text.secondary">
                      No subsections added yet.
                    </Typography>
                  )}
                </AccordionDetails>
              </Accordion>
            ))
          ) : (
            <Typography variant="body2" color="text.secondary">
              No modules added yet.
            </Typography>
          )}
        </Box>
      </DialogContent>
    </Dialog>
  );
};

const DetailChip: React.FC<{ icon: React.ReactNode; label: string }> = ({ icon, label }) => (
  <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, color: "text.secondary" }}>
    {icon}
    <Typography variant="caption">{label}</Typography>
  </Box>
);

export default StudentCourseDetailDialog;
