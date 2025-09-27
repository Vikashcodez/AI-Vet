import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Check, Crown, Globe } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Pricing = () => {
  const navigate = useNavigate();
  const [currency, setCurrency] = useState("INR");

  const currencies = {
    INR: { symbol: "₹", monthly: 399, yearly: 4500 },
    USD: { symbol: "$", monthly: 4.99, yearly: 54.99 },
    EUR: { symbol: "€", monthly: 4.49, yearly: 49.99 },
    GBP: { symbol: "£", monthly: 3.99, yearly: 43.99 },
  };

  const handleGetStarted = () => {
    navigate('/symptoms');
  };

  const handleChoosePlan = (plan: string) => {
    // Handle plan selection logic here
    console.log(`Selected plan: ${plan}`);
    // You can add payment integration or redirect to payment page
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Choose Your Plan
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Select the plan that works best for you and your animal's healthcare needs
          </p>
        </div>

        {/* Currency Selector */}
        <div className="flex justify-center mb-12">
          <div className="flex items-center space-x-2">
            <Globe className="h-5 w-5 text-gray-500" />
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
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {/* Free Plan */}
          <Card className="relative overflow-hidden border-2 border-gray-200">
            <CardContent className="p-6">
              <div className="text-center space-y-4">
                <h3 className="text-xl font-semibold text-gray-900">Free Plan</h3>
                <div className="space-y-2">
                  <div className="text-3xl font-bold text-gray-900">Free</div>
                  <p className="text-sm text-muted-foreground">Forever</p>
                </div>
                
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-center">
                    <Check className="h-4 w-4 text-green-500 mr-2" />
                    AI Symptom Checker (3 uses)
                  </li>
                  <li className="flex items-center text-gray-400">
                    <Check className="h-4 w-4 text-gray-300 mr-2" />
                    Disease Prediction Analysis
                  </li>
                  <li className="flex items-center text-gray-400">
                    <Check className="h-4 w-4 text-gray-300 mr-2" />
                    Diet Evaluation & Planning
                  </li>
                  <li className="flex items-center text-gray-400">
                    <Check className="h-4 w-4 text-gray-300 mr-2" />
                    Preventive Healthcare Tips
                  </li>
                  <li className="flex items-center text-gray-400">
                    <Check className="h-4 w-4 text-gray-300 mr-2" />
                    Health Risk Predictor
                  </li>
                  <li className="flex items-center text-gray-400">
                    <Check className="h-4 w-4 text-gray-300 mr-2" />
                    AI Veterinary Assistant
                  </li>
                  <li className="flex items-center text-gray-400">
                    <Check className="h-4 w-4 text-gray-300 mr-2" />
                    Activity Level Assessment
                  </li>
                  <li className="flex items-center text-gray-400">
                    <Check className="h-4 w-4 text-gray-300 mr-2" />
                    Digital Prescription Generator
                  </li>
                  <li className="flex items-center text-gray-400">
                    <Check className="h-4 w-4 text-gray-300 mr-2" />
                    24/7 Support
                  </li>
                </ul>
                
                <Button 
                  className="w-full" 
                  variant="outline"
                  onClick={() => handleGetStarted()}
                >
                  Get Started Free
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Monthly Plan */}
          <Card className="relative overflow-hidden border-2 border-[#00BFA6] shadow-lg">
            <div className="absolute top-0 left-0 right-0 bg-[#00BFA6] text-white text-center py-2 text-sm font-medium">
              Popular
            </div>
            <CardContent className="p-6 pt-12">
              <div className="text-center space-y-4">
                <h3 className="text-xl font-semibold text-gray-900">Monthly Plan</h3>
                <div className="space-y-2">
                  <div className="text-3xl font-bold text-[#00BFA6]">
                    {currencies[currency as keyof typeof currencies].symbol}
                    {currencies[currency as keyof typeof currencies].monthly}
                  </div>
                  <p className="text-sm text-muted-foreground">per month</p>
                </div>
                
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-center">
                    <Check className="h-4 w-4 text-green-500 mr-2" />
                    AI Symptom Checker (Unlimited)
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
                
                <Button 
                  className="w-full bg-[#00BFA6] hover:bg-[#00A896] text-white"
                  onClick={() => handleChoosePlan('monthly')}
                >
                  Choose Monthly
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Yearly Plan */}
          <Card className="relative overflow-hidden border-2 border-yellow-400 shadow-lg">
            <div className="absolute top-0 left-0 right-0 bg-yellow-400 text-gray-900 text-center py-2 text-sm font-medium">
              Best Value
            </div>
            <CardContent className="p-6 pt-12">
              <div className="text-center space-y-4">
                <h3 className="text-xl font-semibold text-gray-900">Yearly Plan</h3>
                <div className="space-y-2">
                  <div className="text-3xl font-bold text-yellow-600">
                    {currencies[currency as keyof typeof currencies].symbol}
                    {currencies[currency as keyof typeof currencies].yearly}
                  </div>
                  <p className="text-sm text-muted-foreground">per year</p>
                  <p className="text-xs text-green-600 font-medium">Save 25%</p>
                </div>
                
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-center">
                    <Check className="h-4 w-4 text-green-500 mr-2" />
                    AI Symptom Checker (Unlimited)
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
                
                <Button 
                  className="w-full bg-yellow-400 hover:bg-yellow-500 text-gray-900"
                  onClick={() => handleChoosePlan('yearly')}
                >
                  Choose Yearly
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Additional Info */}
        <div className="text-center mt-12 text-gray-600">
          <p>All plans include a 7-day money-back guarantee</p>
        </div>
      </div>
    </div>
  );
};

export default Pricing;