import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { ArrowRight, Clock, HandHeart, Cpu, Quote, Phone, Shield, RefreshCw, Truck, Scale, Crown, Check, Globe, LogIn } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";
import { useTokens } from "@/hooks/useTokens";

const Index = () => {
  const navigate = useNavigate();
  const [currency, setCurrency] = useState("INR");
  const { tokens, showPricing, setShowPricing } = useTokens();

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
  
  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* Top Navigation */}
      <div className="bg-white py-4 px-4 sm:px-6 lg:px-8 shadow-sm">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-600">Free tokens remaining: {tokens}</span>
          </div>
          <div className="flex items-center space-x-4">
            <Button 
              variant="outline" 
              onClick={handleLogin}
              className="flex items-center space-x-2"
            >
              <LogIn className="h-4 w-4" />
              <span>Login</span>
            </Button>
            <Dialog open={showPricing} onOpenChange={setShowPricing}>
              <DialogTrigger asChild>
                <Button variant="outline" className="flex items-center space-x-2">
                  <Crown className="h-4 w-4" />
                  <span>Pricing</span>
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle className="text-2xl font-bold text-center">Choose Your Plan</DialogTitle>
                </DialogHeader>
                
                <div className="space-y-6">
                  {/* Currency Selector */}
                  <div className="flex justify-center">
                    <div className="flex items-center space-x-2">
                      <Globe className="h-4 w-4 text-gray-500" />
                      <Select value={currency} onValueChange={setCurrency}>
                        <SelectTrigger className="w-32">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="INR">🇮🇳 INR</SelectItem>
                          <SelectItem value="USD">🇺🇸 USD</SelectItem>
                          <SelectItem value="EUR">🇪🇺 EUR</SelectItem>
                          <SelectItem value="GBP">🇬🇧 GBP</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* Pricing Cards */}
                  <div className="grid md:grid-cols-2 gap-6">
                    {/* Monthly Plan */}
                    <Card className="relative overflow-hidden border-2 hover:border-primary/50 transition-colors">
                      <CardContent className="p-6">
                        <div className="text-center space-y-4">
                          <h3 className="text-xl font-semibold">Monthly Plan</h3>
                          <div className="space-y-2">
                            <div className="text-3xl font-bold text-primary">
                              {currencies[currency as keyof typeof currencies].symbol}
                              {currencies[currency as keyof typeof currencies].monthly}
                            </div>
                            <p className="text-sm text-muted-foreground">per month</p>
                          </div>
                          
                          <ul className="space-y-2 text-sm">
                            <li className="flex items-center">
                              <Check className="h-4 w-4 text-green-500 mr-2" />
                              AI Symptom Checker
                            </li>
                            <li className="flex items-center">
                              <Check className="h-4 w-4 text-green-500 mr-2" />
                              Disease Prediction Analysis
                            </li>
                            <li className="flex items-center">
                              <Check className="h-4 w-4 text-green-500 mr-2" />
                              Diet Evaluation & Planning
                            </li>
                            <li className="flex items-center">
                              <Check className="h-4 w-4 text-green-500 mr-2" />
                              Preventive Healthcare Tips
                            </li>
                            <li className="flex items-center">
                              <Check className="h-4 w-4 text-green-500 mr-2" />
                              Health Risk Predictor
                            </li>
                            <li className="flex items-center">
                              <Check className="h-4 w-4 text-green-500 mr-2" />
                              AI Veterinary Assistant
                            </li>
                            <li className="flex items-center">
                              <Check className="h-4 w-4 text-green-500 mr-2" />
                              Activity Level Assessment
                            </li>
                            <li className="flex items-center">
                              <Check className="h-4 w-4 text-green-500 mr-2" />
                              Digital Prescription Generator
                            </li>
                            <li className="flex items-center">
                              <Check className="h-4 w-4 text-green-500 mr-2" />
                              24/7 Support
                            </li>
                          </ul>
                          
                          <Button className="w-full" variant="default">
                            Choose Monthly
                          </Button>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Yearly Plan */}
                    <Card className="relative overflow-hidden border-2 border-primary shadow-lg">
                      <div className="absolute top-0 left-0 right-0 bg-primary text-white text-center py-2 text-sm font-medium">
                        Most Popular
                      </div>
                      <CardContent className="p-6 pt-12">
                        <div className="text-center space-y-4">
                          <h3 className="text-xl font-semibold">Yearly Plan</h3>
                          <div className="space-y-2">
                            <div className="text-3xl font-bold text-primary">
                              {currencies[currency as keyof typeof currencies].symbol}
                              {currencies[currency as keyof typeof currencies].yearly}
                            </div>
                            <p className="text-sm text-muted-foreground">per year</p>
                            <p className="text-xs text-green-600 font-medium">Save 25%</p>
                          </div>
                          
                          <ul className="space-y-2 text-sm">
                            <li className="flex items-center">
                              <Check className="h-4 w-4 text-green-500 mr-2" />
                              AI Symptom Checker
                            </li>
                            <li className="flex items-center">
                              <Check className="h-4 w-4 text-green-500 mr-2" />
                              Disease Prediction Analysis
                            </li>
                            <li className="flex items-center">
                              <Check className="h-4 w-4 text-green-500 mr-2" />
                              Diet Evaluation & Planning
                            </li>
                            <li className="flex items-center">
                              <Check className="h-4 w-4 text-green-500 mr-2" />
                              Preventive Healthcare Tips
                            </li>
                            <li className="flex items-center">
                              <Check className="h-4 w-4 text-green-500 mr-2" />
                              Health Risk Predictor
                            </li>
                            <li className="flex items-center">
                              <Check className="h-4 w-4 text-green-500 mr-2" />
                              AI Veterinary Assistant
                            </li>
                            <li className="flex items-center">
                              <Check className="h-4 w-4 text-green-500 mr-2" />
                              Activity Level Assessment
                            </li>
                            <li className="flex items-center">
                              <Check className="h-4 w-4 text-green-500 mr-2" />
                              Digital Prescription Generator
                            </li>
                            <li className="flex items-center">
                              <Check className="h-4 w-4 text-green-500 mr-2" />
                              Advanced Health Analytics
                            </li>
                            <li className="flex items-center">
                              <Check className="h-4 w-4 text-green-500 mr-2" />
                              Priority Support & Updates
                            </li>
                          </ul>
                          
                          <Button className="w-full" variant="default">
                            Choose Yearly
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>

      {/* Rest of your existing code remains the same */}
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
              </p>
              
              <Button 
                variant="lightGreen" 
                onClick={handleGetStarted}
                className="text-white bg-[#00BFA6] hover:bg-[#00A896] rounded-md py-3 px-6 text-lg flex items-center mt-4"
              >
                Get Started <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
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
              description="Analyze your animal's symptoms and get AI-powered insights on potential conditions."
              link="/symptoms"
            />
            
            <FeatureCard 
              title="Disease Prediction"
              description="Predict potential diseases based on symptoms and medical history."
              link="/disease-prediction"
            />
            
            <FeatureCard 
              title="Diet Evaluation"
              description="Get personalized diet recommendations for your animal's optimal health."
              link="/diet-evaluation"
            />
            
            <FeatureCard 
              title="Preventive Tips"
              description="Receive customized preventive healthcare tips for your animal."
              link="/preventive-tips"
            />
            
            <FeatureCard 
              title="Risk Predictor"
              description="Assess your animal's risk factors for various health conditions."
              link="/risk-predictor"
            />
            
            <FeatureCard 
              title="Vet Assistant"
              description="Connect with our AI vet assistant for immediate guidance."
              link="/vet"
            />
          </div>
        </div>
      </div>
      
      {/* Rest of your existing components remain the same */}
      {/* ... (Benefits, Testimonials, CTA, Footer sections) */}
    </div>
  );
};

// Your existing FeatureCard, BenefitCard, TestimonialCard components remain the same
const FeatureCard = ({ title, description, link }: { title: string; description: string; link: string }) => {
  return (
    <Card className="overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1 bg-white h-full">
      <CardContent className="p-6">
        <h3 className="text-xl font-semibold mb-3 text-medical-700">{title}</h3>
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