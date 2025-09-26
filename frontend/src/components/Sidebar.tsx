import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { 
  FileText, 
  Shield, 
  Activity, 
  Apple, 
  Pill,
  Cat,
  Menu,
  Stethoscope,
  LogIn
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  useSidebar
} from "@/components/ui/sidebar";
import UserAvatar from "./UserAvatar";

interface UserData {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
}

export default function MedicalSidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const currentPath = location.pathname;
  const [user, setUser] = useState<UserData | null>(null);

  // Check if user is logged in on component mount
  useEffect(() => {
    const checkAuthStatus = () => {
      try {
        const token = localStorage.getItem('authToken');
        const userData = localStorage.getItem('user');
        
        if (token && userData) {
          setUser(JSON.parse(userData));
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error('Error checking auth status:', error);
        setUser(null);
      }
    };

    checkAuthStatus();

    // Listen for storage changes (logout from other tabs)
    const handleStorageChange = () => {
      checkAuthStatus();
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const handleLogout = () => {
    // Clear localStorage
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    
    // Update state
    setUser(null);
    
    // Redirect to home page
    navigate('/');
    
    // Optional: Show logout message
    console.log('User logged out successfully');
  };

  const medicalServices = [
    {
      title: "Symptom Checker",
      path: "/symptoms",
      icon: FileText,
      active: currentPath === "/symptoms",
      description: "Analyze symptoms and suggest possible illness"
    },
    {
      title: "Disease Prediction",
      path: "/disease-prediction",
      icon: Shield,
      active: currentPath === "/disease-prediction",
      description: "Predict future health risks based on current symptoms"
    },
    {
      title: "Future Risk Predictor",
      path: "/risk-predictor",
      icon: Activity,
      active: currentPath === "/risk-predictor",
      description: "Analyze potential health risks over time"
    },
    {
      title: "Preventive Tips",
      path: "/preventive-tips",
      icon: Shield,
      active: currentPath === "/preventive-tips",
      description: "Daily care advice to avoid problems"
    },
    {
      title: "Diet Evaluation",
      path: "/diet-evaluation",
      icon: Apple,
      active: currentPath === "/diet-evaluation",
      description: "Evaluate current diet for health issues"
    },
    {
      title: "Customized Diet Plan",
      path: "/diet-plan",
      icon: Apple,
      active: currentPath === "/diet-plan",
      description: "Recommend healthy, balanced diet options"
    },
    {
      title: "Prescription Generator",
      path: "/prescription",
      icon: Pill,
      active: currentPath === "/prescription"
    },
    {
      title: "Activity Level Advice",
      path: "/activity-level",
      icon: Activity,
      active: currentPath === "/activity-level",
      description: "Suggests rest or play based on condition"
    },
    {
      title: "Veterinary Assistant",
      path: "/vet",
      icon: Cat,
      active: currentPath === "/vet"
    }
  ];

  return (
    <Sidebar variant="floating" className="border-r border-gray-200" collapsible="icon">
      <SidebarHeader className="p-4 border-b border-gray-200">
        <Link to="/dashboard" className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 flex items-center justify-center">
            <Stethoscope className="text-white w-5 h-5" />
          </div>
          <span className="text-xl font-bold text-gray-800">AI-Vet</span>
        </Link>
      </SidebarHeader>
      
      <SidebarContent className="flex flex-col h-full">
        <div className="flex-1">
          <SidebarGroup>
            <SidebarGroupLabel className="text-gray-500 font-medium">MEDICAL SERVICES</SidebarGroupLabel>
            <SidebarMenu>
              {medicalServices.map((service) => (
                <SidebarMenuItem key={service.title}>
                  <SidebarMenuButton 
                    asChild 
                    isActive={service.active}
                    tooltip={service.description || service.title}
                    className="md:truncate"
                  >
                    <Link to={service.path} className="flex items-center gap-2">
                      <service.icon size={18} />
                      <span>{service.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroup>
        </div>

        {/* User Section at the bottom */}
        <div className="p-4 border-t border-gray-200">
          <UserAvatar user={user} onLogout={handleLogout} />
        </div>
      </SidebarContent>
    </Sidebar>
  );
}

export function MobileSidebarButton() {
  const { toggleSidebar } = useSidebar();
  const location = useLocation();
  const currentPath = location.pathname;
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  // Find the current service based on the path
  const getCurrentService = () => {
    const medicalServices = [
      { title: "Symptom Checker", path: "/symptoms" },
      { title: "Disease Prediction", path: "/disease-prediction" },
      { title: "Future Risk Predictor", path: "/risk-predictor" },
      { title: "Preventive Tips", path: "/preventive-tips" },
      { title: "Diet Evaluation", path: "/diet-evaluation" },
      { title: "Customized Diet Plan", path: "/diet-plan" },
      { title: "Prescription Generator", path: "/prescription" },
      { title: "Activity Level Advice", path: "/activity-level" },
      { title: "Veterinary Assistant", path: "/vet" },
      { title: "Dashboard", path: "/dashboard" },
    ];
    
    const currentService = medicalServices.find(service => service.path === currentPath);
    return currentService?.title || "AI-Vet";
  };

  const getUserInitials = () => {
    if (!user) return null;
    return `${user.firstName?.charAt(0)}${user.lastName?.charAt(0)}`.toUpperCase();
  };

  return (
    <div className="fixed top-0 left-0 right-0 z-50 md:hidden flex items-center justify-between bg-white p-3 border-b border-gray-200 shadow-sm">
      <div className="flex items-center">
        <button
          onClick={toggleSidebar}
          className="flex items-center justify-center w-10 h-10 rounded-full bg-[#1AB394] text-white shadow-sm"
          aria-label="Toggle Medical Services Menu"
        >
          <Menu size={20} />
        </button>
        <h1 className="ml-3 text-lg font-medium text-gray-800">{getCurrentService()}</h1>
      </div>
      
      {/* Mobile user avatar */}
      {user ? (
        <div className="w-8 h-8 rounded-full bg-gradient-to-r from-[#00BFA6] to-[#00A896] flex items-center justify-center text-white text-sm font-medium">
          {getUserInitials()}
        </div>
      ) : (
        <button 
          onClick={() => window.location.href = '/login'}
          className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center"
        >
          <LogIn size={16} className="text-gray-600" />
        </button>
      )}
    </div>
  );
}