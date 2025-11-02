
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Shield, RotateCcw, Activity, Apple, Calendar, Thermometer, Sun, Cloud } from "lucide-react";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import MedicalSidebar, { MobileSidebarButton } from "@/components/Sidebar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { generatePreventiveTips, PreventiveTipsResult } from "@/utils/geminiApi";

export default function PreventiveTips() {
  const [animalType, setAnimalType] = useState("");
  const [animalAge, setAnimalAge] = useState("");
  const [animalBreed, setAnimalBreed] = useState("");
  const [specialNeeds, setSpecialNeeds] = useState("");
  const [loading, setLoading] = useState(false);
  const [tips, setTips] = useState<PreventiveTipsResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!animalType.trim()) {
      toast.error("Please enter animal type at minimum");
      return;
    }

    setLoading(true);
    setTips(null);
    setError(null);

    try {
      const result = await generatePreventiveTips({
        animalType,
        animalAge,
        animalBreed,
        specialNeeds
      });
      
      setTips(result);
      toast.success("Preventive care tips generated!");
    } catch (error) {
      console.error("Error generating preventive tips:", error);
      setError("There was a problem generating preventive tips. Please try again.");
      toast.error("Unable to generate preventive care tips.");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setAnimalType("");
    setAnimalAge("");
    setAnimalBreed("");
    setSpecialNeeds("");
    setTips(null);
    setError(null);
  };

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <MedicalSidebar />
        <SidebarInset>
          {/* Fixed mobile header with button */}
          <MobileSidebarButton />
          
          <div className="min-h-screen p-4 bg-gradient-to-br from-medical-50 to-medical-100 pt-20 md:pt-4">
            <div className="max-w-4xl mx-auto space-y-8 pt-8">
              <Card className="p-8 bg-white/80 backdrop-blur-lg border border-gray-100 rounded-xl shadow-lg">
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <h1 className="text-3xl font-bold text-gray-900">Preventive Tips</h1>
                    <p className="text-gray-600">Daily care advice to avoid pet health problems</p>
                  </div>
                  {(tips || error) && (
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
                
                {!tips && !error && (
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
                      <Label htmlFor="specialNeeds">Special Needs or Concerns (Optional)</Label>
                      <Textarea
                        id="specialNeeds"
                        value={specialNeeds}
                        onChange={(e) => setSpecialNeeds(e.target.value)}
                        placeholder="Any specific concerns, health conditions, or special considerations..."
                        className="min-h-[100px]"
                      />
                    </div>
                    
                    <Button 
                      type="submit" 
                      variant="modern"
                      className="w-full py-3 rounded-md flex items-center justify-center gap-2"
                      disabled={loading}
                    >
                      <Shield className="mr-2 h-5 w-5" />
                      {loading ? "Generating tips..." : "Get Preventive Care Tips"}
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

              {tips && !error && (
                <div className="space-y-6 animate-fadeIn">
                  {/* Daily Care Tips */}
                  <Card className="p-8 bg-white/80 backdrop-blur-lg border border-green-100 rounded-xl shadow-lg">
                    <div className="flex items-center gap-2 mb-4 text-green-700">
                      <Calendar className="h-6 w-6" />
                      <h2 className="font-bold text-xl">Daily Care</h2>
                    </div>
                    <div className="space-y-4">
                      <p className="text-gray-700">{tips.dailyCare}</p>
                    </div>
                  </Card>
                  
                  {/* Health Maintenance */}
                  <Card className="p-8 bg-white/80 backdrop-blur-lg border border-blue-100 rounded-xl shadow-lg">
                    <div className="flex items-center gap-2 mb-4 text-blue-700">
                      <Activity className="h-6 w-6" />
                      <h2 className="font-bold text-xl">Health Maintenance</h2>
                    </div>
                    <div className="space-y-4">
                      <p className="text-gray-700">{tips.healthMaintenance}</p>
                    </div>
                  </Card>

                  {/* Nutrition Advice */}
                  <Card className="p-8 bg-white/80 backdrop-blur-lg border border-amber-100 rounded-xl shadow-lg">
                    <div className="flex items-center gap-2 mb-4 text-amber-700">
                      <Apple className="h-6 w-6" />
                      <h2 className="font-bold text-xl">Nutrition Advice</h2>
                    </div>
                    <div className="space-y-4">
                      <p className="text-gray-700">{tips.nutritionAdvice}</p>
                    </div>
                  </Card>

                  {/* Behavior Management */}
                  <Card className="p-8 bg-white/80 backdrop-blur-lg border border-purple-100 rounded-xl shadow-lg">
                    <div className="flex items-center gap-2 mb-4 text-purple-700">
                      <Shield className="h-6 w-6" />
                      <h2 className="font-bold text-xl">Behavior & Enrichment</h2>
                    </div>
                    <div className="space-y-4">
                      <p className="text-gray-700">{tips.behaviorManagement}</p>
                    </div>
                  </Card>
                  
                  {/* Seasonal Health Advice - NEW SECTION */}
                  <Card className="p-8 bg-white/80 backdrop-blur-lg border border-cyan-100 rounded-xl shadow-lg">
                    <div className="flex items-center gap-2 mb-4 text-cyan-700">
                      <Sun className="h-6 w-6" />
                      <h2 className="font-bold text-xl">Seasonal Health Advice</h2>
                    </div>
                    <div className="space-y-4">
                      <p className="text-gray-700">{tips.seasonalAdvice}</p>
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
