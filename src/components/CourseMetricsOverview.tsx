import React, { useState, useEffect } from "react";
import CourseMetricsCard from "./CourseMetricsCard";
import { PublishedCourse } from "@/types/published";
import { getPublishedCourses, updatePublishedCourse, deletePublishedCourse } from "@/utils/publishedStorage";
import { useToast } from "@/hooks/use-toast";
import { Card } from "@/components/ui/card";
import { Star } from "lucide-react";

interface CourseMetricsOverviewProps {
  onEditCourse?: (course: PublishedCourse) => void;
}

const CourseMetricsOverview: React.FC<CourseMetricsOverviewProps> = ({ onEditCourse }) => {
  const [courses, setCourses] = useState<PublishedCourse[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    setCourses(getPublishedCourses());
  }, []);

  const classroomCourses = courses.filter(course => 
    course.sessionTypes.includes('classroom')
  );
  
  const oneOnOneCourses = courses.filter(course => 
    course.sessionTypes.includes('one-on-one')
  );

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

  if (courses.length === 0) {
    return (
      <Card className="p-12 text-center border-dashed border-2 bg-gradient-to-br from-muted/20 to-transparent">
        <div className="flex flex-col items-center gap-4">
          <div className="p-4 bg-primary/10 rounded-full">
            <Star className="w-12 h-12 text-primary" />
          </div>
          <div className="max-w-md">
            <h3 className="text-xl font-bold text-foreground mb-2">No Published Courses Yet</h3>
            <p className="text-muted-foreground">
              Create and publish your first course to see performance metrics here.
            </p>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-8">
      {/* Classroom Sessions Section */}
      {classroomCourses.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <div className="h-8 w-1 bg-primary rounded-full" />
            <h3 className="text-xl font-bold text-foreground">Classroom Sessions</h3>
            <span className="text-sm text-muted-foreground">({classroomCourses.length})</span>
          </div>
          <div className="space-y-4">
            {classroomCourses.map((course) => (
              <CourseMetricsCard
                key={course.id}
                course={course}
                onEdit={onEditCourse}
                onStatusChange={handleStatusChange}
                onDelete={handleDelete}
              />
            ))}
          </div>
        </div>
      )}

      {/* One-on-One Sessions Section */}
      {oneOnOneCourses.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <div className="h-8 w-1 bg-accent rounded-full" />
            <h3 className="text-xl font-bold text-foreground">One-on-One Sessions</h3>
            <span className="text-sm text-muted-foreground">({oneOnOneCourses.length})</span>
          </div>
          <div className="space-y-4">
            {oneOnOneCourses.map((course) => (
              <CourseMetricsCard
                key={course.id}
                course={course}
                onEdit={onEditCourse}
                onStatusChange={handleStatusChange}
                onDelete={handleDelete}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default CourseMetricsOverview;
