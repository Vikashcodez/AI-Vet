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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface DietPlanResult {
  shortTermPlan: string;
  longTermPlan: string;
  portionGuidance: string;
  feedingSchedule: string;
  supplements: string;
}

export default function DietPlan() {
  const [animalType, setAnimalType] = useState("");
  const [animalAge, setAnimalAge] = useState("");
  const [animalBreed, setAnimalBreed] = useState("");
  const [weight, setWeight] = useState("");
  const [activityLevel, setActivityLevel] = useState("");
  const [healthIssues, setHealthIssues] = useState("");
  const [dietaryRestrictions, setDietaryRestrictions] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<DietPlanResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!animalType.trim()) {
      toast.error("Please enter animal type at minimum");
      return;
    }

    setLoading(true);
    setResult(null);
    setError(null);

    try {
      // This would be replaced with an actual API call in a real implementation
      // Simulating API response for now
      setTimeout(() => {
        const mockResult: DietPlanResult = {
          shortTermPlan: `For your ${animalBreed ? animalBreed + " " : ""}${animalType}${healthIssues ? " with " + healthIssues : ""}, start with a gentle transition to a balanced diet over 7-10 days, gradually replacing the current food with high-quality, ${activityLevel === "high" ? "protein-rich" : "balanced"} nutrition.`,
          longTermPlan: `Maintain a consistent diet of premium-quality ${animalType} food appropriate for ${animalAge || "their age"}, with an emphasis on ${healthIssues ? "ingredients that support " + healthIssues + " management" : "wholesome ingredients with no artificial preservatives or fillers"}.`,
          portionGuidance: `${weight ? `For a ${animalType} weighing ${weight}, feed approximately ${calculatePortions(animalType, weight, activityLevel)} per day, ` : `Feed your ${animalType} `}divided into ${activityLevel === "high" ? "3-4" : "2-3"} meals. Adjust portions based on weight changes and energy levels.`,
          feedingSchedule: `For a ${activityLevel || "moderate"} activity level ${animalType}, establish a consistent feeding schedule: ${activityLevel === "high" ? "morning, midday, evening, and potentially a small late meal" : "morning and evening, with consistent timing"}. Always provide fresh water.`,
          supplements: `Consider adding ${healthIssues ? "supplements targeted to support " + healthIssues : "a high-quality multivitamin"} appropriate for ${animalType}s. ${dietaryRestrictions ? "Given the dietary restrictions, also consider supplements to address potential nutritional gaps." : "Consult with your veterinarian before adding any supplements."}`
        };
        
        setResult(mockResult);
        toast.success("Diet plan generated!");
        setLoading(false);
      }, 1500);
    } catch (error) {
      console.error("Error generating diet plan:", error);
      setError("There was a problem generating the diet plan. Please try again.");
      toast.error("Unable to generate customized diet plan.");
      setLoading(false);
    }
  };

  const calculatePortions = (type: string, weight: string, activity: string): string => {
    // This is a very simplified calculation for demonstration
    const weightNum = parseFloat(weight) || 10;
    let basePortion = 0;
    
    if (type.toLowerCase() === "dog") {
      basePortion = weightNum * 0.025; // 25g per kg of body weight as base
    } else if (type.toLowerCase() === "cat") {
      basePortion = weightNum * 0.02; // 20g per kg of body weight as base
    } else {
      return "portions based on specific guidelines for your animal type";
    }
    
    // Adjust for activity level
    if (activity === "high") {
      basePortion *= 1.5; // 50% more for high activity
    } else if (activity === "low") {
      basePortion *= 0.8; // 20% less for low activity
    }
    
    return `${basePortion.toFixed(2)} cups of dry food`;
  };

  const handleReset = () => {
    setAnimalType("");
    setAnimalAge("");
    setAnimalBreed("");
    setWeight("");
    setActivityLevel("");
    setHealthIssues("");
    setDietaryRestrictions("");
    setResult(null);
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
                    <h1 className="text-3xl font-bold text-gray-900">Customized Diet Plan</h1>
                    <p className="text-gray-600">Get a personalized diet plan for your pet</p>
                  </div>
                  {(result || error) && (
                    <Button
                      variant="outline"
                      className="flex items-center gap-2"
                      onClick={handleReset}
                    >
                      <RotateCcw className="h-4 w-4" />
                      New Diet Plan
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
                      <div className="space-y-2">
                        <Label htmlFor="weight">Weight (Optional)</Label>
                        <Input
                          id="weight"
                          value={weight}
                          onChange={(e) => setWeight(e.target.value)}
                          placeholder="e.g., 25 kg, 10 lbs"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="activityLevel">Activity Level</Label>
                      <Select 
                        value={activityLevel} 
                        onValueChange={setActivityLevel}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select activity level" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="low">Low (Sedentary)</SelectItem>
                          <SelectItem value="moderate">Moderate (Average)</SelectItem>
                          <SelectItem value="high">High (Very Active)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="healthIssues">Health Issues (Optional)</Label>
                      <Textarea
                        id="healthIssues"
                        value={healthIssues}
                        onChange={(e) => setHealthIssues(e.target.value)}
                        placeholder="Any health issues that might affect diet (e.g., diabetes, kidney disease, allergies)"
                        className="min-h-[80px]"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="dietaryRestrictions">Dietary Restrictions (Optional)</Label>
                      <Textarea
                        id="dietaryRestrictions"
                        value={dietaryRestrictions}
                        onChange={(e) => setDietaryRestrictions(e.target.value)}
                        placeholder="Any specific foods your pet should avoid or dietary restrictions"
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
                      {loading ? "Generating diet plan..." : "Generate Diet Plan"}
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
                  {/* Short Term Plan */}
                  <Card className="p-8 bg-white/80 backdrop-blur-lg border border-amber-100 rounded-xl shadow-lg">
                    <div className="flex items-center gap-2 mb-4 text-amber-700">
                      <Activity className="h-6 w-6" />
                      <h2 className="font-bold text-xl">Short-Term Diet Plan</h2>
                    </div>
                    <div className="space-y-4">
                      <p className="text-gray-700">{result.shortTermPlan}</p>
                    </div>
                  </Card>
                  
                  {/* Long Term Plan */}
                  <Card className="p-8 bg-white/80 backdrop-blur-lg border border-blue-100 rounded-xl shadow-lg">
                    <div className="flex items-center gap-2 mb-4 text-blue-700">
                      <Apple className="h-6 w-6" />
                      <h2 className="font-bold text-xl">Long-Term Diet Plan</h2>
                    </div>
                    <div className="space-y-4">
                      <p className="text-gray-700">{result.longTermPlan}</p>
                    </div>
                  </Card>

                  {/* Portion Guidance */}
                  <Card className="p-8 bg-white/80 backdrop-blur-lg border border-green-100 rounded-xl shadow-lg">
                    <div className="flex items-center gap-2 mb-4 text-green-700">
                      <Apple className="h-6 w-6" />
                      <h2 className="font-bold text-xl">Portion Guidance</h2>
                    </div>
                    <div className="space-y-4">
                      <p className="text-gray-700">{result.portionGuidance}</p>
                    </div>
                  </Card>

                  {/* Feeding Schedule */}
                  <Card className="p-8 bg-white/80 backdrop-blur-lg border border-purple-100 rounded-xl shadow-lg">
                    <div className="flex items-center gap-2 mb-4 text-purple-700">
                      <Activity className="h-6 w-6" />
                      <h2 className="font-bold text-xl">Feeding Schedule</h2>
                    </div>
                    <div className="space-y-4">
                      <p className="text-gray-700">{result.feedingSchedule}</p>
                    </div>
                  </Card>
                  
                  {/* Supplements */}
                  <Card className="p-8 bg-white/80 backdrop-blur-lg border border-cyan-100 rounded-xl shadow-lg">
                    <div className="flex items-center gap-2 mb-4 text-cyan-700">
                      <Apple className="h-6 w-6" />
                      <h2 className="font-bold text-xl">Supplements</h2>
                    </div>
                    <div className="space-y-4">
                      <p className="text-gray-700">{result.supplements}</p>
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
