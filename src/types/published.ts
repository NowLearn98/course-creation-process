export interface Student {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  enrolledDate: string;
  progress: number;
  lastActive: string;
}

export interface MetricData {
  date: string;
  clicks: number;
  bookings: number;
}

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
  clicks: number;
  status: 'active' | 'paused' | 'archived';
  students?: Student[];
  metricsHistory?: MetricData[];
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
  endDate: string;
  startTime: string;
  endTime: string;
  timezone: string;
  seatCapacity: number;
  price?: number; // Total price for the entire course
}

export interface OneOnOneSession {
  startDate: string;
  endDate: string;
  daysOfWeek: string[];
  startTime: string;
  endTime: string;
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