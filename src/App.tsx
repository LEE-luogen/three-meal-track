import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useOnboardingStore } from "@/stores/onboardingStore";
import Index from "./pages/Index";
import ProfilePage from "./pages/ProfilePage";
import OnboardingPage from "./pages/OnboardingPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

// Protected route wrapper that checks onboarding status
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { currentStep } = useOnboardingStore();
  
  // If onboarding is not completed, redirect to onboarding
  if (currentStep !== 'completed') {
    return <Navigate to="/onboarding" replace />;
  }
  
  return <>{children}</>;
};

// Onboarding route that redirects if already completed
const OnboardingRoute = () => {
  const { currentStep } = useOnboardingStore();
  
  // If onboarding is completed, redirect to home
  if (currentStep === 'completed') {
    return <Navigate to="/" replace />;
  }
  
  return <OnboardingPage />;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/onboarding" element={<OnboardingRoute />} />
          <Route path="/" element={<ProtectedRoute><Index /></ProtectedRoute>} />
          <Route path="/settings" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
