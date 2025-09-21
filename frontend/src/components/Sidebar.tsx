
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { 
  FileText, 
  Shield, 
  Activity, 
  Apple, 
  Calendar, 
  Pill,
  Cat,
  Menu,
  Stethoscope
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

export default function MedicalSidebar() {
  const location = useLocation();
  const currentPath = location.pathname;

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
      <SidebarContent>
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
      </SidebarContent>
    </Sidebar>
  );
}

export function MobileSidebarButton() {
  const { toggleSidebar } = useSidebar();
  const location = useLocation();
  const currentPath = location.pathname;
  
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
    </div>
  );
}
