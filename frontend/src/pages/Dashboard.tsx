
import { SidebarProvider } from "@/components/ui/sidebar";

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-medical-50">
      <SidebarProvider>
        <div className="flex min-h-screen w-full">
          <div className="flex-1 p-8">
            <h1 className="text-3xl font-bold text-medical-700 mb-6">Dashboard</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-xl font-semibold mb-4 text-medical-600">Welcome to AI Vet</h2>
                <p className="text-gray-600">Thank you for using AI Vet! Select a service from the sidebar to get started.</p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-xl font-semibold mb-4 text-medical-600">Quick Start</h2>
                <p className="text-gray-600">Check out our most popular features:</p>
                <ul className="mt-3 space-y-2 text-medical-600">
                  <li>• Symptom Checker</li>
                  <li>• Disease Prediction</li>
                  <li>• Chat with AI Vet</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </SidebarProvider>
    </div>
  );
}
