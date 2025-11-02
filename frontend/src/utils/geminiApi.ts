import { GoogleGenerativeAI } from "@google/generative-ai";
import { toast } from "sonner";

// Configure the API key (would usually use environment variables)
const API_KEY = "AIzaSyB9FjGkOsT64BefK2mNlTzaeL_R69Dp7TM"; // Replace with actual key
const genAI = new GoogleGenerativeAI(API_KEY);

// Updated to use the generative language v1 API instead of v1beta
const GEMINI_API_KEY = "AIzaSyB9FjGkOsT64BefK2mNlTzaeL_R69Dp7TM";
const GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent";

interface GeminiResponse {
  candidates: Array<{
    content: {
      parts: Array<{
        text: string;
      }>;
    };
  }>;
}

export interface MedicalAnalysis {
  condition: string;
  description: string;
  recommendations: string;
}

export interface VetAnalysisInput {
  animalType: string;
  animalAge: string;
  symptoms: string;
  recentChanges: string;
}

export interface VetAnalysisResult {
  diagnosis: string;
  severity: "low" | "medium" | "high";
  nextSteps: string;
  preventiveTips: string;
}

export interface DiseasePredictionInput {
  animalType: string;
  animalBreed: string;
  animalAge: string;
  symptoms: string;
  lifestyle: string;
}

export interface DiseasePredictionResult {
  shortTermRisks: string;
  longTermRisks: string;
  preventionSteps: string;
  riskLevel: "low" | "moderate" | "high";
}

export interface PrescriptionInput {
  animalType: string;
  animalAge: string;
  symptoms: string;
  medicalHistory?: string;
}

export interface PrescriptionResult {
  medications: string;
  dosage: string;
  precautions: string;
  vetNotes: string;
}

export interface PreventiveTipsInput {
  animalType: string;
  animalAge?: string;
  animalBreed?: string;
  specialNeeds?: string;
}

export interface PreventiveTipsResult {
  dailyCare: string;
  healthMaintenance: string;
  nutritionAdvice: string;
  behaviorManagement: string;
  seasonalAdvice: string;
}

export async function analyzeSymptoms(symptoms: string): Promise<MedicalAnalysis> {
  try {
    const url = `${GEMINI_API_URL}?key=${GEMINI_API_KEY}`;
    
    // Enhanced prompt with more specific instructions to avoid markdown formatting
    const prompt = `
You are a veterinary expert AI assistant specialized in animal health. Based on the following animal symptoms, provide a detailed veterinary analysis:

Pet symptoms: ${symptoms}

IMPORTANT: You must ONLY analyze ANIMAL health conditions, NOT human conditions. Focus exclusively on veterinary medicine.

Return valid JSON in this exact format with NO MARKDOWN CODE BLOCKS, NO BACKTICKS, and NO ADDITIONAL TEXT:
{
  "condition": "The most likely veterinary condition",
  "description": "A clear 1-2 sentence description of this animal condition",
  "recommendations": "Specific recommendations for the pet owner"
}`;

    console.log("Sending request to Gemini API with prompt:", prompt);

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: prompt
              }
            ]
          }
        ],
        generationConfig: {
          temperature: 0.2,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 1024,
        }
      })
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error("Gemini API Error:", errorData);
      
      // Handle quota exceeded errors specifically
      if (response.status === 429) {
        throw new Error("API quota exceeded. The free tier of Gemini API has reached its daily or minute rate limit. Please try again later or upgrade your API plan.");
      }
      
      throw new Error(`API error: ${response.status} - ${errorData}`);
    }

    const data = await response.json() as GeminiResponse;
    console.log("Raw Gemini API response:", data);
    
    if (!data.candidates || data.candidates.length === 0 || !data.candidates[0].content.parts[0].text) {
      console.error("Invalid response structure from Gemini API:", data);
      throw new Error("Invalid response from Gemini API - missing content");
    }

    const textResponse = data.candidates[0].content.parts[0].text.trim();
    console.log("Text response from Gemini:", textResponse);
    
    // Clean the response by removing markdown code blocks if present
    const cleanedResponse = textResponse
      .replace(/^```json\s+/i, '')  // Remove opening markdown
      .replace(/\s+```$/i, '')      // Remove closing markdown
      .trim();
    
    // Extract JSON from response text
    try {
      // First, try direct parsing of the cleaned response
      const result = JSON.parse(cleanedResponse) as MedicalAnalysis;
      console.log("Parsed result:", result);
      return result;
    } catch (jsonError) {
      // If direct parsing fails, try to extract JSON
      console.error("JSON parse error:", jsonError);
      const jsonMatch = cleanedResponse.match(/({[\s\S]*})/);
      if (jsonMatch) {
        const jsonStr = jsonMatch[0];
        console.log("Extracted JSON string:", jsonStr);
        try {
          const result = JSON.parse(jsonStr) as MedicalAnalysis;
          return result;
        } catch (extractError) {
          console.error("Error parsing extracted JSON:", extractError);
          throw new Error("Failed to parse API response");
        }
      } else {
        console.error("Could not extract JSON from response:", cleanedResponse);
        throw new Error("Invalid JSON format in API response");
      }
    }
  } catch (error) {
    console.error("Error analyzing pet symptoms:", error);
    
    // Show more specific error message based on error type
    if (error instanceof Error && error.message.includes("quota exceeded")) {
      toast.error("API quota limit reached. Please try again later or contact support to upgrade your plan.");
    } else {
      toast.error("Failed to analyze pet symptoms. Please try again.");
    }
    
    // Return informative fallback data
    return {
      condition: "Analysis Failed",
      description: "Could not analyze pet symptoms due to API limitations. Please try again later.",
      recommendations: "Please try again with more specific symptoms or consult a veterinarian directly. Make sure to include the type of animal and detailed description of symptoms."
    };
  }
}

