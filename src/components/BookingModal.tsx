import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { CheckCircle, Upload, Play, Image, FileText, Settings, BookOpen, Eye, Plus, X, Clock, ChevronLeft, ChevronRight, Trash2, GripVertical, Crop } from 'lucide-react';
import ReactCrop, { Crop as CropType, PixelCrop } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import { Checkbox } from '@/components/ui/checkbox';
import { Calendar } from '@/components/ui/calendar';
import { useToast } from '@/hooks/use-toast';
import { saveDraft, updateDraft } from '@/utils/draftStorage';
import { publishCourse, updatePublishedCourse } from '@/utils/publishedStorage';
import { DraftCourse } from '@/types/draft';
import { PublishedCourse } from '@/types/published';

interface BookingModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editingDraft?: DraftCourse | null;
  editingPublished?: PublishedCourse | null;
}

interface ProcessedImage {
  id: string;
  file: File;
  preview: string;
  croppedPreview?: string;
  crop?: CropType;
}

interface SubSection {
  title: string;
  description: string;
  type: 'lecture' | 'quiz' | 'assignment' | 'lab';
  timeMinutes: string;
}

interface Module {
  title: string;
  subsections: SubSection[];
}

interface ClassroomSession {
  startDate: string;
  startTime: string;
  endTime: string;
  daysOfWeek: string[];
  recurring: boolean;
}

interface OneOnOneSession {
  startDate: string;
  daysOfWeek: string[];
  startTime: string;
  endTime: string;
  recurring: boolean;
}

interface FormData {
  // General Information
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
  
  // Course Content
  modules: Module[];
  
  // Course Format
  format: string;
  sessionTypes: string[];
  classroomSessions: ClassroomSession[];
  oneOnOneSessions: OneOnOneSession[];
  
  // Media
  images: ProcessedImage[];
  videos: File[];
}

const steps = [
  { id: 1, title: 'General Information', icon: BookOpen },
  { id: 2, title: 'Course Content', icon: FileText },
  { id: 3, title: 'Course Format', icon: Settings },
  { id: 4, title: 'Media Upload', icon: Upload },
  { id: 5, title: 'Review', icon: Eye },
];

const courseLevels = ['Beginner', 'Intermediate', 'Expert'];
const languages = ['English', 'Spanish', 'French', 'German', 'Portuguese', 'Italian', 'Chinese', 'Japanese'];
const categories = ['Technology', 'Business', 'Design', 'Marketing', 'Personal Development', 'Health & Fitness'];
const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const subcategories = {
  'Technology': ['Web Development', 'Mobile Development', 'Data Science', 'AI & Machine Learning', 'Cybersecurity'],
  'Business': ['Entrepreneurship', 'Finance', 'Management', 'Sales', 'Strategy'],
  'Design': ['UI/UX Design', 'Graphic Design', 'Product Design', 'Animation', 'Photography'],
  'Marketing': ['Digital Marketing', 'Content Marketing', 'Social Media', 'SEO', 'Email Marketing'],
  'Personal Development': ['Leadership', 'Communication', 'Productivity', 'Mindfulness', 'Career Development'],
  'Health & Fitness': ['Nutrition', 'Workout', 'Mental Health', 'Yoga', 'Sports'],
};

// Helper function to calculate session duration
const calculateSessionDuration = (startTime: string, endTime: string): string => {
  if (!startTime || !endTime) return '';
  
  const start = new Date(`2000-01-01T${startTime}:00`);
  const end = new Date(`2000-01-01T${endTime}:00`);
  
  if (end <= start) return '';
  
  const diffMs = end.getTime() - start.getTime();
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
  
  if (diffHours === 0) {
    return `${diffMinutes} min`;
  } else if (diffMinutes === 0) {
    return `${diffHours} hr`;
  } else {
    return `${diffHours} hr ${diffMinutes} min`;
  }
};

