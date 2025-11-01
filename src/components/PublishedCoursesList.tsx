import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Star, 
  Users, 
  PlayCircle, 
  PauseCircle, 
  Archive, 
  Edit, 
  Eye,
  MoreHorizontal
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { PublishedCourse } from "@/types/published";
import { getPublishedCourses, updatePublishedCourse, deletePublishedCourse } from "@/utils/publishedStorage";
import { useToast } from "@/hooks/use-toast";

interface PublishedCoursesListProps {
  onEditCourse?: (course: PublishedCourse) => void;
}

const PublishedCoursesList: React.FC<PublishedCoursesListProps> = ({ onEditCourse }) => {
  const [courses, setCourses] = useState<PublishedCourse[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    setCourses(getPublishedCourses());
  }, []);

  const handleStatusChange = (courseId: string, status: PublishedCourse['status']) => {
    const updatedCourse = updatePublishedCourse(courseId, { status });
    if (updatedCourse) {
      setCourses(getPublishedCourses());
      toast({
        title: "Course updated",
        description: `Course status changed to ${status}`,
      });
    }
  };

  const handleDelete = (courseId: string) => {
    if (deletePublishedCourse(courseId)) {
      setCourses(getPublishedCourses());
      toast({
        title: "Course deleted",
        description: "The course has been removed from published courses",
      });
    }
  };

  const getStatusColor = (status: PublishedCourse['status']) => {
    switch (status) {
      case 'active':
        return 'bg-green-500/10 text-green-500 border-green-500/20';
      case 'paused':
        return 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20';
      case 'archived':
        return 'bg-gray-500/10 text-gray-500 border-gray-500/20';
      default:
        return 'bg-gray-500/10 text-gray-500 border-gray-500/20';
    }
  };

  if (courses.length === 0) {
    return (
      <Card className="p-12 text-center border-dashed border-2 bg-gradient-to-br from-muted/20 to-transparent">
        <div className="flex flex-col items-center gap-4">
          <div className="p-4 bg-success/10 rounded-full">
            <Star className="w-12 h-12 text-success" />
          </div>
          <div className="max-w-md">
            <h3 className="text-xl font-bold text-foreground mb-2">No Published Courses Yet</h3>
            <p className="text-muted-foreground">
              Create and publish your first course to see it here. Share your knowledge with the world!
            </p>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-6">
      {courses.map((course) => (
        <Card key={course.id} className="group relative overflow-hidden border-0 shadow-md hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-card to-card/80 backdrop-blur-sm">
          <div className="absolute inset-0 bg-gradient-to-br from-success/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <CardHeader className="relative pb-3">
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1 min-w-0">
                <CardTitle className="text-base md:text-lg font-bold line-clamp-2 mb-2 text-foreground group-hover:text-success transition-colors">
                  {course.title}
                </CardTitle>
                <CardDescription className="line-clamp-2 text-sm">
                  {course.subtitle}
                </CardDescription>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0 hover:bg-success/10 transition-colors">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48 bg-popover/95 backdrop-blur-sm border shadow-lg">
                  <DropdownMenuItem onClick={() => onEditCourse?.(course)} className="cursor-pointer">
                    <Edit className="w-4 h-4 mr-2" />
                    Edit Course
                  </DropdownMenuItem>
                  <DropdownMenuItem className="cursor-pointer">
                    <Eye className="w-4 h-4 mr-2" />
                    View Details
                  </DropdownMenuItem>
                  {course.status === 'active' && (
                    <DropdownMenuItem onClick={() => handleStatusChange(course.id, 'paused')} className="cursor-pointer">
                      <PauseCircle className="w-4 h-4 mr-2" />
                      Pause
                    </DropdownMenuItem>
                  )}
                  {course.status === 'paused' && (
                    <DropdownMenuItem onClick={() => handleStatusChange(course.id, 'active')} className="cursor-pointer">
                      <PlayCircle className="w-4 h-4 mr-2" />
                      Activate
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem onClick={() => handleStatusChange(course.id, 'archived')} className="cursor-pointer">
                    <Archive className="w-4 h-4 mr-2" />
                    Archive
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    onClick={() => handleDelete(course.id)}
                    className="text-destructive focus:text-destructive cursor-pointer"
                  >
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            <div className="flex items-center gap-2 mt-3 flex-wrap">
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
          </CardHeader>
          <CardContent className="relative pt-0">
            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-1.5 text-muted-foreground">
                  <div className="p-1 bg-success/10 rounded">
                    <Users className="w-3.5 h-3.5 text-success" />
                  </div>
                  <span className="font-medium">{course.enrollments} students</span>
                </div>
                <span className="text-xs text-muted-foreground">
                  {course.modules.length} modules
                </span>
              </div>
              
              {course.rating > 0 && (
                <div className="flex items-center gap-1.5 text-sm">
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 fill-warning text-warning" />
                    <span className="font-bold text-foreground">{course.rating.toFixed(1)}</span>
                  </div>
                  <span className="text-muted-foreground text-xs">({course.reviews} reviews)</span>
                </div>
              )}
              
              <div className="pt-2 border-t flex items-center justify-between">
                <span className="text-xl font-bold bg-gradient-to-r from-success to-success/70 bg-clip-text text-transparent">
                  ${course.price}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default PublishedCoursesList;