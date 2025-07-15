import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import {
  Calendar,
  ChevronLeft,
  Check,
  BookOpen,
  DollarSign,
  ImageIcon,
  Video,
  Users,
  User,
} from 'lucide-react';

interface BookingModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface CourseFormData {
  title: string;
  category: string;
  description: string;
  price: number;
  maxStudents: number;
  duration: string;
  sessionTypes: string[];
  classroomSessions: {
    startDate: string;
    recurring: boolean;
    daysOfWeek: string[];
    startTime: string;
    endTime: string;
  }[];
  oneOnOneSessions: {
    startDate: string;
    recurring: boolean;
    daysOfWeek: string[];
    startTime: string;
    endTime: string;
  }[];
  images: string[];
  videos: string[];
}

const BookingModal: React.FC<BookingModalProps> = ({ open, onOpenChange }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [formData, setFormData] = useState<CourseFormData>({
    title: '',
    category: '',
    description: '',
    price: 0,
    maxStudents: 0,
    duration: '',
    sessionTypes: [],
    classroomSessions: [{
      startDate: '',
      recurring: false,
      daysOfWeek: [],
      startTime: '',
      endTime: '',
    }],
    oneOnOneSessions: [{
      startDate: '',
      recurring: false,
      daysOfWeek: [],
      startTime: '',
      endTime: '',
    }],
    images: [],
    videos: [],
  });
  const { toast } = useToast();

  const resetForm = () => {
    setFormData({
      title: '',
      category: '',
      description: '',
      price: 0,
      maxStudents: 0,
      duration: '',
      sessionTypes: [],
      classroomSessions: [{
        startDate: '',
        recurring: false,
        daysOfWeek: [],
        startTime: '',
        endTime: '',
      }],
      oneOnOneSessions: [{
        startDate: '',
        recurring: false,
        daysOfWeek: [],
        startTime: '',
        endTime: '',
      }],
      images: [],
      videos: [],
    });
    setCurrentStep(1);
    setHasUnsavedChanges(false);
  };

  const handleOpenChange = (open: boolean) => {
    if (!open && hasUnsavedChanges) {
      setShowConfirmDialog(true);
    } else {
      if (!open) {
        resetForm();
      }
      onOpenChange(open);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prevData => ({ ...prevData, [name]: value }));
    setHasUnsavedChanges(true);
  };

  const handleClassroomSessionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prevData => ({
      ...prevData,
      classroomSessions: [{
        ...prevData.classroomSessions[0],
        [name]: type === 'checkbox' ? checked : value,
      }],
    }));
    setHasUnsavedChanges(true);
  };

  const handleOneOnOneSessionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prevData => ({
      ...prevData,
      oneOnOneSessions: [{
        ...prevData.oneOnOneSessions[0],
        [name]: type === 'checkbox' ? checked : value,
      }],
    }));
    setHasUnsavedChanges(true);
  };

  const handleDayOfWeekChange = (day: string, checked: boolean, sessionType: 'classroom' | 'oneOnOne') => {
    if (sessionType === 'classroom') {
      setFormData(prevData => ({
        ...prevData,
        classroomSessions: [{
          ...prevData.classroomSessions[0],
          daysOfWeek: checked
            ? [...prevData.classroomSessions[0].daysOfWeek, day]
            : prevData.classroomSessions[0].daysOfWeek.filter(d => d !== day),
        }],
      }));
    } else {
      setFormData(prevData => ({
        ...prevData,
        oneOnOneSessions: [{
          ...prevData.oneOnOneSessions[0],
          daysOfWeek: checked
            ? [...prevData.oneOnOneSessions[0].daysOfWeek, day]
            : prevData.oneOnOneSessions[0].daysOfWeek.filter(d => d !== day),
        }],
      }));
    }
    setHasUnsavedChanges(true);
  };

  const nextStep = () => {
    setCurrentStep(prevStep => prevStep + 1);
  };

  const handleSubmit = async () => {
    try {
      console.log('Course data:', formData);
      toast({
        title: "Course created successfully!",
        description: "Your course has been created and is ready for students.",
      });
      resetForm();
      onOpenChange(false);
    } catch (error) {
      console.error('Error creating course:', error);
      toast({
        title: "Error creating course",
        description: "Please try again later.",
        variant: "destructive",
      });
    }
  };

  return (
    <>
      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Create a New Course</DialogTitle>
          </DialogHeader>
          <div className="space-y-6">
            {currentStep === 1 && (
              <div className="space-y-4">
                <div>
                  <Label htmlFor="title">Course Title</Label>
                  <Input
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    placeholder="Enter course title"
                  />
                </div>
                <div>
                  <Label htmlFor="category">Category</Label>
                  <Select
                    value={formData.category}
                    onValueChange={(value) => {
                      setFormData(prevData => ({ ...prevData, category: value }));
                      setHasUnsavedChanges(true);
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Web Development">Web Development</SelectItem>
                      <SelectItem value="Mobile Development">Mobile Development</SelectItem>
                      <SelectItem value="Data Science">Data Science</SelectItem>
                      <SelectItem value="Design">Design</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    placeholder="Enter course description"
                  />
                </div>
                <Button onClick={nextStep} className="w-full">Next</Button>
              </div>
            )}

            {currentStep === 2 && (
              <div className="space-y-4">
                <div>
                  <Label htmlFor="price">Price ($)</Label>
                  <Input
                    id="price"
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleInputChange}
                    placeholder="0"
                  />
                </div>
                <div>
                  <Label htmlFor="maxStudents">Max Students</Label>
                  <Input
                    id="maxStudents"
                    type="number"
                    name="maxStudents"
                    value={formData.maxStudents}
                    onChange={handleInputChange}
                    placeholder="0"
                  />
                </div>
                <div>
                  <Label htmlFor="duration">Duration</Label>
                  <Input
                    id="duration"
                    name="duration"
                    value={formData.duration}
                    onChange={handleInputChange}
                    placeholder="e.g., 4 weeks, 2 months"
                  />
                </div>
                <div className="flex justify-between">
                  <Button variant="outline" onClick={() => setCurrentStep(1)}>Back</Button>
                  <Button onClick={nextStep}>Next</Button>
                </div>
              </div>
            )}

            {currentStep === 3 && (
              <div className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="classroom"
                      checked={formData.sessionTypes.includes('classroom')}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setFormData(prevData => ({
                            ...prevData,
                            sessionTypes: [...prevData.sessionTypes, 'classroom'],
                          }));
                        } else {
                          setFormData(prevData => ({
                            ...prevData,
                            sessionTypes: prevData.sessionTypes.filter(type => type !== 'classroom'),
                          }));
                        }
                        setHasUnsavedChanges(true);
                      }}
                    />
                    <Label htmlFor="classroom">Classroom Sessions</Label>
                  </div>
                  {formData.sessionTypes.includes('classroom') && (
                    <div className="ml-6 space-y-4 p-4 border rounded-lg">
                      <div>
                        <Label htmlFor="classroom-start-date">Start Date</Label>
                        <Input
                          id="classroom-start-date"
                          type="date"
                          name="startDate"
                          value={formData.classroomSessions[0].startDate}
                          onChange={handleClassroomSessionChange}
                        />
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="classroom-recurring"
                          checked={formData.classroomSessions[0].recurring}
                          onCheckedChange={(checked) => {
                            setFormData(prevData => ({
                              ...prevData,
                              classroomSessions: [{
                                ...prevData.classroomSessions[0],
                                recurring: checked as boolean,
                              }],
                            }));
                            setHasUnsavedChanges(true);
                          }}
                        />
                        <Label htmlFor="classroom-recurring">Recurring</Label>
                      </div>
                      {formData.classroomSessions[0].recurring && (
                        <div>
                          <Label>Days of Week:</Label>
                          <div className="flex flex-wrap gap-2 mt-2">
                            {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map(day => (
                              <div key={day} className="flex items-center space-x-1">
                                <Checkbox
                                  id={`classroom-${day}`}
                                  checked={formData.classroomSessions[0].daysOfWeek.includes(day)}
                                  onCheckedChange={(checked) => handleDayOfWeekChange(day, checked as boolean, 'classroom')}
                                />
                                <Label htmlFor={`classroom-${day}`} className="text-sm">{day}</Label>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="classroom-start-time">Start Time</Label>
                          <Input
                            id="classroom-start-time"
                            type="time"
                            name="startTime"
                            value={formData.classroomSessions[0].startTime}
                            onChange={handleClassroomSessionChange}
                          />
                        </div>
                        <div>
                          <Label htmlFor="classroom-end-time">End Time</Label>
                          <Input
                            id="classroom-end-time"
                            type="time"
                            name="endTime"
                            value={formData.classroomSessions[0].endTime}
                            onChange={handleClassroomSessionChange}
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="oneOnOne"
                      checked={formData.sessionTypes.includes('oneOnOne')}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setFormData(prevData => ({
                            ...prevData,
                            sessionTypes: [...prevData.sessionTypes, 'oneOnOne'],
                          }));
                        } else {
                          setFormData(prevData => ({
                            ...prevData,
                            sessionTypes: prevData.sessionTypes.filter(type => type !== 'oneOnOne'),
                          }));
                        }
                        setHasUnsavedChanges(true);
                      }}
                    />
                    <Label htmlFor="oneOnOne">1-on-1 Sessions</Label>
                  </div>
                  {formData.sessionTypes.includes('oneOnOne') && (
                    <div className="ml-6 space-y-4 p-4 border rounded-lg">
                      <div>
                        <Label htmlFor="oneOnOne-start-date">Start Date</Label>
                        <Input
                          id="oneOnOne-start-date"
                          type="date"
                          name="startDate"
                          value={formData.oneOnOneSessions[0].startDate}
                          onChange={handleOneOnOneSessionChange}
                        />
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="oneOnOne-recurring"
                          checked={formData.oneOnOneSessions[0].recurring}
                          onCheckedChange={(checked) => {
                            setFormData(prevData => ({
                              ...prevData,
                              oneOnOneSessions: [{
                                ...prevData.oneOnOneSessions[0],
                                recurring: checked as boolean,
                              }],
                            }));
                            setHasUnsavedChanges(true);
                          }}
                        />
                        <Label htmlFor="oneOnOne-recurring">Recurring</Label>
                      </div>
                      {formData.oneOnOneSessions[0].recurring && (
                        <div>
                          <Label>Available Days:</Label>
                          <div className="flex flex-wrap gap-2 mt-2">
                            {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map(day => (
                              <div key={day} className="flex items-center space-x-1">
                                <Checkbox
                                  id={`oneOnOne-${day}`}
                                  checked={formData.oneOnOneSessions[0].daysOfWeek.includes(day)}
                                  onCheckedChange={(checked) => handleDayOfWeekChange(day, checked as boolean, 'oneOnOne')}
                                />
                                <Label htmlFor={`oneOnOne-${day}`} className="text-sm">{day}</Label>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="oneOnOne-start-time">Start Time</Label>
                          <Input
                            id="oneOnOne-start-time"
                            type="time"
                            name="startTime"
                            value={formData.oneOnOneSessions[0].startTime}
                            onChange={handleOneOnOneSessionChange}
                          />
                        </div>
                        <div>
                          <Label htmlFor="oneOnOne-end-time">End Time</Label>
                          <Input
                            id="oneOnOne-end-time"
                            type="time"
                            name="endTime"
                            value={formData.oneOnOneSessions[0].endTime}
                            onChange={handleOneOnOneSessionChange}
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                <div className="flex justify-between">
                  <Button variant="outline" onClick={() => setCurrentStep(2)}>Back</Button>
                  <Button onClick={nextStep}>Next</Button>
                </div>
              </div>
            )}

            {currentStep === 4 && (
              <div className="space-y-4">
                <div>
                  <Label htmlFor="images">Upload Images</Label>
                  <Input
                    id="images"
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={(e) => {
                      if (e.target.files) {
                        const files = Array.from(e.target.files).map((file: File) => file.name);
                        setFormData(prevData => ({ ...prevData, images: files }));
                        setHasUnsavedChanges(true);
                      }
                    }}
                  />
                </div>
                <div>
                  <Label htmlFor="videos">Upload Videos</Label>
                  <Input
                    id="videos"
                    type="file"
                    multiple
                    accept="video/*"
                    onChange={(e) => {
                      if (e.target.files) {
                        const files = Array.from(e.target.files).map((file: File) => file.name);
                        setFormData(prevData => ({ ...prevData, videos: files }));
                        setHasUnsavedChanges(true);
                      }
                    }}
                  />
                </div>
                <div className="flex justify-between">
                  <Button variant="outline" onClick={() => setCurrentStep(3)} className="flex items-center gap-2">
                    <ChevronLeft className="h-4 w-4" />
                    Back to Sessions
                  </Button>
                  <Button onClick={nextStep}>Next</Button>
                </div>
              </div>
            )}

            {/* Step 5: Review */}
            {currentStep === 5 && (
              <div className="space-y-6">
                <div className="text-center mb-6">
                  <h3 className="text-xl font-semibold text-foreground mb-2">Review Your Course</h3>
                  <p className="text-sm text-muted-foreground">Please review all details before creating your course</p>
                </div>

                <div className="bg-muted/30 rounded-lg p-6 space-y-6">
                  {/* Basic Information */}
                  <div className="bg-background rounded-lg p-4 border">
                    <div className="flex items-center gap-2 mb-3">
                      <BookOpen className="h-5 w-5 text-primary" />
                      <h4 className="font-semibold text-foreground">Course Information</h4>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                      <div>
                        <span className="font-medium text-muted-foreground">Title:</span>
                        <p className="text-foreground mt-1">{formData.title || 'Not specified'}</p>
                      </div>
                      <div>
                        <span className="font-medium text-muted-foreground">Category:</span>
                        <p className="text-foreground mt-1">{formData.category || 'Not specified'}</p>
                      </div>
                      <div className="md:col-span-2">
                        <span className="font-medium text-muted-foreground">Description:</span>
                        <p className="text-foreground mt-1 leading-relaxed">{formData.description || 'Not specified'}</p>
                      </div>
                    </div>
                  </div>

                  {/* Pricing & Capacity */}
                  <div className="bg-background rounded-lg p-4 border">
                    <div className="flex items-center gap-2 mb-3">
                      <DollarSign className="h-5 w-5 text-green-600" />
                      <h4 className="font-semibold text-foreground">Pricing & Capacity</h4>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
                      <div>
                        <span className="font-medium text-muted-foreground">Price:</span>
                        <p className="text-foreground mt-1 font-semibold">${formData.price || '0'}</p>
                      </div>
                      <div>
                        <span className="font-medium text-muted-foreground">Max Students:</span>
                        <p className="text-foreground mt-1">{formData.maxStudents || 'Not specified'}</p>
                      </div>
                      <div>
                        <span className="font-medium text-muted-foreground">Duration:</span>
                        <p className="text-foreground mt-1">{formData.duration || 'Not specified'}</p>
                      </div>
                    </div>
                  </div>

                  {/* Course Format & Sessions */}
                  <div className="bg-background rounded-lg p-4 border">
                    <div className="flex items-center gap-2 mb-3">
                      <Calendar className="h-5 w-5 text-blue-600" />
                      <h4 className="font-semibold text-foreground">Course Format & Sessions</h4>
                    </div>
                    
                    <div className="space-y-4">
                      <div>
                        <span className="font-medium text-muted-foreground">Selected Formats:</span>
                        <div className="flex flex-wrap gap-2 mt-2">
                          {formData.sessionTypes.length > 0 ? 
                            formData.sessionTypes.map(type => (
                              <span key={type} className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary border border-primary/20">
                                {type === 'classroom' ? '👥 Classroom Sessions' : '👤 1-on-1 Sessions'}
                              </span>
                            )) : 
                            <span className="text-muted-foreground text-sm">No format selected</span>
                          }
                        </div>
                      </div>
                      
                      {/* Classroom Session Details */}
                      {formData.sessionTypes.includes('classroom') && formData.classroomSessions[0] && (
                        <div className="bg-primary/5 rounded-lg p-4 border border-primary/20">
                          <div className="flex items-center gap-2 mb-3">
                            <Users className="h-4 w-4 text-primary" />
                            <h5 className="font-medium text-primary">Classroom Session Details</h5>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                            <div>
                              <span className="font-medium text-muted-foreground">Start Date:</span>
                              <p className="text-foreground mt-1">{formData.classroomSessions[0].startDate || 'Not set'}</p>
                            </div>
                            <div>
                              <span className="font-medium text-muted-foreground">Recurring:</span>
                              <p className="text-foreground mt-1">{formData.classroomSessions[0].recurring ? '🔄 Yes' : '❌ No'}</p>
                            </div>
                            <div>
                              <span className="font-medium text-muted-foreground">Days of Week:</span>
                              <div className="flex flex-wrap gap-1 mt-1">
                                {formData.classroomSessions[0].daysOfWeek.length > 0 ? 
                                  formData.classroomSessions[0].daysOfWeek.map(day => (
                                    <span key={day} className="px-2 py-1 bg-primary/10 text-primary text-xs rounded">
                                      {day}
                                    </span>
                                  )) : 
                                  <span className="text-muted-foreground">None selected</span>
                                }
                              </div>
                            </div>
                            <div>
                              <span className="font-medium text-muted-foreground">Time Slot:</span>
                              <p className="text-foreground mt-1">
                                {formData.classroomSessions[0].startTime && formData.classroomSessions[0].endTime
                                  ? `🕐 ${formData.classroomSessions[0].startTime} - ${formData.classroomSessions[0].endTime}`
                                  : 'Not set'
                                }
                              </p>
                            </div>
                          </div>
                        </div>
                      )}
                      
                      {/* 1-on-1 Session Details */}
                      {formData.sessionTypes.includes('oneOnOne') && formData.oneOnOneSessions[0] && (
                        <div className="bg-emerald-50 rounded-lg p-4 border border-emerald-200">
                          <div className="flex items-center gap-2 mb-3">
                            <User className="h-4 w-4 text-emerald-600" />
                            <h5 className="font-medium text-emerald-700">1-on-1 Session Details</h5>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                            <div>
                              <span className="font-medium text-muted-foreground">Start Date:</span>
                              <p className="text-foreground mt-1">{formData.oneOnOneSessions[0].startDate || 'Not set'}</p>
                            </div>
                            <div>
                              <span className="font-medium text-muted-foreground">Recurring:</span>
                              <p className="text-foreground mt-1">{formData.oneOnOneSessions[0].recurring ? '🔄 Yes' : '❌ No'}</p>
                            </div>
                            <div>
                              <span className="font-medium text-muted-foreground">Available Days:</span>
                              <div className="flex flex-wrap gap-1 mt-1">
                                {formData.oneOnOneSessions[0].daysOfWeek.length > 0 ? 
                                  formData.oneOnOneSessions[0].daysOfWeek.map(day => (
                                    <span key={day} className="px-2 py-1 bg-emerald-100 text-emerald-700 text-xs rounded">
                                      {day}
                                    </span>
                                  )) : 
                                  <span className="text-muted-foreground">None selected</span>
                                }
                              </div>
                            </div>
                            <div>
                              <span className="font-medium text-muted-foreground">Time Slot:</span>
                              <p className="text-foreground mt-1">
                                {formData.oneOnOneSessions[0].startTime && formData.oneOnOneSessions[0].endTime
                                  ? `🕐 ${formData.oneOnOneSessions[0].startTime} - ${formData.oneOnOneSessions[0].endTime}`
                                  : 'Not set'
                                }
                              </p>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Media Files */}
                  <div className="bg-background rounded-lg p-4 border">
                    <div className="flex items-center gap-2 mb-3">
                      <ImageIcon className="h-5 w-5 text-purple-600" />
                      <h4 className="font-semibold text-foreground">Media Files</h4>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-100 rounded-lg">
                          <ImageIcon className="h-4 w-4 text-blue-600" />
                        </div>
                        <div>
                          <p className="font-medium text-foreground">{formData.images.length} Images</p>
                          <p className="text-xs text-muted-foreground">Uploaded successfully</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-red-100 rounded-lg">
                          <Video className="h-4 w-4 text-red-600" />
                        </div>
                        <div>
                          <p className="font-medium text-foreground">{formData.videos.length} Videos</p>
                          <p className="text-xs text-muted-foreground">Uploaded successfully</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex justify-between pt-4 border-t">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setCurrentStep(4)}
                    className="flex items-center gap-2"
                  >
                    <ChevronLeft className="h-4 w-4" />
                    Back to Media
                  </Button>
                  <Button
                    onClick={handleSubmit}
                    className="flex items-center gap-2 bg-primary hover:bg-primary/90"
                  >
                    <Check className="h-4 w-4" />
                    Create Course
                  </Button>
                </div>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Confirmation Dialog */}
      <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Unsaved Changes</DialogTitle>
          </DialogHeader>
          <p>Are you sure you want to close without saving? Your changes will be lost.</p>
          <div className="flex justify-end gap-2 mt-4">
            <Button variant="outline" onClick={() => setShowConfirmDialog(false)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                setShowConfirmDialog(false);
                resetForm();
                onOpenChange(false);
              }}
            >
              Close Without Saving
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default BookingModal;