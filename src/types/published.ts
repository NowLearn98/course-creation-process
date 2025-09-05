export interface PublishedCourse {
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
  publishedAt: string;
  enrollments: number;
  rating: number;
  reviews: number;
  price: number;
  status: 'active' | 'paused' | 'archived';
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
}

export interface OneOnOneSession {
  startDate: string;
  daysOfWeek: string[];
  startTime: string;
  endTime: string;
  recurring: boolean;
}

export interface ProcessedImage {
  id: string;
  file: File;
  preview: string;
  croppedPreview?: string;
  crop?: any;
}