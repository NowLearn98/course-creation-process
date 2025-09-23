import { PublishedCourse } from '@/types/published';
import { publishCourse } from './publishedStorage';

export const createSamplePublishedCourses = () => {
  const sampleCourses = [
    {
      title: "React Development Masterclass",
      subtitle: "Build modern web applications with React and TypeScript",
      description: "Learn React from scratch and build production-ready applications. This comprehensive course covers hooks, context, state management, and testing.",
      objectives: "Master React fundamentals, understand component lifecycle, implement state management with Context API and Redux, write comprehensive tests for React components",
      requirements: "Basic JavaScript knowledge, familiarity with HTML/CSS, Node.js installed",
      level: "Intermediate",
      language: "English",
      category: "Technology",
      subcategory: "Web Development",
      durationHours: "25",
      durationMinutes: "30",
      modules: [
        {
          title: "React Fundamentals",
          subsections: [
            { title: "Introduction to React", description: "Understanding React and its ecosystem", type: "lecture" as const, timeMinutes: "45" },
            { title: "Components and JSX", description: "Creating your first React components", type: "lecture" as const, timeMinutes: "60" },
            { title: "Props and State", description: "Managing component data", type: "lecture" as const, timeMinutes: "50" }
          ]
        },
        {
          title: "Advanced React Patterns",
          subsections: [
            { title: "Context API", description: "Global state management", type: "lecture" as const, timeMinutes: "40" },
            { title: "Custom Hooks", description: "Reusable stateful logic", type: "lecture" as const, timeMinutes: "35" }
          ]
        }
      ],
      format: "online",
      sessionTypes: ["self-paced"],
      classroomSessions: [],
      oneOnOneSessions: [],
      images: [],
      videos: []
    },
    {
      title: "Digital Marketing Fundamentals",
      subtitle: "Master the basics of digital marketing and grow your business",
      description: "A comprehensive introduction to digital marketing covering SEO, social media, email marketing, and analytics.",
      objectives: "Understand SEO principles, create effective social media campaigns, design email marketing funnels, analyze marketing performance",
      requirements: "No prior marketing experience needed, basic computer skills",
      level: "Beginner",
      language: "English",
      category: "Marketing",
      subcategory: "Digital Marketing",
      durationHours: "15",
      durationMinutes: "0",
      modules: [
        {
          title: "SEO Essentials",
          subsections: [
            { title: "Keyword Research", description: "Finding the right keywords for your business", type: "lecture" as const, timeMinutes: "40" },
            { title: "On-Page Optimization", description: "Optimizing your website content", type: "assignment" as const, timeMinutes: "60" }
          ]
        },
        {
          title: "Social Media Marketing",
          subsections: [
            { title: "Platform Strategy", description: "Choosing the right social platforms", type: "lecture" as const, timeMinutes: "35" },
            { title: "Content Creation", description: "Creating engaging social content", type: "assignment" as const, timeMinutes: "45" }
          ]
        }
      ],
      format: "hybrid",
      sessionTypes: ["self-paced", "classroom"],
      classroomSessions: [
        {
          startDate: "2024-12-01",
          endDate: "2024-12-15",
          startTime: "10:00",
          endTime: "12:00",
          recurring: true
        }
      ],
      oneOnOneSessions: [],
      images: [],
      videos: []
    }
  ];

  // Only create sample courses if none exist
  const existingCourses = JSON.parse(localStorage.getItem('published_courses') || '[]');
  if (existingCourses.length === 0) {
    sampleCourses.forEach(course => {
      publishCourse(course);
    });
  }
};