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
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-accent/10">
      <div className="container mx-auto px-4 py-6 md:py-10 max-w-7xl">
        {/* Header */}
        <div className="mb-8 md:mb-12">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl md:text-5xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent mb-2">
                Course Creator
              </h1>
              <p className="text-base md:text-lg text-muted-foreground">
                Build and launch your courses with ease
              </p>
            </div>
            <Button 
              onClick={handleCreateNew}
              size="lg" 
              className="shadow-lg hover:shadow-xl transition-all duration-300 self-start md:self-auto"
            >
              <Plus className="w-5 h-5 mr-2" />
              New Course
            </Button>
          </div>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="overview" className="w-full space-y-6">
          <TabsList className="grid w-full grid-cols-3 h-auto p-1 bg-card/50 backdrop-blur-sm border shadow-sm">
            <TabsTrigger 
              value="overview" 
              className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground py-3"
            >
              <TrendingUp className="w-4 h-4" />
              <span className="hidden sm:inline">Overview</span>
            </TabsTrigger>
            <TabsTrigger 
              value="drafts" 
              className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground py-3"
            >
              <BookOpen className="w-4 h-4" />
              <span className="hidden sm:inline">Drafts</span>
            </TabsTrigger>
            <TabsTrigger 
              value="published" 
              className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground py-3"
            >
              <Star className="w-4 h-4" />
              <span className="hidden sm:inline">Published</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6 animate-fade-in">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
              <Card className="relative overflow-hidden border-0 shadow-md hover:shadow-lg transition-all duration-300 bg-gradient-to-br from-card to-card/80 backdrop-blur-sm">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent" />
                <CardHeader className="relative flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Total Courses</CardTitle>
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <BookOpen className="h-4 w-4 text-primary" />
                  </div>
                </CardHeader>
                <CardContent className="relative">
                  <div className="text-3xl font-bold text-foreground">12</div>
                  <p className="text-xs text-muted-foreground mt-1">+2 from last month</p>
                </CardContent>
              </Card>

              <Card className="relative overflow-hidden border-0 shadow-md hover:shadow-lg transition-all duration-300 bg-gradient-to-br from-card to-card/80 backdrop-blur-sm">
                <div className="absolute inset-0 bg-gradient-to-br from-success/5 to-transparent" />
                <CardHeader className="relative flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Total Students</CardTitle>
                  <div className="p-2 bg-success/10 rounded-lg">
                    <Users className="h-4 w-4 text-success" />
                  </div>
                </CardHeader>
                <CardContent className="relative">
                  <div className="text-3xl font-bold text-foreground">1,234</div>
                  <p className="text-xs text-muted-foreground mt-1">+15% from last month</p>
                </CardContent>
              </Card>

              <Card className="relative overflow-hidden border-0 shadow-md hover:shadow-lg transition-all duration-300 bg-gradient-to-br from-card to-card/80 backdrop-blur-sm">
                <div className="absolute inset-0 bg-gradient-to-br from-warning/5 to-transparent" />
                <CardHeader className="relative flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Avg. Rating</CardTitle>
                  <div className="p-2 bg-warning/10 rounded-lg">
                    <Star className="h-4 w-4 text-warning" />
                  </div>
                </CardHeader>
                <CardContent className="relative">
                  <div className="text-3xl font-bold text-foreground">4.8</div>
                  <p className="text-xs text-muted-foreground mt-1">Based on 256 reviews</p>
                </CardContent>
              </Card>

              <Card className="relative overflow-hidden border-0 shadow-md hover:shadow-lg transition-all duration-300 bg-gradient-to-br from-card to-card/80 backdrop-blur-sm">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent" />
                <CardHeader className="relative flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Revenue</CardTitle>
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <TrendingUp className="h-4 w-4 text-primary" />
                  </div>
                </CardHeader>
                <CardContent className="relative">
                  <div className="text-3xl font-bold text-foreground">$12,345</div>
                  <p className="text-xs text-muted-foreground mt-1">+8% from last month</p>
                </CardContent>
              </Card>
            </div>

            {/* Quick Action Card */}
            <Card className="border-0 shadow-lg bg-gradient-to-br from-primary/10 via-primary/5 to-transparent backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-2xl font-bold text-foreground">Ready to Create?</CardTitle>
                <CardDescription className="text-base">Start building your next amazing course</CardDescription>
              </CardHeader>
              <CardContent>
                <Button 
                  onClick={handleCreateNew}
                  size="lg" 
                  className="shadow-md hover:shadow-lg transition-all duration-300"
                >
                  <Plus className="w-5 h-5 mr-2" />
                  Create New Course
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="drafts" className="space-y-6 animate-fade-in">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
              <div>
                <h2 className="text-2xl md:text-3xl font-bold text-foreground">Course Drafts</h2>
                <p className="text-sm md:text-base text-muted-foreground mt-1">Continue where you left off</p>
              </div>
              <Button 
                onClick={handleCreateNew}
                className="shadow-md hover:shadow-lg transition-all duration-300 self-start sm:self-auto"
              >
                <Plus className="w-4 h-4 mr-2" />
                New Draft
              </Button>
            </div>
            <DraftsList onEditDraft={handleEditDraft} />
          </TabsContent>

          <TabsContent value="published" className="space-y-6 animate-fade-in">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
              <div>
                <h2 className="text-2xl md:text-3xl font-bold text-foreground">Published Courses</h2>
                <p className="text-sm md:text-base text-muted-foreground mt-1">Manage your live courses</p>
              </div>
              <Button 
                onClick={handleCreateNew}
                className="shadow-md hover:shadow-lg transition-all duration-300 self-start sm:self-auto"
              >
                <Plus className="w-4 h-4 mr-2" />
                Publish New
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