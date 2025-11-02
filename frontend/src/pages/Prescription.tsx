
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Pill, RotateCcw, AlertTriangle, Beaker, Shield, FileText } from "lucide-react";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import MedicalSidebar, { MobileSidebarButton } from "@/components/Sidebar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { generatePrescription, PrescriptionResult } from "@/utils/geminiApi";

export default function Prescription() {
  const [animalType, setAnimalType] = useState("");
  const [animalAge, setAnimalAge] = useState("");
  const [symptoms, setSymptoms] = useState("");
  const [medicalHistory, setMedicalHistory] = useState("");
  const [loading, setLoading] = useState(false);
  const [prescription, setPrescription] = useState<PrescriptionResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!symptoms.trim() || !animalType.trim()) {
      toast.error("Please enter both animal type and symptoms");
      return;
    }

    setLoading(true);
    setPrescription(null);
    setError(null);

    try {
      const result = await generatePrescription({
        animalType,
        animalAge,
        symptoms,
        medicalHistory
      });
      
      setPrescription(result);
      toast.success("Prescription suggestions generated!");
    } catch (error) {
      console.error("Error generating prescription:", error);
      setError("There was a problem analyzing the symptoms. Please try again.");
      toast.error("Unable to generate prescription suggestions.");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setAnimalType("");
    setAnimalAge("");
    setSymptoms("");
    setMedicalHistory("");
    setPrescription(null);
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
                    <h1 className="text-3xl font-bold text-gray-900">Prescription Generator</h1>
                    <p className="text-gray-600">Suggest possible medicine options for your animal</p>
                  </div>
                  {(prescription || error) && (
                    <Button
                      variant="outline"
                      className="flex items-center gap-2"
                      onClick={handleReset}
                    >
                      <RotateCcw className="h-4 w-4" />
                      New Prescription
                    </Button>
                  )}
                </div>
                
                {!prescription && !error && (
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
                      <Label htmlFor="symptoms">Symptoms</Label>
                      <Textarea
                        id="symptoms"
                        value={symptoms}
                        onChange={(e) => setSymptoms(e.target.value)}
                        placeholder="Describe your animal's symptoms in detail..."
                        className="min-h-[100px]"
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="medicalHistory">Medical History (Optional)</Label>
                      <Textarea
                        id="medicalHistory"
                        value={medicalHistory}
                        onChange={(e) => setMedicalHistory(e.target.value)}
                        placeholder="Any previous conditions, allergies, or treatments..."
                        className="min-h-[100px]"
                      />
                    </div>
                    
                    <Button 
                      type="submit" 
                      variant="modern"
                      className="w-full py-3 rounded-md flex items-center justify-center gap-2"
                      disabled={loading}
                    >
                      <Pill className="mr-2 h-5 w-5" />
                      {loading ? "Analyzing symptoms..." : "Generate Prescription Suggestions"}
                    </Button>
                  </form>
                )}
              </Card>

              {error && (
                <Card className="p-8 bg-white/80 backdrop-blur-lg border border-red-100 rounded-xl shadow-lg">
                  <div className="space-y-4">
                    <div className="flex items-center text-red-500 gap-2">
                      <AlertTriangle size={20} />
                      <h3 className="font-semibold text-xl">Analysis Error</h3>
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

              {prescription && !error && (
                <div className="space-y-6 animate-fadeIn">
                  {/* Medication Suggestions */}
                  <Card className="p-8 bg-white/80 backdrop-blur-lg border border-purple-100 rounded-xl shadow-lg">
                    <div className="flex items-center gap-2 mb-4 text-purple-700">
                      <Pill className="h-6 w-6" />
                      <h2 className="font-bold text-xl">Medication Suggestions</h2>
                    </div>
                    <div className="space-y-4">
                      <p className="text-gray-700">{prescription.medications}</p>
                    </div>
                  </Card>
                  
                  {/* Dosage Information */}
                  <Card className="p-8 bg-white/80 backdrop-blur-lg border border-blue-100 rounded-xl shadow-lg">
                    <div className="flex items-center gap-2 mb-4 text-blue-700">
                      <Beaker className="h-6 w-6" />
                      <h2 className="font-bold text-xl">Dosage Information</h2>
                    </div>
                    <div className="space-y-4">
                      <p className="text-gray-700">{prescription.dosage}</p>
                    </div>
                  </Card>

                  {/* Precautions */}
                  <Card className="p-8 bg-white/80 backdrop-blur-lg border border-amber-100 rounded-xl shadow-lg">
                    <div className="flex items-center gap-2 mb-4 text-amber-700">
                      <Shield className="h-6 w-6" />
                      <h2 className="font-bold text-xl">Precautions</h2>
                    </div>
                    <div className="space-y-4">
                      <p className="text-gray-700">{prescription.precautions}</p>
                    </div>
                  </Card>

                  {/* Veterinary Notes */}
                  <Card className="p-8 bg-white/80 backdrop-blur-lg border border-green-100 rounded-xl shadow-lg">
                    <div className="flex items-center gap-2 mb-4 text-green-700">
                      <FileText className="h-6 w-6" />
                      <h2 className="font-bold text-xl">Veterinary Notes</h2>
                    </div>
                    <div className="space-y-4">
                      <p className="text-gray-700">{prescription.vetNotes}</p>
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
