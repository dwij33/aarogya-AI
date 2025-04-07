import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Layout } from "@/components/Layout";
import Index from "@/pages/Index";
import SymptomChecker from "@/pages/SymptomChecker";
import MentalHealth from "@/pages/MentalHealth";
import MentalHealthCompanion from "@/pages/MentalHealthCompanion";
import ReportAnalyzer from "@/pages/ReportAnalyzer";
import FindDoctors from "@/pages/FindDoctors";
import Appointments from "@/pages/Appointments";
import NotFound from "@/pages/NotFound";
import DietNutrition from "@/pages/DietNutrition";
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import Profile from "@/pages/Profile";
import About from "@/pages/About";
import Contact from "@/pages/Contact";
import { AuthProvider } from "@/contexts/AuthContext";
import { StrictMode } from "react";

// Create a client for react-query
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1
    }
  }
});

const App = () => (
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Layout />}>
                <Route index element={<Index />} />
                <Route path="symptom-checker" element={<SymptomChecker />} />
                <Route path="mental-health" element={<MentalHealth />} />
                <Route path="mental-health-companion" element={<MentalHealthCompanion />} />
                <Route path="report-analyzer" element={<ReportAnalyzer />} />
                <Route path="find-doctors" element={<FindDoctors />} />
                <Route path="appointments" element={<Appointments />} />
                <Route path="diet-nutrition" element={<DietNutrition />} />
                <Route path="about" element={<About />} />
                <Route path="contact" element={<Contact />} />
                <Route path="login" element={<Login />} />
                <Route path="register" element={<Register />} />
                <Route path="profile" element={<Profile />} />
                <Route path="*" element={<NotFound />} />
              </Route>
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  </StrictMode>
);

export default App;
