import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { 
  AlertCircle, 
  Cat, 
  Activity, 
  AlertTriangle,
  CheckCircle,
  Calendar,
  MoreHorizontal,
  Send,
  Globe,
  Check
} from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { analyzeVetSymptoms } from "@/utils/geminiApi";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import MedicalSidebar, { MobileSidebarButton } from "@/components/Sidebar";
import { useTokens } from "@/hooks/useTokens";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface DiagnosisResult {
  diagnosis: string;
  severity: "low" | "medium" | "high";
  nextSteps: string;
  preventiveTips: string;
}

export default function VetAssistant() {
  const [animalType, setAnimalType] = useState("");
  const [animalAge, setAnimalAge] = useState("");
  const [symptoms, setSymptoms] = useState("");
  const [recentChanges, setRecentChanges] = useState("");
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [diagnosis, setDiagnosis] = useState<DiagnosisResult | null>(null);
  const [currency, setCurrency] = useState("INR");
  const { tokens, useToken, showPricing, setShowPricing } = useTokens();

  const currencies = {
    INR: { symbol: "₹", monthly: 399, yearly: 4500 },
    USD: { symbol: "$", monthly: 4.99, yearly: 54.99 },
    EUR: { symbol: "€", monthly: 4.49, yearly: 49.99 },
    GBP: { symbol: "£", monthly: 3.99, yearly: 43.99 },
  };

  const handleNext = () => {
    if (currentStep === 1 && !animalType.trim()) {
      toast.error("Please enter your animal type");
      return;
    }
    if (currentStep === 2 && !animalAge.trim()) {
      toast.error("Please enter your animal's age");
      return;
    }
    if (currentStep === 3 && !symptoms.trim()) {
      toast.error("Please describe the symptoms");
      return;
    }
    
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    } else {
      handleAnalyze();
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleReset = () => {
    setAnimalType("");
    setAnimalAge("");
    setSymptoms("");
    setRecentChanges("");
    setCurrentStep(1);
    setDiagnosis(null);
  };

  const handleAnalyze = async () => {
    // Check tokens before proceeding
    if (!useToken()) {
      return; // Token check failed, pricing modal will show
    }

    setLoading(true);
    
    try {
      const result = await analyzeVetSymptoms({
        animalType,
        animalAge,
        symptoms,
        recentChanges
      });
      
      setDiagnosis(result);
      toast.success("Analysis complete!");
    } catch (error) {
      console.error("Error analyzing symptoms:", error);
      toast.error("Unable to analyze. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "low": return "bg-green-100 text-green-700";
      case "medium": return "bg-yellow-100 text-yellow-700";
      case "high": return "bg-red-100 text-red-700";
      default: return "bg-gray-100 text-gray-700";
    }
  };
  
  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case "low": return <CheckCircle className="h-5 w-5 text-green-500" />;
      case "medium": return <AlertCircle className="h-5 w-5 text-yellow-500" />;
      case "high": return <AlertTriangle className="h-5 w-5 text-red-500" />;
      default: return null;
    }
  };

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <MedicalSidebar />
        <SidebarInset>
          {/* Fixed mobile header with button */}
          <MobileSidebarButton />
          
          {/* Pricing Modal */}
          <Dialog open={showPricing} onOpenChange={setShowPricing}>
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
                    <div className="p-6">
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
                    </div>
                  </Card>

                  {/* Yearly Plan */}
                  <Card className="relative overflow-hidden border-2 border-primary shadow-lg">
                    <div className="absolute top-0 left-0 right-0 bg-primary text-white text-center py-2 text-sm font-medium">
                      Most Popular
                    </div>
                    <div className="p-6 pt-12">
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
                    </div>
                  </Card>
                </div>
              </div>
            </DialogContent>
          </Dialog>
          
          <div className="min-h-screen p-4 bg-gradient-to-br from-blue-50 to-purple-50">
            <div className="max-w-3xl mx-auto space-y-8 pt-8">
              <div className="text-right mb-4">
                {/* <span className="text-sm text-gray-600">Free tokens remaining: {tokens}</span> */}
              </div>
              <Card className="p-8 bg-white/80 backdrop-blur-lg border border-gray-100 rounded-xl shadow-lg">
                <div className="flex justify-between items-center mb-6">
                  <div className="flex items-center gap-2">
                    <Cat className="h-6 w-6 text-purple-500" />
                    <h1 className="text-3xl font-bold text-gray-900">Veterinary AI Assistant</h1>
                  </div>
                  {diagnosis && (
                    <Button
                      variant="outline"
                      className="flex items-center gap-2"
                      onClick={handleReset}
                    >
                      New Consultation
                    </Button>
                  )}
                </div>

                {!diagnosis ? (
                  <div className="space-y-6">
                    <div className="flex justify-between items-center">
                      <h2 className="text-xl font-semibold text-gray-800">
                        {currentStep === 1 && "Animal Information"}
                        {currentStep === 2 && "Animal Age"}
                        {currentStep === 3 && "Symptoms"}
                        {currentStep === 4 && "Recent Changes"}
                      </h2>
                      <div className="text-sm text-gray-500">
                        Step {currentStep} of 4
                      </div>
                    </div>

                    {currentStep === 1 && (
                      <div className="space-y-4">
                        <Label htmlFor="animalType" className="text-gray-700">What type of animal do you need help with?</Label>
                        <Input
                          id="animalType"
                          value={animalType}
                          onChange={(e) => setAnimalType(e.target.value)}
                          placeholder="Enter animal type"
                          className="w-full"
                        />
                      </div>
                    )}

                    {currentStep === 2 && (
                      <div className="space-y-4">
                        <Label htmlFor="animalAge" className="text-gray-700">How old is your {animalType}?</Label>
                        <Input
                          id="animalAge"
                          value={animalAge}
                          onChange={(e) => setAnimalAge(e.target.value)}
                          placeholder="Enter age (e.g., 3 years, 6 months)"
                          className="w-full"
                        />
                      </div>
                    )}

                    {currentStep === 3 && (
                      <div className="space-y-4">
                        <Label htmlFor="symptoms" className="text-gray-700">
                          Please describe the symptoms your {animalType} is experiencing
                          <span className="text-gray-500 text-sm block mt-1">Be as detailed as possible</span>
                        </Label>
                        <Textarea
                          id="symptoms"
                          value={symptoms}
                          onChange={(e) => setSymptoms(e.target.value)}
                          placeholder="Describe any symptoms you've observed..."
                          className="min-h-[150px] resize-none"
                        />
                      </div>
                    )}

                    {currentStep === 4 && (
                      <div className="space-y-4">
                        <Label htmlFor="recentChanges" className="text-gray-700">
                          Any recent changes in diet, environment, or behavior?
                          <span className="text-gray-500 text-sm block mt-1">Optional, but helpful for diagnosis</span>
                        </Label>
                        <Textarea
                          id="recentChanges"
                          value={recentChanges}
                          onChange={(e) => setRecentChanges(e.target.value)}
                          placeholder="Describe any recent changes..."
                          className="min-h-[150px] resize-none"
                        />
                      </div>
                    )}

                    <div className="flex justify-between pt-4">
                      {currentStep > 1 ? (
                        <Button 
                          type="button" 
                          variant="outline"
                          onClick={handleBack}
                        >
                          Back
                        </Button>
                      ) : (
                        <div></div>
                      )}
                      
                      <Button 
                        type="button"
                        variant="modern"
                        className="bg-purple-600 hover:bg-purple-700"
                        onClick={handleNext}
                        disabled={loading}
                      >
                        {currentStep < 4 ? (
                          "Next"
                        ) : (
                          <>
                            {loading ? "Analyzing..." : "Get Diagnosis"}
                            {!loading && <Send className="ml-2 h-4 w-4" />}
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-6 animate-fadeIn">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <Activity className="h-5 w-5 text-purple-500" />
                        <h3 className="text-lg font-semibold text-gray-800">Diagnosis</h3>
                      </div>
                      <p className="text-gray-700">{diagnosis.diagnosis}</p>
                    </div>

                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <AlertCircle className="h-5 w-5 text-purple-500" />
                        <h3 className="text-lg font-semibold text-gray-800">Severity</h3>
                      </div>
                      <div className="flex items-center">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm ${getSeverityColor(diagnosis.severity)}`}>
                          {getSeverityIcon(diagnosis.severity)}
                          <span className="ml-1 capitalize">{diagnosis.severity}</span>
                        </span>
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <CheckCircle className="h-5 w-5 text-purple-500" />
                        <h3 className="text-lg font-semibold text-gray-800">Recommended Next Steps</h3>
                      </div>
                      <p className="text-gray-700">{diagnosis.nextSteps}</p>
                    </div>

                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <MoreHorizontal className="h-5 w-5 text-purple-500" />
                        <h3 className="text-lg font-semibold text-gray-800">Preventive Tips</h3>
                      </div>
                      <p className="text-gray-700">{diagnosis.preventiveTips}</p>
                    </div>

                    <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-100">
                      <p className="text-sm text-blue-800 font-medium">
                        <strong>Disclaimer:</strong> This is not a substitute for a real vet. Please consult a licensed veterinarian for confirmation.
                      </p>
                    </div>
                  </div>
                )}
              </Card>
            </div>
          </div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
