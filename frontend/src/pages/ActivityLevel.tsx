import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Activity, RotateCcw, Shield } from "lucide-react";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import MedicalSidebar, { MobileSidebarButton } from "@/components/Sidebar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface ActivityAdvice {
  recommendation: string;
  shortTerm: string;
  longTerm: string;
  warning: string;
}

export default function ActivityLevel() {
  const [animalType, setAnimalType] = useState("");
  const [animalAge, setAnimalAge] = useState("");
  const [animalCondition, setAnimalCondition] = useState("");
  const [animalSymptoms, setAnimalSymptoms] = useState("");
  const [loading, setLoading] = useState(false);
  const [advice, setAdvice] = useState<ActivityAdvice | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!animalType.trim() || !animalCondition.trim()) {
      toast.error("Please enter animal type and condition at minimum");
      return;
    }

    setLoading(true);
    setAdvice(null);
    setError(null);

    try {
      // Simulate API call - in a production app, this would call a real API
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Generate mock activity advice based on input
      setAdvice({
        recommendation: `Based on the ${animalCondition} condition and ${animalSymptoms ? `symptoms (${animalSymptoms})` : "current health status"}, your ${animalType} ${animalAge ? `(${animalAge})` : ""} should ${animalCondition.includes("weak") || animalSymptoms?.includes("vomit") || animalSymptoms?.includes("diarrhea") ? "REST for 1-2 days with minimal activity" : "maintain MODERATE ACTIVITY levels with regular but gentle exercise"}.`,
        
        shortTerm: `${animalCondition.includes("weak") || animalSymptoms?.includes("vomit") || animalSymptoms?.includes("diarrhea") ? 
          `For the next 24-48 hours, limit your ${animalType}'s physical activity to brief, gentle walks only for elimination purposes. Watch for signs of fatigue such as excessive panting, reluctance to move, or lying down during walks.` : 
          `In the coming days, engage your ${animalType} in regular but moderate exercise sessions of 15-20 minutes, 2-3 times daily. Monitor for any signs of discomfort or exhaustion.`}`,
        
        longTerm: `${animalCondition.includes("weak") || animalSymptoms?.includes("vomit") || animalSymptoms?.includes("diarrhea") ? 
          `After 48 hours of rest, gradually reintroduce activity starting with 5-minute walks and increasing by 5 minutes each day if no symptoms return. Build back to normal activity levels over 7-10 days.` : 
          `Maintain a consistent exercise routine that includes both physical and mental stimulation appropriate for your ${animalType}${animalAge ? ` at ${animalAge} of age` : ""}. This helps prevent behavioral issues and supports overall wellbeing.`}`,
        
        warning: `${animalCondition.includes("weak") || animalSymptoms?.includes("vomit") || animalSymptoms?.includes("diarrhea") ? 
          `IMPORTANT: If you notice worsening symptoms, lethargy, or refusal to drink water during the rest period, consult your veterinarian immediately.` : 
          `CAUTION: Even with normal activity levels, always monitor for signs of excessive fatigue, limping, or pain during exercise. Adjust activity levels accordingly and seek veterinary care if symptoms persist.`}`
      });
      
      toast.success("Activity advice generated!");
    } catch (error) {
      console.error("Error generating activity advice:", error);
      setError("There was a problem generating activity advice. Please try again.");
      toast.error("Unable to generate activity advice.");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setAnimalType("");
    setAnimalAge("");
    setAnimalCondition("");
    setAnimalSymptoms("");
    setAdvice(null);
    setError(null);
  };

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <MedicalSidebar />
        <SidebarInset>
          {/* Fixed mobile header with button */}
          <MobileSidebarButton />
          
          <div className="min-h-screen p-4 bg-gradient-to-br from-medical-50 to-medical-100">
            <div className="max-w-4xl mx-auto space-y-8 pt-8">
              <Card className="p-8 bg-white/80 backdrop-blur-lg border border-gray-100 rounded-xl shadow-lg">
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <h1 className="text-3xl font-bold text-gray-900">Activity Level Advice</h1>
                    <p className="text-gray-600">Get recommendations on rest or play based on your pet's condition</p>
                  </div>
                  {(advice || error) && (
                    <Button
                      variant="outline"
                      className="flex items-center gap-2"
                      onClick={handleReset}
                    >
                      <RotateCcw className="h-4 w-4" />
                      New Recommendations
                    </Button>
                  )}
                </div>
                
                {!advice && !error && (
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
                    
                    <div className="space-y-2">
                      <Label htmlFor="animalCondition">Current Condition</Label>
                      <Input
                        id="animalCondition"
                        value={animalCondition}
                        onChange={(e) => setAnimalCondition(e.target.value)}
                        placeholder="e.g., recovering from surgery, weak, healthy, energetic"
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="animalSymptoms">Symptoms (Optional)</Label>
                      <Textarea
                        id="animalSymptoms"
                        value={animalSymptoms}
                        onChange={(e) => setAnimalSymptoms(e.target.value)}
                        placeholder="Any specific symptoms your pet is experiencing..."
                        className="min-h-[100px]"
                      />
                    </div>
                    
                    <Button 
                      type="submit" 
                      variant="modern"
                      className="w-full py-3 rounded-md flex items-center justify-center gap-2"
                      disabled={loading}
                    >
                      <Activity className="mr-2 h-5 w-5" />
                      {loading ? "Generating advice..." : "Get Activity Recommendations"}
                    </Button>
                  </form>
                )}
              </Card>

              {error && (
                <Card className="p-8 bg-white/80 backdrop-blur-lg border border-red-100 rounded-xl shadow-lg">
                  <div className="space-y-4">
                    <div className="flex items-center text-red-500 gap-2">
                      <Shield size={20} />
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

              {advice && !error && (
                <div className="space-y-6 animate-fadeIn">
                  {/* Overall Recommendation */}
                  <Card className="p-8 bg-white/80 backdrop-blur-lg border border-purple-100 rounded-xl shadow-lg">
                    <div className="flex items-center gap-2 mb-4 text-purple-700">
                      <Activity className="h-6 w-6" />
                      <h2 className="font-bold text-xl">Recommendation</h2>
                    </div>
                    <div className="space-y-4">
                      <p className="text-gray-700">{advice.recommendation}</p>
                    </div>
                  </Card>
                  
                  {/* Short-term Advice */}
                  <Card className="p-8 bg-white/80 backdrop-blur-lg border border-blue-100 rounded-xl shadow-lg">
                    <div className="flex items-center gap-2 mb-4 text-blue-700">
                      <Activity className="h-6 w-6" />
                      <h2 className="font-bold text-xl">Short-term Plan</h2>
                    </div>
                    <div className="space-y-4">
                      <p className="text-gray-700">{advice.shortTerm}</p>
                    </div>
                  </Card>

                  {/* Long-term Advice */}
                  <Card className="p-8 bg-white/80 backdrop-blur-lg border border-amber-100 rounded-xl shadow-lg">
                    <div className="flex items-center gap-2 mb-4 text-amber-700">
                      <Activity className="h-6 w-6" />
                      <h2 className="font-bold text-xl">Long-term Plan</h2>
                    </div>
                    <div className="space-y-4">
                      <p className="text-gray-700">{advice.longTerm}</p>
                    </div>
                  </Card>

                  {/* Warning/Caution */}
                  <Card className="p-8 bg-white/80 backdrop-blur-lg border border-red-100 rounded-xl shadow-lg">
                    <div className="flex items-center gap-2 mb-4 text-red-700">
                      <Shield className="h-6 w-6" />
                      <h2 className="font-bold text-xl">Important Notes</h2>
                    </div>
                    <div className="space-y-4">
                      <p className="text-gray-700">{advice.warning}</p>
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
