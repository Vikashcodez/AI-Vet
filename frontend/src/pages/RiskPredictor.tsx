
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { AlertTriangle, Activity, Clock, ShieldCheck } from "lucide-react";
import { predictDiseaseRisks, DiseasePredictionInput, DiseasePredictionResult } from "@/utils/geminiApi";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import MedicalSidebar, { MobileSidebarButton } from "@/components/Sidebar";

export default function RiskPredictor() {
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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.animalType.trim() || !formData.animalAge.trim() || !formData.symptoms.trim()) {
      toast.error("Please fill in all required fields");
      return;
    }

    setLoading(true);
    setPrediction(null);
    setError(null);

    try {
      const result = await predictDiseaseRisks(formData);
      
      if (result.shortTermRisks.includes("Analysis failed")) {
        setError("Our AI couldn't analyze these symptoms properly. Please provide more detailed information.");
        toast.error("Could not complete risk prediction");
      } else {
        setPrediction(result);
        toast.success("Risk prediction complete!");
      }
    } catch (error) {
      console.error("Error predicting health risks:", error);
      setError("There was a problem connecting to our AI service. Please try again later.");
      toast.error("Unable to complete risk prediction");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <MedicalSidebar />
        <SidebarInset>
          <div className="min-h-screen p-4 bg-gradient-to-br from-medical-50 to-medical-100">
            {/* Mobile sidebar button */}
            <div className="md:hidden mobile-padding-top">
              <MobileSidebarButton />
            </div>
            
            <div className="max-w-4xl mx-auto space-y-8 pt-8">
              <Card className="p-8 bg-white/80 backdrop-blur-lg border border-gray-100 rounded-xl shadow-lg animate-fadeIn">
                <div className="mb-6">
                  <h1 className="text-3xl font-bold text-gray-900">Future Risk Predictor</h1>
                  <p className="text-gray-600">Predict potential future health risks based on current symptoms</p>
                </div>
                
                {!prediction && !error && (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-gray-700 font-medium">Animal Type</label>
                        <Input
                          name="animalType"
                          value={formData.animalType}
                          onChange={handleInputChange}
                          placeholder="e.g., Dog, Cat, Bird"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-gray-700 font-medium">Animal Breed</label>
                        <Input
                          name="animalBreed"
                          value={formData.animalBreed}
                          onChange={handleInputChange}
                          placeholder="e.g., Labrador, Persian, Parakeet"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-gray-700 font-medium">Age</label>
                        <Input
                          name="animalAge"
                          value={formData.animalAge}
                          onChange={handleInputChange}
                          placeholder="e.g., 5 years, 6 months"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-gray-700 font-medium">Lifestyle Factors (optional)</label>
                        <Input
                          name="lifestyle"
                          value={formData.lifestyle}
                          onChange={handleInputChange}
                          placeholder="e.g., Indoor only, active, sedentary"
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-gray-700 font-medium">Current Symptoms</label>
                      <Input
                        name="symptoms"
                        value={formData.symptoms}
                        onChange={handleInputChange}
                        placeholder="Describe current symptoms"
                        required
                      />
                    </div>
                    
                    <Button 
                      type="submit" 
                      className="w-full bg-medical-500 hover:bg-medical-600 text-white"
                      disabled={loading}
                    >
                      <Activity className="mr-2 h-5 w-5" />
                      {loading ? "Analyzing with Gemini AI..." : "Predict Health Risks"}
                    </Button>
                  </form>
                )}

                {error && (
                  <div className="space-y-4">
                    <div className="flex items-center text-red-500 gap-2">
                      <AlertTriangle size={20} />
                      <h3 className="font-semibold text-xl">Analysis Error</h3>
                    </div>
                    <p className="text-gray-700">{error}</p>
                    <Button 
                      onClick={() => {
                        setError(null);
                        setPrediction(null);
                      }}
                      variant="outline"
                    >
                      Try Again
                    </Button>
                  </div>
                )}

                {prediction && (
                  <div className="space-y-6 animate-fadeIn">
                    <div className="flex justify-between items-center">
                      <h2 className="text-2xl font-bold text-gray-900">Risk Analysis Results</h2>
                      <Button 
                        variant="outline" 
                        onClick={() => {
                          setPrediction(null);
                          setFormData({
                            animalType: "",
                            animalBreed: "",
                            animalAge: "",
                            symptoms: "",
                            lifestyle: "",
                          });
                        }}
                      >
                        New Analysis
                      </Button>
                    </div>
                    
                    {/* Risk Level Indicator */}
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <div className="flex justify-between items-center">
                        <span className="font-medium">Overall Risk Level:</span>
                        <span className={`px-3 py-1 rounded-full font-medium ${
                          prediction.riskLevel === "high" ? "bg-red-100 text-red-700" : 
                          prediction.riskLevel === "moderate" ? "bg-yellow-100 text-yellow-700" : 
                          "bg-green-100 text-green-700"
                        }`}>
                          {prediction.riskLevel.charAt(0).toUpperCase() + prediction.riskLevel.slice(1)}
                        </span>
                      </div>
                    </div>
                    
                    {/* Short Term Risks */}
                    <Card className="p-6 border border-gray-200 rounded-lg">
                      <div className="flex items-center gap-2 mb-3 text-blue-700">
                        <Clock className="h-5 w-5" />
                        <h3 className="font-semibold text-lg">Short-Term Risks</h3>
                      </div>
                      <p className="text-gray-700">{prediction.shortTermRisks}</p>
                    </Card>
                    
                    {/* Long Term Risks */}
                    <Card className="p-6 border border-gray-200 rounded-lg">
                      <div className="flex items-center gap-2 mb-3 text-purple-700">
                        <Activity className="h-5 w-5" />
                        <h3 className="font-semibold text-lg">Long-Term Risks</h3>
                      </div>
                      <p className="text-gray-700">{prediction.longTermRisks}</p>
                    </Card>
                    
                    {/* Prevention Steps */}
                    <Card className="p-6 border border-gray-200 rounded-lg">
                      <div className="flex items-center gap-2 mb-3 text-green-700">
                        <ShieldCheck className="h-5 w-5" />
                        <h3 className="font-semibold text-lg">Prevention Steps</h3>
                      </div>
                      <p className="text-gray-700">{prediction.preventionSteps}</p>
                    </Card>
                    
                    <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                      <p className="text-sm text-blue-700">
                        <strong>Disclaimer:</strong> This is an AI-powered veterinary analysis and should not replace professional veterinary advice. 
                        Please consult with a veterinarian for proper diagnosis and treatment of your pet.
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
