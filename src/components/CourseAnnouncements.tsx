import React, { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Send, Megaphone, Trash2 } from "lucide-react";

export interface Announcement {
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

const saveAnnouncement = (announcement: Announcement) => {
  const all = JSON.parse(localStorage.getItem(ANNOUNCEMENTS_KEY) || "[]");
  all.push(announcement);
  localStorage.setItem(ANNOUNCEMENTS_KEY, JSON.stringify(all));
};

const deleteAnnouncement = (id: string) => {
  const all = JSON.parse(localStorage.getItem(ANNOUNCEMENTS_KEY) || "[]");
  localStorage.setItem(
    ANNOUNCEMENTS_KEY,
    JSON.stringify(all.filter((a: Announcement) => a.id !== id))
  );
};

interface CourseAnnouncementsProps {
  courseId: string;
}

const CourseAnnouncements: React.FC<CourseAnnouncementsProps> = ({ courseId }) => {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setAnnouncements(getAnnouncements(courseId));
  }, [courseId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [announcements]);

  const handleSend = () => {
    const trimmed = newMessage.trim();
    if (!trimmed) return;

    const announcement: Announcement = {
      id: Math.random().toString(36).substr(2, 9),
      courseId,
      message: trimmed,
      timestamp: new Date().toISOString(),
    };

    saveAnnouncement(announcement);
    setAnnouncements(getAnnouncements(courseId));
    setNewMessage("");
  };

  const handleDelete = (id: string) => {
    deleteAnnouncement(id);
    setAnnouncements(getAnnouncements(courseId));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex flex-col h-full rounded-lg border bg-muted/10 overflow-hidden">
      {/* Header */}
      <div className="flex items-center gap-2 px-3 py-2 border-b bg-muted/30 shrink-0">
        <Megaphone className="w-3.5 h-3.5 text-primary" />
        <h4 className="text-xs font-semibold text-foreground">Announcements</h4>
        <span className="text-xs text-muted-foreground ml-auto">
          {announcements.length > 0 && `${announcements.length}`}
        </span>
      </div>

      {/* Scrollable messages area - fixed height */}
      <div className="flex-1 min-h-0 max-h-[180px] overflow-y-auto p-2 space-y-2">
        {announcements.length === 0 ? (
          <p className="text-xs text-muted-foreground text-center py-6">
            No announcements yet.
          </p>
        ) : (
          announcements.map((a) => (
            <div
              key={a.id}
              className="group/msg rounded-md bg-card border p-2 space-y-0.5"
            >
              <div className="flex items-start justify-between gap-1">
                <p className="text-xs text-foreground whitespace-pre-wrap break-words flex-1 leading-relaxed">
                  {a.message}
                </p>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-5 w-5 p-0 opacity-0 group-hover/msg:opacity-100 transition-opacity text-muted-foreground hover:text-destructive shrink-0"
                  onClick={() => handleDelete(a.id)}
                >
                  <Trash2 className="w-3 h-3" />
                </Button>
              </div>
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

      {/* Input area - always at the bottom */}
      <div className="flex gap-1.5 p-2 border-t bg-muted/20 shrink-0">
        <Textarea
          placeholder="Write an announcement..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          className="min-h-[36px] max-h-[60px] resize-none text-xs py-2"
        />
        <Button
          size="sm"
          onClick={handleSend}
          disabled={!newMessage.trim()}
          className="self-end h-8 w-8 p-0 shrink-0"
        >
          <Send className="w-3.5 h-3.5" />
        </Button>
      </div>
    </div>
  );
};

export default CourseAnnouncements;
