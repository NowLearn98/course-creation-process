import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import BookingModal from '@/components/BookingModal';
import { Plus, BookOpen, Users, TrendingUp, Star } from 'lucide-react';

const Index = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-accent/5 to-primary/5">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center space-y-6 mb-16">
          <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">
            Course Creation Platform
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Create engaging online courses with our intuitive 5-step process. Share your knowledge and build a learning community.
          </p>
          <Button 
            onClick={() => setIsModalOpen(true)}
            size="lg"
            className="bg-gradient-to-r from-primary to-primary-glow hover:from-primary/90 hover:to-primary-glow/90 text-lg px-8 py-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
          >
            <Plus className="w-5 h-5 mr-2" />
            Create New Course
          </Button>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {[
            {
              icon: BookOpen,
              title: 'Easy Course Creation',
              description: 'Simple 5-step process to create professional courses',
              color: 'text-primary'
            },
            {
              icon: Users,
              title: 'Engage Students',
              description: 'Multiple formats to keep learners engaged',
              color: 'text-success'
            },
            {
              icon: TrendingUp,
              title: 'Track Progress',
              description: 'Monitor student progress and course performance',
              color: 'text-warning'
            },
            {
              icon: Star,
              title: 'Quality Content',
              description: 'Upload videos, images, and interactive materials',
              color: 'text-primary-glow'
            }
          ].map((feature, index) => {
            const Icon = feature.icon;
            return (
              <Card key={index} className="group hover:shadow-lg transition-all duration-300 hover:scale-105 border-border/50 bg-card/50 backdrop-blur-sm">
                <CardHeader className="text-center pb-2">
                  <div className="w-12 h-12 mx-auto bg-gradient-to-br from-accent to-accent/50 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                    <Icon className={`w-6 h-6 ${feature.color}`} />
                  </div>
                  <CardTitle className="text-lg">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <CardDescription className="text-sm leading-relaxed">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Process Steps */}
        <div className="bg-card/30 backdrop-blur-sm rounded-2xl p-8 border border-border/50">
          <h2 className="text-3xl font-bold text-center mb-8 text-foreground">
            Our Simple 5-Step Process
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
            {[
              { step: 1, title: 'General Info', description: 'Basic course details and requirements' },
              { step: 2, title: 'Content', description: 'Structure your course modules' },
              { step: 3, title: 'Format', description: 'Choose delivery method' },
              { step: 4, title: 'Media', description: 'Upload images and videos' },
              { step: 5, title: 'Review', description: 'Final review and publish' }
            ].map((item, index) => (
              <div key={item.step} className="text-center group">
                <div className="w-16 h-16 bg-gradient-to-br from-primary to-primary-glow rounded-full flex items-center justify-center mx-auto mb-4 text-white font-bold text-lg shadow-lg group-hover:scale-110 transition-transform duration-300">
                  {item.step}
                </div>
                <h3 className="font-semibold text-foreground mb-2">{item.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{item.description}</p>
                {index < 4 && (
                  <div className="hidden md:block absolute top-8 left-full w-full h-px bg-gradient-to-r from-primary/50 to-transparent transform translate-x-3" />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center mt-16">
          <Card className="max-w-2xl mx-auto bg-gradient-to-r from-primary/10 to-primary-glow/10 border-primary/20">
            <CardContent className="p-8">
              <h3 className="text-2xl font-bold mb-4 text-foreground">Ready to Start Teaching?</h3>
              <p className="text-muted-foreground mb-6 leading-relaxed">
                Join thousands of educators sharing their expertise through our platform. 
                Create your first course in minutes!
              </p>
              <Button 
                onClick={() => setIsModalOpen(true)}
                size="lg"
                className="bg-gradient-to-r from-primary to-primary-glow hover:from-primary/90 hover:to-primary-glow/90 shadow-lg hover:shadow-xl transition-all duration-300"
              >
                Get Started Now
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      <BookingModal open={isModalOpen} onOpenChange={setIsModalOpen} />
    </div>
  );
};

export default Index;
