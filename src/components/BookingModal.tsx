import React, { useState } from 'react';
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Input,
  Select,
  SelectItem,
  Textarea,
} from "@nextui-org/react";
import { toast } from 'react-hot-toast';
import { useRouter } from 'next/navigation';
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
  isOpen: boolean;
  onClose: () => void;
  userId: string | null | undefined;
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

const BookingModal: React.FC<BookingModalProps> = ({ isOpen, onClose, userId }) => {
  const [currentStep, setCurrentStep] = useState(1);
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
  const router = useRouter();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prevData => ({ ...prevData, [name]: value }));
  };

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prevData => ({ ...prevData, [name]: value }));
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    if (checked) {
      setFormData(prevData => ({
        ...prevData,
        sessionTypes: [...prevData.sessionTypes, name],
      }));
    } else {
      setFormData(prevData => ({
        ...prevData,
        sessionTypes: prevData.sessionTypes.filter(type => type !== name),
      }));
    }
  };

  const handleClassroomSessionChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prevData => ({
      ...prevData,
      classroomSessions: [{
        ...prevData.classroomSessions[0],
        [name]: type === 'checkbox' ? checked : value,
      }],
    }));
  };

  const handleOneOnOneSessionChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prevData => ({
      ...prevData,
      oneOnOneSessions: [{
        ...prevData.oneOnOneSessions[0],
        [name]: type === 'checkbox' ? checked : value,
      }],
    }));
  };

  const handleDayOfWeekChange = (e: React.ChangeEvent<HTMLInputElement>, sessionType: 'classroom' | 'oneOnOne') => {
    const { name, checked } = e.target;
    if (sessionType === 'classroom') {
      setFormData(prevData => ({
        ...prevData,
        classroomSessions: [{
          ...prevData.classroomSessions[0],
          daysOfWeek: checked
            ? [...prevData.classroomSessions[0].daysOfWeek, name]
            : prevData.classroomSessions[0].daysOfWeek.filter(day => day !== name),
        }],
      }));
    } else {
      setFormData(prevData => ({
        ...prevData,
        oneOnOneSessions: [{
          ...prevData.oneOnOneSessions[0],
          daysOfWeek: checked
            ? [...prevData.oneOnOneSessions[0].daysOfWeek, name]
            : prevData.oneOnOneSessions[0].daysOfWeek.filter(day => day !== name),
        }],
      }));
    }
  };

  const nextStep = () => {
    setCurrentStep(prevStep => prevStep + 1);
  };

  const handleSubmit = async () => {
    try {
      const response = await fetch('/api/courses', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          userId: userId,
        }),
      });

      if (response.ok) {
        toast.success('Course created successfully!');
        onClose();
        router.refresh();
      } else {
        toast.error('Failed to create course');
      }
    } catch (error) {
      console.error('Error creating course:', error);
      toast.error('Error creating course');
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="4xl">
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1">Create a New Course</ModalHeader>
            <ModalBody>
              {currentStep === 1 && (
                <div className="flex flex-col gap-4">
                  <Input
                    type="text"
                    label="Course Title"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                  />
                  <Select
                    label="Category"
                    name="category"
                    selectedKeys={[formData.category]}
                    onSelectionChange={(value) => setFormData(prevData => ({ ...prevData, category: String(value) }))}
                  >
                    <SelectItem key="Web Development" value="Web Development">Web Development</SelectItem>
                    <SelectItem key="Mobile Development" value="Mobile Development">Mobile Development</SelectItem>
                    <SelectItem key="Data Science" value="Data Science">Data Science</SelectItem>
                    <SelectItem key="Design" value="Design">Design</SelectItem>
                  </Select>
                  <Textarea
                    label="Description"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                  />
                  <Button onClick={nextStep}>Next</Button>
                </div>
              )}

              {currentStep === 2 && (
                <div className="flex flex-col gap-4">
                  <Input
                    type="number"
                    label="Price"
                    name="price"
                    value={formData.price}
                    onChange={handleInputChange}
                  />
                  <Input
                    type="number"
                    label="Max Students"
                    name="maxStudents"
                    value={formData.maxStudents}
                    onChange={handleInputChange}
                  />
                  <Input
                    type="text"
                    label="Duration"
                    name="duration"
                    value={formData.duration}
                    onChange={handleInputChange}
                  />
                  <div className="flex justify-between">
                    <Button onClick={() => setCurrentStep(1)}>Back</Button>
                    <Button onClick={nextStep}>Next</Button>
                  </div>
                </div>
              )}

              {currentStep === 3 && (
                <div className="flex flex-col gap-4">
                  <div>
                    <label className="flex items-center space-x-2">
                      <Input
                        type="checkbox"
                        name="classroom"
                        checked={formData.sessionTypes.includes('classroom')}
                        onChange={handleCheckboxChange}
                      />
                      <span>Classroom Sessions</span>
                    </label>
                    {formData.sessionTypes.includes('classroom') && (
                      <div className="ml-4 mt-2">
                        <Input
                          type="date"
                          label="Start Date"
                          name="startDate"
                          value={formData.classroomSessions[0].startDate}
                          onChange={handleClassroomSessionChange}
                        />
                        <label className="flex items-center space-x-2">
                          <Input
                            type="checkbox"
                            name="recurring"
                            checked={formData.classroomSessions[0].recurring}
                            onChange={handleClassroomSessionChange}
                          />
                          <span>Recurring</span>
                        </label>
                        {formData.classroomSessions[0].recurring && (
                          <div className="ml-4 mt-2">
                            <label className="block text-sm font-medium text-gray-700">Days of Week:</label>
                            <div className="mt-1 flex flex-wrap gap-2">
                              {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map(day => (
                                <label key={day} className="flex items-center space-x-1">
                                  <Input
                                    type="checkbox"
                                    name={day}
                                    checked={formData.classroomSessions[0].daysOfWeek.includes(day)}
                                    onChange={(e) => handleDayOfWeekChange(e, 'classroom')}
                                  />
                                  <span>{day}</span>
                                </label>
                              ))}
                            </div>
                          </div>
                        )}
                        <div className="flex gap-2">
                          <Input
                            type="time"
                            label="Start Time"
                            name="startTime"
                            value={formData.classroomSessions[0].startTime}
                            onChange={handleClassroomSessionChange}
                          />
                          <Input
                            type="time"
                            label="End Time"
                            name="endTime"
                            value={formData.classroomSessions[0].endTime}
                            onChange={handleClassroomSessionChange}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                  <div>
                    <label className="flex items-center space-x-2">
                      <Input
                        type="checkbox"
                        name="oneOnOne"
                        checked={formData.sessionTypes.includes('oneOnOne')}
                        onChange={handleCheckboxChange}
                      />
                      <span>1-on-1 Sessions</span>
                    </label>
                    {formData.sessionTypes.includes('oneOnOne') && (
                      <div className="ml-4 mt-2">
                        <Input
                          type="date"
                          label="Start Date"
                          name="startDate"
                          value={formData.oneOnOneSessions[0].startDate}
                          onChange={handleOneOnOneSessionChange}
                        />
                        <label className="flex items-center space-x-2">
                          <Input
                            type="checkbox"
                            name="recurring"
                            checked={formData.oneOnOneSessions[0].recurring}
                            onChange={handleOneOnOneSessionChange}
                          />
                          <span>Recurring</span>
                        </label>
                        {formData.oneOnOneSessions[0].recurring && (
                          <div className="ml-4 mt-2">
                            <label className="block text-sm font-medium text-gray-700">Available Days:</label>
                            <div className="mt-1 flex flex-wrap gap-2">
                              {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map(day => (
                                <label key={day} className="flex items-center space-x-1">
                                  <Input
                                    type="checkbox"
                                    name={day}
                                    checked={formData.oneOnOneSessions[0].daysOfWeek.includes(day)}
                                    onChange={(e) => handleDayOfWeekChange(e, 'oneOnOne')}
                                  />
                                  <span>{day}</span>
                                </label>
                              ))}
                            </div>
                          </div>
                        )}
                        <div className="flex gap-2">
                          <Input
                            type="time"
                            label="Start Time"
                            name="startTime"
                            value={formData.oneOnOneSessions[0].startTime}
                            onChange={handleOneOnOneSessionChange}
                          />
                          <Input
                            type="time"
                            label="End Time"
                            name="endTime"
                            value={formData.oneOnOneSessions[0].endTime}
                            onChange={handleOneOnOneSessionChange}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="flex justify-between">
                    <Button onClick={() => setCurrentStep(2)}>Back</Button>
                    <Button onClick={nextStep}>Next</Button>
                  </div>
                </div>
              )}

              {currentStep === 4 && (
                <div>
                  <div>
                    <Input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={(e) => {
                        if (e.target.files) {
                          const files = Array.from(e.target.files).map(file => file.name);
                          setFormData(prevData => ({ ...prevData, images: files }));
                        }
                      }}
                    />
                    <p className="text-sm text-gray-500">Upload Images</p>
                  </div>
                  <div>
                    <Input
                      type="file"
                      multiple
                      accept="video/*"
                      onChange={(e) => {
                        if (e.target.files) {
                          const files = Array.from(e.target.files).map(file => file.name);
                          setFormData(prevData => ({ ...prevData, videos: files }));
                        }
                      }}
                    />
                    <p className="text-sm text-gray-500">Upload Videos</p>
                  </div>
                  <div className="flex justify-between">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setCurrentStep(3)}
                      className="flex items-center gap-2"
                    >
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
                        
                        {/* Classroom Session Details - Enhanced */}
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
                        
                        {/* 1-on-1 Session Details - Enhanced */}
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
            </ModalBody>
            <ModalFooter>
              <Button color="danger" variant="flat" onPress={onClose}>
                Close
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};

export default BookingModal;
