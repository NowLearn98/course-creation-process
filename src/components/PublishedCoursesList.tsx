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
      <Card className="p-8 text-center">
        <div className="flex flex-col items-center gap-4">
          <Star className="w-12 h-12 text-muted-foreground" />
          <div>
            <h3 className="text-lg font-semibold text-foreground mb-2">No Published Courses Yet</h3>
            <p className="text-muted-foreground">
              Create and publish your first course to see it here.
            </p>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {courses.map((course) => (
        <Card key={course.id} className="hover:shadow-lg transition-shadow duration-200">
          <CardHeader className="pb-3">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <CardTitle className="text-lg font-semibold line-clamp-2 mb-1">
                  {course.title}
                </CardTitle>
                <CardDescription className="line-clamp-2">
                  {course.subtitle}
                </CardDescription>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => onEditCourse?.(course)}>
                    <Edit className="w-4 h-4 mr-2" />
                    Edit
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Eye className="w-4 h-4 mr-2" />
                    View Details
                  </DropdownMenuItem>
                  {course.status === 'active' && (
                    <DropdownMenuItem onClick={() => handleStatusChange(course.id, 'paused')}>
                      <PauseCircle className="w-4 h-4 mr-2" />
                      Pause
                    </DropdownMenuItem>
                  )}
                  {course.status === 'paused' && (
                    <DropdownMenuItem onClick={() => handleStatusChange(course.id, 'active')}>
                      <PlayCircle className="w-4 h-4 mr-2" />
                      Activate
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem onClick={() => handleStatusChange(course.id, 'archived')}>
                    <Archive className="w-4 h-4 mr-2" />
                    Archive
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    onClick={() => handleDelete(course.id)}
                    className="text-destructive focus:text-destructive"
                  >
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            <div className="flex items-center gap-2 mt-2">
              <Badge 
                variant="outline" 
                className={getStatusColor(course.status)}
              >
                {course.status}
              </Badge>
              <Badge variant="outline">
                {course.level}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Users className="w-4 h-4" />
                  {course.enrollments} students
                </div>
              </div>
              
              {course.rating > 0 && (
                <div className="flex items-center gap-1 text-sm">
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  <span className="font-medium">{course.rating.toFixed(1)}</span>
                  <span className="text-muted-foreground">({course.reviews} reviews)</span>
                </div>
              )}
              
              <div className="flex items-center justify-between">
                <span className="text-lg font-semibold text-foreground">
                  ${course.price}
                </span>
                <span className="text-sm text-muted-foreground">
                  {course.modules.length} modules
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