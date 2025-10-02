
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Symptoms from "./pages/Symptoms";
import NotFound from "./pages/NotFound";
import VetAssistant from "./pages/VetAssistant";
import DiseasePrediction from "./pages/DiseasePrediction";
import RiskPredictor from "./pages/RiskPredictor";
import Prescription from "./pages/Prescription";
import PreventiveTips from "./pages/PreventiveTips";
import ActivityLevel from "./pages/ActivityLevel";
import DietEvaluation from "./pages/DietEvaluation";
import DietPlan from "./pages/DietPlan";
import Index from "./pages/Index";
import AIChatButton from "./components/AIChatButton";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import { AuthProvider } from './contexts/AuthContext';
import Pricing from "./components/Pricing";
import AdminDashboard from "./pages/adminDashboard";

function App() {
  const queryClient = new QueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Signup />} />
            <Route path="/dashboard" element={<Navigate to="/symptoms" />} />
            <Route path="/symptoms" element={<Symptoms />} />
            <Route path="/disease-prediction" element={<DiseasePrediction />} />
            <Route path="/risk-predictor" element={<RiskPredictor />} />
            <Route path="/preventive-tips" element={<PreventiveTips />} />
            <Route path="/diet-evaluation" element={<DietEvaluation />} />
            <Route path="/diet-plan" element={<DietPlan />} />
            <Route path="/prescription" element={<Prescription />} />
            <Route path="/activity-level" element={<ActivityLevel />} />
            <Route path="/vet" element={<VetAssistant />} />
            <Route path="/plans" element={<Pricing />} />
            <Route path="*" element={<NotFound />} />
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
          </Routes>
          <AIChatButton />
        </BrowserRouter>
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