export function BookingModal({ open, onOpenChange, editingDraft = null, editingPublished = null }: BookingModalProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [calendarDate, setCalendarDate] = useState(new Date());
  const [cropModalOpen, setCropModalOpen] = useState(false);
  const [currentImageToCrop, setCurrentImageToCrop] = useState<string | null>(null);
  const [crop, setCrop] = useState<CropType>();
  const [imgRef, setImgRef] = useState<HTMLImageElement | null>(null);
  const [showCloseConfirmation, setShowCloseConfirmation] = useState(false);
  
  const initialFormData: FormData = {
    title: '',
    subtitle: '',
    description: '',
    objectives: '',
    requirements: '',
    level: '',
    language: '',
    category: '',
    subcategory: '',
    durationHours: '',
    durationMinutes: '',
    modules: [{ title: '', subsections: [] }],
    format: '',
    sessionTypes: [],
    classroomSessions: [],
    oneOnOneSessions: [],
    images: [],
    videos: [],
  };
  
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [isEditingDraft, setIsEditingDraft] = useState(false);
  const [isEditingPublished, setIsEditingPublished] = useState(false);
  const [currentDraftId, setCurrentDraftId] = useState<string | null>(null);
  const [currentPublishedId, setCurrentPublishedId] = useState<string | null>(null);
  const [isGeneratingDescription, setIsGeneratingDescription] = useState(false);
  const [isGeneratingSubtitle, setIsGeneratingSubtitle] = useState(false);
  const [isGeneratingObjectives, setIsGeneratingObjectives] = useState(false);
  const [isGeneratingRequirements, setIsGeneratingRequirements] = useState(false);
  const [isGeneratingModuleTitle, setIsGeneratingModuleTitle] = useState(false);
  const [isGeneratingSubsectionTitle, setIsGeneratingSubsectionTitle] = useState(false);
  const [isGeneratingSubsectionDescription, setIsGeneratingSubsectionDescription] = useState(false);
  const [isGeneratingModuleSubsections, setIsGeneratingModuleSubsections] = useState(false);
  const { toast } = useToast();

  // Load draft or published course data when editing
  useEffect(() => {
    if (editingDraft && open) {
      setFormData(editingDraft);
      setIsEditingDraft(true);
      setIsEditingPublished(false);
      setCurrentDraftId(editingDraft.id);
      setCurrentPublishedId(null);
      setCurrentStep(1);
    } else if (editingPublished && open) {
      // Convert published course to form data format
      const publishedAsFormData = {
        ...editingPublished,
        // Remove published-specific fields that aren't in FormData
      };
      setFormData(publishedAsFormData);
      setIsEditingDraft(false);
      setIsEditingPublished(true);
      setCurrentDraftId(null);
      setCurrentPublishedId(editingPublished.id);
      setCurrentStep(1);
    } else if (open && !editingDraft && !editingPublished) {
      // Reset when creating new course
      setIsEditingDraft(false);
      setIsEditingPublished(false);
      setCurrentDraftId(null);
      setCurrentPublishedId(null);
    }
  }, [editingDraft, editingPublished, open]);

  const resetForm = () => {
    setFormData(initialFormData);
    setCurrentStep(1);
    setCrop(undefined);
    setCurrentImageToCrop(null);
    setIsEditingDraft(false);
    setIsEditingPublished(false);
    setCurrentDraftId(null);
    setCurrentPublishedId(null);
  };

  const handleCloseModal = () => {
    // Check if there's any form data that would be lost
    const hasFormData = formData.title || formData.description || formData.modules.some(m => m.title) || 
                       formData.images.length > 0 || formData.videos.length > 0 || formData.sessionTypes.length > 0;
    
    if (hasFormData) {
      setShowCloseConfirmation(true);
    } else {
      resetForm();
      onOpenChange(false);
    }
  };

  const confirmClose = () => {
    resetForm();
    setShowCloseConfirmation(false);
    onOpenChange(false);
  };

  const updateFormData = (field: keyof FormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const generateDescription = async () => {
    if (!formData.title.trim()) {
      toast({
        title: "Course title required",
        description: "Please enter a course title first to generate a description.",
        variant: "destructive",
      });
      return;
    }

    setIsGeneratingDescription(true);
    try {
      // Simulate AI generation - in a real app, this would call an AI API
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const suggestions = [
        `Master the fundamentals of ${formData.title} with this comprehensive course designed for learners at all levels. You'll gain practical skills and theoretical knowledge through hands-on projects and real-world applications.`,
        `Dive deep into ${formData.title} and unlock your potential with expert-led instruction. This course combines theoretical concepts with practical exercises to ensure you develop both understanding and application skills.`,
        `Transform your career with our intensive ${formData.title} course. Learn from industry experts and build a strong foundation through interactive lessons, projects, and personalized feedback.`,
        `Discover the power of ${formData.title} in this engaging and comprehensive course. Whether you're a beginner or looking to advance your skills, you'll find valuable insights and practical knowledge to achieve your goals.`
      ];
      
      const randomDescription = suggestions[Math.floor(Math.random() * suggestions.length)];
      updateFormData('description', randomDescription);
      
      toast({
        title: "Description generated!",
        description: "AI has generated a course description based on your title. Feel free to edit it as needed.",
      });
    } catch (error) {
      toast({
        title: "Generation failed",
        description: "Failed to generate description. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGeneratingDescription(false);
    }
  };

  const generateSubtitle = async () => {
    if (!formData.title.trim()) {
      toast({
        title: "Course title required",
        description: "Please enter a course title first to generate a subtitle.",
        variant: "destructive",
      });
      return;
    }

    setIsGeneratingSubtitle(true);
    try {
      // Simulate AI generation - in a real app, this would call an AI API
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const suggestions = [
        `Learn ${formData.title} from scratch to advanced level`,
        `Master ${formData.title} with hands-on projects and expert guidance`,
        `Complete guide to ${formData.title} for beginners and professionals`,
        `Practical ${formData.title} skills for real-world applications`,
        `Step-by-step ${formData.title} training with industry best practices`,
        `Professional ${formData.title} course with certification preparation`
      ];
      
      const randomSubtitle = suggestions[Math.floor(Math.random() * suggestions.length)];
      updateFormData('subtitle', randomSubtitle);
      
      toast({
        title: "Subtitle generated!",
        description: "AI has generated a course subtitle based on your title. Feel free to edit it as needed.",
      });
    } catch (error) {
      toast({
        title: "Generation failed",
        description: "Failed to generate subtitle. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGeneratingSubtitle(false);
    }
  };

  const generateObjectives = async () => {
    if (!formData.title.trim()) {
      toast({
        title: "Course title required",
        description: "Please enter a course title first to generate objectives.",
        variant: "destructive",
      });
      return;
    }

    setIsGeneratingObjectives(true);
    try {
      // Simulate AI generation - in a real app, this would call an AI API
      await new Promise(resolve => setTimeout(resolve, 1800));
      
      const suggestions = [
        `By the end of this ${formData.title} course, students will be able to:\n• Understand the fundamental concepts and principles\n• Apply practical skills in real-world scenarios\n• Build projects using industry best practices\n• Solve complex problems independently\n• Demonstrate mastery through hands-on exercises`,
        `Upon completion of this ${formData.title} course, learners will:\n• Master the core concepts and methodologies\n• Develop practical skills through hands-on projects\n• Analyze and solve problems using professional techniques\n• Create original work demonstrating their understanding\n• Confidently apply knowledge in professional settings`,
        `This ${formData.title} course will enable students to:\n• Gain comprehensive understanding of key principles\n• Implement solutions using modern tools and techniques\n• Design and develop professional-quality projects\n• Evaluate and optimize their work for best results\n• Prepare for advanced studies or career opportunities`
      ];
      
      const randomObjectives = suggestions[Math.floor(Math.random() * suggestions.length)];
      updateFormData('objectives', randomObjectives);
      
      toast({
        title: "Objectives generated!",
        description: "AI has generated course objectives based on your title. Feel free to edit them as needed.",
      });
    } catch (error) {
      toast({
        title: "Generation failed",
        description: "Failed to generate objectives. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGeneratingObjectives(false);
    }
  };

  const generateRequirements = async () => {
    if (!formData.title.trim()) {
      toast({
        title: "Course title required",
        description: "Please enter a course title first to generate requirements.",
        variant: "destructive",
      });
      return;
    }

    setIsGeneratingRequirements(true);
    try {
      // Simulate AI generation - in a real app, this would call an AI API
      await new Promise(resolve => setTimeout(resolve, 1600));
      
      const suggestions = [
        `To succeed in this ${formData.title} course, students should have:\n• Basic computer literacy and internet access\n• Willingness to learn and practice regularly\n• No prior experience required - we'll start from the basics\n• Access to a computer or laptop for hands-on exercises\n• Commitment to complete assignments and projects`,
        `Prerequisites for this ${formData.title} course:\n• Fundamental computer skills and web browsing\n• Enthusiasm for learning new skills\n• Access to necessary software (guidance provided)\n• Time commitment of 3-5 hours per week\n• Open mindset and willingness to ask questions`,
        `Before starting this ${formData.title} course, ensure you have:\n• Basic familiarity with technology and computers\n• Reliable internet connection for online content\n• Dedication to practice and apply what you learn\n• Access to recommended tools and resources\n• Beginner-friendly approach - suitable for all levels`
      ];
      
      const randomRequirements = suggestions[Math.floor(Math.random() * suggestions.length)];
      updateFormData('requirements', randomRequirements);
      
      toast({
        title: "Requirements generated!",
        description: "AI has generated course requirements based on your title. Feel free to edit them as needed.",
      });
    } catch (error) {
      toast({
        title: "Generation failed",
        description: "Failed to generate requirements. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGeneratingRequirements(false);
    }
  };

  const generateModuleTitle = async (moduleIndex: number) => {
    if (!formData.title.trim()) {
      toast({
        title: "Course title required",
        description: "Please enter a course title first to generate module titles.",
        variant: "destructive",
      });
      return;
    }

    setIsGeneratingModuleTitle(true);
    try {
      // Simulate AI generation - in a real app, this would call an AI API
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const suggestions = [
        `Introduction to ${formData.title}`,
        `Getting Started with ${formData.title}`,
        `Fundamentals of ${formData.title}`,
        `Core Concepts in ${formData.title}`,
        `Advanced ${formData.title} Techniques`,
        `Practical ${formData.title} Applications`,
        `Best Practices in ${formData.title}`,
        `Real-world ${formData.title} Projects`,
        `Mastering ${formData.title} Skills`,
        `Professional ${formData.title} Development`
      ];
      
      const randomTitle = suggestions[Math.floor(Math.random() * suggestions.length)];
      updateModule(moduleIndex, 'title', randomTitle);
      
      toast({
        title: "Module title generated!",
        description: "AI has generated a module title. Feel free to edit it as needed.",
      });
    } catch (error) {
      toast({
        title: "Generation failed",
        description: "Failed to generate module title. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGeneratingModuleTitle(false);
    }
  };

  const generateSubsectionTitle = async (moduleIndex: number, subIndex: number) => {
    if (!formData.title.trim()) {
      toast({
        title: "Course title required",
        description: "Please enter a course title first to generate subsection titles.",
        variant: "destructive",
      });
      return;
    }

    setIsGeneratingSubsectionTitle(true);
    try {
      // Simulate AI generation - in a real app, this would call an AI API
      await new Promise(resolve => setTimeout(resolve, 1200));
      
      const moduleTitle = formData.modules[moduleIndex]?.title || formData.title;
      const suggestions = [
        `Overview of ${moduleTitle}`,
        `Understanding ${moduleTitle}`,
        `Key Concepts in ${moduleTitle}`,
        `Practical Examples`,
        `Hands-on Exercise`,
        `Implementation Guide`,
        `Common Challenges`,
        `Best Practices`,
        `Case Study`,
        `Summary and Review`
      ];
      
      const randomTitle = suggestions[Math.floor(Math.random() * suggestions.length)];
      updateSubSection(moduleIndex, subIndex, 'title', randomTitle);
      
      toast({
        title: "Subsection title generated!",
        description: "AI has generated a subsection title. Feel free to edit it as needed.",
      });
    } catch (error) {
      toast({
        title: "Generation failed",
        description: "Failed to generate subsection title. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGeneratingSubsectionTitle(false);
    }
  };

  const generateSubsectionDescription = async (moduleIndex: number, subIndex: number) => {
    if (!formData.title.trim()) {
      toast({
        title: "Course title required",
        description: "Please enter a course title first to generate subsection descriptions.",
        variant: "destructive",
      });
      return;
    }

    setIsGeneratingSubsectionDescription(true);
    try {
      // Simulate AI generation - in a real app, this would call an AI API
      await new Promise(resolve => setTimeout(resolve, 1400));
      
      const subsectionTitle = formData.modules[moduleIndex]?.subsections[subIndex]?.title || "this topic";
      const suggestions = [
        `In this section, we'll explore ${subsectionTitle} and learn how to apply it effectively in real-world scenarios.`,
        `This lesson covers the essential aspects of ${subsectionTitle}, providing practical examples and hands-on exercises.`,
        `Students will dive deep into ${subsectionTitle}, understanding its importance and implementation strategies.`,
        `A comprehensive overview of ${subsectionTitle} with step-by-step guidance and practical applications.`,
        `Learn the fundamentals of ${subsectionTitle} through interactive examples and expert insights.`
      ];
      
      const randomDescription = suggestions[Math.floor(Math.random() * suggestions.length)];
      updateSubSection(moduleIndex, subIndex, 'description', randomDescription);
      
      toast({
        title: "Subsection description generated!",
        description: "AI has generated a subsection description. Feel free to edit it as needed.",
      });
    } catch (error) {
      toast({
        title: "Generation failed",
        description: "Failed to generate subsection description. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGeneratingSubsectionDescription(false);
    }
  };

  const generateModuleSubsections = async (moduleIndex: number) => {
    if (!formData.title.trim()) {
      toast({
        title: "Course title required",
        description: "Please enter a course title first to generate subsections.",
        variant: "destructive",
      });
      return;
    }

    setIsGeneratingModuleSubsections(true);
    try {
      // Simulate AI generation - in a real app, this would call an AI API
      await new Promise(resolve => setTimeout(resolve, 2500));
      
      const moduleTitle = formData.modules[moduleIndex]?.title || `Module ${moduleIndex + 1}`;
      const courseTitle = formData.title;
      
      // Generate 4-6 subsections for the module
      const subsectionTemplates = [
        {
          title: `Introduction to ${moduleTitle}`,
          description: `Overview of ${moduleTitle} concepts and how they relate to ${courseTitle}. Students will understand the fundamental principles.`,
          type: 'lecture' as const,
          timeMinutes: '15'
        },
        {
          title: `Core Concepts and Theory`,
          description: `Detailed exploration of the key theoretical foundations and concepts that underpin ${moduleTitle}.`,
          type: 'lecture' as const,
          timeMinutes: '25'
        },
        {
          title: `Practical Examples and Use Cases`,
          description: `Real-world examples demonstrating how ${moduleTitle} is applied in professional settings.`,
          type: 'lecture' as const,
          timeMinutes: '20'
        },
        {
          title: `Hands-on Lab Exercise`,
          description: `Interactive lab exercise where students practice implementing ${moduleTitle} concepts through guided activities.`,
          type: 'lab' as const,
          timeMinutes: '30'
        },
        {
          title: `Assignment: Practical Application`,
          description: `Assignment where students apply ${moduleTitle} concepts to solve real-world problems independently.`,
          type: 'assignment' as const,
          timeMinutes: '45'
        },
        {
          title: `Common Challenges and Solutions`,
          description: `Discussion of typical problems encountered with ${moduleTitle} and proven strategies to overcome them.`,
          type: 'lecture' as const,
          timeMinutes: '20'
        },
        {
          title: `Module Assessment Quiz`,
          description: `Assessment quiz to evaluate understanding of ${moduleTitle} concepts and learning objectives.`,
          type: 'quiz' as const,
          timeMinutes: '15'
        }
      ];

      // Select 4-5 random subsections
      const numberOfSubsections = 4 + Math.floor(Math.random() * 2); // 4 or 5 subsections
      const selectedSubsections = subsectionTemplates
        .sort(() => 0.5 - Math.random())
        .slice(0, numberOfSubsections);

      // Clear existing subsections and add generated ones
      const newModules = [...formData.modules];
      newModules[moduleIndex].subsections = selectedSubsections;
      setFormData(prev => ({ ...prev, modules: newModules }));
      
      toast({
        title: "Subsections generated!",
        description: `AI has generated ${numberOfSubsections} subsections for ${moduleTitle}. Feel free to edit them as needed.`,
      });
    } catch (error) {
      toast({
        title: "Generation failed",
        description: "Failed to generate subsections. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGeneratingModuleSubsections(false);
    }
  };

  const nextStep = () => {
    if (currentStep < 5) setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const addModule = () => {
    setFormData(prev => ({ 
      ...prev, 
      modules: [...prev.modules, { title: '', subsections: [] }] 
    }));
  };

  const updateModule = (index: number, field: 'title', value: string) => {
    const newModules = [...formData.modules];
    newModules[index] = { ...newModules[index], [field]: value };
    setFormData(prev => ({ ...prev, modules: newModules }));
  };

  const removeModule = (index: number) => {
    if (formData.modules.length > 1) {
      const newModules = formData.modules.filter((_, i) => i !== index);
      setFormData(prev => ({ ...prev, modules: newModules }));
    }
  };

  const addSubSection = (moduleIndex: number) => {
    const newModules = [...formData.modules];
    newModules[moduleIndex].subsections.push({
      title: '',
      description: '',
      type: 'lecture',
      timeMinutes: ''
    });
    setFormData(prev => ({ ...prev, modules: newModules }));
  };

  const updateSubSection = (moduleIndex: number, subIndex: number, field: keyof SubSection, value: any) => {
    const newModules = [...formData.modules];
    newModules[moduleIndex].subsections[subIndex] = {
      ...newModules[moduleIndex].subsections[subIndex],
      [field]: value
    };
    setFormData(prev => ({ ...prev, modules: newModules }));
  };

  const removeSubSection = (moduleIndex: number, subIndex: number) => {
    const newModules = [...formData.modules];
    newModules[moduleIndex].subsections = newModules[moduleIndex].subsections.filter((_, i) => i !== subIndex);
    setFormData(prev => ({ ...prev, modules: newModules }));
  };

  const handleFileUpload = (type: 'images' | 'videos', files: FileList | null) => {
    if (files) {
      if (type === 'images') {
        Array.from(files).forEach(file => {
          const id = Math.random().toString(36).substr(2, 9);
          const preview = URL.createObjectURL(file);
          const processedImage: ProcessedImage = {
            id,
            file,
            preview,
          };
          setFormData(prev => ({ 
            ...prev, 
            images: [...prev.images, processedImage] 
          }));
          
          // Immediately open crop modal for the uploaded image
          setCurrentImageToCrop(id);
          setCropModalOpen(true);
          setCrop(undefined);
        });
        
        // Clear the input so the same file can be uploaded again
        const input = document.getElementById('image-upload') as HTMLInputElement;
        if (input) input.value = '';
      } else {
        const fileArray = Array.from(files);
        setFormData(prev => ({ ...prev, [type]: [...prev[type], ...fileArray] }));
      }
    }
  };

  const removeImage = (id: string) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter(img => img.id !== id)
    }));
  };

  const reorderImages = (fromIndex: number, toIndex: number) => {
    setFormData(prev => {
      const newImages = [...prev.images];
      const [movedImage] = newImages.splice(fromIndex, 1);
      newImages.splice(toIndex, 0, movedImage);
      return { ...prev, images: newImages };
    });
  };

  const openCropModal = (imageId: string) => {
    const image = formData.images.find(img => img.id === imageId);
    setCurrentImageToCrop(imageId);
    setCropModalOpen(true);
    // Restore previous crop settings if they exist
    setCrop(image?.crop || undefined);
  };

  const getCroppedImg = (image: HTMLImageElement, crop: PixelCrop): Promise<string> => {
    return new Promise((resolve, reject) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      if (!ctx) {
        reject(new Error('No 2d context'));
        return;
      }

      const scaleX = image.naturalWidth / image.width;
      const scaleY = image.naturalHeight / image.height;

      canvas.width = crop.width;
      canvas.height = crop.height;

      ctx.drawImage(
        image,
        crop.x * scaleX,
        crop.y * scaleY,
        crop.width * scaleX,
        crop.height * scaleY,
        0,
        0,
        crop.width,
        crop.height
      );

      canvas.toBlob((blob) => {
        if (!blob) {
          reject(new Error('Canvas is empty'));
          return;
        }
        const croppedImageUrl = URL.createObjectURL(blob);
        resolve(croppedImageUrl);
      }, 'image/jpeg', 0.95);
    });
  };

  const applyCrop = async () => {
    if (imgRef && crop && currentImageToCrop && crop.width && crop.height) {
      try {
        const croppedImageUrl = await getCroppedImg(imgRef, crop as PixelCrop);
        setFormData(prev => ({
          ...prev,
          images: prev.images.map(img => 
            img.id === currentImageToCrop 
              ? { ...img, croppedPreview: croppedImageUrl, crop }
              : img
          )
        }));
        setCropModalOpen(false);
        setCurrentImageToCrop(null);
      } catch (e) {
        console.error('Error cropping image:', e);
      }
    }
  };

  const addClassroomSession = () => {
    const newSession: ClassroomSession = {
      startDate: '',
      startTime: '',
      endTime: '',
      daysOfWeek: [],
      recurring: false
    };
    setFormData(prev => ({ 
      ...prev, 
      classroomSessions: [...prev.classroomSessions, newSession] 
    }));
  };

  const updateClassroomSession = (index: number, field: keyof ClassroomSession, value: any) => {
    const newSessions = [...formData.classroomSessions];
    newSessions[index] = { ...newSessions[index], [field]: value };
    setFormData(prev => ({ ...prev, classroomSessions: newSessions }));
  };

  const removeClassroomSession = (index: number) => {
    const newSessions = formData.classroomSessions.filter((_, i) => i !== index);
    setFormData(prev => ({ ...prev, classroomSessions: newSessions }));
  };

  const addOneOnOneSession = () => {
    const newSession: OneOnOneSession = {
      startDate: '',
      daysOfWeek: [],
      startTime: '',
      endTime: '',
      recurring: false
    };
    setFormData(prev => ({ 
      ...prev, 
      oneOnOneSessions: [...prev.oneOnOneSessions, newSession] 
    }));
  };

  const updateOneOnOneSession = (index: number, field: keyof OneOnOneSession, value: any) => {
    const newSessions = [...formData.oneOnOneSessions];
    newSessions[index] = { ...newSessions[index], [field]: value };
    setFormData(prev => ({ ...prev, oneOnOneSessions: newSessions }));
  };

  const removeOneOnOneSession = (index: number) => {
    const newSessions = formData.oneOnOneSessions.filter((_, i) => i !== index);
    setFormData(prev => ({ ...prev, oneOnOneSessions: newSessions }));
  };

  const toggleSessionType = (type: string) => {
    const newTypes = formData.sessionTypes.includes(type)
      ? formData.sessionTypes.filter(t => t !== type)
      : [...formData.sessionTypes, type];
    
    let newClassroomSessions = formData.classroomSessions;
    let newOneOnOneSessions = formData.oneOnOneSessions;
    
    // Auto-add default session when session type is selected
    if (!formData.sessionTypes.includes(type)) {
      if (type === 'classroom') {
        newClassroomSessions = [...formData.classroomSessions, {
          startDate: '',
          startTime: '',
          endTime: '',
          daysOfWeek: [],
          recurring: false
        }];
      } else if (type === 'oneOnOne') {
        newOneOnOneSessions = [...formData.oneOnOneSessions, {
          startDate: '',
          daysOfWeek: [],
          startTime: '',
          endTime: '',
          recurring: false
        }];
      }
    } else {
      // Remove sessions when session type is deselected
      if (type === 'classroom') {
        newClassroomSessions = [];
      } else if (type === 'oneOnOne') {
        newOneOnOneSessions = [];
      }
    }
    
    setFormData(prev => ({ 
      ...prev, 
      sessionTypes: newTypes,
      classroomSessions: newClassroomSessions,
      oneOnOneSessions: newOneOnOneSessions
    }));
  };

  const toggleDayOfWeek = (sessionType: 'classroom' | 'oneOnOne', sessionIndex: number, day: string) => {
    if (sessionType === 'classroom') {
      const session = formData.classroomSessions[sessionIndex];
      const newDays = session.daysOfWeek.includes(day)
        ? session.daysOfWeek.filter(d => d !== day)
        : [...session.daysOfWeek, day];
      updateClassroomSession(sessionIndex, 'daysOfWeek', newDays);
    } else {
      const session = formData.oneOnOneSessions[sessionIndex];
      const newDays = session.daysOfWeek.includes(day)
        ? session.daysOfWeek.filter(d => d !== day)
        : [...session.daysOfWeek, day];
      updateOneOnOneSession(sessionIndex, 'daysOfWeek', newDays);
    }
  };

  const handleSubmit = () => {
    // Use the publish course function instead of just showing a toast
    handlePublishCourse();
  };

  const handleSaveAsDraft = () => {
    try {
      const draftData = {
        title: formData.title,
        subtitle: formData.subtitle,
        description: formData.description,
        objectives: formData.objectives,
        requirements: formData.requirements,
        level: formData.level,
        language: formData.language,
        category: formData.category,
        subcategory: formData.subcategory,
        durationHours: formData.durationHours,
        durationMinutes: formData.durationMinutes,
        modules: formData.modules,
        format: formData.format,
        sessionTypes: formData.sessionTypes,
        classroomSessions: formData.classroomSessions,
        oneOnOneSessions: formData.oneOnOneSessions,
        images: formData.images,
        videos: formData.videos,
      };

      if (isEditingDraft && currentDraftId) {
        // Update existing draft
        const updatedDraft = updateDraft(currentDraftId, draftData);
        if (updatedDraft) {
          toast({
            title: "Draft Updated",
            description: "Your course draft has been updated successfully.",
          });
        }
      } else {
        // Create new draft
        const newDraft = saveDraft(draftData);
        toast({
          title: "Course Saved as Draft",
          description: "Your course has been saved and you can continue editing it later.",
        });
        setIsEditingDraft(true);
        setCurrentDraftId(newDraft.id);
      }
      
      // Close the modal after saving
      onOpenChange(false);
      resetForm();
    } catch (error) {
      toast({
        title: "Error Saving Draft",
        description: "There was an error saving your draft. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handlePublishCourse = () => {
    try {
      const courseData = {
        title: formData.title,
        subtitle: formData.subtitle,
        description: formData.description,
        objectives: formData.objectives,
        requirements: formData.requirements,
        level: formData.level,
        language: formData.language,
        category: formData.category,
        subcategory: formData.subcategory,
        durationHours: formData.durationHours,
        durationMinutes: formData.durationMinutes,
        modules: formData.modules,
        format: formData.format,
        sessionTypes: formData.sessionTypes,
        classroomSessions: formData.classroomSessions,
        oneOnOneSessions: formData.oneOnOneSessions,
        images: formData.images,
        videos: formData.videos,
      };

      if (isEditingPublished && currentPublishedId) {
        // Update existing published course
        const updatedCourse = updatePublishedCourse(currentPublishedId, courseData);
        if (updatedCourse) {
          toast({
            title: "Course Updated",
            description: "Your published course has been updated successfully.",
          });
        }
      } else {
        // Publish new course
        const publishedCourse = publishCourse(courseData);
        toast({
          title: "Course Published",
          description: "Your course has been published successfully and is now live!",
        });
      }
      
      // Close the modal after publishing
      onOpenChange(false);
      resetForm();
    } catch (error) {
      toast({
        title: "Error Publishing Course",
        description: "There was an error publishing your course. Please try again.",
        variant: "destructive",
      });
    }
  };

  const StepIndicator = () => (
    <div className="flex items-center justify-center mb-8">
      {steps.map((step, index) => {
        const isCompleted = step.id < currentStep;
        const isCurrent = step.id === currentStep;
        const StepIcon = step.icon;
        
        return (
          <React.Fragment key={step.id}>
            <button
              onClick={() => setCurrentStep(step.id)}
              className="flex flex-col items-center group transition-transform hover:scale-105"
            >
              <div
                className={`
                  w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 cursor-pointer
                  ${isCompleted ? 'bg-primary text-primary-foreground shadow-lg group-hover:shadow-xl' : 
                    isCurrent ? 'bg-primary text-primary-foreground shadow-lg scale-110' : 
                    'bg-muted text-muted-foreground group-hover:bg-muted/80'}
                `}
              >
                {isCompleted ? <CheckCircle className="w-5 h-5" /> : <StepIcon className="w-5 h-5" />}
              </div>
              <p className={`text-xs mt-2 font-medium transition-colors ${
                isCurrent ? 'text-primary' : 'text-muted-foreground group-hover:text-foreground'
              }`}>
                {step.title}
              </p>
            </button>
            {index < steps.length - 1 && (
              <div className={`w-16 h-px mx-4 transition-colors duration-300 ${
                step.id < currentStep ? 'bg-primary' : 'bg-border'
              }`} />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="title">Course Title *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => updateFormData('title', e.target.value)}
                  placeholder="Enter course title"
                  className="transition-all duration-200 focus:ring-2 focus:ring-primary/20"
                />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="subtitle">Course Subtitle</Label>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={generateSubtitle}
                    disabled={!formData.title.trim() || isGeneratingSubtitle}
                    className="text-xs"
                  >
                    {isGeneratingSubtitle ? (
                      <>
                        <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-primary mr-1"></div>
                        Generating...
                      </>
                    ) : (
                      <>
                        <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                        AI Generate
                      </>
                    )}
                  </Button>
                </div>
                <Input
                  id="subtitle"
                  value={formData.subtitle}
                  onChange={(e) => updateFormData('subtitle', e.target.value)}
                  placeholder="Enter course subtitle"
                  className="transition-all duration-200 focus:ring-2 focus:ring-primary/20"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="description">Course Description *</Label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={generateDescription}
                  disabled={!formData.title.trim() || isGeneratingDescription}
                  className="text-xs"
                >
                  {isGeneratingDescription ? (
                    <>
                      <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-primary mr-1"></div>
                      Generating...
                    </>
                  ) : (
                    <>
                      <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                      AI Generate
                    </>
                  )}
                </Button>
              </div>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => updateFormData('description', e.target.value)}
                placeholder="Describe what students will learn in this course"
                className="min-h-32 transition-all duration-200 focus:ring-2 focus:ring-primary/20"
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="objectives">Course Objectives</Label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={generateObjectives}
                  disabled={!formData.title.trim() || isGeneratingObjectives}
                  className="text-xs"
                >
                  {isGeneratingObjectives ? (
                    <>
                      <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-primary mr-1"></div>
                      Generating...
                    </>
                  ) : (
                    <>
                      <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                      AI Generate
                    </>
                  )}
                </Button>
              </div>
              <Textarea
                id="objectives"
                value={formData.objectives}
                onChange={(e) => updateFormData('objectives', e.target.value)}
                placeholder="List the key learning objectives"
                className="transition-all duration-200 focus:ring-2 focus:ring-primary/20"
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="requirements">Requirements</Label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={generateRequirements}
                  disabled={!formData.title.trim() || isGeneratingRequirements}
                  className="text-xs"
                >
                  {isGeneratingRequirements ? (
                    <>
                      <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-primary mr-1"></div>
                      Generating...
                    </>
                  ) : (
                    <>
                      <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                      AI Generate
                    </>
                  )}
                </Button>
              </div>
              <Textarea
                id="requirements"
                value={formData.requirements}
                onChange={(e) => updateFormData('requirements', e.target.value)}
                placeholder="What do students need to know before taking this course?"
                className="transition-all duration-200 focus:ring-2 focus:ring-primary/20"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <Label>Course Level *</Label>
                <Select value={formData.level} onValueChange={(value) => updateFormData('level', value)}>
                  <SelectTrigger className="transition-all duration-200 focus:ring-2 focus:ring-primary/20">
                    <SelectValue placeholder="Select level" />
                  </SelectTrigger>
                  <SelectContent>
                    {courseLevels.map((level) => (
                      <SelectItem key={level} value={level}>{level}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Language *</Label>
                <Select value={formData.language} onValueChange={(value) => updateFormData('language', value)}>
                  <SelectTrigger className="transition-all duration-200 focus:ring-2 focus:ring-primary/20">
                    <SelectValue placeholder="Select language" />
                  </SelectTrigger>
                  <SelectContent>
                    {languages.map((language) => (
                      <SelectItem key={language} value={language}>{language}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Course Duration</Label>
                <div className="flex gap-2">
                  <div className="flex-1">
                    <Input
                      type="number"
                      min="0"
                      max="999"
                      value={formData.durationHours}
                      onChange={(e) => updateFormData('durationHours', e.target.value)}
                      placeholder="Hours"
                      className="transition-all duration-200 focus:ring-2 focus:ring-primary/20"
                    />
                    <Label className="text-xs text-muted-foreground mt-1">Hours</Label>
                  </div>
                  <div className="flex-1">
                    <Input
                      type="number"
                      min="0"
                      max="59"
                      value={formData.durationMinutes}
                      onChange={(e) => updateFormData('durationMinutes', e.target.value)}
                      placeholder="Minutes"
                      className="transition-all duration-200 focus:ring-2 focus:ring-primary/20"
                    />
                    <Label className="text-xs text-muted-foreground mt-1">Minutes</Label>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label>Category *</Label>
                <Select value={formData.category} onValueChange={(value) => {
                  updateFormData('category', value);
                  updateFormData('subcategory', '');
                }}>
                  <SelectTrigger className="transition-all duration-200 focus:ring-2 focus:ring-primary/20">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category} value={category}>{category}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Subcategory</Label>
                <Select 
                  value={formData.subcategory} 
                  onValueChange={(value) => updateFormData('subcategory', value)}
                  disabled={!formData.category}
                >
                  <SelectTrigger className="transition-all duration-200 focus:ring-2 focus:ring-primary/20">
                    <SelectValue placeholder="Select subcategory" />
                  </SelectTrigger>
                  <SelectContent>
                    {formData.category && subcategories[formData.category as keyof typeof subcategories]?.map((subcategory) => (
                      <SelectItem key={subcategory} value={subcategory}>{subcategory}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-foreground">Course Modules</h3>
              <Button onClick={addModule} variant="outline" size="sm">
                Add Module
              </Button>
            </div>
            
            <div className="space-y-6">
              {formData.modules.map((module, moduleIndex) => (
                <Card key={moduleIndex} className="p-6 border border-border hover:shadow-md transition-shadow duration-200">
                  <div className="space-y-4">
                    <div className="flex items-center gap-4">
                      <Badge variant="secondary" className="text-xs">
                        Module {moduleIndex + 1}
                      </Badge>
                      <div className="flex-1 flex items-center gap-2">
                        <Input
                          value={module.title}
                          onChange={(e) => updateModule(moduleIndex, 'title', e.target.value)}
                          placeholder={`Enter module ${moduleIndex + 1} title`}
                          className="flex-1 transition-all duration-200 focus:ring-2 focus:ring-primary/20"
                        />
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => generateModuleTitle(moduleIndex)}
                          disabled={!formData.title.trim() || isGeneratingModuleTitle}
                          className="text-xs whitespace-nowrap"
                        >
                          {isGeneratingModuleTitle ? (
                            <>
                              <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-primary mr-1"></div>
                              Generating...
                            </>
                          ) : (
                            <>
                              <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                              </svg>
                              AI Generate
                            </>
                          )}
                        </Button>
                      </div>
                      {formData.modules.length > 1 && (
                        <Button 
                          onClick={() => removeModule(moduleIndex)} 
                          variant="outline" 
                          size="sm"
                          className="text-destructive hover:text-destructive-foreground hover:bg-destructive"
                        >
                          Remove
                        </Button>
                      )}
                    </div>

                    <Separator />

                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <h4 className="text-sm font-medium text-foreground">Subsections</h4>
                        <div className="flex gap-2">
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => generateModuleSubsections(moduleIndex)}
                            disabled={!formData.title.trim() || isGeneratingModuleSubsections}
                            className="text-xs"
                          >
                            {isGeneratingModuleSubsections ? (
                              <>
                                <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-primary mr-1"></div>
                                Generating...
                              </>
                            ) : (
                              <>
                                <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                </svg>
                                AI Generate Subsections
                              </>
                            )}
                          </Button>
                          <Button 
                            onClick={() => addSubSection(moduleIndex)} 
                            variant="outline" 
                            size="sm"
                          >
                            Add Subsection
                          </Button>
                        </div>
                      </div>

                      {module.subsections.length > 0 && (
                        <div className="space-y-3">
                          {module.subsections.map((subsection, subIndex) => (
                            <Card key={subIndex} className="p-4 bg-accent/30">
                              <div className="space-y-3">
                                <div className="flex items-center gap-2">
                                  <Badge variant="outline" className="text-xs">
                                    {subIndex + 1}
                                  </Badge>
                                  <div className="flex-1 flex items-center gap-2">
                                    <Input
                                      value={subsection.title}
                                      onChange={(e) => updateSubSection(moduleIndex, subIndex, 'title', e.target.value)}
                                      placeholder="Subsection title"
                                      className="flex-1 h-9"
                                    />
                                    <Button
                                      type="button"
                                      variant="outline"
                                      size="sm"
                                      onClick={() => generateSubsectionTitle(moduleIndex, subIndex)}
                                      disabled={!formData.title.trim() || isGeneratingSubsectionTitle}
                                      className="text-xs whitespace-nowrap h-9"
                                    >
                                      {isGeneratingSubsectionTitle ? (
                                        <>
                                          <div className="animate-spin rounded-full h-2 w-2 border-b-2 border-primary mr-1"></div>
                                          AI
                                        </>
                                      ) : (
                                        <>
                                          <svg className="w-2 h-2 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                          </svg>
                                          AI
                                        </>
                                      )}
                                    </Button>
                                  </div>
                                  <Input
                                    type="number"
                                    min="0"
                                    value={subsection.timeMinutes}
                                    onChange={(e) => updateSubSection(moduleIndex, subIndex, 'timeMinutes', e.target.value)}
                                    placeholder="Min"
                                    className="w-20 h-9"
                                  />
                                  <Select 
                                    value={subsection.type} 
                                    onValueChange={(value) => updateSubSection(moduleIndex, subIndex, 'type', value)}
                                  >
                                    <SelectTrigger className="w-32 h-9">
                                      <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="lecture">Lecture</SelectItem>
                                      <SelectItem value="quiz">Quiz</SelectItem>
                                      <SelectItem value="assignment">Assignment</SelectItem>
                                      <SelectItem value="lab">Lab</SelectItem>
                                    </SelectContent>
                                  </Select>
                                  <Button 
                                    onClick={() => removeSubSection(moduleIndex, subIndex)} 
                                    variant="outline" 
                                    size="sm"
                                    className="text-destructive hover:text-destructive-foreground hover:bg-destructive h-9 w-9 p-0"
                                  >
                                    ×
                                  </Button>
                                </div>
                                <div className="space-y-2">
                                  <div className="flex items-center justify-between">
                                    <span className="text-xs text-muted-foreground">Description</span>
                                    <Button
                                      type="button"
                                      variant="outline"
                                      size="sm"
                                      onClick={() => generateSubsectionDescription(moduleIndex, subIndex)}
                                      disabled={!formData.title.trim() || isGeneratingSubsectionDescription}
                                      className="text-xs h-6"
                                    >
                                      {isGeneratingSubsectionDescription ? (
                                        <>
                                          <div className="animate-spin rounded-full h-2 w-2 border-b-2 border-primary mr-1"></div>
                                          AI
                                        </>
                                      ) : (
                                        <>
                                          <svg className="w-2 h-2 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                          </svg>
                                          AI
                                        </>
                                      )}
                                    </Button>
                                  </div>
                                  <Textarea
                                    value={subsection.description}
                                    onChange={(e) => updateSubSection(moduleIndex, subIndex, 'description', e.target.value)}
                                    placeholder="Subsection description"
                                    className="text-sm min-h-20"
                                  />
                                </div>
                              </div>
                            </Card>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-foreground mb-4">Course Format</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { value: 'classroom', title: 'Classroom Sessions', description: 'Group learning sessions', icon: Settings },
                { value: 'oneOnOne', title: '1-on-1 Sessions', description: 'Individual tutoring sessions', icon: BookOpen },
              ].map((format) => {
                const FormatIcon = format.icon;
                const isSelected = formData.sessionTypes.includes(format.value);
                return (
                  <Card 
                    key={format.value}
                    className={`p-6 cursor-pointer transition-all duration-200 hover:shadow-lg ${
                      isSelected ? 'ring-2 ring-primary bg-accent' : ''
                    }`}
                    onClick={() => toggleSessionType(format.value)}
                  >
                    <div className="flex items-start gap-4">
                      <div className={`p-2 rounded-lg ${
                        isSelected ? 'bg-primary text-primary-foreground' : 'bg-muted'
                      }`}>
                        <FormatIcon className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="font-medium text-foreground">{format.title}</h4>
                        <p className="text-sm text-muted-foreground mt-1">{format.description}</p>
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>

            {formData.sessionTypes.includes('classroom') && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-lg font-semibold text-foreground">Classroom Sessions</h4>
                </div>
                
                {formData.classroomSessions.length > 0 && formData.classroomSessions.map((session, index) => (
                  <Card key={index} className="p-4">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <Badge variant="secondary">Session {index + 1}</Badge>
                        <Button
                          onClick={() => removeClassroomSession(index)}
                          variant="outline"
                          size="sm"
                          className="text-destructive hover:text-destructive-foreground hover:bg-destructive"
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                      
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label>Start Date</Label>
                          <Input
                            type="date"
                            value={session.startDate}
                            onChange={(e) => updateClassroomSession(index, 'startDate', e.target.value)}
                            min={new Date().toISOString().split('T')[0]}
                          />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label>Start Time</Label>
                            <Input
                              type="time"
                              value={session.startTime}
                              onChange={(e) => updateClassroomSession(index, 'startTime', e.target.value)}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>End Time</Label>
                            <Input
                              type="time"
                              value={session.endTime}
                              onChange={(e) => updateClassroomSession(index, 'endTime', e.target.value)}
                            />
                          </div>
                        </div>

                        {(session.startTime && session.endTime) && (
                          <div className="flex items-center gap-2 p-3 bg-accent/50 rounded-lg">
                            <Clock className="w-4 h-4 text-primary" />
                            <span className="text-sm font-medium">
                              Session Duration: {calculateSessionDuration(session.startTime, session.endTime)}
                            </span>
                          </div>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label>Days of the Week</Label>
                        <div className="flex flex-wrap gap-2">
                          {daysOfWeek.map((day) => (
                            <Badge
                              key={day}
                              variant={session.daysOfWeek.includes(day) ? "default" : "outline"}
                              className="cursor-pointer"
                              onClick={() => toggleDayOfWeek('classroom', index, day)}
                            >
                              {day.slice(0, 3)}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id={`classroom-recurring-${index}`}
                          checked={session.recurring}
                          onCheckedChange={(checked) => updateClassroomSession(index, 'recurring', checked)}
                        />
                        <Label htmlFor={`classroom-recurring-${index}`}>Recurring every week</Label>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}

            {formData.sessionTypes.includes('oneOnOne') && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-lg font-semibold text-foreground">1-on-1 Sessions</h4>
                  <Button onClick={addOneOnOneSession} variant="outline" size="sm">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Session
                  </Button>
                </div>
                
                {formData.oneOnOneSessions.length > 0 && formData.oneOnOneSessions.map((session, index) => (
                  <Card key={index} className="p-4">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <Badge variant="secondary">Session {index + 1}</Badge>
                        <Button
                          onClick={() => removeOneOnOneSession(index)}
                          variant="outline"
                          size="sm"
                          className="text-destructive hover:text-destructive-foreground hover:bg-destructive"
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                      
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label>Start Date</Label>
                          <Input
                            type="date"
                            value={session.startDate}
                            onChange={(e) => updateOneOnOneSession(index, 'startDate', e.target.value)}
                            min={new Date().toISOString().split('T')[0]}
                          />
                        </div>

                        <div className="space-y-2">
                          <Label>Available Days</Label>
                          <div className="flex flex-wrap gap-2">
                            {daysOfWeek.map((day) => (
                              <Badge
                                key={day}
                                variant={session.daysOfWeek.includes(day) ? "default" : "outline"}
                                className="cursor-pointer"
                                onClick={() => toggleDayOfWeek('oneOnOne', index, day)}
                              >
                                {day.slice(0, 3)}
                              </Badge>
                            ))}
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label>Start Time</Label>
                            <Input
                              type="time"
                              value={session.startTime}
                              onChange={(e) => updateOneOnOneSession(index, 'startTime', e.target.value)}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>End Time</Label>
                            <Input
                              type="time"
                              value={session.endTime}
                              onChange={(e) => updateOneOnOneSession(index, 'endTime', e.target.value)}
                            />
                          </div>
                        </div>

                        {(session.startTime && session.endTime) && (
                          <div className="flex items-center gap-2 p-3 bg-accent/50 rounded-lg">
                            <Clock className="w-4 h-4 text-primary" />
                            <span className="text-sm font-medium">
                              Session Duration: {calculateSessionDuration(session.startTime, session.endTime)}
                            </span>
                          </div>
                        )}
                      </div>

                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id={`oneOnOne-recurring-${index}`}
                          checked={session.recurring}
                          onCheckedChange={(checked) => updateOneOnOneSession(index, 'recurring', checked)}
                        />
                        <Label htmlFor={`oneOnOne-recurring-${index}`}>Recurring</Label>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}

            {/* Calendar Preview - Always at the bottom */}
            {((formData.sessionTypes.includes('classroom') && formData.classroomSessions.length > 0 && formData.classroomSessions[0].daysOfWeek.length > 0) ||
              (formData.sessionTypes.includes('oneOnOne') && formData.oneOnOneSessions.length > 0 && formData.oneOnOneSessions[0].daysOfWeek.length > 0)) && (
              <div className="space-y-4 mt-8">
                <h5 className="text-sm font-medium text-foreground text-center">Session Preview</h5>
                <div className="flex justify-center">
                  <div className="w-full max-w-6xl p-6 bg-accent/30 rounded-lg">
                    {/* Monthly Calendar View */}
                    <div className="space-y-4">
                      {/* Month Header with Navigation */}
                      <div className="flex items-center justify-between">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setCalendarDate(new Date(calendarDate.getFullYear(), calendarDate.getMonth() - 1, 1))}
                          className="h-8 w-8 p-0"
                        >
                          <ChevronLeft className="h-4 w-4" />
                        </Button>
                        <h6 className="text-lg font-semibold text-foreground">
                          {calendarDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                        </h6>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setCalendarDate(new Date(calendarDate.getFullYear(), calendarDate.getMonth() + 1, 1))}
                          className="h-8 w-8 p-0"
                        >
                          <ChevronRight className="h-4 w-4" />
                        </Button>
                      </div>
                      
                      {/* Days of Week Header */}
                      <div className="grid grid-cols-7 gap-2">
                        {['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'].map((dayName) => (
                          <div key={dayName} className="text-center p-2 font-medium text-sm text-muted-foreground border-b border-border">
                            {dayName.slice(0, 3)}
                          </div>
                        ))}
                      </div>
                      
                      {/* Calendar Grid */}
                      <div className="grid grid-cols-7 gap-2">
                        {(() => {
                          const classroomSession = formData.classroomSessions[0];
                          const oneOnOneSession = formData.oneOnOneSessions[0];
                          const currentMonth = calendarDate.getMonth();
                          const currentYear = calendarDate.getFullYear();
                          const firstDay = new Date(currentYear, currentMonth, 1);
                          const lastDay = new Date(currentYear, currentMonth + 1, 0);
                          const daysInMonth = lastDay.getDate();
                          const startingDayOfWeek = firstDay.getDay();
                          
                          const calendarDays = [];
                          
                          // Previous month's trailing days
                          const prevMonth = new Date(currentYear, currentMonth - 1, 0);
                          for (let i = startingDayOfWeek - 1; i >= 0; i--) {
                            const dayDate = prevMonth.getDate() - i;
                            calendarDays.push({ date: dayDate, isCurrentMonth: false, isNextMonth: false });
                          }
                          
                          // Current month days
                          for (let day = 1; day <= daysInMonth; day++) {
                            calendarDays.push({ date: day, isCurrentMonth: true, isNextMonth: false });
                          }
                          
                          // Next month's leading days
                          const remainingDays = 42 - calendarDays.length; // 6 weeks * 7 days
                          for (let day = 1; day <= remainingDays; day++) {
                            calendarDays.push({ date: day, isCurrentMonth: false, isNextMonth: true });
                          }
                          
                          return calendarDays.map((calendarDay, index) => {
                            const dayDate = new Date(
                              calendarDay.isNextMonth ? currentYear : calendarDay.isCurrentMonth ? currentYear : currentYear,
                              calendarDay.isNextMonth ? currentMonth + 1 : calendarDay.isCurrentMonth ? currentMonth : currentMonth - 1,
                              calendarDay.date
                            );
                            const dayName = dayDate.toLocaleDateString('en-US', { weekday: 'long' });
                            
                            // Check both session types with recurring logic
                            const isClassroomDay = classroomSession?.daysOfWeek.includes(dayName);
                            const isOneOnOneDay = oneOnOneSession?.daysOfWeek.includes(dayName);
                            const isToday = dayDate.toDateString() === new Date().toDateString();
                            const isPastDate = dayDate < new Date(new Date().setHours(0, 0, 0, 0));
                            
                            // Handle recurring sessions - if recurring is enabled, show sessions even after the calendar month
                            let isAfterClassroomStart = true;
                            let isAfterOneOnOneStart = true;
                            
                            if (classroomSession?.startDate) {
                              const startDate = new Date(classroomSession.startDate);
                              if (classroomSession.recurring) {
                                // For recurring sessions, only check if the day is after the start date
                                isAfterClassroomStart = dayDate >= startDate;
                              } else {
                                // For non-recurring sessions, only show in the start month
                                isAfterClassroomStart = dayDate >= startDate && 
                                  dayDate.getMonth() === startDate.getMonth() && 
                                  dayDate.getFullYear() === startDate.getFullYear();
                              }
                            }
                            
                            if (oneOnOneSession?.startDate) {
                              const startDate = new Date(oneOnOneSession.startDate);
                              if (oneOnOneSession.recurring) {
                                // For recurring sessions, only check if the day is after the start date
                                isAfterOneOnOneStart = dayDate >= startDate;
                              } else {
                                // For non-recurring sessions, only show in the start month
                                isAfterOneOnOneStart = dayDate >= startDate && 
                                  dayDate.getMonth() === startDate.getMonth() && 
                                  dayDate.getFullYear() === startDate.getFullYear();
                              }
                            }
                            
                            return (
                              <div 
                                key={index} 
                                className={`h-24 border border-border rounded-md relative ${
                                  !calendarDay.isCurrentMonth ? 'opacity-30' : ''
                                }`}
                              >
                                {/* Day Number */}
                                <div className={`absolute top-1 left-2 text-sm font-medium ${
                                  isToday ? 'text-primary' : calendarDay.isCurrentMonth ? 'text-foreground' : 'text-muted-foreground'
                                }`}>
                                  {calendarDay.date}
                                  {isToday && (
                                    <div className="w-1 h-1 bg-primary rounded-full absolute -bottom-1 left-1/2 transform -translate-x-1/2"></div>
                                  )}
                                </div>
                                
                                {/* Session Blocks */}
                                <div className="absolute inset-1 top-6 flex flex-col gap-1">
                                  {/* Classroom Session Block */}
                                  {isClassroomDay && calendarDay.isCurrentMonth && !isPastDate && isAfterClassroomStart && (
                                    <div className="flex-1">
                                      {classroomSession.startTime && classroomSession.endTime ? (
                                        <div className="bg-primary text-primary-foreground rounded-sm p-1 h-full flex flex-col justify-center text-center">
                                          <div className="text-xs font-medium leading-tight">
                                            Classroom{classroomSession.recurring ? ' ♻' : ''}
                                          </div>
                                          <div className="text-xs opacity-90 leading-tight">
                                            {classroomSession.startTime.slice(0, 5)} - {classroomSession.endTime.slice(0, 5)}
                                          </div>
                                        </div>
                                      ) : (
                                        <div className="bg-accent border border-dashed border-primary rounded-sm p-1 h-full flex items-center justify-center">
                                          <div className="text-xs text-muted-foreground text-center leading-tight">
                                            Classroom{classroomSession.recurring ? ' ♻' : ''}
                                          </div>
                                        </div>
                                      )}
                                    </div>
                                  )}
                                  
                                  {/* 1-on-1 Session Block */}
                                  {isOneOnOneDay && calendarDay.isCurrentMonth && !isPastDate && isAfterOneOnOneStart && (
                                    <div className="flex-1">
                                      {oneOnOneSession.startTime && oneOnOneSession.endTime ? (
                                        <div className="bg-emerald-500 text-white rounded-sm p-1 h-full flex flex-col justify-center text-center">
                                          <div className="text-xs font-medium leading-tight">
                                            1-on-1{oneOnOneSession.recurring ? ' ♻' : ''}
                                          </div>
                                          <div className="text-xs opacity-90 leading-tight">
                                            {oneOnOneSession.startTime.slice(0, 5)} - {oneOnOneSession.endTime.slice(0, 5)}
                                          </div>
                                        </div>
                                      ) : (
                                        <div className="bg-accent border border-dashed border-emerald-500 rounded-sm p-1 h-full flex items-center justify-center">
                                          <div className="text-xs text-muted-foreground text-center leading-tight">
                                            1-on-1{oneOnOneSession.recurring ? ' ♻' : ''}
                                          </div>
                                        </div>
                                      )}
                                    </div>
                                  )}
                                </div>
                              </div>
                            );
                          });
                        })()}
                      </div>
                      
                      {/* Legend */}
                      <div className="flex justify-center gap-6 pt-4">
                        {formData.sessionTypes.includes('classroom') && (
                          <div className="flex items-center gap-2">
                            <div className="w-4 h-4 bg-primary rounded"></div>
                            <span className="text-sm text-muted-foreground">Classroom Sessions</span>
                          </div>
                        )}
                        {formData.sessionTypes.includes('oneOnOne') && (
                          <div className="flex items-center gap-2">
                            <div className="w-4 h-4 bg-emerald-500 rounded"></div>
                            <span className="text-sm text-muted-foreground">1-on-1 Sessions</span>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    {/* Session Summary */}
                    <div className="mt-6 p-4 bg-background/50 rounded-lg space-y-4">
                      {formData.sessionTypes.includes('classroom') && formData.classroomSessions[0] && (
                        <div>
                          <h6 className="text-sm font-medium text-foreground mb-2">
                            Classroom Sessions {formData.classroomSessions[0].recurring && <span className="text-primary">♻ Recurring</span>}
                          </h6>
                          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
                            <div className="text-center">
                              <div className="text-muted-foreground">Start Date</div>
                              <div className="font-medium">{formData.classroomSessions[0].startDate || 'Not set'}</div>
                            </div>
                            <div className="text-center">
                              <div className="text-muted-foreground">Selected Days</div>
                              <div className="font-medium">{formData.classroomSessions[0].daysOfWeek.join(', ')}</div>
                            </div>
                            {formData.classroomSessions[0].startTime && formData.classroomSessions[0].endTime && (
                              <>
                                <div className="text-center">
                                  <div className="text-muted-foreground">Session Time</div>
                                  <div className="font-medium">{formData.classroomSessions[0].startTime} - {formData.classroomSessions[0].endTime}</div>
                                </div>
                                <div className="text-center">
                                  <div className="text-muted-foreground">Duration</div>
                                  <div className="font-medium">{calculateSessionDuration(formData.classroomSessions[0].startTime, formData.classroomSessions[0].endTime)}</div>
                                </div>
                              </>
                            )}
                          </div>
                        </div>
                      )}
                      
                      {formData.sessionTypes.includes('oneOnOne') && formData.oneOnOneSessions[0] && (
                        <div>
                          <h6 className="text-sm font-medium text-foreground mb-2">
                            1-on-1 Sessions {formData.oneOnOneSessions[0].recurring && <span className="text-emerald-500">♻ Recurring</span>}
                          </h6>
                          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
                            <div className="text-center">
                              <div className="text-muted-foreground">Start Date</div>
                              <div className="font-medium">{formData.oneOnOneSessions[0].startDate || 'Not set'}</div>
                            </div>
                            <div className="text-center">
                              <div className="text-muted-foreground">Available Days</div>
                              <div className="font-medium">{formData.oneOnOneSessions[0].daysOfWeek.join(', ')}</div>
                            </div>
                            {formData.oneOnOneSessions[0].startTime && formData.oneOnOneSessions[0].endTime && (
                              <>
                                <div className="text-center">
                                  <div className="text-muted-foreground">Session Time</div>
                                  <div className="font-medium">{formData.oneOnOneSessions[0].startTime} - {formData.oneOnOneSessions[0].endTime}</div>
                                </div>
                                <div className="text-center">
                                  <div className="text-muted-foreground">Duration</div>
                                  <div className="font-medium">{calculateSessionDuration(formData.oneOnOneSessions[0].startTime, formData.oneOnOneSessions[0].endTime)}</div>
                                </div>
                              </>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-foreground">Upload Course Media</h3>
            
            <div className="space-y-6">
              <Card className="p-6">
                <div className="space-y-4">
                  <div className="text-center space-y-4">
                    <div className="w-12 h-12 bg-accent rounded-lg flex items-center justify-center mx-auto">
                      <Image className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-medium text-foreground">Course Images</h4>
                      <p className="text-sm text-muted-foreground">Upload promotional images</p>
                    </div>
                    <div>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleFileUpload('images', e.target.files)}
                        className="hidden"
                        id="image-upload"
                      />
                      <label
                        htmlFor="image-upload"
                        className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 cursor-pointer"
                      >
                        Choose Images
                      </label>
                    </div>
                  </div>

                  {formData.images.length > 0 && (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium text-foreground">
                          Selected Images ({formData.images.length})
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Drag to reorder
                        </p>
                      </div>
                      
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {formData.images.map((image, index) => (
                          <div
                            key={image.id}
                            className="relative group bg-muted rounded-lg overflow-hidden aspect-square"
                            draggable
                            onDragStart={(e) => {
                              e.dataTransfer.setData('text/plain', index.toString());
                            }}
                            onDragOver={(e) => e.preventDefault()}
                            onDrop={(e) => {
                              e.preventDefault();
                              const fromIndex = parseInt(e.dataTransfer.getData('text/plain'));
                              reorderImages(fromIndex, index);
                            }}
                          >
                            <img
                              src={image.croppedPreview || image.preview}
                              alt={`Upload ${index + 1}`}
                              className="w-full h-full object-cover"
                            />
                            
                            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                              <Button
                                size="sm"
                                variant="secondary"
                                onClick={() => openCropModal(image.id)}
                                className="h-8 w-8 p-0"
                              >
                                <Crop className="h-4 w-4" />
                              </Button>
                              <Button
                                size="sm"
                                variant="destructive"
                                onClick={() => removeImage(image.id)}
                                className="h-8 w-8 p-0"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                            
                            <div className="absolute top-2 left-2 bg-primary text-primary-foreground text-xs px-2 py-1 rounded">
                              {index + 1}
                            </div>
                            
                            <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                              <GripVertical className="h-4 w-4 text-white" />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </Card>

              <Card className="p-6">
                <div className="text-center space-y-4">
                  <div className="w-12 h-12 bg-accent rounded-lg flex items-center justify-center mx-auto">
                    <Play className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-medium text-foreground">Course Videos</h4>
                    <p className="text-sm text-muted-foreground">Upload promotional videos</p>
                  </div>
                  <div>
                    <input
                      type="file"
                      accept="video/*"
                      multiple
                      onChange={(e) => handleFileUpload('videos', e.target.files)}
                      className="hidden"
                      id="video-upload"
                    />
                    <label
                      htmlFor="video-upload"
                      className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 cursor-pointer"
                    >
                      Choose Videos
                    </label>
                  </div>
                  {formData.videos.length > 0 && (
                    <p className="text-xs text-muted-foreground">
                      {formData.videos.length} video(s) selected
                    </p>
                  )}
                </div>
              </Card>
            </div>
          </div>
        );

      case 5:
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-foreground">Review Your Course</h3>
            
            <Card className="p-6 space-y-6">
              <div>
                <h4 className="font-medium text-foreground mb-2">General Information</h4>
                <div className="text-sm text-muted-foreground space-y-1">
                  <p><span className="font-medium">Title:</span> {formData.title || 'Not specified'}</p>
                  <p><span className="font-medium">Subtitle:</span> {formData.subtitle || 'Not specified'}</p>
                  <p><span className="font-medium">Level:</span> {formData.level || 'Not specified'}</p>
                  <p><span className="font-medium">Language:</span> {formData.language || 'Not specified'}</p>
                  <p><span className="font-medium">Category:</span> {formData.category || 'Not specified'}</p>
                  <p><span className="font-medium">Duration:</span> {
                    formData.durationHours || formData.durationMinutes 
                      ? `${formData.durationHours || '0'} hours ${formData.durationMinutes || '0'} minutes`
                      : 'Not specified'
                  }</p>
                </div>
              </div>

              <Separator />

              <div>
                <h4 className="font-medium text-foreground mb-2">Course Content</h4>
                <div className="text-sm text-muted-foreground">
                  <p><span className="font-medium">Modules:</span> {formData.modules.filter(m => m.title.trim()).length}</p>
                  <ul className="list-disc list-inside mt-1 space-y-1">
                    {formData.modules.filter(m => m.title.trim()).map((module, index) => (
                      <li key={index}>
                        <span className="font-medium">{module.title}</span>
                        {module.subsections.length > 0 && (
                          <ul className="list-disc list-inside ml-4 mt-1">
                            {module.subsections.map((sub, subIndex) => (
                              <li key={subIndex} className="text-xs">
                                {sub.title} ({sub.type})
                                {sub.timeMinutes && <span className="text-muted-foreground"> - {sub.timeMinutes} min</span>}
                              </li>
                            ))}
                          </ul>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <Separator />

              <div>
                <h4 className="font-medium text-foreground mb-2">Format & Sessions</h4>
                <div className="text-sm text-muted-foreground space-y-3">
                  <p><span className="font-medium">Format:</span> {
                    formData.sessionTypes.length > 0 
                      ? formData.sessionTypes.map(type => 
                          type === 'classroom' ? 'Classroom Sessions' : '1-on-1 Sessions'
                        ).join(', ')
                      : 'Not specified'
                  }</p>
                  
                  {/* Classroom Session Details */}
                  {formData.sessionTypes.includes('classroom') && formData.classroomSessions[0] && (
                    <div className="pl-4 border-l-2 border-primary/20">
                      <p className="font-medium text-primary mb-1">Classroom Session Details:</p>
                      <div className="space-y-1">
                        <p><span className="font-medium">Start Date:</span> {formData.classroomSessions[0].startDate || 'Not set'}</p>
                        <p><span className="font-medium">Days:</span> {formData.classroomSessions[0].daysOfWeek.join(', ') || 'None selected'}</p>
                        {formData.classroomSessions[0].startTime && formData.classroomSessions[0].endTime && (
                          <p><span className="font-medium">Time:</span> {formData.classroomSessions[0].startTime} - {formData.classroomSessions[0].endTime}</p>
                        )}
                        <p><span className="font-medium">Recurring:</span> {formData.classroomSessions[0].recurring ? 'Yes' : 'No'}</p>
                      </div>
                    </div>
                  )}
                  
                  {/* 1-on-1 Session Details */}
                  {formData.sessionTypes.includes('oneOnOne') && formData.oneOnOneSessions[0] && (
                    <div className="pl-4 border-l-2 border-emerald-500/20">
                      <p className="font-medium text-emerald-600 mb-1">1-on-1 Session Details:</p>
                      <div className="space-y-1">
                        <p><span className="font-medium">Start Date:</span> {formData.oneOnOneSessions[0].startDate || 'Not set'}</p>
                        <p><span className="font-medium">Available Days:</span> {formData.oneOnOneSessions[0].daysOfWeek.join(', ') || 'None selected'}</p>
                        {formData.oneOnOneSessions[0].startTime && formData.oneOnOneSessions[0].endTime && (
                          <p><span className="font-medium">Time:</span> {formData.oneOnOneSessions[0].startTime} - {formData.oneOnOneSessions[0].endTime}</p>
                        )}
                        <p><span className="font-medium">Recurring:</span> {formData.oneOnOneSessions[0].recurring ? 'Yes' : 'No'}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <Separator />

              <div>
                <h4 className="font-medium text-foreground mb-2">Media</h4>
                <div className="text-sm text-muted-foreground space-y-1">
                  <p><span className="font-medium">Images:</span> {formData.images.length} uploaded</p>
                  <p><span className="font-medium">Videos:</span> {formData.videos.length} uploaded</p>
                </div>
              </div>
            </Card>
          </div>
        );

      default:
        return null;
    }
  };

  const isStepValid = () => {
    switch (currentStep) {
      case 1:
        return formData.title && formData.description && formData.level && formData.language && formData.category;
      case 2:
        return formData.modules.some(module => module.title.trim());
      case 3:
        return formData.sessionTypes.length > 0;
      case 4:
        return true; // Optional step
      case 5:
        return true;
      default:
        return false;
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleCloseModal}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader className="pb-6 sticky top-0 bg-background z-10 border-b border-border">
          <DialogTitle className="text-2xl font-bold text-center bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">
            Create New Course
          </DialogTitle>
          
        </DialogHeader>

        <div className="flex-1 overflow-auto">
          <div className="px-2 pt-6">
            {renderStepContent()}
          </div>
        </div>

        <div className="flex justify-between items-center pt-6 border-t border-border">
          <Button 
            onClick={prevStep} 
            variant="outline" 
            disabled={currentStep === 1}
            className="transition-all duration-200"
          >
            Previous
          </Button>
          
          <div className="flex gap-3">
            {!isEditingPublished && (
              <Button 
                onClick={handleSaveAsDraft}
                variant="outline"
                className="transition-all duration-200"
              >
                {isEditingDraft ? 'Update Draft' : 'Save as Draft'}
              </Button>
            )}
            
            {currentStep < 5 ? (
              <Button 
                onClick={nextStep} 
                disabled={!isStepValid()}
                className="transition-all duration-200"
              >
                Next Step
              </Button>
            ) : (
              <Button 
                onClick={handleSubmit}
                className="bg-gradient-to-r from-primary to-primary-glow hover:from-primary/90 hover:to-primary-glow/90 transition-all duration-200"
              >
                {isEditingPublished ? 'Update Course' : isEditingDraft ? 'Publish Course' : 'Publish Course'}
              </Button>
            )}
          </div>
        </div>
      </DialogContent>

      {/* Crop Modal */}
      <Dialog open={cropModalOpen} onOpenChange={setCropModalOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-auto">
          <DialogHeader>
            <DialogTitle>Crop Image</DialogTitle>
          </DialogHeader>
          
          {currentImageToCrop && (
            <div className="space-y-4">
              <div className="flex justify-center">
                <ReactCrop
                  crop={crop}
                  onChange={(c) => setCrop(c)}
                  aspect={16 / 9}
                  minWidth={100}
                  minHeight={100}
                >
                  <img
                    ref={setImgRef}
                    src={formData.images.find(img => img.id === currentImageToCrop)?.croppedPreview || 
                         formData.images.find(img => img.id === currentImageToCrop)?.preview}
                    alt="Crop preview"
                    className="max-w-full max-h-[400px] object-contain"
                  />
                </ReactCrop>
              </div>
              
              <div className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  onClick={() => {
                    setCropModalOpen(false);
                    setCurrentImageToCrop(null);
                  }}
                >
                  Cancel
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    // Save without cropping - just close the modal
                    setCropModalOpen(false);
                    setCurrentImageToCrop(null);
                  }}
                >
                  Save without cropping
                </Button>
                <Button
                  onClick={applyCrop}
                  disabled={!crop?.width || !crop?.height}
                >
                  Apply Crop
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Close Confirmation Dialog */}
      <AlertDialog open={showCloseConfirmation} onOpenChange={setShowCloseConfirmation}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure you want to close?</AlertDialogTitle>
            <AlertDialogDescription>
              You have unsaved changes. If you close now, all your progress will be lost.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Continue editing</AlertDialogCancel>
            <AlertDialogAction onClick={confirmClose}>
              Close without saving
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Dialog>
  );
}