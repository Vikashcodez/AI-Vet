import React, { useEffect, useContext, useState, useRef } from "react";
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
  LogIn,
  Crown,
  User,
  Settings,
  LogOut,
  ChevronDown
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
import { AppContext } from "../App";
import { useAuth } from "@/contexts/AuthContext";

export default function MedicalSidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const currentPath = location.pathname;
  const { 
    setIsLoading, 
    subscription, 
    user, 
    setUser, 
    setSubscription,
    fetchSubscription 
  } = useContext(AppContext);
  
  const { logout } = useAuth();

  // Check if user is logged in on component mount
  useEffect(() => {
    const checkAuthStatus = () => {
      const token = localStorage.getItem('authToken');
      const userData = localStorage.getItem('user');
      
      if (!token || !userData) {
        setUser(null);
        setSubscription(null);
      } else {
        try {
          const parsedUser = JSON.parse(userData);
          setUser(parsedUser);
        } catch (error) {
          console.error('Error parsing user data:', error);
          setUser(null);
          setSubscription(null);
        }
      }
    };

    checkAuthStatus();

    // Listen for storage changes (logout from other tabs)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'authToken' || e.key === 'user') {
        checkAuthStatus();
      }
    };

    // Listen for custom logout events
    const handleCustomLogout = () => {
      checkAuthStatus();
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('customLogout', handleCustomLogout);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('customLogout', handleCustomLogout);
    };
  }, [setUser, setSubscription]);

  const handleLogout = () => {
    setIsLoading(true);
    try {
      // Use the auth context logout for consistency
      logout();
      
      // Update global state
      setUser(null);
      setSubscription(null);
      
      // Dispatch custom event to sync all components
      window.dispatchEvent(new Event('customLogout'));
      
      // Redirect to home page with slight delay for state to sync
      setTimeout(() => {
        navigate('/');
      }, 100);
    } finally {
      setTimeout(() => setIsLoading(false), 500);
    }
  };

  // Check if subscription is active and valid
  const isSubscriptionActive = () => {
    if (!subscription) return false;
    
    const now = new Date();
    const endDate = new Date(subscription.endDate);
    return subscription.status === 'active' && now < endDate;
  };

  // Check if feature should be enabled
  const isFeatureEnabled = (featureIndex: number) => {
    // First feature (Symptom Checker) is always enabled for free users (3 uses)
    if (featureIndex === 0) return true;
    
    // All other features require active subscription
    return isSubscriptionActive();
  };

  const medicalServices = [
    {
      title: "Symptom Checker",
      path: "/symptoms",
      icon: FileText,
      active: currentPath === "/symptoms",
      description: "Analyze symptoms and suggest possible illness",
      isFree: true
    },
    {
      title: "Disease Prediction",
      path: "/disease-prediction",
      icon: Shield,
      active: currentPath === "/disease-prediction",
      description: "Predict future health risks based on current symptoms",
      isFree: false
    },
    {
      title: "Future Risk Predictor",
      path: "/risk-predictor",
      icon: Activity,
      active: currentPath === "/risk-predictor",
      description: "Analyze potential health risks over time",
      isFree: false
    },
    {
      title: "Preventive Tips",
      path: "/preventive-tips",
      icon: Shield,
      active: currentPath === "/preventive-tips",
      description: "Daily care advice to avoid problems",
      isFree: false
    },
    {
      title: "Diet Evaluation",
      path: "/diet-evaluation",
      icon: Apple,
      active: currentPath === "/diet-evaluation",
      description: "Evaluate current diet for health issues",
      isFree: false
    },
    {
      title: "Customized Diet Plan",
      path: "/diet-plan",
      icon: Apple,
      active: currentPath === "/diet-plan",
      description: "Recommend healthy, balanced diet options",
      isFree: false
    },
    {
      title: "Prescription Generator",
      path: "/prescription",
      icon: Pill,
      active: currentPath === "/prescription",
      isFree: false
    },
    {
      title: "Activity Level Advice",
      path: "/activity-level",
      icon: Activity,
      active: currentPath === "/activity-level",
      description: "Suggests rest or play based on condition",
      isFree: false
    },
    {
      title: "Veterinary Assistant",
      path: "/vet",
      icon: Cat,
      active: currentPath === "/vet",
      isFree: false
    }
  ];

  const handleFeatureClick = (service: any, index: number) => {
    if (!isFeatureEnabled(index)) {
      alert('This feature requires a premium subscription. Please upgrade to access all features.');
      navigate('/pricing');
      return;
    }
    navigate(service.path);
  };

  return (
    <Sidebar variant="floating" className="border-r border-gray-200" collapsible="icon">
      <SidebarHeader className="p-4 border-b border-gray-200">
        <Link to="/dashboard" className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 flex items-center justify-center">
            <Stethoscope className="text-white w-5 h-5" />
          </div>
          <span className="text-xl font-bold text-gray-800">AI-Vet</span>
        </Link>
        
        {/* Subscription Status Badge */}
        {user && (
          <div className="mt-2 text-xs">
            {isSubscriptionActive() ? (
              <div className="flex items-center gap-1 bg-green-100 text-green-800 px-2 py-1 rounded-full">
                <Crown className="w-3 h-3" />
                <span>Premium ({subscription?.plan})</span>
              </div>
            ) : (
              <div className="bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                Free Plan
              </div>
            )}
          </div>
        )}
      </SidebarHeader>
      
      <SidebarContent className="flex flex-col h-full">
        <div className="flex-1">
          <SidebarGroup>
            <SidebarGroupLabel className="text-gray-500 font-medium">
              MEDICAL SERVICES
              {!isSubscriptionActive() && user && (
                <span className="text-xs text-orange-600 ml-2">
                  (Upgrade for full access)
                </span>
              )}
            </SidebarGroupLabel>
            <SidebarMenu>
              {medicalServices.map((service, index) => (
                <SidebarMenuItem key={service.title}>
                  <SidebarMenuButton 
                    asChild 
                    isActive={service.active}
                    tooltip={
                      isFeatureEnabled(index) 
                        ? service.description || service.title
                        : "Premium feature - Upgrade to access"
                    }
                    className={`md:truncate ${!isFeatureEnabled(index) ? 'opacity-60' : ''}`}
                    disabled={!isFeatureEnabled(index)}
                  >
                    <div 
                      onClick={() => handleFeatureClick(service, index)}
                      className={`flex items-center gap-2 w-full ${
                        isFeatureEnabled(index) 
                          ? 'cursor-pointer hover:bg-gray-50' 
                          : 'cursor-not-allowed'
                      }`}
                    >
                      <service.icon size={18} />
                      <span className="flex-1">{service.title}</span>
                      
                      {/* Premium Badge for locked features */}
                      {!isFeatureEnabled(index) && index > 0 && (
                        <Crown className="w-3 h-3 text-yellow-500 flex-shrink-0" />
                      )}
                      
                      {/* Free Badge for free features */}
                      {service.isFree && (
                        <span className="text-xs bg-green-100 text-green-800 px-1 rounded flex-shrink-0">
                          Free
                        </span>
                      )}
                    </div>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroup>

          {/* Upgrade Prompt */}
          {user && !isSubscriptionActive() && (
            <div className="p-4 border-t border-gray-200">
              <div className="bg-gradient-to-r from-[#00BFA6] to-[#00A896] rounded-lg p-3 text-white text-center">
                <Crown className="w-4 h-4 mx-auto mb-1" />
                <p className="text-xs font-medium mb-2">Unlock All Features</p>
                <button 
                  onClick={() => navigate('/pricing')}
                  className="bg-white text-[#00BFA6] text-xs font-medium px-3 py-1 rounded-full hover:bg-gray-100 transition-colors"
                >
                  Upgrade Now
                </button>
              </div>
            </div>
          )}
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
  const navigate = useNavigate();
  const currentPath = location.pathname;
  const { user, subscription } = useContext(AppContext);
  const { logout } = useAuth();
  
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const mobileMenuRef = useRef<HTMLDivElement>(null);

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

  const isSubscriptionActive = () => {
    if (!subscription) return false;
    const now = new Date();
    const endDate = new Date(subscription.endDate);
    return subscription.status === 'active' && now < endDate;
  };

  const handleMobileLogout = () => {
    logout();
    setIsMobileMenuOpen(false);
    window.dispatchEvent(new Event('customLogout'));
    setTimeout(() => {
      navigate('/');
    }, 100);
  };

  const handleMenuItemClick = (path: string) => {
    navigate(path);
    setIsMobileMenuOpen(false);
  };

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target as Node)) {
        setIsMobileMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

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
        <div className="ml-3">
          <h1 className="text-lg font-medium text-gray-800">{getCurrentService()}</h1>
          {user && (
            <div className="text-xs text-gray-500">
              {isSubscriptionActive() ? (
                <span className="text-green-600">● Premium</span>
              ) : (
                <span className="text-gray-400">● Free Plan</span>
              )}
            </div>
          )}
        </div>
      </div>
      
      {/* Mobile user avatar with dropdown */}
      <div className="relative" ref={mobileMenuRef}>
        {user ? (
          <div className="flex items-center gap-2">
            {!isSubscriptionActive() && (
              <button 
                onClick={() => navigate('/pricing')}
                className="bg-[#00BFA6] text-white text-xs px-2 py-1 rounded-full"
              >
                Upgrade
              </button>
            )}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="flex items-center gap-2 p-1 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-[#00BFA6] to-[#00A896] flex items-center justify-center text-white text-sm font-medium">
                {getUserInitials()}
              </div>
              <ChevronDown className={`w-4 h-4 text-gray-600 transition-transform ${isMobileMenuOpen ? 'rotate-180' : ''}`} />
            </button>

            {/* Mobile Dropdown Menu */}
            {isMobileMenuOpen && (
              <div className="absolute top-full right-0 mt-2 w-56 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                <div className="p-2">
                  {/* User Info */}
                  <div className="flex items-center gap-3 px-3 py-2 mb-2 border-b border-gray-100">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-r from-[#00BFA6] to-[#00A896] flex items-center justify-center text-white text-sm font-medium">
                      {getUserInitials()}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {user.firstName} {user.lastName}
                      </p>
                      <p className="text-xs text-gray-500 truncate">{user.email}</p>
                    </div>
                  </div>
                  
                  {/* Menu Items */}
                  <button
                    onClick={() => handleMenuItemClick('/dashboard')}
                    className="flex items-center gap-3 w-full px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-md transition-colors"
                  >
                    <User className="w-4 h-4" />
                    Dashboard
                  </button>
                  
                  <button
                    onClick={() => handleMenuItemClick('/plans')}
                    className="flex items-center gap-3 w-full px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-md transition-colors"
                  >
                    <Crown className="w-4 h-4" />
                    My Plans
                  </button>
                  
                  <button
                    onClick={() => handleMenuItemClick('/account')}
                    className="flex items-center gap-3 w-full px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-md transition-colors"
                  >
                    <Settings className="w-4 h-4" />
                    My Account
                  </button>
                  
                  <div className="border-t border-gray-100 mt-2 pt-2">
                    <button
                      onClick={handleMobileLogout}
                      className="flex items-center gap-3 w-full px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-md transition-colors"
                    >
                      <LogOut className="w-4 h-4" />
                      Logout
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        ) : (
          <button 
            onClick={() => navigate('/login')}
            className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center hover:bg-gray-300 transition-colors"
          >
            <LogIn size={16} className="text-gray-600" />
          </button>
        )}
      </div>
    </div>
  );
};