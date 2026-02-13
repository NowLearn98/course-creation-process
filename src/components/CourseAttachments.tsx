import React, { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Paperclip, Upload, Trash2, FileText, Image, File, Download } from "lucide-react";

export interface CourseAttachment {
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

const saveAttachment = (attachment: CourseAttachment) => {
  const all = JSON.parse(localStorage.getItem(ATTACHMENTS_KEY) || "[]");
  all.push(attachment);
  localStorage.setItem(ATTACHMENTS_KEY, JSON.stringify(all));
};

const removeAttachment = (id: string) => {
  const all = JSON.parse(localStorage.getItem(ATTACHMENTS_KEY) || "[]");
  localStorage.setItem(
    ATTACHMENTS_KEY,
    JSON.stringify(all.filter((a: CourseAttachment) => a.id !== id))
  );
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

interface CourseAttachmentsProps {
  courseId: string;
}

const CourseAttachments: React.FC<CourseAttachmentsProps> = ({ courseId }) => {
  const [attachments, setAttachments] = useState<CourseAttachment[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setAttachments(getAttachments(courseId));
  }, [courseId]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    Array.from(files).forEach((file) => {
      // Limit to 5MB per file for localStorage
      if (file.size > 5 * 1024 * 1024) {
        alert(`File "${file.name}" is too large. Max 5MB per file.`);
        return;
      }

      const reader = new FileReader();
      reader.onload = () => {
        const attachment: CourseAttachment = {
          id: Math.random().toString(36).substr(2, 9),
          courseId,
          name: file.name,
          size: file.size,
          type: file.type,
          dataUrl: reader.result as string,
          timestamp: new Date().toISOString(),
        };
        saveAttachment(attachment);
        setAttachments(getAttachments(courseId));
      };
      reader.readAsDataURL(file);
    });

    // Reset input
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleDelete = (id: string) => {
    removeAttachment(id);
    setAttachments(getAttachments(courseId));
  };

  const handleDownload = (attachment: CourseAttachment) => {
    const link = document.createElement("a");
    link.href = attachment.dataUrl;
    link.download = attachment.name;
    link.click();
  };

  return (
    <div className="flex flex-col h-full rounded-lg border bg-muted/10 overflow-hidden">
      {/* Header */}
      <div className="flex items-center gap-2 px-3 py-2 border-b bg-muted/30 shrink-0">
        <Paperclip className="w-3.5 h-3.5 text-primary" />
        <h4 className="text-xs font-semibold text-foreground">Attachments</h4>
        <span className="text-xs text-muted-foreground ml-auto">
          {attachments.length > 0 && `${attachments.length}`}
        </span>
      </div>

      {/* File list */}
      <div className="flex-1 min-h-0 max-h-[150px] overflow-y-auto p-2 space-y-1.5">
        {attachments.length === 0 ? (
          <p className="text-xs text-muted-foreground text-center py-4">
            No attachments yet.
          </p>
        ) : (
          attachments.map((a) => (
            <div
              key={a.id}
              className="group/file flex items-center gap-2 rounded-md bg-card border p-1.5 hover:bg-accent/5 transition-colors"
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
              <div className="flex items-center gap-0.5 shrink-0 opacity-0 group-hover/file:opacity-100 transition-opacity">
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-5 w-5 p-0 text-muted-foreground hover:text-primary"
                  onClick={() => handleDownload(a)}
                >
                  <Download className="w-3 h-3" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-5 w-5 p-0 text-muted-foreground hover:text-destructive"
                  onClick={() => handleDelete(a.id)}
                >
                  <Trash2 className="w-3 h-3" />
                </Button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Upload button */}
      <div className="p-2 border-t bg-muted/20 shrink-0">
        <input
          ref={fileInputRef}
          type="file"
          multiple
          className="hidden"
          onChange={handleFileSelect}
          accept=".pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx,.txt,.csv,.jpg,.jpeg,.png,.gif,.zip,.rar"
        />
        <Button
          variant="outline"
          size="sm"
          className="w-full h-7 text-xs gap-1.5"
          onClick={() => fileInputRef.current?.click()}
        >
          <Upload className="w-3 h-3" />
          Add Files
        </Button>
      </div>
    </div>
  );
};

export default CourseAttachments;
