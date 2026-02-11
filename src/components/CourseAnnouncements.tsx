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
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <Megaphone className="w-4 h-4 text-primary" />
        <h4 className="text-sm font-semibold text-foreground">Announcements & Classroom Chat</h4>
      </div>

      <div className="rounded-lg border bg-muted/30 p-3 max-h-[280px] overflow-y-auto space-y-3">
        {announcements.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-4">
            No announcements yet. Post one to notify your students.
          </p>
        ) : (
          announcements.map((a) => (
            <div
              key={a.id}
              className="group/msg rounded-lg bg-card border p-3 space-y-1"
            >
              <div className="flex items-start justify-between gap-2">
                <p className="text-sm text-foreground whitespace-pre-wrap break-words flex-1">
                  {a.message}
                </p>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 w-6 p-0 opacity-0 group-hover/msg:opacity-100 transition-opacity text-muted-foreground hover:text-destructive"
                  onClick={() => handleDelete(a.id)}
                >
                  <Trash2 className="w-3 h-3" />
                </Button>
              </div>
              <span className="text-xs text-muted-foreground">
                {new Date(a.timestamp).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                  hour: "numeric",
                  minute: "2-digit",
                })}
              </span>
            </div>
          ))
        )}
        <div ref={bottomRef} />
      </div>

      <div className="flex gap-2">
        <Textarea
          placeholder="Write an announcement..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          className="min-h-[60px] resize-none text-sm"
        />
        <Button
          size="sm"
          onClick={handleSend}
          disabled={!newMessage.trim()}
          className="self-end gap-1.5"
        >
          <Send className="w-4 h-4" />
          Post
        </Button>
      </div>
    </div>
  );
};

export default CourseAnnouncements;
