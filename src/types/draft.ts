export interface DraftCourse {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  objectives: string;
  requirements: string;
  level: string;
  language: string;
  category: string;
  subcategory: string;
  durationHours: string;
  durationMinutes: string;
  modules: Module[];
  format: string;
  sessionTypes: string[];
  classroomSessions: ClassroomSession[];
  oneOnOneSessions: OneOnOneSession[];
  images: ProcessedImage[];
  videos: File[];
  createdAt: string;
  updatedAt: string;
}

export interface Module {
  title: string;
  subsections: SubSection[];
}

export interface SubSection {
  title: string;
  description: string;
  type: 'lecture' | 'quiz' | 'assignment' | 'lab';
  timeMinutes: string;
}

export interface ClassroomSession {
  startDate: string;
  startTime: string;
  endTime: string;
  daysOfWeek: string[];
  recurring: boolean;
  price?: number; // Total price for the entire course
}

export interface OneOnOneSession {
  startDate: string;
  daysOfWeek: string[];
  startTime: string;
  endTime: string;
  recurring: boolean;
  pricePerInterval?: number; // Price per time interval
  intervalMinutes?: number; // 30, 60, 90, 120 minutes etc.
}

export interface ProcessedImage {
  id: string;
  file: File;
  preview: string;
  croppedPreview?: string;
  crop?: any;
}