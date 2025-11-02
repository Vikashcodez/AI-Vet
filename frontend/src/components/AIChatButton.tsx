
import { useState } from "react";
import { MessageSquare, Bot, X, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

const AIChatButton = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [conversation, setConversation] = useState<Array<{type: 'user' | 'ai', content: string}>>([
    {
      type: 'ai',
      content: "Hello! I'm your pet health assistant. How can I help you today?"
    }
  ]);

  const handleChatButtonClick = () => {
    setIsOpen(!isOpen);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;
    
    // Add user message to conversation
    const userMessage = message;
    setConversation([...conversation, { type: 'user', content: userMessage }]);
    setMessage("");
    
    // Simulate AI response
    setTimeout(() => {
      const responses = [
        "I understand your concern about your pet. Could you provide more details?",
        "Based on those symptoms, it might be helpful to consult with your veterinarian.",
        "Make sure your pet stays hydrated and comfortable until you can see a professional.",
        "Pet nutrition is important! Make sure they're getting a balanced diet appropriate for their age and activity level.",
        "Regular check-ups are essential for your pet's health. Have you scheduled their annual wellness exam?"
      ];
      
      const randomResponse = responses[Math.floor(Math.random() * responses.length)];
      setConversation(prev => [...prev, { type: 'ai', content: randomResponse }]);
    }, 1000);
  };

  return (
    <>
      <div className="fixed bottom-6 right-6 z-50">
        <Button
          onClick={handleChatButtonClick}
          className="w-14 h-14 rounded-full bg-teal-400 hover:bg-teal-500 shadow-lg flex items-center justify-center p-0 transition-all duration-300"
          aria-label="Chat with AI Vet Assistant"
        >
          <MessageSquare className="text-white h-6 w-6" />
        </Button>
      </div>

      {isOpen && (
        <div className="fixed bottom-24 right-6 w-80 sm:w-96 bg-white rounded-lg shadow-xl border border-gray-200 z-50 flex flex-col max-h-[500px] overflow-hidden">
          {/* Chat header */}
          <div className="flex items-center justify-between bg-teal-400 text-white px-4 py-3">
            <div className="flex items-center gap-2">
              <Bot className="h-5 w-5" />
              <h3 className="font-medium">AI Vet Assistant</h3>
            </div>
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-8 w-8 text-white hover:bg-teal-500"
              onClick={() => setIsOpen(false)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          
          {/* Chat messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 min-h-[300px] max-h-[350px]">
            {conversation.map((msg, index) => (
              <div 
                key={index} 
                className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div 
                  className={`max-w-[80%] rounded-lg px-4 py-2 ${
                    msg.type === 'user' 
                      ? 'bg-teal-400 text-white rounded-br-none' 
                      : 'bg-gray-100 text-gray-800 rounded-bl-none'
                  }`}
                >
                  {msg.content}
                </div>
              </div>
            ))}
          </div>
          
          {/* Chat input */}
          <form onSubmit={handleSubmit} className="border-t p-3 flex gap-2">
            <Input
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type your message..."
              className="flex-1"
            />
            <Button type="submit" className="bg-teal-400 hover:bg-teal-500">
              <Send className="h-4 w-4" />
            </Button>
          </form>
        </div>
      )}
    </>
  );
};

export default AIChatButton;
