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
import AuthCallback from "./components/AuthCallback";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsConditions from "./pages/TermsConditions";
import CancellationRefund from "./pages/CancellationRefund";
import Contact from "./pages/Contact";
import React, { useState, useEffect } from "react";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

interface Subscription {
  id: number;
  plan: string;
  startDate: string;
  endDate: string;
  status: string;
  includes: string[];
}

interface UserData {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
}

// Create a global context for both loading and subscription
export const AppContext = React.createContext<{
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
  subscription: Subscription | null;
  setSubscription: (subscription: Subscription | null) => void;
  user: UserData | null;
  setUser: (user: UserData | null) => void;
  fetchSubscription: () => Promise<void>;
}>({
  isLoading: false,
  setIsLoading: () => { },
  subscription: null,
  setSubscription: () => { },
  user: null,
  setUser: () => { },
  fetchSubscription: async () => { }
});

// Global loader component
export function GlobalLoader() {
  const { isLoading } = React.useContext(AppContext);

  if (!isLoading) return null;

  return (
    <div className="fixed inset-0 bg-white bg-opacity-80 z-50 flex items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <div className="w-12 h-12 border-4 border-[#00BFA6] border-t-transparent rounded-full animate-spin"></div>
        <p className="text-gray-600 font-medium">Loading ...</p>
      </div>
    </div>
  );
}

function App() {
  const queryClient = new QueryClient();
  const [isLoading, setIsLoading] = useState(false);
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [user, setUser] = useState<UserData | null>(null);

  // Fetch subscription function that can be called from anywhere
  // Inside your App component, update the fetchSubscription function
  const fetchSubscription = async () => {
    const token = localStorage.getItem('authToken');
    const userData = localStorage.getItem('user');

    if (!token || !userData) {
      setSubscription(null);
      setUser(null);
      return;
    }

    try {
      const userObj = JSON.parse(userData);
      setUser(userObj);

      const response = await fetch(`${API_BASE_URL}/subscriptions/user/${userObj.id}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();

      if (data.success && data.data && data.data.subscription) {
        setSubscription(data.data.subscription);

        // Clear token count when user subscribes
        if (data.data.subscription.status === 'active') {
          localStorage.removeItem("aivet-tokens");
        }
      } else {
        setSubscription(null);
      }
    } catch (error) {
      console.error('Error fetching subscription:', error);
      setSubscription(null);
    }
  };
  // Initial subscription fetch on app load
  useEffect(() => {
    const initializeApp = async () => {
      setIsLoading(true);
      await fetchSubscription();
      setIsLoading(false);
    };

    initializeApp();
  }, []);

  return (
    <AppContext.Provider value={{
      isLoading,
      setIsLoading,
      subscription,
      setSubscription,
      user,
      setUser,
      fetchSubscription
    }}>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <AuthProvider>
            <BrowserRouter>
              <GlobalLoader />
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
                <Route path="/pricing" element={<Pricing />} />
                <Route path="*" element={<NotFound />} />
                <Route path="/admin/dashboard" element={<AdminDashboard />} />
                <Route path="/auth/callback" element={<AuthCallback />} />
                <Route path="/privacy-policy" element={<PrivacyPolicy />} />
                <Route path="/terms-conditions" element={<TermsConditions />} />
                <Route path="/cancellation-refund" element={<CancellationRefund />} />
                <Route path="/contact" element={<Contact />} />
              </Routes>
              <AIChatButton />
            </BrowserRouter>
          </AuthProvider>
        </TooltipProvider>
      </QueryClientProvider>
    </AppContext.Provider>
  );
}

export default App;