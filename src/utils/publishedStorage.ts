import { PublishedCourse } from '@/types/published';

const PUBLISHED_STORAGE_KEY = 'published_courses';

export const publishCourse = (course: Omit<PublishedCourse, 'id' | 'publishedAt' | 'enrollments' | 'rating' | 'reviews' | 'price' | 'status'>): PublishedCourse => {
  const courses = getPublishedCourses();
  const now = new Date().toISOString();
  
  const publishedCourse: PublishedCourse = {
    ...course,
    id: Math.random().toString(36).substr(2, 9),
    publishedAt: now,
    enrollments: 0,
    rating: 0,
    reviews: 0,
    price: 99, // Default price
    status: 'active',
  };

  courses.push(publishedCourse);
  localStorage.setItem(PUBLISHED_STORAGE_KEY, JSON.stringify(courses));
  return publishedCourse;
};

export const updatePublishedCourse = (id: string, course: Partial<PublishedCourse>): PublishedCourse | null => {
  const courses = getPublishedCourses();
  const index = courses.findIndex(c => c.id === id);
  
  if (index === -1) return null;

  const updatedCourse: PublishedCourse = {
    ...courses[index],
    ...course,
  };

  courses[index] = updatedCourse;
  localStorage.setItem(PUBLISHED_STORAGE_KEY, JSON.stringify(courses));
  return updatedCourse;
};

export const getPublishedCourses = (): PublishedCourse[] => {
  try {
    const courses = localStorage.getItem(PUBLISHED_STORAGE_KEY);
    return courses ? JSON.parse(courses) : [];
  } catch (error) {
    console.error('Error loading published courses:', error);
    return [];
  }
};

export const getPublishedCourse = (id: string): PublishedCourse | null => {
  const courses = getPublishedCourses();
  return courses.find(c => c.id === id) || null;
};

export const deletePublishedCourse = (id: string): boolean => {
  const courses = getPublishedCourses();
  const filteredCourses = courses.filter(c => c.id !== id);
  
  if (filteredCourses.length === courses.length) return false;
  
  localStorage.setItem(PUBLISHED_STORAGE_KEY, JSON.stringify(filteredCourses));
  return true;
};

export const clearAllPublishedCourses = (): void => {
  localStorage.removeItem(PUBLISHED_STORAGE_KEY);
};