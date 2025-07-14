import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { CheckCircle, Upload, Play, Image, FileText, Settings, BookOpen, Eye, Plus, X, Clock } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';
import { Calendar } from '@/components/ui/calendar';
import { useToast } from '@/hooks/use-toast';

interface BookingModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
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
  startTime: string;
  endTime: string;
  daysOfWeek: string[];
  recurring: boolean;
}

interface OneOnOneSession {
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
  images: File[];
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

export function BookingModal({ open, onOpenChange }: BookingModalProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<FormData>({
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
  });
  const { toast } = useToast();

  const updateFormData = (field: keyof FormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
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
      const fileArray = Array.from(files);
      setFormData(prev => ({ ...prev, [type]: [...prev[type], ...fileArray] }));
    }
  };

  const addClassroomSession = () => {
    const newSession: ClassroomSession = {
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
          startTime: '',
          endTime: '',
          daysOfWeek: [],
          recurring: false
        }];
      } else if (type === 'oneOnOne') {
        newOneOnOneSessions = [...formData.oneOnOneSessions, {
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
    toast({
      title: "Course Created Successfully!",
      description: "Your course has been submitted for review.",
    });
    onOpenChange(false);
    setCurrentStep(1);
    setFormData({
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
    });
  };

  const StepIndicator = () => (
    <div className="flex items-center justify-center mb-8">
      {steps.map((step, index) => {
        const isCompleted = step.id < currentStep;
        const isCurrent = step.id === currentStep;
        const StepIcon = step.icon;
        
        return (
          <React.Fragment key={step.id}>
            <div className="flex flex-col items-center">
              <div
                className={`
                  w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300
                  ${isCompleted ? 'bg-primary text-primary-foreground shadow-lg' : 
                    isCurrent ? 'bg-primary text-primary-foreground shadow-lg scale-110' : 
                    'bg-muted text-muted-foreground'}
                `}
              >
                {isCompleted ? <CheckCircle className="w-5 h-5" /> : <StepIcon className="w-5 h-5" />}
              </div>
              <p className={`text-xs mt-2 font-medium ${isCurrent ? 'text-primary' : 'text-muted-foreground'}`}>
                {step.title}
              </p>
            </div>
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
                <Label htmlFor="subtitle">Course Subtitle</Label>
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
              <Label htmlFor="description">Course Description *</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => updateFormData('description', e.target.value)}
                placeholder="Describe what students will learn in this course"
                className="min-h-32 transition-all duration-200 focus:ring-2 focus:ring-primary/20"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="objectives">Course Objectives</Label>
              <Textarea
                id="objectives"
                value={formData.objectives}
                onChange={(e) => updateFormData('objectives', e.target.value)}
                placeholder="List the key learning objectives"
                className="transition-all duration-200 focus:ring-2 focus:ring-primary/20"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="requirements">Requirements</Label>
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
                      <Input
                        value={module.title}
                        onChange={(e) => updateModule(moduleIndex, 'title', e.target.value)}
                        placeholder={`Enter module ${moduleIndex + 1} title`}
                        className="flex-1 transition-all duration-200 focus:ring-2 focus:ring-primary/20"
                      />
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
                        <Button 
                          onClick={() => addSubSection(moduleIndex)} 
                          variant="outline" 
                          size="sm"
                        >
                          Add Subsection
                        </Button>
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
                                  <Input
                                    value={subsection.title}
                                    onChange={(e) => updateSubSection(moduleIndex, subIndex, 'title', e.target.value)}
                                    placeholder="Subsection title"
                                    className="flex-1 h-9"
                                  />
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
                                <Textarea
                                  value={subsection.description}
                                  onChange={(e) => updateSubSection(moduleIndex, subIndex, 'description', e.target.value)}
                                  placeholder="Subsection description"
                                  className="text-sm min-h-20"
                                />
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
                  <Button onClick={addClassroomSession} variant="outline" size="sm">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Session
                  </Button>
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

                      {session.startTime && session.endTime && (
                        <div className="flex items-center gap-2 p-3 bg-accent/50 rounded-lg">
                          <Clock className="w-4 h-4 text-primary" />
                          <span className="text-sm font-medium">
                            Session Duration: {calculateSessionDuration(session.startTime, session.endTime)}
                          </span>
                        </div>
                      )}

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

                      {session.daysOfWeek.length > 0 && (session.startTime || session.endTime) && (
                        <div className="space-y-4">
                          <h5 className="text-sm font-medium text-foreground text-center">Session Preview</h5>
                          <div className="flex justify-center">
                            <div className="w-full max-w-6xl p-6 bg-accent/30 rounded-lg">
                              {/* Monthly Calendar View */}
                              <div className="space-y-4">
                                {/* Month Header */}
                                <div className="text-center">
                                  <h6 className="text-lg font-semibold text-foreground">
                                    {new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                                  </h6>
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
                                    const today = new Date();
                                    const currentMonth = today.getMonth();
                                    const currentYear = today.getFullYear();
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
                                          const isSessionDay = session.daysOfWeek.includes(dayName);
                                          const isToday = dayDate.toDateString() === new Date().toDateString();
                                          const isPastDate = dayDate < new Date(new Date().setHours(0, 0, 0, 0));
                                          
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
                                              
                                              {/* Session Block - Only show for current and future dates */}
                                              {isSessionDay && calendarDay.isCurrentMonth && !isPastDate && (
                                                <div className="absolute inset-1 top-6">
                                                  {session.startTime && session.endTime ? (
                                                    <div className="bg-primary text-primary-foreground rounded-sm p-1 h-full flex flex-col justify-center text-center">
                                                      <div className="text-xs font-medium leading-tight">
                                                        Session
                                                      </div>
                                                      <div className="text-xs opacity-90 leading-tight">
                                                        {session.startTime.slice(0, 5)}
                                                      </div>
                                                      <div className="text-xs opacity-75 leading-tight">
                                                        {session.endTime.slice(0, 5)}
                                                      </div>
                                                    </div>
                                                  ) : (
                                                    <div className="bg-accent border border-dashed border-primary rounded-sm p-1 h-full flex items-center justify-center">
                                                      <div className="text-xs text-muted-foreground text-center leading-tight">
                                                        Scheduled
                                                      </div>
                                                    </div>
                                                  )}
                                                </div>
                                              )}
                                        </div>
                                      );
                                    });
                                  })()}
                                </div>
                              </div>
                              
                              {/* Session Summary */}
                              <div className="mt-6 p-4 bg-background/50 rounded-lg">
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                                  <div className="text-center">
                                    <div className="text-muted-foreground">Selected Days</div>
                                    <div className="font-medium">{session.daysOfWeek.join(', ')}</div>
                                  </div>
                                  {session.startTime && session.endTime && (
                                    <>
                                      <div className="text-center">
                                        <div className="text-muted-foreground">Session Time</div>
                                        <div className="font-medium">{session.startTime} - {session.endTime}</div>
                                      </div>
                                      <div className="text-center">
                                        <div className="text-muted-foreground">Duration</div>
                                        <div className="font-medium">{calculateSessionDuration(session.startTime, session.endTime)}</div>
                                      </div>
                                    </>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
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

                      {session.startTime && session.endTime && (
                        <div className="flex items-center gap-2 p-3 bg-accent/50 rounded-lg">
                          <Clock className="w-4 h-4 text-primary" />
                          <span className="text-sm font-medium">
                            Session Duration: {calculateSessionDuration(session.startTime, session.endTime)}
                          </span>
                        </div>
                      )}

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
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-foreground">Upload Course Media</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="p-6">
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
                      multiple
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
                  {formData.images.length > 0 && (
                    <p className="text-xs text-muted-foreground">
                      {formData.images.length} image(s) selected
                    </p>
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
                <h4 className="font-medium text-foreground mb-2">Format & Media</h4>
                <div className="text-sm text-muted-foreground space-y-1">
                  <p><span className="font-medium">Format:</span> {formData.format || 'Not specified'}</p>
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
        return formData.format;
      case 4:
        return true; // Optional step
      case 5:
        return true;
      default:
        return false;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader className="pb-6">
          <DialogTitle className="text-2xl font-bold text-center bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">
            Create New Course
          </DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-auto">
          <StepIndicator />
          
          <div className="px-2">
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
          
          <div className="flex gap-2">
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
                Create Course
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}