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
import { X, ChevronDown, BookOpen, Clock, Calendar, Users, Globe, Target, AlertCircle, Layers, GraduationCap } from "lucide-react";
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
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      scroll="paper"
      PaperProps={{
        sx: {
          borderRadius: 3,
          overflow: "hidden",
        },
      }}
    >
      {/* Hero Header */}
      <Box
        sx={{
          background: "linear-gradient(135deg, hsl(220, 100%, 50%) 0%, hsl(220, 80%, 35%) 100%)",
          px: { xs: 3, md: 4 },
          pt: { xs: 3, md: 4 },
          pb: { xs: 4, md: 5 },
          position: "relative",
        }}
      >
        <IconButton
          onClick={onClose}
          sx={{
            position: "absolute",
            right: 12,
            top: 12,
            color: "white",
            bgcolor: "rgba(255,255,255,0.15)",
            "&:hover": { bgcolor: "rgba(255,255,255,0.25)" },
          }}
        >
          <X className="w-5 h-5" />
        </IconButton>

        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 1.5 }}>
          <Box
            sx={{
              width: 40,
              height: 40,
              borderRadius: 2,
              bgcolor: "rgba(255,255,255,0.2)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <GraduationCap className="w-5 h-5 text-white" />
          </Box>
          <Chip
            label={course.level}
            size="small"
            sx={{
              bgcolor: "rgba(255,255,255,0.2)",
              color: "white",
              fontWeight: 600,
              fontSize: "0.75rem",
            }}
          />
          <Chip
            label={type === "classroom" ? "Classroom" : type === "one-on-one" ? "1-on-1" : "Self-paced"}
            size="small"
            sx={{
              bgcolor: "rgba(255,255,255,0.15)",
              color: "white",
              fontWeight: 500,
              fontSize: "0.7rem",
            }}
          />
        </Box>

        <Typography
          variant="h4"
          sx={{
            fontWeight: 800,
            color: "white",
            fontSize: { xs: "1.5rem", md: "1.85rem" },
            lineHeight: 1.2,
            mb: 1,
          }}
        >
          {course.title}
        </Typography>
        <Typography
          variant="body1"
          sx={{
            color: "rgba(255,255,255,0.8)",
            fontSize: { xs: "0.9rem", md: "1rem" },
          }}
        >
          {course.subtitle}
        </Typography>

        {/* Quick stats */}
        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            gap: 2.5,
            mt: 2.5,
          }}
        >
          <QuickStat icon={<Globe className="w-4 h-4" />} label={course.language} />
          <QuickStat icon={<BookOpen className="w-4 h-4" />} label={`${course.category}`} />
          <QuickStat icon={<Layers className="w-4 h-4" />} label={`${course.modules.length} modules`} />
        </Box>
      </Box>

      <DialogContent sx={{ px: { xs: 3, md: 4 }, py: 3 }}>
        {/* About */}
        <SectionHeader icon={<BookOpen className="w-4.5 h-4.5" />} title="About This Course" color="hsl(220, 100%, 50%)" />
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3, whiteSpace: "pre-line", lineHeight: 1.7 }}>
          {course.description}
        </Typography>

        {/* Objectives */}
        {course.objectives && (
          <>
            <SectionHeader icon={<Target className="w-4.5 h-4.5" />} title="Learning Objectives" color="hsl(142, 70%, 40%)" />
            <Box
              sx={{
                p: 2.5,
                borderRadius: 2,
                bgcolor: "hsl(142, 70%, 97%)",
                border: "1px solid hsl(142, 50%, 88%)",
                mb: 3,
              }}
            >
              <Typography variant="body2" color="text.secondary" sx={{ whiteSpace: "pre-line", lineHeight: 1.7 }}>
                {course.objectives}
              </Typography>
            </Box>
          </>
        )}

        {/* Requirements */}
        {course.requirements && (
          <>
            <SectionHeader icon={<AlertCircle className="w-4.5 h-4.5" />} title="Requirements" color="hsl(30, 90%, 50%)" />
            <Box
              sx={{
                p: 2.5,
                borderRadius: 2,
                bgcolor: "hsl(30, 90%, 97%)",
                border: "1px solid hsl(30, 70%, 88%)",
                mb: 3,
              }}
            >
              <Typography variant="body2" color="text.secondary" sx={{ whiteSpace: "pre-line", lineHeight: 1.7 }}>
                {course.requirements}
              </Typography>
            </Box>
          </>
        )}

        <Divider sx={{ my: 3 }} />

        {/* Schedule */}
        <SectionHeader icon={<Calendar className="w-4.5 h-4.5" />} title="Schedule & Timings" color="hsl(260, 70%, 55%)" />
        {sessions && sessions.length > 0 ? (
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mb: 3 }}>
            {sessions.map((session, idx) => (
              <Box
                key={idx}
                sx={{
                  p: 2.5,
                  border: "1px solid",
                  borderColor: "divider",
                  borderRadius: 2.5,
                  bgcolor: "background.paper",
                  transition: "all 0.2s",
                  "&:hover": {
                    borderColor: "primary.main",
                    boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
                  },
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1.5 }}>
                  <Box
                    sx={{
                      width: 28,
                      height: 28,
                      borderRadius: "50%",
                      bgcolor: "primary.main",
                      color: "white",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "0.75rem",
                      fontWeight: 700,
                    }}
                  >
                    {idx + 1}
                  </Box>
                  <Typography variant="body2" fontWeight={700}>
                    Session {idx + 1}
                  </Typography>
                </Box>
                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2, pl: 0.5 }}>
                  <InfoPill icon={<Calendar className="w-3.5 h-3.5" />} label={`${session.startDate} – ${session.endDate}`} />
                  <InfoPill icon={<Clock className="w-3.5 h-3.5" />} label={`${session.startTime} – ${session.endTime}`} />
                  {type === "classroom" && "seatCapacity" in session && (
                    <>
                      <InfoPill icon={<Users className="w-3.5 h-3.5" />} label={`${(session as any).seatCapacity} seats`} />
                      {"timezone" in session && (
                        <InfoPill icon={<Globe className="w-3.5 h-3.5" />} label={(session as any).timezone} />
                      )}
                    </>
                  )}
                  {type === "one-on-one" && "intervalMinutes" in session && (
                    <InfoPill icon={<Clock className="w-3.5 h-3.5" />} label={`${(session as any).intervalMinutes} min intervals`} />
                  )}
                  {type === "one-on-one" && "daysOfWeek" in session && (session as any).daysOfWeek?.length > 0 && (
                    <InfoPill icon={<Calendar className="w-3.5 h-3.5" />} label={`Days: ${(session as any).daysOfWeek.join(", ")}`} />
                  )}
                </Box>
              </Box>
            ))}
          </Box>
        ) : (
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            No sessions scheduled yet.
          </Typography>
        )}

        <Divider sx={{ my: 3 }} />

        {/* Course Outline */}
        <SectionHeader icon={<Layers className="w-4.5 h-4.5" />} title="Course Outline" color="hsl(220, 100%, 50%)" />
        {course.modules.length > 0 ? (
          <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
            {course.modules.map((mod, idx) => (
              <Accordion
                key={idx}
                disableGutters
                sx={{
                  boxShadow: "none",
                  border: "1px solid",
                  borderColor: "divider",
                  borderRadius: "12px !important",
                  "&:before": { display: "none" },
                  overflow: "hidden",
                  "&.Mui-expanded": {
                    borderColor: "primary.main",
                  },
                }}
              >
                <AccordionSummary
                  expandIcon={<ChevronDown className="w-4 h-4" />}
                  sx={{
                    px: 2.5,
                    "&.Mui-expanded": {
                      bgcolor: "action.hover",
                    },
                  }}
                >
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                    <Box
                      sx={{
                        width: 24,
                        height: 24,
                        borderRadius: 1,
                        bgcolor: "primary.main",
                        color: "white",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "0.7rem",
                        fontWeight: 700,
                        flexShrink: 0,
                      }}
                    >
                      {idx + 1}
                    </Box>
                    <Typography variant="body2" fontWeight={600}>
                      {mod.title}
                    </Typography>
                  </Box>
                </AccordionSummary>
                <AccordionDetails sx={{ px: 2.5, pt: 0, pb: 2 }}>
                  {mod.subsections.length > 0 ? (
                    <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                      {mod.subsections.map((sub, sIdx) => (
                        <Box
                          key={sIdx}
                          sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            p: 1.5,
                            borderRadius: 1.5,
                            bgcolor: "action.hover",
                            transition: "background 0.15s",
                            "&:hover": { bgcolor: "action.selected" },
                          }}
                        >
                          <Box sx={{ display: "flex", alignItems: "flex-start", gap: 1 }}>
                            <Box
                              sx={{
                                width: 6,
                                height: 6,
                                borderRadius: "50%",
                                bgcolor: "primary.main",
                                mt: 0.8,
                                flexShrink: 0,
                              }}
                            />
                            <Box>
                              <Typography variant="body2" fontWeight={500}>{sub.title}</Typography>
                              {sub.description && (
                                <Typography variant="caption" color="text.secondary">
                                  {sub.description}
                                </Typography>
                              )}
                            </Box>
                          </Box>
                          <Box sx={{ display: "flex", alignItems: "center", gap: 1, flexShrink: 0, ml: 1 }}>
                            <Chip
                              label={sub.type}
                              size="small"
                              variant="outlined"
                              sx={{ fontSize: "0.65rem", borderRadius: 1 }}
                            />
                            {sub.timeMinutes && (
                              <Chip
                                icon={<Clock className="w-3 h-3" />}
                                label={`${sub.timeMinutes}m`}
                                size="small"
                                sx={{ fontSize: "0.65rem", bgcolor: "action.hover", borderRadius: 1 }}
                              />
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
            ))}
          </Box>
        ) : (
          <Typography variant="body2" color="text.secondary">
            No modules added yet.
          </Typography>
        )}
      </DialogContent>
    </Dialog>
  );
};

/* --- Sub-components --- */

const SectionHeader: React.FC<{ icon: React.ReactNode; title: string; color: string }> = ({ icon, title, color }) => (
  <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 2 }}>
    <Box
      sx={{
        width: 32,
        height: 32,
        borderRadius: 1.5,
        bgcolor: `${color}15`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: color,
      }}
    >
      {icon}
    </Box>
    <Typography variant="subtitle1" fontWeight={700}>
      {title}
    </Typography>
  </Box>
);

const InfoPill: React.FC<{ icon: React.ReactNode; label: string }> = ({ icon, label }) => (
  <Box
    sx={{
      display: "flex",
      alignItems: "center",
      gap: 0.75,
      px: 1.5,
      py: 0.5,
      borderRadius: 2,
      bgcolor: "action.hover",
      color: "text.secondary",
    }}
  >
    {icon}
    <Typography variant="caption" fontWeight={500}>{label}</Typography>
  </Box>
);

const QuickStat: React.FC<{ icon: React.ReactNode; label: string }> = ({ icon, label }) => (
  <Box sx={{ display: "flex", alignItems: "center", gap: 0.75, color: "rgba(255,255,255,0.85)" }}>
    {icon}
    <Typography variant="caption" fontWeight={500}>{label}</Typography>
  </Box>
);

export default StudentCourseDetailDialog;