export async function analyzeVetSymptoms(input: VetAnalysisInput): Promise<VetAnalysisResult> {
  try {
    const url = `${GEMINI_API_URL}?key=${GEMINI_API_KEY}`;
    
    const prompt = `
You are an expert veterinary AI doctor. Based on the following information about an animal, provide a veterinary assessment:

Animal type: ${input.animalType}
Age: ${input.animalAge}
Symptoms: ${input.symptoms}
Recent changes in diet, environment, or behavior: ${input.recentChanges || "None reported"}

Please analyze these symptoms using your veterinary knowledge and provide:
1. A possible diagnosis (in simple language)
2. Severity level (must be exactly one of these: "low", "medium", or "high")
3. Recommended next steps (e.g., home care, vet visit, immediate attention)
4. Preventive tips if needed

Format your response in strict JSON format following this structure:
{
  "diagnosis": "Your diagnosis in simple language",
  "severity": "low|medium|high",
  "nextSteps": "Recommended next steps",
  "preventiveTips": "Preventive tips"
}

Only return the JSON, nothing else. Ensure it's valid JSON that can be parsed with JSON.parse().
`;

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: prompt
              }
            ]
          }
        ],
        generationConfig: {
          temperature: 0.2,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 1024,
        }
      })
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error("API Error:", errorData);
      
      // Handle quota exceeded errors specifically  
      if (response.status === 429) {
        throw new Error("API quota exceeded. The free tier of Gemini API has reached its daily or minute rate limit. Please try again later or upgrade your API plan.");
      }
      
      throw new Error(`API error: ${response.status}`);
    }

    const data = await response.json() as GeminiResponse;
    
    if (!data.candidates || data.candidates.length === 0 || !data.candidates[0].content.parts[0].text) {
      throw new Error("Invalid response from Gemini API");
    }

    const textResponse = data.candidates[0].content.parts[0].text.trim();
    
    // Extract the JSON part from the response (in case there's any extra text)
    const jsonMatch = textResponse.match(/({.*})/s);
    const jsonStr = jsonMatch ? jsonMatch[0] : textResponse;
    
    const result = JSON.parse(jsonStr) as VetAnalysisResult;
    
    return result;
  } catch (error) {
    console.error("Error analyzing veterinary symptoms:", error);
    
    // Show more specific error message based on error type  
    if (error instanceof Error && error.message.includes("quota exceeded")) {
      toast.error("API quota limit reached. Please try again later or contact support to upgrade your plan.");
    } else {
      toast.error("Error analyzing symptoms. Please try again.");
    }
    
    // Return mock data in case of failure
    return {
      diagnosis: "Analysis Failed",
      severity: "medium",
      nextSteps: "Analysis temporarily unavailable due to API limits. Please try again later or consult a veterinarian directly.",
      preventiveTips: "As a precaution, monitor your pet closely for any changes in behavior or symptoms."
    };
  }
}

