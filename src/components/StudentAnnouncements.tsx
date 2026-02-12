import React, { useState, useEffect, useRef } from "react";
import { Megaphone } from "lucide-react";

interface Announcement {
  id: string;
  courseId: string;
  message: string;
  timestamp: string;
}

const ANNOUNCEMENTS_KEY = "course_announcements";

const getAnnouncements = (courseId: string): Announcement[] => {
  try {
    const all = JSON.parse(localStorage.getItem(ANNOUNCEMENTS_KEY) || "[]");
    return all.filter((a: Announcement) => a.courseId === courseId);
  } catch {
    return [];
  }
};

interface StudentAnnouncementsProps {
  courseId: string;
}

const StudentAnnouncements: React.FC<StudentAnnouncementsProps> = ({ courseId }) => {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const bottomRef = useRef<HTMLDivElement>(null);

  const loadAnnouncements = () => setAnnouncements(getAnnouncements(courseId));

  useEffect(() => {
    loadAnnouncements();
  }, [courseId]);

  // Re-read on window focus (same-tab SPA navigation)
  useEffect(() => {
    const handleFocus = () => loadAnnouncements();
    window.addEventListener("focus", handleFocus);
    return () => window.removeEventListener("focus", handleFocus);
  }, [courseId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [announcements]);

  return (
    <div className="flex flex-col h-full rounded-lg border bg-muted/10 overflow-hidden">
      <div className="flex items-center gap-2 px-3 py-2 border-b bg-muted/30 shrink-0">
        <Megaphone className="w-3.5 h-3.5 text-primary" />
        <h4 className="text-xs font-semibold text-foreground">Announcements</h4>
        <span className="text-xs text-muted-foreground ml-auto">
          {announcements.length > 0 && `${announcements.length}`}
        </span>
      </div>

      <div className="flex-1 min-h-0 max-h-[180px] overflow-y-auto p-2 space-y-2">
        {announcements.length === 0 ? (
          <p className="text-xs text-muted-foreground text-center py-6">
            No announcements yet.
          </p>
        ) : (
          announcements.map((a) => (
            <div
              key={a.id}
              className="rounded-md bg-card border p-2 space-y-0.5"
            >
              <p className="text-xs text-foreground whitespace-pre-wrap break-words leading-relaxed">
                {a.message}
              </p>
              <span className="text-[10px] text-muted-foreground">
                {new Date(a.timestamp).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  hour: "numeric",
                  minute: "2-digit",
                })}
              </span>
            </div>
          ))
        )}
        <div ref={bottomRef} />
      </div>
    </div>
  );
};

export default StudentAnnouncements;
