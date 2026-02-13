import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import {
  DollarSign,
  Users,
  MousePointerClick,
  Star,
  MoreHorizontal,
  Edit,
  Eye,
  PauseCircle,
  PlayCircle,
  Archive,
  TrendingUp,
  TrendingDown,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  MessageCircle
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { PublishedCourse } from "@/types/published";
import CourseAnnouncements from "./CourseAnnouncements";
import CourseAttachments from "./CourseAttachments";

interface CourseMetricsCardProps {
  course: PublishedCourse;
  onEdit?: (course: PublishedCourse) => void;
  onStatusChange?: (courseId: string, status: PublishedCourse['status']) => void;
  onDelete?: (courseId: string) => void;
}

const CourseMetricsCard: React.FC<CourseMetricsCardProps> = ({
  course,
  onEdit,
  onStatusChange,
  onDelete
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const revenue = (course.enrollments || 0) * (course.price || 0);
  const clicks = course.clicks || 0;
  const enrollments = course.enrollments || 0;
  const isOneOnOne = course.sessionTypes.includes('one-on-one');
  
  const getStatusColor = (status: PublishedCourse['status']) => {
    switch (status) {
      case 'active':
        return 'bg-success/10 text-success border-success/20';
      case 'paused':
        return 'bg-warning/10 text-warning border-warning/20';
      case 'archived':
        return 'bg-muted text-muted-foreground border-border';
      default:
        return 'bg-muted text-muted-foreground border-border';
    }
  };

  return (
    <Card className="group relative overflow-hidden border shadow-md hover:shadow-xl transition-all duration-300 bg-card">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      
      <CardHeader className="relative pb-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2">
              <Badge 
                variant="outline" 
                className={`shadow-sm ${getStatusColor(course.status)}`}
              >
                {course.status}
              </Badge>
              <Badge variant="outline" className="shadow-sm">
                {course.level}
              </Badge>
            </div>
            <CardTitle className="text-xl font-bold line-clamp-2 mb-2 text-foreground group-hover:text-primary transition-colors">
              {course.title}
            </CardTitle>
            <p className="text-sm text-muted-foreground line-clamp-2">
              {course.subtitle}
            </p>
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsOpen(!isOpen)}
              className="gap-2 hover:bg-primary hover:text-primary-foreground transition-colors"
            >
              <Eye className="w-4 h-4" />
              <span className="hidden sm:inline">View Details</span>
              {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </Button>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0 hover:bg-primary/10 transition-colors">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48 bg-popover/95 backdrop-blur-sm border shadow-lg">
                <DropdownMenuItem onClick={() => onEdit?.(course)} className="cursor-pointer">
                  <Edit className="w-4 h-4 mr-2" />
                  Edit Course
                </DropdownMenuItem>
                {course.status === 'active' && (
                  <DropdownMenuItem onClick={() => onStatusChange?.(course.id, 'paused')} className="cursor-pointer">
                    <PauseCircle className="w-4 h-4 mr-2" />
                    Pause
                  </DropdownMenuItem>
                )}
                {course.status === 'paused' && (
                  <DropdownMenuItem onClick={() => onStatusChange?.(course.id, 'active')} className="cursor-pointer">
                    <PlayCircle className="w-4 h-4 mr-2" />
                    Activate
                  </DropdownMenuItem>
                )}
                <DropdownMenuItem onClick={() => onStatusChange?.(course.id, 'archived')} className="cursor-pointer">
                  <Archive className="w-4 h-4 mr-2" />
                  Archive
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={() => onDelete?.(course.id)}
                  className="text-destructive focus:text-destructive cursor-pointer"
                >
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="relative">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Metrics Grid */}
          <div className="grid grid-cols-2 gap-4 flex-1">
            {/* Revenue */}
            <div className="flex flex-col gap-2 p-3 rounded-lg bg-gradient-to-br from-success/5 to-transparent border border-success/10">
              <div className="flex items-center gap-2">
                <div className="p-1.5 bg-success/10 rounded">
                  <DollarSign className="w-4 h-4 text-success" />
                </div>
                <span className="text-xs font-medium text-muted-foreground">Revenue</span>
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-bold text-foreground">${revenue.toLocaleString()}</span>
                <TrendingUp className="w-4 h-4 text-success" />
              </div>
            </div>

            {/* Students */}
            <div className="flex flex-col gap-2 p-3 rounded-lg bg-gradient-to-br from-primary/5 to-transparent border border-primary/10">
              <div className="flex items-center gap-2">
                <div className="p-1.5 bg-primary/10 rounded">
                  <Users className="w-4 h-4 text-primary" />
                </div>
                <span className="text-xs font-medium text-muted-foreground">Students</span>
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-bold text-foreground">{enrollments.toLocaleString()}</span>
              </div>
            </div>

            {/* Clicks */}
            <div className="flex flex-col gap-2 p-3 rounded-lg bg-gradient-to-br from-accent/5 to-transparent border border-accent/10">
              <div className="flex items-center gap-2">
                <div className="p-1.5 bg-accent/10 rounded">
                  <MousePointerClick className="w-4 h-4 text-accent" />
                </div>
                <span className="text-xs font-medium text-muted-foreground">Clicks</span>
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-bold text-foreground">{clicks.toLocaleString()}</span>
              </div>
            </div>

            {/* Rating */}
            <div className="flex flex-col gap-2 p-3 rounded-lg bg-gradient-to-br from-warning/5 to-transparent border border-warning/10">
              <div className="flex items-center gap-2">
                <div className="p-1.5 bg-warning/10 rounded">
                  <Star className="w-4 h-4 text-warning fill-warning" />
                </div>
                <span className="text-xs font-medium text-muted-foreground">Rating</span>
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-bold text-foreground">
                  {course.rating > 0 ? course.rating.toFixed(1) : 'N/A'}
                </span>
                {course.reviews > 0 && (
                  <span className="text-xs text-muted-foreground">({course.reviews})</span>
                )}
              </div>
            </div>
          </div>

          {/* Announcements & Attachments */}
          <div className="lg:w-[280px] shrink-0 flex flex-col gap-3">
            <div className="lg:max-h-[220px]">
              <CourseAnnouncements courseId={course.id} />
            </div>
            <div>
              <CourseAttachments courseId={course.id} />
            </div>
          </div>
        </div>

        <div className="mt-4 pt-4 border-t">
          <Collapsible open={isOpen} onOpenChange={setIsOpen}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <span>{course.modules.length} modules</span>
                <span>•</span>
                <span>${course.price} per student</span>
              </div>
            </div>

            <CollapsibleContent className="mt-4 space-y-6">
              {/* Metrics Chart */}
              {course.metricsHistory && course.metricsHistory.length > 0 && (
                <div className="space-y-2">
                  <h4 className="text-sm font-semibold text-foreground">Performance Over Time</h4>
                  <div className="h-[250px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={course.metricsHistory}>
                        <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                        <XAxis 
                          dataKey="date" 
                          tick={{ fontSize: 12 }}
                          tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                          className="text-muted-foreground"
                        />
                        <YAxis tick={{ fontSize: 12 }} className="text-muted-foreground" />
                        <Tooltip 
                          contentStyle={{ 
                            backgroundColor: 'hsl(var(--popover))', 
                            border: '1px solid hsl(var(--border))',
                            borderRadius: '8px'
                          }}
                          labelFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                        />
                        <Legend />
                        <Line 
                          type="monotone" 
                          dataKey="clicks" 
                          stroke="#ef4444" 
                          strokeWidth={2}
                          name="Clicks"
                          dot={{ fill: '#ef4444' }}
                        />
                        <Line 
                          type="monotone" 
                          dataKey="bookings" 
                          stroke="#3b82f6" 
                          strokeWidth={2}
                          name="Bookings"
                          dot={{ fill: '#3b82f6' }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              )}

              {/* Students Table */}
              {course.students && course.students.length > 0 && (
                <div className="space-y-2">
                  <h4 className="text-sm font-semibold text-foreground">Enrolled Students</h4>
                  <div className="rounded-lg border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>First Name</TableHead>
                    <TableHead>Last Name</TableHead>
                    <TableHead>Email Address</TableHead>
                    {isOneOnOne && (
                      <>
                        <TableHead>Booked Date</TableHead>
                        <TableHead>Booked Time</TableHead>
                      </>
                    )}
                    <TableHead>Profile</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {course.students.map((student) => (
                    <TableRow key={student.id}>
                      <TableCell className="font-medium">{student.firstName}</TableCell>
                      <TableCell className="font-medium">{student.lastName}</TableCell>
                      <TableCell className="text-muted-foreground">{student.email}</TableCell>
                      {isOneOnOne && (
                        <>
                          <TableCell className="text-muted-foreground">
                            {student.bookedSessionDate ? new Date(student.bookedSessionDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'Not booked'}
                          </TableCell>
                          <TableCell className="text-muted-foreground">
                            {student.bookedSessionTime && student.bookedSessionEndTime 
                              ? `${student.bookedSessionTime} - ${student.bookedSessionEndTime}` 
                              : 'Not scheduled'}
                          </TableCell>
                        </>
                      )}
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="gap-2"
                          onClick={() => window.open(`/student/${student.id}`, '_blank')}
                        >
                          <ExternalLink className="w-4 h-4" />
                          View Profile
                        </Button>
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="outline"
                          size="sm"
                          className="gap-2"
                          onClick={() => console.log('Message student:', student.id)}
                        >
                          <MessageCircle className="w-4 h-4" />
                          Message
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
                  </div>
                </div>
              )}
            </CollapsibleContent>
          </Collapsible>
        </div>
      </CardContent>
    </Card>
  );
};

export default CourseMetricsCard;