export async function predictDiseaseRisks(input: DiseasePredictionInput): Promise<DiseasePredictionResult> {
  try {
    const url = `${GEMINI_API_URL}?key=${GEMINI_API_KEY}`;
    
    const prompt = `
You are an expert veterinary AI doctor specialized in predictive health analytics for animals. Based on the following information, predict future health risks:

Animal type: ${input.animalType}
Animal breed: ${input.animalBreed}
Age: ${input.animalAge}
Current symptoms: ${input.symptoms}
Lifestyle factors: ${input.lifestyle || "No lifestyle information provided"}

Please analyze these details to provide:
1. Short-term risks (next few days to weeks)
2. Long-term risks (months to years) if condition is not addressed
3. Preventative steps the owner can take
4. Overall risk level (must be exactly one of: "low", "moderate", "high")

Format your response in strict JSON format following this structure:
{
  "shortTermRisks": "Detailed analysis of immediate risks",
  "longTermRisks": "Detailed analysis of potential long-term complications",
  "preventionSteps": "Recommended preventive measures",
  "riskLevel": "low|moderate|high"
}

Only return the JSON, nothing else. No markdown formatting, no code blocks, no backticks.
`;

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: prompt
              }
            ]
          }
        ],
        generationConfig: {
          temperature: 0.2,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 1024,
        }
      })
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error("API Error:", errorData);
      
      // Handle quota exceeded errors specifically
      if (response.status === 429) {
        throw new Error("API quota exceeded. The free tier of Gemini API has reached its daily or minute rate limit. Please try again later or upgrade your API plan.");
      }
      
      throw new Error(`API error: ${response.status}`);
    }

    const data = await response.json() as GeminiResponse;
    
    if (!data.candidates || data.candidates.length === 0 || !data.candidates[0].content.parts[0].text) {
      throw new Error("Invalid response from Gemini API");
    }

    const textResponse = data.candidates[0].content.parts[0].text.trim();
    console.log("Disease prediction response:", textResponse);
    
    // Clean the response by removing markdown code blocks if present
    const cleanedResponse = textResponse
      .replace(/^```json\s+/i, '')  // Remove opening markdown
      .replace(/\s+```$/i, '')      // Remove closing markdown
      .trim();
    
    try {
      // First, try direct parsing of the cleaned response
      const result = JSON.parse(cleanedResponse) as DiseasePredictionResult;
      return result;
    } catch (jsonError) {
      // If direct parsing fails, try to extract JSON
      console.error("JSON parse error:", jsonError);
      const jsonMatch = cleanedResponse.match(/({[\s\S]*})/);
      if (jsonMatch) {
        const jsonStr = jsonMatch[0];
        try {
          const result = JSON.parse(jsonStr) as DiseasePredictionResult;
          return result;
        } catch (extractError) {
          console.error("Error parsing extracted JSON:", extractError);
          throw new Error("Failed to parse API response");
        }
      } else {
        throw new Error("Invalid JSON format in API response");
      }
    }
  } catch (error) {
    console.error("Error predicting disease risks:", error);
    
    // Show more specific error message based on error type
    if (error instanceof Error && error.message.includes("quota exceeded")) {
      toast.error("API quota limit reached. Please try again later or contact support to upgrade your plan.");
    } else {
      toast.error("Failed to analyze future health risks. Please try again.");
    }
    
    // Return fallback data
    return {
      shortTermRisks: "Analysis temporarily unavailable due to API limits. Please try again later.",
      longTermRisks: "Analysis temporarily unavailable due to API limits. Please try again later.", 
      preventionSteps: "Please consult with a veterinarian for proper preventive care advice.",
      riskLevel: "moderate"
    };
  }
}

