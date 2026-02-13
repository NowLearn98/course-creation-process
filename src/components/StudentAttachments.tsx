import React, { useState, useEffect } from "react";
import { Paperclip, FileText, Image, File, Download } from "lucide-react";

interface CourseAttachment {
  id: string;
  courseId: string;
  name: string;
  size: number;
  type: string;
  dataUrl: string;
  timestamp: string;
}

const ATTACHMENTS_KEY = "course_attachments";

const getAttachments = (courseId: string): CourseAttachment[] => {
  try {
    const all = JSON.parse(localStorage.getItem(ATTACHMENTS_KEY) || "[]");
    return all.filter((a: CourseAttachment) => a.courseId === courseId);
  } catch {
    return [];
  }
};

const formatFileSize = (bytes: number): string => {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

const getFileIcon = (type: string) => {
  if (type.startsWith("image/")) return <Image className="w-3.5 h-3.5" />;
  if (type.includes("pdf") || type.includes("document") || type.includes("text"))
    return <FileText className="w-3.5 h-3.5" />;
  return <File className="w-3.5 h-3.5" />;
};

interface StudentAttachmentsProps {
  courseId: string;
}

const StudentAttachments: React.FC<StudentAttachmentsProps> = ({ courseId }) => {
  const [attachments, setAttachments] = useState<CourseAttachment[]>([]);

  const loadAttachments = () => setAttachments(getAttachments(courseId));

  useEffect(() => {
    loadAttachments();
  }, [courseId]);

  useEffect(() => {
    const handleFocus = () => loadAttachments();
    window.addEventListener("focus", handleFocus);
    return () => window.removeEventListener("focus", handleFocus);
  }, [courseId]);

  const handleDownload = (attachment: CourseAttachment) => {
    const link = document.createElement("a");
    link.href = attachment.dataUrl;
    link.download = attachment.name;
    link.click();
  };

  return (
    <div className="flex flex-col h-full rounded-lg border bg-muted/10 overflow-hidden">
      <div className="flex items-center gap-2 px-3 py-2 border-b bg-muted/30 shrink-0">
        <Paperclip className="w-3.5 h-3.5 text-primary" />
        <h4 className="text-xs font-semibold text-foreground">Attachments</h4>
        <span className="text-xs text-muted-foreground ml-auto">
          {attachments.length > 0 && `${attachments.length}`}
        </span>
      </div>

      <div className="flex-1 min-h-0 max-h-[180px] overflow-y-auto p-2 space-y-1.5">
        {attachments.length === 0 ? (
          <p className="text-xs text-muted-foreground text-center py-6">
            No attachments yet.
          </p>
        ) : (
          attachments.map((a) => (
            <div
              key={a.id}
              className="group/file flex items-center gap-2 rounded-md bg-card border p-1.5 hover:bg-accent/5 transition-colors cursor-pointer"
              onClick={() => handleDownload(a)}
            >
              <div className="p-1 bg-primary/10 rounded text-primary shrink-0">
                {getFileIcon(a.type)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-foreground truncate">
                  {a.name}
                </p>
                <p className="text-[10px] text-muted-foreground">
                  {formatFileSize(a.size)}
                </p>
              </div>
              <Download className="w-3 h-3 text-muted-foreground opacity-0 group-hover/file:opacity-100 transition-opacity shrink-0" />
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default StudentAttachments;
