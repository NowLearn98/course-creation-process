import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import StudentDashboard from "./pages/StudentDashboard";
import StudentCourseMaterialPage from "./pages/StudentCourseMaterialPage";
import NotFound from "./pages/NotFound";
import ReviewsPage from "./pages/ReviewsPage";
import PerformancePage from "./pages/PerformancePage";
import AdminPortalPage from "./pages/AdminPortalPage";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/reviews" element={<ReviewsPage />} />
          <Route path="/performance" element={<PerformancePage />} />
          <Route path="/admin" element={<AdminPortalPage />} />
          <Route path="/student" element={<StudentDashboard />} />
          <Route path="/student/course/:courseId/module/:moduleIndex" element={<StudentCourseMaterialPage />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