export async function generatePrescription(input: PrescriptionInput): Promise<PrescriptionResult> {
  try {
    const url = `${GEMINI_API_URL}?key=${GEMINI_API_KEY}`;
    
    const prompt = `
You are an expert veterinary AI assistant. Based on the following information about an animal, suggest potential over-the-counter treatments and medications that a veterinarian might consider:

Animal type: ${input.animalType}
Age: ${input.animalAge || "Not specified"}
Symptoms: ${input.symptoms}
Medical history: ${input.medicalHistory || "No history provided"}

Please provide detailed suggestions for:
1. Potential medications that a veterinarian might consider (both prescription and OTC options)
2. Typical dosage guidelines based on animal type/size
3. Important precautions and potential side effects
4. Additional notes that a veterinarian might consider

Format your response in strict JSON format as follows:
{
  "medications": "Detailed information about suggested medications",
  "dosage": "Information about typical dosage guidelines",
  "precautions": "Important warnings and potential side effects",
  "vetNotes": "Additional considerations a veterinarian might make"
}

IMPORTANT: Include a clear disclaimer that these are only suggestions and that pet owners should ALWAYS consult with a licensed veterinarian before administering any medication. Do not include any markdown formatting in your response, just valid JSON.
`;

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: prompt
              }
            ]
          }
        ],
        generationConfig: {
          temperature: 0.2,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 1024,
        }
      })
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error("API Error:", errorData);
      
      // Handle quota exceeded errors specifically
      if (response.status === 429) {
        throw new Error("API quota exceeded. The free tier of Gemini API has reached its daily or minute rate limit. Please try again later or upgrade your API plan.");
      }
      
      throw new Error(`API error: ${response.status}`);
    }

    const data = await response.json() as GeminiResponse;
    
    if (!data.candidates || data.candidates.length === 0 || !data.candidates[0].content.parts[0].text) {
      throw new Error("Invalid response from Gemini API");
    }

    const textResponse = data.candidates[0].content.parts[0].text.trim();
    console.log("Prescription generation response:", textResponse);
    
    // Clean the response by removing markdown code blocks if present
    const cleanedResponse = textResponse
      .replace(/^```json\s+/i, '')  // Remove opening markdown
      .replace(/\s+```$/i, '')      // Remove closing markdown
      .trim();
    
    try {
      // First, try direct parsing of the cleaned response
      const result = JSON.parse(cleanedResponse) as PrescriptionResult;
      return result;
    } catch (jsonError) {
      // If direct parsing fails, try to extract JSON
      console.error("JSON parse error:", jsonError);
      const jsonMatch = cleanedResponse.match(/({[\s\S]*})/);
      if (jsonMatch) {
        const jsonStr = jsonMatch[0];
        try {
          const result = JSON.parse(jsonStr) as PrescriptionResult;
          return result;
        } catch (extractError) {
          console.error("Error parsing extracted JSON:", extractError);
          throw new Error("Failed to parse API response");
        }
      } else {
        throw new Error("Invalid JSON format in API response");
      }
    }
  } catch (error) {
    console.error("Error generating prescription:", error);
    
    // Show more specific error message based on error type
    if (error instanceof Error && error.message.includes("quota exceeded")) {
      toast.error("API quota limit reached. Please try again later or contact support to upgrade your plan.");
    } else {
      toast.error("Failed to generate prescription suggestions. Please try again.");
    }
    
    // Return fallback data
    return {
      medications: "Unable to generate medication suggestions due to API limits. Please try again later.",
      dosage: "Please consult with a veterinarian for proper dosage information.",
      precautions: "Always consult with a licensed veterinarian before administering any medication to your pet.",
      vetNotes: "A proper veterinary examination is recommended to determine appropriate treatment."
    };
  }
}

