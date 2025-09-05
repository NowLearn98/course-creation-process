import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, BookOpen, Users, TrendingUp, Star } from "lucide-react";
import { BookingModal } from "@/components/BookingModal";
import { DraftsList } from "@/components/DraftsList";
import PublishedCoursesList from "@/components/PublishedCoursesList";
import { DraftCourse } from "@/types/draft";
import { PublishedCourse } from "@/types/published";
import { createSamplePublishedCourses } from "@/utils/sampleData";

const Index = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingDraft, setEditingDraft] = useState<DraftCourse | null>(null);
  const [editingPublished, setEditingPublished] = useState<PublishedCourse | null>(null);

  // Create sample published courses on first load
  useEffect(() => {
    createSamplePublishedCourses();
  }, []);

  const handleEditDraft = (draft: DraftCourse) => {
    setEditingDraft(draft);
    setEditingPublished(null);
    setIsModalOpen(true);
  };

  const handleEditPublished = (course: PublishedCourse) => {
    setEditingPublished(course);
    setEditingDraft(null);
    setIsModalOpen(true);
  };

  const handleModalClose = (open: boolean) => {
    setIsModalOpen(open);
    if (!open) {
      setEditingDraft(null);
      setEditingPublished(null);
    }
  };

  const handleCreateNew = () => {
    setEditingDraft(null);
    setEditingPublished(null);
    setIsModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-accent/20">
      <div className="container mx-auto py-8 px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-foreground mb-4">
            Course Creator Dashboard
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Create, manage, and publish your courses with our comprehensive course creation platform
          </p>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-8">
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="drafts" className="flex items-center gap-2">
              <BookOpen className="w-4 h-4" />
              Drafts
            </TabsTrigger>
            <TabsTrigger value="published" className="flex items-center gap-2">
              <Star className="w-4 h-4" />
              Published
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-8">
            {/* Quick Actions */}
            <Card className="border-0 bg-gradient-to-r from-primary/10 via-primary/5 to-transparent">
              <CardHeader>
                <CardTitle className="text-xl font-semibold text-foreground">Quick Actions</CardTitle>
                <CardDescription>Get started with creating your next course</CardDescription>
              </CardHeader>
              <CardContent>
                <Button 
                  onClick={handleCreateNew}
                  size="lg" 
                  className="bg-gradient-to-r from-primary to-primary-glow hover:from-primary/90 hover:to-primary-glow/90 transition-all duration-200"
                >
                  <Plus className="w-5 h-5 mr-2" />
                  Create New Course
                </Button>
              </CardContent>
            </Card>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="hover:shadow-lg transition-shadow duration-200">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Courses</CardTitle>
                  <BookOpen className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">12</div>
                  <p className="text-xs text-muted-foreground">+2 from last month</p>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow duration-200">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Students</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">1,234</div>
                  <p className="text-xs text-muted-foreground">+15% from last month</p>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow duration-200">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Avg. Rating</CardTitle>
                  <Star className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">4.8</div>
                  <p className="text-xs text-muted-foreground">Based on 256 reviews</p>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow duration-200">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Revenue</CardTitle>
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">$12,345</div>
                  <p className="text-xs text-muted-foreground">+8% from last month</p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="drafts" className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-foreground">Course Drafts</h2>
                <p className="text-muted-foreground">Continue working on your saved drafts</p>
              </div>
              <Button 
                onClick={handleCreateNew}
                className="bg-gradient-to-r from-primary to-primary-glow hover:from-primary/90 hover:to-primary-glow/90 transition-all duration-200"
              >
                <Plus className="w-4 h-4 mr-2" />
                New Course
              </Button>
            </div>
            <DraftsList onEditDraft={handleEditDraft} />
          </TabsContent>

          <TabsContent value="published" className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-foreground">Published Courses</h2>
                <p className="text-muted-foreground">Manage your live courses</p>
              </div>
              <Button 
                onClick={handleCreateNew}
                className="bg-gradient-to-r from-primary to-primary-glow hover:from-primary/90 hover:to-primary-glow/90 transition-all duration-200"
              >
                <Plus className="w-4 h-4 mr-2" />
                New Course
              </Button>
            </div>
            <PublishedCoursesList onEditCourse={handleEditPublished} />
          </TabsContent>
        </Tabs>

        {/* Course Creation Modal */}
        <BookingModal 
          open={isModalOpen} 
          onOpenChange={handleModalClose}
          editingDraft={editingDraft}
          editingPublished={editingPublished}
        />
      </div>
    </div>
  );
};

export default Index;