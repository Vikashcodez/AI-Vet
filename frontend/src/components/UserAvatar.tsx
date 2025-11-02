import { useState, useRef, useEffect } from "react";
import { User, Settings, Crown, LogOut, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

interface UserData {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
}

interface UserAvatarProps {
  user: UserData | null;
  onLogout: () => void;
}

const UserAvatar = ({ user, onLogout }: UserAvatarProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  const handleMenuItemClick = (path: string) => {
    navigate(path);
    setIsOpen(false);
  };

  if (!user) {
    return (
      <Button 
        onClick={() => navigate('/login')}
        className="w-full bg-[#00BFA6] hover:bg-[#00A896] text-white"
      >
        <User className="w-4 h-4 mr-2" />
        Login
      </Button>
    );
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <Button
        variant="ghost"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full justify-between px-3 py-2 hover:bg-gray-100"
      >
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-gradient-to-r from-[#00BFA6] to-[#00A896] flex items-center justify-center text-white text-sm font-medium">
            {getInitials(user.firstName, user.lastName)}
          </div>
          <div className="text-left">
            <p className="text-sm font-medium text-gray-900 truncate max-w-[120px]">
              {user.firstName} {user.lastName}
            </p>
            <p className="text-xs text-gray-500 truncate max-w-[120px]">
              {user.email}
            </p>
          </div>
        </div>
        <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </Button>

      {isOpen && (
        <div className="absolute bottom-full left-0 right-0 mb-2 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
          <div className="p-2">
            <div className="flex items-center gap-3 px-3 py-2 mb-2 border-b border-gray-100">
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-[#00BFA6] to-[#00A896] flex items-center justify-center text-white text-sm font-medium">
                {getInitials(user.firstName, user.lastName)}
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">
                  {user.firstName} {user.lastName}
                </p>
                <p className="text-xs text-gray-500">{user.email}</p>
              </div>
            </div>
            
         
            
            <button
              onClick={() => handleMenuItemClick('/plans')}
              className="flex items-center gap-3 w-full px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-md transition-colors"
            >
              <Crown className="w-4 h-4" />
              My Plans
            </button>
            
           
            
            <div className="border-t border-gray-100 mt-2 pt-2">
              <button
                onClick={onLogout}
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
  );
};

export default UserAvatar;