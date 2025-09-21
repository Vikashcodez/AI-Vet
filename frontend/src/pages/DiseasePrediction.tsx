
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Shield, RotateCcw, AlertTriangle, Clock, Calendar, ActivitySquare } from "lucide-react";
import { predictDiseaseRisks, DiseasePredictionInput, DiseasePredictionResult } from "@/utils/geminiApi";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import MedicalSidebar, { MobileSidebarButton } from "@/components/Sidebar";

export default function DiseasePrediction() {
  const [formData, setFormData] = useState<DiseasePredictionInput>({
    animalType: "",
    animalBreed: "",
    animalAge: "",
    symptoms: "",
    lifestyle: "",
  });
  const [loading, setLoading] = useState(false);
  const [prediction, setPrediction] = useState<DiseasePredictionResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.animalType || !formData.animalBreed || !formData.animalAge || !formData.symptoms) {
      toast.error("Please fill in all required fields");
      return;
    }

    setLoading(true);
    setPrediction(null);
    setError(null);

    try {
      const result = await predictDiseaseRisks(formData);
      
      if (result.shortTermRisks.includes("Analysis failed")) {
        setError("Our AI couldn't analyze these inputs properly. Please provide more detailed information about your pet.");
        toast.error("Could not complete prediction analysis");
      } else {
        setPrediction(result);
        toast.success("Risk analysis complete!");
      }
    } catch (error) {
      console.error("Error analyzing disease prediction:", error);
      setError("There was a problem connecting to our AI service. Please try again later.");
      toast.error("Unable to predict health risks. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setFormData({
      animalType: "",
      animalBreed: "",
      animalAge: "",
      symptoms: "",
      lifestyle: "",
    });
    setPrediction(null);
    setError(null);
  };

  const getRiskColor = (level: string) => {
    switch (level) {
      case "low": return "text-green-600";
      case "moderate": return "text-amber-600";
      case "high": return "text-red-600";
      default: return "text-gray-600";
    }
  };

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <MedicalSidebar />
        <SidebarInset>
          <div className="min-h-screen p-4 bg-gradient-to-br from-medical-50 to-medical-100">
            {/* Add MobileSidebarButton for mobile devices */}
            <MobileSidebarButton />
            
            <div className="max-w-4xl mx-auto space-y-8 pt-8">
              <Card className="p-8 bg-white/80 backdrop-blur-lg border border-gray-100 rounded-xl shadow-lg animate-fadeIn">
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <h1 className="text-3xl font-bold text-gray-900">Disease Prediction</h1>
                    <p className="text-gray-600">Predict future health risks based on current symptoms</p>
                  </div>
                  {(prediction || error) && (
                    <Button
                      variant="outline"
                      className="flex items-center gap-2"
                      onClick={handleReset}
                    >
                      <RotateCcw className="h-4 w-4" />
                      New Analysis
                    </Button>
                  )}
                </div>
                
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="animalType">Animal Type</Label>
                      <Input
                        id="animalType"
                        name="animalType"
                        placeholder="e.g., Dog, Cat, Bird"
                        value={formData.animalType}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="animalBreed">Animal Breed</Label>
                      <Input
                        id="animalBreed"
                        name="animalBreed"
                        placeholder="e.g., Labrador, Persian, Parakeet"
                        value={formData.animalBreed}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="animalAge">Age</Label>
                      <Input
                        id="animalAge"
                        name="animalAge"
                        placeholder="e.g., 5 years, 6 months"
                        value={formData.animalAge}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lifestyle">Lifestyle Factors (optional)</Label>
                      <Input
                        id="lifestyle"
                        name="lifestyle"
                        placeholder="e.g., Indoor only, active, sedentary"
                        value={formData.lifestyle}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="symptoms">Current Symptoms</Label>
                    <Textarea
                      id="symptoms"
                      name="symptoms"
                      placeholder="Please describe the current symptoms in detail..."
                      className="min-h-[150px] resize-none"
                      value={formData.symptoms}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  
                  <div className="text-sm text-amber-700 bg-amber-50 p-3 rounded-md flex items-start">
                    <span className="mr-2 mt-0.5"><AlertTriangle size={16} /></span>
                    <span>For best results, please include: detailed symptoms, duration, behavioral changes, and any known medical history.</span>
                  </div>
                  
                  <Button 
                    type="submit" 
                    className="w-full bg-medical-500 hover:bg-medical-600 text-white"
                    disabled={loading}
                  >
                    <Shield className="mr-2 h-5 w-5" />
                    {loading ? "Analyzing with Gemini AI..." : "Predict Health Risks"}
                  </Button>
                </form>
              </Card>

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
                        <li>Specify the type and breed of your pet</li>
                        <li>Provide the exact age of your pet</li>
                        <li>List all symptoms in detail with timeline</li>
                        <li>Include lifestyle factors (diet, exercise, environment)</li>
                        <li>Mention any pre-existing conditions if known</li>
                      </ul>
                    </div>
                  </div>
                </Card>
              )}

              {prediction && !error && (
                <div className="space-y-6 animate-fadeIn">
                  {/* Risk Level Summary Section */}
                  <Card className="p-8 bg-white/80 backdrop-blur-lg border border-purple-100 rounded-xl shadow-lg">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                      <div className="flex items-center gap-2">
                        <ActivitySquare className="h-6 w-6 text-purple-700" />
                        <h2 className="font-bold text-xl text-gray-900">Risk Assessment</h2>
                      </div>
                      <div className={`px-4 py-2 rounded-full font-semibold ${
                        prediction.riskLevel === "low" ? "bg-green-100 text-green-700" : 
                        prediction.riskLevel === "moderate" ? "bg-amber-100 text-amber-700" : 
                        "bg-red-100 text-red-700"
                      }`}>
                        {prediction.riskLevel.toUpperCase()} RISK
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Short Term Risks */}
                      <div className="space-y-3">
                        <div className="flex items-center gap-2">
                          <Clock className={`h-5 w-5 ${getRiskColor(prediction.riskLevel)}`} />
                          <h3 className="font-semibold text-lg text-gray-900">Short-Term Risks</h3>
                        </div>
                        <div className="bg-gray-50 p-4 rounded-lg">
                          <p className="text-gray-700">{prediction.shortTermRisks}</p>
                        </div>
                      </div>
                      
                      {/* Long Term Risks */}
                      <div className="space-y-3">
                        <div className="flex items-center gap-2">
                          <Calendar className={`h-5 w-5 ${getRiskColor(prediction.riskLevel)}`} />
                          <h3 className="font-semibold text-lg text-gray-900">Long-Term Risks</h3>
                        </div>
                        <div className="bg-gray-50 p-4 rounded-lg">
                          <p className="text-gray-700">{prediction.longTermRisks}</p>
                        </div>
                      </div>
                    </div>
                  </Card>
                  
                  {/* Prevention Steps */}
                  <Card className="p-8 bg-white/80 backdrop-blur-lg border border-blue-100 rounded-xl shadow-lg">
                    <div className="flex items-center gap-2 mb-4 text-blue-700">
                      <Shield className="h-6 w-6" />
                      <h2 className="font-bold text-xl">Prevention Steps</h2>
                    </div>
                    <div className="space-y-4">
                      <p className="text-gray-700">{prediction.preventionSteps}</p>
                      
                      <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                        <p className="text-sm text-blue-700">
                          <strong>Disclaimer:</strong> This is an AI-powered veterinary analysis powered by Google's Gemini and should not replace professional veterinary advice.
                          Please consult with a veterinarian for proper diagnosis and treatment of your pet.
                        </p>
                      </div>
                    </div>
                  </Card>
                </div>
              )}
            </div>
          </div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