export async function generatePreventiveTips(params: PreventiveTipsInput): Promise<PreventiveTipsResult> {
  try {
    const url = `${GEMINI_API_URL}?key=${GEMINI_API_KEY}`;
    
    const prompt = `
You are an expert veterinary AI assistant specializing in preventive care. Based on the following information about an animal, provide comprehensive preventive care tips:

Animal type: ${params.animalType}
Age: ${params.animalAge || "Not specified"}
Breed: ${params.animalBreed || "Not specified"}
Special needs or concerns: ${params.specialNeeds || "None mentioned"}
Current season: ${getCurrentSeason()}

Please provide detailed preventive care tips for this animal, organized into the following categories:
1. Daily Care - grooming, exercise, routine checks
2. Health Maintenance - vaccinations, check-ups, parasite prevention
3. Nutrition Advice - diet recommendations, feeding schedules, supplements
4. Behavior Management - training tips, enrichment activities, stress prevention
5. Seasonal Health Advice - specific recommendations for the current season (${getCurrentSeason()})

Format your response in strict JSON format as follows:
{
  "dailyCare": "Detailed daily care recommendations",
  "healthMaintenance": "Health maintenance tips",
  "nutritionAdvice": "Diet and nutrition recommendations",
  "behaviorManagement": "Behavior and training advice",
  "seasonalAdvice": "Season-specific health recommendations for ${getCurrentSeason()}"
}

Only return the JSON, nothing else. No markdown formatting, no code blocks, no backticks.
`;

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: prompt
              }
            ]
          }
        ],
        generationConfig: {
          temperature: 0.2,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 1024,
        }
      })
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error("API Error:", errorData);
      throw new Error(`API error: ${response.status}`);
    }

    const data = await response.json() as GeminiResponse;
    
    if (!data.candidates || data.candidates.length === 0 || !data.candidates[0].content.parts[0].text) {
      throw new Error("Invalid response from Gemini API");
    }

    const textResponse = data.candidates[0].content.parts[0].text.trim();
    console.log("Preventive tips generation response:", textResponse);
    
    // Clean the response by removing markdown code blocks if present
    const cleanedResponse = textResponse
      .replace(/^```json\s+/i, '')  // Remove opening markdown
      .replace(/\s+```$/i, '')      // Remove closing markdown
      .trim();
                                                                              
    try {
      // First, try direct parsing of the cleaned response
      const result = JSON.parse(cleanedResponse) as PreventiveTipsResult;
      return result;
    } catch (jsonError) {
      // If direct parsing fails, try to extract JSON
      console.error("JSON parse error:", jsonError);
      const jsonMatch = cleanedResponse.match(/({[\s\S]*})/);
      if (jsonMatch) {
        const jsonStr = jsonMatch[0];
        try {
          const result = JSON.parse(jsonStr) as PreventiveTipsResult;
          return result;
        } catch (extractError) {
          console.error("Error parsing extracted JSON:", extractError);
          throw new Error("Failed to parse API response");
        }
      } else {
        throw new Error("Invalid JSON format in API response");
      }
    }
  } catch (error) {
    console.error("Error generating preventive tips:", error);
    toast.error("Failed to generate preventive tips. Please try again.");
    
    // Return fallback data
    return {
      dailyCare: `For ${params.animalType}s, daily care should include regular grooming, ${
        params.animalAge ? `appropriate for ${params.animalAge} age, ` : ""
      }dental hygiene, and exercise routines.`,
      
      healthMaintenance: `Regular health check-ups are essential for ${params.animalType}s. ${
        params.animalAge ? `At ${params.animalAge}, ` : ""
      }ensure vaccinations are up to date and parasite prevention is maintained year-round.`,
      
      nutritionAdvice: `Provide high-quality, age-appropriate food for your ${params.animalType}. ${
        params.animalBreed ? `${params.animalBreed}s often benefit from ` : "Consider "
      }specialized nutrition that supports joint health and maintains optimal weight.`,
      
      behaviorManagement: `${params.animalType}s need mental stimulation and appropriate training. ${
        params.animalAge ? `At ${params.animalAge}, focus on ` : "Focus on "
      }positive reinforcement techniques and consistent boundaries.`,

      seasonalAdvice: `Currently in ${getCurrentSeason()}, ${params.animalType}s may face specific challenges. ${
        params.animalBreed ? `${params.animalBreed}s should be particularly aware of ` : "Be aware of "
      }${getSeasonalAdvice(getCurrentSeason(), params.animalType)}`
    };
  }
}

// Helper function to get current season
function getCurrentSeason(): string {
  const now = new Date();
  const month = now.getMonth();
  
  if (month >= 2 && month <= 4) return "spring";
  if (month >= 5 && month <= 7) return "summer";
  if (month >= 8 && month <= 10) return "fall";
  return "winter";
}

// Helper function to provide seasonal advice based on animal type
function getSeasonalAdvice(season: string, animalType: string): string {
  const advice = {
    spring: {
      dog: "seasonal allergies, tick and flea emergence, and muddy conditions that can lead to skin issues.",
      cat: "increased outdoor activity, potential allergies from pollen, and risks from pesticides in gardens.",
      bird: "changing daylight hours affecting mood and behavior, and draft exposure during temperature fluctuations.",
      default: "seasonal allergies, changing outdoor conditions, and emerging parasites."
    },
    summer: {
      dog: "heat stress, dehydration, and hot pavement burning paws. Provide shade and limit exercise during peak heat hours.",
      cat: "heat-related issues, increased parasite activity, and potential sunburn for light-colored animals.",
      bird: "heat stress, dehydration, and potential air quality issues from air conditioning.",
      default: "heat-related stress, increased hydration needs, and sun exposure risks."
    },
    fall: {
      dog: "seasonal mushrooms that may be toxic, increased wildlife activity, and allergens from falling leaves.",
      cat: "seeking warm spots near heaters which can be hazardous, and increased hunger as temperatures drop.",
      bird: "changing light cycles affecting behavior and potential draft exposure as heating systems turn on.",
      default: "changing temperatures, potential allergens, and preparing for colder weather."
    },
    winter: {
      dog: "cold exposure, dry skin, joint pain from cold weather, and chemical hazards from ice melts.",
      cat: "seeking dangerous heat sources, dry skin from indoor heating, and reduced exercise.",
      bird: "temperature regulation challenges, draft sensitivity, and humidity issues from heating.",
      default: "cold weather exposure, dry skin from indoor heating, and reduced activity leading to weight gain."
    }
  };

  const animalAdvice = advice[season as keyof typeof advice][animalType.toLowerCase() as keyof typeof advice.spring] || 
                       advice[season as keyof typeof advice].default;
  
  return animalAdvice;
}
