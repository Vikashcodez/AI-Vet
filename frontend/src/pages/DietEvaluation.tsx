
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Apple, Activity, RotateCcw } from "lucide-react";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import MedicalSidebar, { MobileSidebarButton } from "@/components/Sidebar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface DietEvaluationResult {
  overallAssessment: string;
  nutritionalAnalysis: string;
  concernsAndWarnings: string;
  recommendations: string;
}

export default function DietEvaluation() {
  const [animalType, setAnimalType] = useState("");
  const [animalAge, setAnimalAge] = useState("");
  const [animalBreed, setAnimalBreed] = useState("");
  const [currentDiet, setCurrentDiet] = useState("");
  const [healthIssues, setHealthIssues] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<DietEvaluationResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!animalType.trim() || !currentDiet.trim()) {
      toast.error("Please enter animal type and current diet at minimum");
      return;
    }

    setLoading(true);
    setResult(null);
    setError(null);

    try {
      // This would be replaced with an actual API call in a real implementation
      // Simulating API response for now
      setTimeout(() => {
        const mockResult: DietEvaluationResult = {
          overallAssessment: `Based on the information provided for your ${animalType}, the current diet appears to be ${healthIssues ? "potentially problematic" : "generally adequate"} but could benefit from some adjustments.`,
          nutritionalAnalysis: `The diet you described for your ${animalAge || ""} ${animalBreed || ""} ${animalType} provides basic nutrition but may ${healthIssues ? "be contributing to the health issues you mentioned" : "lack some essential nutrients for optimal health"}.`,
          concernsAndWarnings: healthIssues ? 
            `The ${healthIssues} you mentioned may be related to the current diet. Some ingredients may be triggering inflammation or digestive issues.` : 
            `No major concerns detected, but watch for signs of food allergies or sensitivities like excessive scratching, digestive upset, or changes in energy levels.`,
          recommendations: `Consider transitioning to a balanced diet specifically formulated for ${animalBreed ? animalBreed + " " : ""}${animalType}s${animalAge ? " of " + animalAge + " age" : ""} that includes high-quality protein sources, essential fatty acids, and appropriate vitamin/mineral balance.`
        };
        
        setResult(mockResult);
        toast.success("Diet evaluation complete!");
        setLoading(false);
      }, 1500);
    } catch (error) {
      console.error("Error evaluating diet:", error);
      setError("There was a problem evaluating the diet. Please try again.");
      toast.error("Unable to complete diet evaluation.");
      setLoading(false);
    }
  };

  const handleReset = () => {
    setAnimalType("");
    setAnimalAge("");
    setAnimalBreed("");
    setCurrentDiet("");
    setHealthIssues("");
    setResult(null);
    setError(null);
  };

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <MedicalSidebar />
        <SidebarInset>
          <div className="min-h-screen p-4 bg-gradient-to-br from-medical-50 to-medical-100">
            {/* Fixed mobile top bar with button */}
            <MobileSidebarButton />
            
            <div className="max-w-4xl mx-auto space-y-8 pt-20 md:pt-8">
              <Card className="p-8 bg-white/80 backdrop-blur-lg border border-gray-100 rounded-xl shadow-lg">
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <h1 className="text-3xl font-bold text-gray-900">Diet Evaluation</h1>
                    <p className="text-gray-600">Evaluate your animal's current diet for health issues</p>
                  </div>
                  {(result || error) && (
                    <Button
                      variant="outline"
                      className="flex items-center gap-2"
                      onClick={handleReset}
                    >
                      <RotateCcw className="h-4 w-4" />
                      New Evaluation
                    </Button>
                  )}
                </div>
                
                {!result && !error && (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="animalType">Animal Type</Label>
                        <Input
                          id="animalType"
                          value={animalType}
                          onChange={(e) => setAnimalType(e.target.value)}
                          placeholder="e.g., Dog, Cat, Bird"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="animalAge">Animal Age</Label>
                        <Input
                          id="animalAge"
                          value={animalAge}
                          onChange={(e) => setAnimalAge(e.target.value)}
                          placeholder="e.g., 3 years, 6 months"
                        />
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="animalBreed">Breed (Optional)</Label>
                        <Input
                          id="animalBreed"
                          value={animalBreed}
                          onChange={(e) => setAnimalBreed(e.target.value)}
                          placeholder="e.g., Labrador, Persian"
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="currentDiet">Current Diet</Label>
                      <Textarea
                        id="currentDiet"
                        value={currentDiet}
                        onChange={(e) => setCurrentDiet(e.target.value)}
                        placeholder="Describe your pet's current diet in detail (brand names, feeding frequency, portion sizes, treats, supplements, etc.)"
                        className="min-h-[100px]"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="healthIssues">Health Issues (Optional)</Label>
                      <Textarea
                        id="healthIssues"
                        value={healthIssues}
                        onChange={(e) => setHealthIssues(e.target.value)}
                        placeholder="Any health issues or concerns that might be related to diet (allergies, digestive problems, weight issues, etc.)"
                        className="min-h-[80px]"
                      />
                    </div>
                    
                    <Button 
                      type="submit" 
                      variant="modern"
                      className="w-full py-3 rounded-md flex items-center justify-center gap-2"
                      disabled={loading}
                    >
                      <Apple className="mr-2 h-5 w-5" />
                      {loading ? "Evaluating diet..." : "Evaluate Diet"}
                    </Button>
                  </form>
                )}
              </Card>

              {error && (
                <Card className="p-8 bg-white/80 backdrop-blur-lg border border-red-100 rounded-xl shadow-lg">
                  <div className="space-y-4">
                    <div className="flex items-center text-red-500 gap-2">
                      <Activity size={20} />
                      <h3 className="font-semibold text-xl">Error</h3>
                    </div>
                    <p className="text-gray-700">{error}</p>
                    <Button 
                      onClick={handleReset}
                      variant="outline"
                    >
                      Try Again
                    </Button>
                  </div>
                </Card>
              )}

              {result && !error && (
                <div className="space-y-6 animate-fadeIn">
                  {/* Overall Assessment */}
                  <Card className="p-8 bg-white/80 backdrop-blur-lg border border-blue-100 rounded-xl shadow-lg">
                    <div className="flex items-center gap-2 mb-4 text-blue-700">
                      <Activity className="h-6 w-6" />
                      <h2 className="font-bold text-xl">Overall Assessment</h2>
                    </div>
                    <div className="space-y-4">
                      <p className="text-gray-700">{result.overallAssessment}</p>
                    </div>
                  </Card>
                  
                  {/* Nutritional Analysis */}
                  <Card className="p-8 bg-white/80 backdrop-blur-lg border border-green-100 rounded-xl shadow-lg">
                    <div className="flex items-center gap-2 mb-4 text-green-700">
                      <Apple className="h-6 w-6" />
                      <h2 className="font-bold text-xl">Nutritional Analysis</h2>
                    </div>
                    <div className="space-y-4">
                      <p className="text-gray-700">{result.nutritionalAnalysis}</p>
                    </div>
                  </Card>

                  {/* Concerns & Warnings */}
                  <Card className="p-8 bg-white/80 backdrop-blur-lg border border-amber-100 rounded-xl shadow-lg">
                    <div className="flex items-center gap-2 mb-4 text-amber-700">
                      <Activity className="h-6 w-6" />
                      <h2 className="font-bold text-xl">Concerns & Warnings</h2>
                    </div>
                    <div className="space-y-4">
                      <p className="text-gray-700">{result.concernsAndWarnings}</p>
                    </div>
                  </Card>

                  {/* Recommendations */}
                  <Card className="p-8 bg-white/80 backdrop-blur-lg border border-purple-100 rounded-xl shadow-lg">
                    <div className="flex items-center gap-2 mb-4 text-purple-700">
                      <Apple className="h-6 w-6" />
                      <h2 className="font-bold text-xl">Recommendations</h2>
                    </div>
                    <div className="space-y-4">
                      <p className="text-gray-700">{result.recommendations}</p>
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
