import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Stethoscope, RotateCcw, AlertTriangle, Check, Zap, Star } from "lucide-react";
import { analyzeSymptoms, MedicalAnalysis } from "@/utils/geminiApi";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import MedicalSidebar, { MobileSidebarButton } from "@/components/Sidebar";
import { useTokens } from "@/hooks/useTokens";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Crown, Check as CheckIcon, Globe } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function Symptoms() {
  const [symptoms, setSymptoms] = useState("");
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState<MedicalAnalysis | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [currency, setCurrency] = useState("INR");
  const { tokens, useToken, showPricing, setShowPricing } = useTokens();

  const currencies = {
    INR: { symbol: "₹", monthly: 399, yearly: 4500 },
    USD: { symbol: "$", monthly: 4.99, yearly: 54.99 },
    EUR: { symbol: "€", monthly: 4.49, yearly: 49.99 },
    GBP: { symbol: "£", monthly: 3.99, yearly: 43.99 },
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!symptoms.trim()) {
      toast.error("Please enter your animal's symptoms");
      return;
    }

    // Check tokens before proceeding
    if (!useToken()) {
      return; // Token check failed, pricing modal will show
    }

    setLoading(true);
    setAnalysis(null);
    setError(null);

    try {
      const result = await analyzeSymptoms(symptoms);
      
      // Check if we got the fallback "Analysis Failed" response
      if (result.condition === "Analysis Failed") {
        setError("Our AI couldn't analyze these symptoms properly. Please provide more detailed information about your animal.");
        toast.error("Could not analyze symptoms");
      } else {
        setAnalysis(result);
        toast.success("Analysis complete!");
      }
    } catch (error) {
      console.error("Error analyzing symptoms:", error);
      setError("There was a problem connecting to our AI service. Please try again later.");
      toast.error("Unable to analyze symptoms. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setSymptoms("");
    setAnalysis(null);
    setError(null);
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
                            <CheckIcon className="h-4 w-4 text-green-500 mr-2" />
                            AI Symptom Checker
                          </li>
                          <li className="flex items-center">
                            <CheckIcon className="h-4 w-4 text-green-500 mr-2" />
                            Disease Prediction Analysis
                          </li>
                          <li className="flex items-center">
                            <CheckIcon className="h-4 w-4 text-green-500 mr-2" />
                            Diet Evaluation & Planning
                          </li>
                          <li className="flex items-center">
                            <CheckIcon className="h-4 w-4 text-green-500 mr-2" />
                            Preventive Healthcare Tips
                          </li>
                          <li className="flex items-center">
                            <CheckIcon className="h-4 w-4 text-green-500 mr-2" />
                            Health Risk Predictor
                          </li>
                          <li className="flex items-center">
                            <CheckIcon className="h-4 w-4 text-green-500 mr-2" />
                            AI Veterinary Assistant
                          </li>
                          <li className="flex items-center">
                            <CheckIcon className="h-4 w-4 text-green-500 mr-2" />
                            Activity Level Assessment
                          </li>
                          <li className="flex items-center">
                            <CheckIcon className="h-4 w-4 text-green-500 mr-2" />
                            Digital Prescription Generator
                          </li>
                          <li className="flex items-center">
                            <CheckIcon className="h-4 w-4 text-green-500 mr-2" />
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
                            <CheckIcon className="h-4 w-4 text-green-500 mr-2" />
                            AI Symptom Checker
                          </li>
                          <li className="flex items-center">
                            <CheckIcon className="h-4 w-4 text-green-500 mr-2" />
                            Disease Prediction Analysis
                          </li>
                          <li className="flex items-center">
                            <CheckIcon className="h-4 w-4 text-green-500 mr-2" />
                            Diet Evaluation & Planning
                          </li>
                          <li className="flex items-center">
                            <CheckIcon className="h-4 w-4 text-green-500 mr-2" />
                            Preventive Healthcare Tips
                          </li>
                          <li className="flex items-center">
                            <CheckIcon className="h-4 w-4 text-green-500 mr-2" />
                            Health Risk Predictor
                          </li>
                          <li className="flex items-center">
                            <CheckIcon className="h-4 w-4 text-green-500 mr-2" />
                            AI Veterinary Assistant
                          </li>
                          <li className="flex items-center">
                            <CheckIcon className="h-4 w-4 text-green-500 mr-2" />
                            Activity Level Assessment
                          </li>
                          <li className="flex items-center">
                            <CheckIcon className="h-4 w-4 text-green-500 mr-2" />
                            Digital Prescription Generator
                          </li>
                          <li className="flex items-center">
                            <CheckIcon className="h-4 w-4 text-green-500 mr-2" />
                            Advanced Health Analytics
                          </li>
                          <li className="flex items-center">
                            <CheckIcon className="h-4 w-4 text-green-500 mr-2" />
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
          
          <div className="container mx-auto p-4 pt-20 md:pt-4">
            <div className="max-w-4xl mx-auto">
              <div className="mb-4 text-right">
                <span className="text-sm text-gray-600">Free tokens remaining: {tokens}</span>
              </div>
              <Card className="p-8 bg-white shadow-md border-0 rounded-xl">
                {!analysis && !error && (
                  <>
                    <h2 className="text-3xl font-bold mb-2 text-gray-800">Symptom Checker</h2>
                    <p className="text-gray-600 mb-6">Analyze animal symptoms and suggest possible illness</p>
                    
                    <form onSubmit={handleSubmit}>
                      <div className="space-y-6">
                        <div>
                          <label className="block text-gray-700 font-medium mb-2">
                            Describe your animal's symptoms
                          </label>
                          <Textarea 
                            value={symptoms}
                            onChange={(e) => setSymptoms(e.target.value)}
                            placeholder="Please describe your animal's symptoms in detail (e.g., vomiting, lethargy, limping)..."
                            className="min-h-[250px] w-full border rounded-md p-3 focus:ring-medical-500 focus:border-medical-500"
                          />
                        </div>
                        
                        <Button 
                          type="submit"
                          variant="modern"
                          className="w-full py-3 rounded-md flex items-center justify-center gap-2 transition-all"
                          disabled={loading}
                        >
                          <Stethoscope className="h-5 w-5" />
                          {loading ? "Analyzing..." : "Analyze Animal Symptoms"}
                        </Button>
                      </div>
                    </form>
                  </>
                )}
                
                {error && (
                <Card className="p-8 bg-white/80 backdrop-blur-lg border border-red-100 rounded-xl shadow-lg animate-fadeIn">
                  <div className="space-y-4">
                    <div className="flex items-center text-red-500 gap-2">
                      <AlertTriangle size={20} />
                      <h3 className="font-semibold text-xl">Analysis Error</h3>
                    </div>
                    <p className="text-gray-700">{error}</p>
                    <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                      <p className="font-medium">Tips for better results:</p>
                      <ul className="list-disc list-inside text-gray-600 space-y-1">
                        <li>Specify the type of animal (dog, cat, bird, etc.)</li>
                        <li>Include the age of your animal</li>
                        <li>List all symptoms in detail</li>
                        <li>Mention when symptoms started</li>
                        <li>Include any changes in diet, behavior or environment</li>
                      </ul>
                    </div>
                    <Button 
                      onClick={handleReset}
                      variant="outline"
                    >
                      Try Again
                    </Button>
                  </div>
                </Card>
              )}

              {analysis && !error && (
                <div className="space-y-6 animate-fadeIn">
                  {/* Basic Analysis Results Section */}
                  <Card className="p-8 bg-white/80 backdrop-blur-lg border border-green-100 rounded-xl shadow-lg">
                    <div className="flex items-center gap-2 mb-4 text-green-700">
                      <Check className="h-6 w-6" />
                      <h2 className="font-bold text-xl">Basic Analysis Results</h2>
                    </div>
                    <div className="space-y-4">
                      <div>
                        <h3 className="font-semibold text-lg text-gray-900">Possible Condition</h3>
                        <p className="text-gray-900 font-medium">{analysis.condition}</p>
                      </div>
                    </div>
                  </Card>
                  
                  {/* Advanced AI Analysis Section */}
                  <Card className="p-8 bg-white/80 backdrop-blur-lg border border-purple-100 rounded-xl shadow-lg">
                    <div className="flex items-center gap-2 mb-4 text-purple-700">
                      <Zap className="h-6 w-6" />
                      <h2 className="font-bold text-xl">Advanced AI Analysis</h2>
                    </div>
                    <div className="space-y-4">
                      <div>
                        <h3 className="font-semibold text-lg text-gray-900">Detailed Assessment</h3>
                        <p className="text-gray-700">{analysis.description}</p>
                      </div>
                    </div>
                  </Card>

                  {/* Recommendations Section */}
                  <Card className="p-8 bg-white/80 backdrop-blur-lg border border-blue-100 rounded-xl shadow-lg">
                    <div className="flex items-center gap-2 mb-4 text-blue-700">
                      <Star className="h-6 w-6" />
                      <h2 className="font-bold text-xl">Recommendations</h2>
                    </div>
                    <div className="space-y-4">
                      <div>
                        <p className="text-gray-700">{analysis.recommendations}</p>
                      </div>
                      
                      <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                        <p className="text-sm text-blue-700">
                          <strong>Disclaimer:</strong> This is an AI-powered veterinary analysis powered by Google's Gemini and should not replace professional veterinary advice. 
                          Please consult with a veterinarian for proper diagnosis and treatment of your animal.
                        </p>
                      </div>
                    </div>
                  </Card>
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
