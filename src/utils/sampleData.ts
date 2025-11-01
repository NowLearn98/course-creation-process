import { PublishedCourse, Student, MetricData } from '@/types/published';
import { publishCourse } from './publishedStorage';

const generateStudents = (count: number): Student[] => {
  const firstNames = ['Sarah', 'Mike', 'Emma', 'James', 'Lisa', 'David', 'Sofia', 'Chris', 'Anna', 'Ryan'];
  const lastNames = ['Johnson', 'Chen', 'Williams', 'Brown', 'Garcia', 'Miller', 'Rodriguez', 'Lee', 'Taylor', 'Martinez'];
  return Array.from({ length: count }, (_, i) => {
    const firstName = firstNames[i % firstNames.length];
    const lastName = lastNames[i % lastNames.length];
    return {
      id: `student-${i + 1}`,
      firstName,
      lastName,
      email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@example.com`,
      enrolledDate: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
      progress: Math.floor(Math.random() * 100),
      lastActive: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString()
    };
  });
};

const generateMetricsHistory = (days: number = 30): MetricData[] => {
  return Array.from({ length: days }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (days - i - 1));
    return {
      date: date.toISOString().split('T')[0],
      clicks: Math.floor(Math.random() * 100) + 20,
      bookings: Math.floor(Math.random() * 30) + 5
    };
  });
};

export const createSamplePublishedCourses = () => {
  // Clear existing courses to ensure fresh data with correct structure
  localStorage.removeItem('published_courses');
  
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
          timezone: "America/New_York",
          seatCapacity: 25
        }
      ],
      oneOnOneSessions: [],
      images: [],
      videos: []
    },
    {
      title: "Personal Fitness Coaching",
      subtitle: "One-on-one personalized fitness training and nutrition guidance",
      description: "Get personalized fitness coaching tailored to your goals. Work directly with a certified trainer who will create a custom workout plan and provide ongoing support.",
      objectives: "Achieve your fitness goals, learn proper form and technique, develop sustainable healthy habits, improve overall wellness",
      requirements: "Basic fitness level, commitment to regular sessions, willingness to follow a personalized plan",
      level: "All Levels",
      language: "English",
      category: "Health & Fitness",
      subcategory: "Personal Training",
      durationHours: "12",
      durationMinutes: "0",
      modules: [
        {
          title: "Assessment & Goal Setting",
          subsections: [
            { title: "Initial Fitness Assessment", description: "Evaluate current fitness level", type: "lecture" as const, timeMinutes: "60" },
            { title: "Goal Planning Session", description: "Set realistic fitness goals", type: "lecture" as const, timeMinutes: "30" }
          ]
        },
        {
          title: "Custom Training Program",
          subsections: [
            { title: "Strength Training", description: "Build muscle and strength", type: "lab" as const, timeMinutes: "45" },
            { title: "Cardio & Endurance", description: "Improve cardiovascular health", type: "lab" as const, timeMinutes: "45" },
            { title: "Nutrition Guidance", description: "Learn healthy eating habits", type: "lecture" as const, timeMinutes: "30" }
          ]
        }
      ],
      format: "online",
      sessionTypes: ["one-on-one"],
      classroomSessions: [],
      oneOnOneSessions: [
        {
          startDate: "2024-12-01",
          endDate: "2025-03-01",
          daysOfWeek: ["Monday", "Wednesday", "Friday"],
          startTime: "09:00",
          endTime: "17:00",
          pricePerInterval: 75,
          intervalMinutes: 60
        }
      ],
      images: [],
      videos: []
    }
  ];

  // Create sample courses
  sampleCourses.forEach(course => {
    const published = publishCourse(course);
    // Update sample courses with realistic metrics
    const updatedCourses = JSON.parse(localStorage.getItem('published_courses') || '[]');
    const courseIndex = updatedCourses.findIndex((c: any) => c.id === published.id);
    if (courseIndex !== -1) {
      const enrollmentCount = Math.floor(Math.random() * 500) + 100;
      updatedCourses[courseIndex] = {
        ...updatedCourses[courseIndex],
        enrollments: enrollmentCount,
        clicks: Math.floor(Math.random() * 2000) + 500,
        rating: parseFloat((Math.random() * 2 + 3).toFixed(1)),
        reviews: Math.floor(Math.random() * 100) + 20,
        price: course.title.includes('React') ? 149 : 99,
        students: generateStudents(Math.min(enrollmentCount, 10)),
        metricsHistory: generateMetricsHistory(30)
      };
      localStorage.setItem('published_courses', JSON.stringify(updatedCourses));
    }
  });
};