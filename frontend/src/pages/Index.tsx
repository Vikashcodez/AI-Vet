import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { ArrowRight, Clock, HandHeart, Cpu, Quote, Phone, Shield, RefreshCw, Truck, Scale, Crown, Check, Globe, LogIn, User, ChevronDown, Settings, LogOut } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { useState, useEffect, useRef } from "react";
import { useTokens } from "@/hooks/useTokens";
import { useAuth } from "@/contexts/AuthContext";



const Index = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [currency, setCurrency] = useState("INR");
  const { tokens, showPricing, setShowPricing } = useTokens();
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);

  const currencies = {
    INR: { symbol: "₹", monthly: 399, yearly: 4500 },
    USD: { symbol: "$", monthly: 4.99, yearly: 54.99 },
    EUR: { symbol: "€", monthly: 4.49, yearly: 49.99 },
    GBP: { symbol: "£", monthly: 3.99, yearly: 43.99 },
  };

  const handleGetStarted = () => {
    navigate('/symptoms');
  };

  const handleLogin = () => {
    navigate('/login');
  };

  const handleViewPlans = () => {
    navigate('/plans');
  };

  const handleLogout = () => {
  logout();
  setIsUserMenuOpen(false);
  // Force a page refresh to ensure all components re-render
  window.location.reload();
};
  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleMenuItemClick = (path: string) => {
    navigate(path);
    setIsUserMenuOpen(false);
  };
  
  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* Top Navigation */}
      <div className="bg-white py-4 px-4 sm:px-6 lg:px-8 shadow-sm">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-4">
            {/* <span className="text-sm text-gray-600">Free tokens remaining: {tokens}</span> */}
          </div>
          <div className="flex items-center space-x-4">
            {/* User Avatar or Login Button */}
            {user ? (
              <div className="relative" ref={userMenuRef}>
                <Button
                  variant="ghost"
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center space-x-2 px-3 py-2 hover:bg-gray-100"
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-[#00BFA6] to-[#00A896] flex items-center justify-center text-white text-sm font-medium">
                    {getInitials(user.firstName, user.lastName)}
                  </div>
                  <span className="hidden sm:block text-sm font-medium text-gray-700">
                    {user.firstName}
                  </span>
                  <ChevronDown className={`h-4 w-4 transition-transform ${isUserMenuOpen ? 'rotate-180' : ''}`} />
                </Button>

                {isUserMenuOpen && (
                  <div className="absolute right-0 top-full mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                    <div className="p-2">
                      <div className="flex items-center gap-3 px-3 py-2 mb-2 border-b border-gray-100">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-r from-[#00BFA6] to-[#00A896] flex items-center justify-center text-white text-sm font-medium">
                          {getInitials(user.firstName, user.lastName)}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {user.firstName} {user.lastName}
                          </p>
                          <p className="text-xs text-gray-500 truncate">{user.email}</p>
                        </div>
                      </div>
                      
                      <button
                        onClick={() => handleMenuItemClick('/dashboard')}
                        className="flex items-center gap-3 w-full px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-md transition-colors"
                      >
                        <User className="w-4 w-4" />
                        Dashboard
                      </button>
                      
                      <button
                        onClick={() => handleMenuItemClick('/pricing')}
                        className="flex items-center gap-3 w-full px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-md transition-colors"
                      >
                        <Crown className="w-4 w-4" />
                        My Plans
                      </button>
                      
                      <button
                        onClick={() => handleMenuItemClick('/account')}
                        className="flex items-center gap-3 w-full px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-md transition-colors"
                      >
                        <Settings className="w-4 w-4" />
                        My Account
                      </button>
                      
                      <div className="border-t border-gray-100 mt-2 pt-2">
                        <button
                          onClick={handleLogout}
                          className="flex items-center gap-3 w-full px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-md transition-colors"
                        >
                          <LogOut className="w-4 w-4" />
                          Logout
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <Button 
                variant="outline" 
                onClick={handleLogin}
                className="flex items-center space-x-2"
              >
                <LogIn className="h-4 w-4" />
                <span>Login</span>
              </Button>
            )}

            {/* View Plans Button - Always visible */}
            <Button 
              onClick={handleViewPlans}
              className="flex items-center space-x-2 bg-[#00BFA6] hover:bg-[#00A896] text-white"
            >
              <Crown className="h-4 w-4" />
              <span>View Plans</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <div className="relative overflow-hidden bg-[#e8f9f6] py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-12">
            <div className="w-full md:w-1/2 space-y-6 text-left animate-fadeIn">
              <span className="inline-block px-4 py-2 rounded-full bg-[#e8f9f6] text-medical-700 font-medium text-sm mb-2">
                Veterinary AI Assistant
              </span>
              <h1 className="text-4xl md:text-6xl font-bold text-gray-900 leading-tight">
                AI-Powered <span className="text-[#00BFA6]">Animal</span><br />
                <span className="text-[#00BFA6]">Healthcare</span>
              </h1>
              <p className="text-xl text-gray-600 max-w-lg">
                Get instant insights and personalized care recommendations for your animal using our advanced AI veterinary assistant.
                Start with our free plan including 3 symptom checks!
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 mt-6">
                <Button 
                  variant="lightGreen" 
                  onClick={handleGetStarted}
                  className="text-white bg-[#00BFA6] hover:bg-[#00A896] rounded-md py-3 px-6 text-lg flex items-center"
                >
                  Get Started Free <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
                
                <Button 
                  variant="outline"
                  onClick={handleViewPlans}
                  className="border-[#00BFA6] text-[#00BFA6] hover:bg-[#00BFA6] hover:text-white rounded-md py-3 px-6 text-lg flex items-center"
                >
                  <Crown className="mr-2 h-5 w-5" />
                  View All Plans
                </Button>
              </div>

              {/* Free Plan Highlights */}
              <div className="bg-white rounded-lg p-4 mt-6 border border-gray-200">
                <h4 className="font-semibold text-gray-900 mb-2">Free Plan Includes:</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li className="flex items-center">
                    <Check className="h-4 w-4 text-green-500 mr-2" />
                    AI Symptom Checker (3 free uses)
                  </li>
                  <li className="flex items-center">
                    <Check className="h-4 w-4 text-green-500 mr-2" />
                    Basic health insights
                  </li>
                  <li className="flex items-center">
                    <Check className="h-4 w-4 text-green-500 mr-2" />
                    No credit card required
                  </li>
                </ul>
              </div>
            </div>

            <div className="w-full md:w-1/2 animate-slideUp">
              <img 
                src="/lovable-uploads/c1f981a3-0e36-4c89-87f3-c4e42fcb1f0f.png" 
                alt="Veterinarian with dog" 
                className="w-full h-auto rounded-2xl"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="bg-gray-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-2 rounded-full bg-medical-100 text-medical-700 font-medium text-sm mb-3">
              Our Services
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Why Choose AIVeterinaryDoc?</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Comprehensive tools and solutions designed to provide the best care for your animal
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureCard 
              title="Symptom Checker"
              description="Analyze your animal's symptoms and get AI-powered insights on potential conditions. 3 free uses included."
              link="/symptoms"
              isFree={true}
            />
            
            <FeatureCard 
              title="Disease Prediction"
              description="Predict potential diseases based on symptoms and medical history."
              link="/disease-prediction"
              isFree={false}
            />
            
            <FeatureCard 
              title="Diet Evaluation"
              description="Get personalized diet recommendations for your animal's optimal health."
              link="/diet-evaluation"
              isFree={false}
            />
            
            <FeatureCard 
              title="Preventive Tips"
              description="Receive customized preventive healthcare tips for your animal."
              link="/preventive-tips"
              isFree={false}
            />
            
            <FeatureCard 
              title="Risk Predictor"
              description="Assess your animal's risk factors for various health conditions."
              link="/risk-predictor"
              isFree={false}
            />
            
            <FeatureCard 
              title="Vet Assistant"
              description="Connect with our AI vet assistant for immediate guidance."
              link="/vet"
              isFree={false}
            />
          </div>

          {/* Upgrade CTA */}
          <div className="text-center mt-12">
            <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-200 max-w-2xl mx-auto">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Ready for Unlimited Access?</h3>
              <p className="text-gray-600 mb-6">
                Upgrade to unlock all features including unlimited symptom checks, disease prediction, 
                diet planning, and premium support.
              </p>
              <Button 
                onClick={handleViewPlans}
                className="bg-[#00BFA6] hover:bg-[#00A896] text-white px-8 py-3 text-lg"
              >
                <Crown className="mr-2 h-5 w-5" />
                View Premium Plans
              </Button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Benefits Section */}
      <div className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-2 rounded-full bg-medical-100 text-medical-700 font-medium text-sm mb-3">
              Advantages
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Benefits of AI Vet</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              How our technology enhances your animal's healthcare experience
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <BenefitCard 
              icon={<Clock className="w-12 h-12 text-medical-500" />}
              title="24/7 Availability"
              description="Our AI vet has no working hours and never gets tired. Use our chatbot anytime, anywhere, and ask as many questions about your animal's health as you want."
            />
            
            <BenefitCard 
              icon={<HandHeart className="w-12 h-12 text-medical-500" />}
              title="Personalization"
              description="AI Vet screenings are tailored to your animal's specific needs, health history, and even lifestyle habits, helping to closely align AI with veterinary insights."
            />
            
            <BenefitCard 
              icon={<Cpu className="w-12 h-12 text-medical-500" />}
              title="Powered by NLP Models"
              description="Our AI vet assistant is driven by a natural language model, which enables it to approach your animal's health inquiries with advanced intelligence and understanding."
            />
          </div>
        </div>
      </div>
      
      {/* Testimonials Section */}
      <div className="py-20 bg-medical-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-2 rounded-full bg-medical-100 text-medical-700 font-medium text-sm mb-3">
              Testimonials
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Hear From Our Users</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Discover how our AI Vet has positively impacted animals' lives
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <TestimonialCard 
              quote="I've never felt more empowered in my animal's health journey. AI Vet provides instant, reliable insights that are easy to understand. It complements our vet visits perfectly by offering a readily available second opinion. Every animal owner should use this!"
              author="Monica A."
              image="/lovable-uploads/7c1c55a1-0d6b-4500-b2e3-9965e7ef0629.png"
            />
            
            <TestimonialCard 
              quote="AI Vet has made a significant difference in how I approach my animal's health. 24/7 it provides prompt, understandable responses to my health concerns. It's given me peace of mind and empowered me to be more proactive about my dog's health. Truly invaluable!"
              author="Harry L."
              image="/lovable-uploads/7c1c55a1-0d6b-4500-b2e3-9965e7ef0629.png"
            />
            
            <TestimonialCard 
              quote="Using AI Vet has been a game-changer for my cat. I love that I can ask health-related questions anytime. It's like having a virtual vet assistant in my pocket. It's convenient and makes understanding complex animal health topics much easier."
              author="Emily G."
              image="/lovable-uploads/7c1c55a1-0d6b-4500-b2e3-9965e7ef0629.png"
            />
          </div>
        </div>
      </div>
      
      {/* CTA Section */}
      <div className="bg-gradient-to-r from-medical-600 to-medical-700 py-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">Ready to improve your animal's health?</h2>
          <p className="text-xl text-medical-100 mb-8 max-w-2xl mx-auto">
            Join thousands of animal owners who trust AI Vet for personalized health guidance and peace of mind.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              onClick={handleGetStarted}
              className="bg-white text-medical-700 hover:bg-gray-100 px-8 py-3 text-lg"
            >
              Start Free Trial
            </Button>
            <Button 
              onClick={handleViewPlans}
              variant="outline"
              className="border-white text-white hover:bg-white hover:text-medical-700 px-8 py-3 text-lg"
            >
              View All Plans
            </Button>
          </div>
          <p className="text-medical-200 mt-4 text-sm">
            No credit card required • 3 free symptom checks included
          </p>
        </div>
      </div>
      
      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-4">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <h3 className="text-2xl font-bold">AI Vet</h3>
            <p className="text-gray-400">AI-Powered Animal Healthcare</p>
            <p className="text-gray-400">Transforming animal wellness through artificial intelligence.</p>
          </div>
          
          <div className="space-y-4">
            <h4 className="text-lg font-semibold">Services</h4>
            <div className="flex flex-col gap-2">
              <Link to="/symptoms" className="text-gray-300 hover:text-white transition-colors">Symptoms Checker</Link>
              <Link to="/disease-prediction" className="text-gray-300 hover:text-white transition-colors">Disease Prediction</Link>
              <Link to="/risk-predictor" className="text-gray-300 hover:text-white transition-colors">Risk Predictor</Link>
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="text-lg font-semibold">Resources</h4>
            <div className="flex flex-col gap-2">
              <Link to="/preventive-tips" className="text-gray-300 hover:text-white transition-colors">Preventive Tips</Link>
              <Link to="/diet-evaluation" className="text-gray-300 hover:text-white transition-colors">Diet Evaluation</Link>
              <Link to="/pricing" className="text-gray-300 hover:text-white transition-colors">Pricing & Plans</Link>
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="text-lg font-semibold">Legal</h4>
            <div className="flex flex-col gap-2">
              <Link to="/privacy-policy" className="text-gray-300 hover:text-white transition-colors">Privacy Policy</Link>
              <Link to="/terms-conditions" className="text-gray-300 hover:text-white transition-colors">Terms & Conditions</Link>
              <Link to="/cancellation-refund" className="text-gray-300 hover:text-white transition-colors">Cancellation & Refund</Link>
              <Link to="/contact" className="text-gray-300 hover:text-white transition-colors">Contact Us</Link>
            </div>
          </div>
        </div>
        
        <div className="max-w-7xl mx-auto mt-12 pt-8 border-t border-gray-800">
          <div className="text-center text-gray-500 text-sm">
            <p>© {new Date().getFullYear()} AI Vet. All rights reserved.</p>
            <p className="mt-2">This is an AI-powered tool and should not replace professional veterinary advice.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

// Updated FeatureCard with free/premium indicators
const FeatureCard = ({ title, description, link, isFree }: { title: string; description: string; link: string; isFree: boolean }) => {
  return (
    <Card className="overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1 bg-white h-full">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-xl font-semibold text-medical-700">{title}</h3>
          {isFree ? (
            <span className="bg-green-100 text-green-800 text-xs font-medium px-2 py-1 rounded-full">
              Free
            </span>
          ) : (
            <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded-full">
              Premium
            </span>
          )}
        </div>
        <p className="text-gray-600 mb-4">{description}</p>
        <Link to={link}>
          <Button variant="ghost" className="group text-medical-600 p-0 hover:text-medical-700 hover:bg-transparent">
            Learn more 
            <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
};

const BenefitCard = ({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) => {
  return (
    <div className="flex flex-col items-center md:items-start text-center md:text-left">
      <div className="mb-5 p-4 rounded-2xl bg-medical-50">
        {icon}
      </div>
      <h3 className="text-xl font-semibold mb-3 text-gray-800">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  );
};

const TestimonialCard = ({ quote, author, image }: { quote: string; author: string; image: string }) => {
  return (
    <Card className={cn(
      "relative overflow-hidden bg-white p-8 rounded-xl shadow-md hover:shadow-lg transition-all h-full",
      "before:content-[''] before:absolute before:top-0 before:left-0 before:w-full before:h-1 before:bg-medical-500"
    )}>
      <Quote className="text-medical-100 w-10 h-10 mb-4" />
      <div className="pt-2">
        <p className="text-gray-700 italic mb-6">{quote}</p>
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full overflow-hidden bg-medical-100">
            <img 
              src={image} 
              alt={author} 
              className="w-full h-full object-cover"
            />
          </div>
          <p className="font-semibold text-medical-700">{author}</p>
        </div>
      </div>
    </Card>
  );
};

export default Index;