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
import { CheckCircle, Upload, Play, Image, FileText, Settings, BookOpen, Eye } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface BookingModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface SubSection {
  title: string;
  description: string;
  type: 'lecture' | 'quiz' | 'assignment' | 'lab';
}

interface Module {
  title: string;
  subsections: SubSection[];
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
const subcategories = {
  'Technology': ['Web Development', 'Mobile Development', 'Data Science', 'AI & Machine Learning', 'Cybersecurity'],
  'Business': ['Entrepreneurship', 'Finance', 'Management', 'Sales', 'Strategy'],
  'Design': ['UI/UX Design', 'Graphic Design', 'Product Design', 'Animation', 'Photography'],
  'Marketing': ['Digital Marketing', 'Content Marketing', 'Social Media', 'SEO', 'Email Marketing'],
  'Personal Development': ['Leadership', 'Communication', 'Productivity', 'Mindfulness', 'Career Development'],
  'Health & Fitness': ['Nutrition', 'Workout', 'Mental Health', 'Yoga', 'Sports'],
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
      type: 'lecture'
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
                { value: 'video', title: 'Video Course', description: 'Pre-recorded video lessons', icon: Play },
                { value: 'live', title: 'Live Sessions', description: 'Real-time interactive sessions', icon: Settings },
                { value: 'mixed', title: 'Mixed Format', description: 'Combination of video and live', icon: BookOpen },
                { value: 'text', title: 'Text-based', description: 'Written content and exercises', icon: FileText },
              ].map((format) => {
                const FormatIcon = format.icon;
                return (
                  <Card 
                    key={format.value}
                    className={`p-6 cursor-pointer transition-all duration-200 hover:shadow-lg ${
                      formData.format === format.value ? 'ring-2 ring-primary bg-accent' : ''
                    }`}
                    onClick={() => updateFormData('format', format.value)}
                  >
                    <div className="flex items-start gap-4">
                      <div className={`p-2 rounded-lg ${
                        formData.format === format.value ? 'bg-primary text-primary-foreground' : 'bg-muted'
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