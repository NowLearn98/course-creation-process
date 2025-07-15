import { DraftCourse } from '@/types/draft';

const DRAFTS_STORAGE_KEY = 'course_drafts';

export const saveDraft = (draft: Omit<DraftCourse, 'id' | 'createdAt' | 'updatedAt'>): DraftCourse => {
  const drafts = getDrafts();
  const now = new Date().toISOString();
  
  const newDraft: DraftCourse = {
    ...draft,
    id: Math.random().toString(36).substr(2, 9),
    createdAt: now,
    updatedAt: now,
  };

  drafts.push(newDraft);
  localStorage.setItem(DRAFTS_STORAGE_KEY, JSON.stringify(drafts));
  return newDraft;
};

export const updateDraft = (id: string, draft: Omit<DraftCourse, 'id' | 'createdAt' | 'updatedAt'>): DraftCourse | null => {
  const drafts = getDrafts();
  const index = drafts.findIndex(d => d.id === id);
  
  if (index === -1) return null;

  const updatedDraft: DraftCourse = {
    ...draft,
    id,
    createdAt: drafts[index].createdAt,
    updatedAt: new Date().toISOString(),
  };

  drafts[index] = updatedDraft;
  localStorage.setItem(DRAFTS_STORAGE_KEY, JSON.stringify(drafts));
  return updatedDraft;
};

export const getDrafts = (): DraftCourse[] => {
  try {
    const drafts = localStorage.getItem(DRAFTS_STORAGE_KEY);
    return drafts ? JSON.parse(drafts) : [];
  } catch (error) {
    console.error('Error loading drafts:', error);
    return [];
  }
};

export const getDraft = (id: string): DraftCourse | null => {
  const drafts = getDrafts();
  return drafts.find(d => d.id === id) || null;
};

export const deleteDraft = (id: string): boolean => {
  const drafts = getDrafts();
  const filteredDrafts = drafts.filter(d => d.id !== id);
  
  if (filteredDrafts.length === drafts.length) return false;
  
  localStorage.setItem(DRAFTS_STORAGE_KEY, JSON.stringify(filteredDrafts));
  return true;
};

export const clearAllDrafts = (): void => {
  localStorage.removeItem(DRAFTS_STORAGE_KEY);
};