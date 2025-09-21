import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { ArrowRight, Clock, HandHeart, Cpu, Quote, Phone, Shield, RefreshCw, Truck, Scale, Crown, Check, Globe } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";
import { useTokens } from "@/hooks/useTokens";

const Index = () => {
  const navigate = useNavigate();
  const [currency, setCurrency] = useState("INR");
  const { tokens, showPricing, setShowPricing } = useTokens();

  const currencies = {
    INR: { symbol: "₹", monthly: 399, yearly: 4500 },
    USD: { symbol: "$", monthly: 4.99, yearly: 54.99 },
    EUR: { symbol: "€", monthly: 4.49, yearly: 49.99 },
    GBP: { symbol: "£", monthly: 3.99, yearly: 43.99 },
  };

  const handleGetStarted = () => {
    navigate('/symptoms');
  };
  
  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* Top Navigation */}
      <div className="bg-white py-4 px-4 sm:px-6 lg:px-8 shadow-sm">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-600">Free tokens remaining: {tokens}</span>
          </div>
          <Dialog open={showPricing} onOpenChange={setShowPricing}>
            <DialogTrigger asChild>
              <Button variant="outline" className="flex items-center space-x-2">
                <Crown className="h-4 w-4" />
                <span>Pricing</span>
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="text-2xl font-bold text-center">Choose Your Plan</DialogTitle>
              </DialogHeader>
              
              <div className="space-y-6">
                {/* Currency Selector */}
                <div className="flex justify-center">
                  <div className="flex items-center space-x-2">
                    <Globe className="h-4 w-4 text-gray-500" />
                    <Select value={currency} onValueChange={setCurrency}>
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="INR">🇮🇳 INR</SelectItem>
                        <SelectItem value="USD">🇺🇸 USD</SelectItem>
                        <SelectItem value="EUR">🇪🇺 EUR</SelectItem>
                        <SelectItem value="GBP">🇬🇧 GBP</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Pricing Cards */}
                <div className="grid md:grid-cols-2 gap-6">
                  {/* Monthly Plan */}
                  <Card className="relative overflow-hidden border-2 hover:border-primary/50 transition-colors">
                    <CardContent className="p-6">
                      <div className="text-center space-y-4">
                        <h3 className="text-xl font-semibold">Monthly Plan</h3>
                        <div className="space-y-2">
                          <div className="text-3xl font-bold text-primary">
                            {currencies[currency as keyof typeof currencies].symbol}
                            {currencies[currency as keyof typeof currencies].monthly}
                          </div>
                          <p className="text-sm text-muted-foreground">per month</p>
                        </div>
                        
                        <ul className="space-y-2 text-sm">
                          <li className="flex items-center">
                            <Check className="h-4 w-4 text-green-500 mr-2" />
                            AI Symptom Checker
                          </li>
                          <li className="flex items-center">
                            <Check className="h-4 w-4 text-green-500 mr-2" />
                            Disease Prediction Analysis
                          </li>
                          <li className="flex items-center">
                            <Check className="h-4 w-4 text-green-500 mr-2" />
                            Diet Evaluation & Planning
                          </li>
                          <li className="flex items-center">
                            <Check className="h-4 w-4 text-green-500 mr-2" />
                            Preventive Healthcare Tips
                          </li>
                          <li className="flex items-center">
                            <Check className="h-4 w-4 text-green-500 mr-2" />
                            Health Risk Predictor
                          </li>
                          <li className="flex items-center">
                            <Check className="h-4 w-4 text-green-500 mr-2" />
                            AI Veterinary Assistant
                          </li>
                          <li className="flex items-center">
                            <Check className="h-4 w-4 text-green-500 mr-2" />
                            Activity Level Assessment
                          </li>
                          <li className="flex items-center">
                            <Check className="h-4 w-4 text-green-500 mr-2" />
                            Digital Prescription Generator
                          </li>
                          <li className="flex items-center">
                            <Check className="h-4 w-4 text-green-500 mr-2" />
                            24/7 Support
                          </li>
                        </ul>
                        
                        <Button className="w-full" variant="default">
                          Choose Monthly
                        </Button>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Yearly Plan */}
                  <Card className="relative overflow-hidden border-2 border-primary shadow-lg">
                    <div className="absolute top-0 left-0 right-0 bg-primary text-white text-center py-2 text-sm font-medium">
                      Most Popular
                    </div>
                    <CardContent className="p-6 pt-12">
                      <div className="text-center space-y-4">
                        <h3 className="text-xl font-semibold">Yearly Plan</h3>
                        <div className="space-y-2">
                          <div className="text-3xl font-bold text-primary">
                            {currencies[currency as keyof typeof currencies].symbol}
                            {currencies[currency as keyof typeof currencies].yearly}
                          </div>
                          <p className="text-sm text-muted-foreground">per year</p>
                          <p className="text-xs text-green-600 font-medium">Save 25%</p>
                        </div>
                        
                        <ul className="space-y-2 text-sm">
                          <li className="flex items-center">
                            <Check className="h-4 w-4 text-green-500 mr-2" />
                            AI Symptom Checker
                          </li>
                          <li className="flex items-center">
                            <Check className="h-4 w-4 text-green-500 mr-2" />
                            Disease Prediction Analysis
                          </li>
                          <li className="flex items-center">
                            <Check className="h-4 w-4 text-green-500 mr-2" />
                            Diet Evaluation & Planning
                          </li>
                          <li className="flex items-center">
                            <Check className="h-4 w-4 text-green-500 mr-2" />
                            Preventive Healthcare Tips
                          </li>
                          <li className="flex items-center">
                            <Check className="h-4 w-4 text-green-500 mr-2" />
                            Health Risk Predictor
                          </li>
                          <li className="flex items-center">
                            <Check className="h-4 w-4 text-green-500 mr-2" />
                            AI Veterinary Assistant
                          </li>
                          <li className="flex items-center">
                            <Check className="h-4 w-4 text-green-500 mr-2" />
                            Activity Level Assessment
                          </li>
                          <li className="flex items-center">
                            <Check className="h-4 w-4 text-green-500 mr-2" />
                            Digital Prescription Generator
                          </li>
                          <li className="flex items-center">
                            <Check className="h-4 w-4 text-green-500 mr-2" />
                            Advanced Health Analytics
                          </li>
                          <li className="flex items-center">
                            <Check className="h-4 w-4 text-green-500 mr-2" />
                            Priority Support & Updates
                          </li>
                        </ul>
                        
                        <Button className="w-full" variant="default">
                          Choose Yearly
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>

              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Hero Section with gradient background - updated to match reference */}
      <div className="relative overflow-hidden bg-[#e8f9f6] py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-12">
            <div className="w-full md:w-1/2 space-y-6 text-left animate-fadeIn">
              <span className="inline-block px-4 py-2 rounded-full bg-[#e8f9f6] text-medical-700 font-medium text-sm mb-2">
                Veterinary AI Assistant
              </span>
              <h1 className="text-4xl md:text-6xl font-bold text-gray-900 leading-tight">
                AI-Powered <span className="text-[#00BFA6]">Animal</span><br />
                <span className="text-[#00BFA6]">Healthcare</span>
              </h1>
              <p className="text-xl text-gray-600 max-w-lg">
                Get instant insights and personalized care recommendations for your animal using our advanced AI veterinary assistant.
              </p>
              
              {/* Get Started Button styled like the reference */}
              <Button 
                variant="lightGreen" 
                onClick={handleGetStarted}
                className="text-white bg-[#00BFA6] hover:bg-[#00A896] rounded-md py-3 px-6 text-lg flex items-center mt-4"
              >
                Get Started <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>

            <div className="w-full md:w-1/2 animate-slideUp">
              <img 
                src="/lovable-uploads/c1f981a3-0e36-4c89-87f3-c4e42fcb1f0f.png" 
                alt="Veterinarian with dog" 
                className="w-full h-auto rounded-2xl"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="bg-gray-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-2 rounded-full bg-medical-100 text-medical-700 font-medium text-sm mb-3">
              Our Services
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Why Choose AIVeterinaryDoc?</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Comprehensive tools and solutions designed to provide the best care for your animal
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureCard 
              title="Symptom Checker"
              description="Analyze your animal's symptoms and get AI-powered insights on potential conditions."
              link="/symptoms"
            />
            
            <FeatureCard 
              title="Disease Prediction"
              description="Predict potential diseases based on symptoms and medical history."
              link="/disease-prediction"
            />
            
            <FeatureCard 
              title="Diet Evaluation"
              description="Get personalized diet recommendations for your animal's optimal health."
              link="/diet-evaluation"
            />
            
            <FeatureCard 
              title="Preventive Tips"
              description="Receive customized preventive healthcare tips for your animal."
              link="/preventive-tips"
            />
            
            <FeatureCard 
              title="Risk Predictor"
              description="Assess your animal's risk factors for various health conditions."
              link="/risk-predictor"
            />
            
            <FeatureCard 
              title="Vet Assistant"
              description="Connect with our AI vet assistant for immediate guidance."
              link="/vet"
            />
          </div>
        </div>
      </div>
      
      {/* Benefits Section */}
      <div className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-2 rounded-full bg-medical-100 text-medical-700 font-medium text-sm mb-3">
              Advantages
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Benefits of AI Vet</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              How our technology enhances your animal's healthcare experience
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <BenefitCard 
              icon={<Clock className="w-12 h-12 text-medical-500" />}
              title="24/7 Availability"
              description="Our AI vet has no working hours and never gets tired. Use our chatbot anytime, anywhere, and ask as many questions about your animal's health as you want."
            />
            
            <BenefitCard 
              icon={<HandHeart className="w-12 h-12 text-medical-500" />}
              title="Personalization"
              description="AI Vet screenings are tailored to your animal's specific needs, health history, and even lifestyle habits, helping to closely align AI with veterinary insights."
            />
            
            <BenefitCard 
              icon={<Cpu className="w-12 h-12 text-medical-500" />}
              title="Powered by NLP Models"
              description="Our AI vet assistant is driven by a natural language model, which enables it to approach your animal's health inquiries with advanced intelligence and understanding."
            />
          </div>
        </div>
      </div>
      
      {/* Testimonials Section */}
      <div className="py-20 bg-medical-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-2 rounded-full bg-medical-100 text-medical-700 font-medium text-sm mb-3">
              Testimonials
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Hear From Our Users</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Discover how our AI Vet has positively impacted animals' lives
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <TestimonialCard 
              quote="I've never felt more empowered in my animal's health journey. AI Vet provides instant, reliable insights that are easy to understand. It complements our vet visits perfectly by offering a readily available second opinion. Every animal owner should use this!"
              author="Monica A."
              image="/lovable-uploads/7c1c55a1-0d6b-4500-b2e3-9965e7ef0629.png"
            />
            
            <TestimonialCard 
              quote="AI Vet has made a significant difference in how I approach my animal's health. 24/7 it provides prompt, understandable responses to my health concerns. It's given me peace of mind and empowered me to be more proactive about my dog's health. Truly invaluable!"
              author="Harry L."
              image="/lovable-uploads/7c1c55a1-0d6b-4500-b2e3-9965e7ef0629.png"
            />
            
            <TestimonialCard 
              quote="Using AI Vet has been a game-changer for my cat. I love that I can ask health-related questions anytime. It's like having a virtual vet assistant in my pocket. It's convenient and makes understanding complex animal health topics much easier."
              author="Emily G."
              image="/lovable-uploads/7c1c55a1-0d6b-4500-b2e3-9965e7ef0629.png"
            />
          </div>
        </div>
      </div>
      
      {/* CTA Section */}
      <div className="bg-gradient-to-r from-medical-600 to-medical-700 py-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">Ready to improve your animal's health?</h2>
          <p className="text-xl text-medical-100 mb-10 max-w-2xl mx-auto">
            Join thousands of animal owners who trust AI Vet for personalized health guidance and peace of mind.
          </p>
        </div>
      </div>
      
      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-4">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <h3 className="text-2xl font-bold">AI Vet</h3>
            <p className="text-gray-400">AI-Powered Animal Healthcare</p>
            <p className="text-gray-400">Transforming animal wellness through artificial intelligence.</p>
          </div>
          
          <div className="space-y-4">
            <h4 className="text-lg font-semibold">Services</h4>
            <div className="flex flex-col gap-2">
              <Link to="/symptoms" className="text-gray-300 hover:text-white transition-colors">Symptoms</Link>
              <Link to="/disease-prediction" className="text-gray-300 hover:text-white transition-colors">Disease Prediction</Link>
              <Link to="/risk-predictor" className="text-gray-300 hover:text-white transition-colors">Risk Predictor</Link>
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="text-lg font-semibold">Resources</h4>
            <div className="flex flex-col gap-2">
              <Link to="/preventive-tips" className="text-gray-300 hover:text-white transition-colors">Preventive Tips</Link>
              <Link to="/diet-evaluation" className="text-gray-300 hover:text-white transition-colors">Diet Evaluation</Link>
              <Link to="/activity-level" className="text-gray-300 hover:text-white transition-colors">Activity Level</Link>
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="text-lg font-semibold">Get Started</h4>
            <div className="flex flex-col gap-2">
              <Link to="/symptoms" className="text-gray-300 hover:text-white transition-colors">Symptoms Checker</Link>
              <Link to="/vet" className="text-gray-300 hover:text-white transition-colors">Chat with AI Vet</Link>
            </div>
          </div>
        </div>
        
        <div className="max-w-7xl mx-auto mt-12 pt-8 border-t border-gray-800">
          <div className="text-center mb-6 space-x-4 flex flex-wrap justify-center gap-2">
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" className="bg-white text-gray-900 hover:bg-gray-100 border-gray-300">
                  <Phone className="mr-2 h-4 w-4" />
                  Contact Us
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Contact Us</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 text-sm">
                  <p className="text-muted-foreground">Last updated on Sep 16 2025</p>
                  <p>You may contact us using the information below:</p>
                  
                  <div className="space-y-2">
                    <p><strong>Merchant Legal entity name:</strong> Ankit Laj Acharya</p>
                    <p><strong>Registered Address:</strong> Rangat bazzar North And Middle Andaman ANDAMAN & NICOBAR ISLANDS 744205</p>
                    <p><strong>Operational Address:</strong> Rangat bazzar North And Middle Andaman ANDAMAN & NICOBAR ISLANDS 744205</p>
                    <p><strong>Telephone No:</strong> 9531973175</p>
                    <p><strong>E-Mail ID:</strong> ankitlajacharya@gmail.com</p>
                  </div>
                </div>
              </DialogContent>
            </Dialog>

            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" className="bg-white text-gray-900 hover:bg-gray-100 border-gray-300">
                  <Shield className="mr-2 h-4 w-4" />
                  Privacy
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-2xl max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Privacy Policy</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 text-sm">
                  <p className="text-muted-foreground">Last updated on Sep 16 2025</p>
                  
                  <p>This privacy policy sets out how Ankit Laj Acharya uses and protects any information that you give Ankit Laj Acharya when you visit their website and/or agree to purchase from them.</p>
                  
                  <p>Ankit Laj Acharya is committed to ensuring that your privacy is protected. Should we ask you to provide certain information by which you can be identified when using this website, and then you can be assured that it will only be used in accordance with this privacy statement.</p>
                  
                  <p>Ankit Laj Acharya may change this policy from time to time by updating this page. You should check this page from time to time to ensure that you adhere to these changes.</p>
                  
                  <div>
                    <h4 className="font-semibold mb-2">We may collect the following information:</h4>
                    <ul className="list-disc list-inside space-y-1 ml-4">
                      <li>Name</li>
                      <li>Contact information including email address</li>
                      <li>Demographic information such as postcode, preferences and interests, if required</li>
                      <li>Other information relevant to customer surveys and/or offers</li>
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold mb-2">What we do with the information we gather</h4>
                    <p>We require this information to understand your needs and provide you with a better service, and in particular for the following reasons:</p>
                    <ul className="list-disc list-inside space-y-1 ml-4 mt-2">
                      <li>Internal record keeping.</li>
                      <li>We may use the information to improve our products and services.</li>
                      <li>We may periodically send promotional emails about new products, special offers or other information which we think you may find interesting using the email address which you have provided.</li>
                      <li>From time to time, we may also use your information to contact you for market research purposes. We may contact you by email, phone, fax or mail. We may use the information to customise the website according to your interests.</li>
                    </ul>
                  </div>
                  
                  <p>We are committed to ensuring that your information is secure. In order to prevent unauthorised access or disclosure we have put in suitable measures.</p>
                  
                  <div>
                    <h4 className="font-semibold mb-2">How we use cookies</h4>
                    <p>A cookie is a small file which asks permission to be placed on your computer's hard drive. Once you agree, the file is added and the cookie helps analyze web traffic or lets you know when you visit a particular site. Cookies allow web applications to respond to you as an individual. The web application can tailor its operations to your needs, likes and dislikes by gathering and remembering information about your preferences.</p>
                    
                    <p className="mt-2">We use traffic log cookies to identify which pages are being used. This helps us analyze data about webpage traffic and improve our website in order to tailor it to customer needs. We only use this information for statistical analysis purposes and then the data is removed from the system.</p>
                    
                    <p className="mt-2">Overall, cookies help us provide you with a better website, by enabling us to monitor which pages you find useful and which you do not. A cookie in no way gives us access to your computer or any information about you, other than the data you choose to share with us.</p>
                    
                    <p className="mt-2">You can choose to accept or decline cookies. Most web browsers automatically accept cookies, but you can usually modify your browser setting to decline cookies if you prefer. This may prevent you from taking full advantage of the website.</p>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold mb-2">Controlling your personal information</h4>
                    <p>You may choose to restrict the collection or use of your personal information in the following ways:</p>
                    <ul className="list-disc list-inside space-y-1 ml-4 mt-2">
                      <li>whenever you are asked to fill in a form on the website, look for the box that you can click to indicate that you do not want the information to be used by anybody for direct marketing purposes</li>
                      <li>if you have previously agreed to us using your personal information for direct marketing purposes, you may change your mind at any time by writing to or emailing us at ankitlajacharya@gmail.com</li>
                    </ul>
                    
                    <p className="mt-2">We will not sell, distribute or lease your personal information to third parties unless we have your permission or are required by law to do so. We may use your personal information to send you promotional information about third parties which we think you may find interesting if you tell us that you wish this to happen.</p>
                    
                    <p className="mt-2">If you believe that any information we are holding on you is incorrect or incomplete, please write to Rangat bazzar North And Middle Andaman ANDAMAN & NICOBAR ISLANDS 744205 . or contact us at 9531973175 or ankitlajacharya@gmail.com as soon as possible. We will promptly correct any information found to be incorrect.</p>
                  </div>
                </div>
              </DialogContent>
            </Dialog>

            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" className="bg-white text-gray-900 hover:bg-gray-100 border-gray-300">
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Cancellation & Refunds
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-2xl max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Cancellation & Refund Policy</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 text-sm">
                  <p className="text-muted-foreground">Last updated on Sep 16 2025</p>
                  
                  <p>Ankit Laj Acharya believes in helping its customers as far as possible, and has therefore a liberal cancellation policy. Under this policy:</p>
                  
                  <p>Cancellations will be considered only if the request is made within Not Applicable of placing the order. However, the cancellation request may not be entertained if the orders have been communicated to the vendors/merchants and they have initiated the process of shipping them.</p>
                  
                  <p>Ankit Laj Acharya does not accept cancellation requests for perishable items like flowers, eatables etc. However, refund/replacement can be made if the customer establishes that the quality of product delivered is not good.</p>
                  
                  <p>In case of receipt of damaged or defective items please report the same to our Customer Service team. The request will, however, be entertained once the merchant has checked and determined the same at his own end. This should be reported within Not Applicable of receipt of the products.</p>
                  
                  <p>In case you feel that the product received is not as shown on the site or as per your expectations, you must bring it to the notice of our customer service within Not Applicable of receiving the product. The Customer Service Team after looking into your complaint will take an appropriate decision.</p>
                  
                  <p>In case of complaints regarding products that come with a warranty from manufacturers, please refer the issue to them.</p>
                  
                  <p>In case of any Refunds approved by the Ankit Laj Acharya, it'll take Not Applicable for the refund to be processed to the end customer.</p>
                </div>
              </DialogContent>
            </Dialog>

            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" className="bg-white text-gray-900 hover:bg-gray-100 border-gray-300">
                  <Truck className="mr-2 h-4 w-4" />
                  Shipping Policy
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-2xl max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Shipping & Delivery Policy</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 text-sm">
                  <p className="text-muted-foreground">Last updated on Sep 16 2025</p>
                  
                  <p>For International buyers, orders are shipped and delivered through registered international courier companies and/or International speed post only. For domestic buyers, orders are shipped through registered domestic courier companies and /or speed post only. Orders are shipped within Not Applicable or as per the delivery date agreed at the time of order confirmation and delivering of the shipment subject to Courier Company / post office norms. Ankit Laj Acharya is not liable for any delay in delivery by the courier company / postal authorities and only guarantees to hand over the consignment to the courier company or postal authorities within Not Applicable rom the date of the order and payment or as per the delivery date agreed at the time of order confirmation. Delivery of all orders will be to the address provided by the buyer. Delivery of our services will be confirmed on your mail ID as specified during registration. For any issues in utilizing our services you may contact our helpdesk on 9531973175 or ankitlajacharya@gmail.com</p>
                </div>
              </DialogContent>
            </Dialog>

            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" className="bg-white text-gray-900 hover:bg-gray-100 border-gray-300">
                  <Scale className="mr-2 h-4 w-4" />
                  Terms & Conditions
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-2xl max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Terms & Conditions</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 text-sm">
                  <p className="text-muted-foreground">Last updated on Sep 16 2025</p>
                  
                  <p>For the purpose of these Terms and Conditions, The term "we", "us", "our" used anywhere on this page shall mean Ankit Laj Acharya, whose registered/operational office is Rangat bazzar North And Middle Andaman ANDAMAN & NICOBAR ISLANDS 744205 . "you", "your", "user", "visitor" shall mean any natural or legal person who is visiting our website and/or agreed to purchase from us.</p>
                  
                  <p>Your use of the website and/or purchase from us are governed by following Terms and Conditions:</p>
                  
                  <p>The content of the pages of this website is subject to change without notice.</p>
                  
                  <p>Neither we nor any third parties provide any warranty or guarantee as to the accuracy, timeliness, performance, completeness or suitability of the information and materials found or offered on this website for any particular purpose. You acknowledge that such information and materials may contain inaccuracies or errors and we expressly exclude liability for any such inaccuracies or errors to the fullest extent permitted by law.</p>
                  
                  <p>Your use of any information or materials on our website and/or product pages is entirely at your own risk, for which we shall not be liable. It shall be your own responsibility to ensure that any products, services or information available through our website and/or product pages meet your specific requirements.</p>
                  
                  <p>Our website contains material which is owned by or licensed to us. This material includes, but are not limited to, the design, layout, look, appearance and graphics. Reproduction is prohibited other than in accordance with the copyright notice, which forms part of these terms and conditions.</p>
                  
                  <p>All trademarks reproduced in our website which are not the property of, or licensed to, the operator are acknowledged on the website.</p>
                  
                  <p>Unauthorized use of information provided by us shall give rise to a claim for damages and/or be a criminal offense.</p>
                  
                  <p>From time to time our website may also include links to other websites. These links are provided for your convenience to provide further information.</p>
                  
                  <p>You may not create a link to our website from another website or document without Ankit Laj Acharya's prior written consent.</p>
                  
                  <p>Any dispute arising out of use of our website and/or purchase with us and/or any engagement with us is subject to the laws of India .</p>
                  
                  <p>We, shall be under no liability whatsoever in respect of any loss or damage arising directly or indirectly out of the decline of authorization for any Transaction, on Account of the Cardholder having exceeded the preset limit mutually agreed by us with our acquiring bank from time to time</p>
                </div>
              </DialogContent>
            </Dialog>
          </div>
          
          <div className="text-center text-gray-500 text-sm">
            <p>© {new Date().getFullYear()} AI Vet. All rights reserved.</p>
            <p className="mt-2">This is an AI-powered tool and should not replace professional veterinary advice.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

const FeatureCard = ({ title, description, link }: { title: string; description: string; link: string }) => {
  return (
    <Card className="overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1 bg-white h-full">
      <CardContent className="p-6">
        <h3 className="text-xl font-semibold mb-3 text-medical-700">{title}</h3>
        <p className="text-gray-600 mb-4">{description}</p>
        <Link to={link}>
          <Button variant="ghost" className="group text-medical-600 p-0 hover:text-medical-700 hover:bg-transparent">
            Learn more 
            <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
};

const BenefitCard = ({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) => {
  return (
    <div className="flex flex-col items-center md:items-start text-center md:text-left">
      <div className="mb-5 p-4 rounded-2xl bg-medical-50">
        {icon}
      </div>
      <h3 className="text-xl font-semibold mb-3 text-gray-800">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  );
};

const TestimonialCard = ({ quote, author, image }: { quote: string; author: string; image: string }) => {
  return (
    <Card className={cn(
      "relative overflow-hidden bg-white p-8 rounded-xl shadow-md hover:shadow-lg transition-all h-full",
      "before:content-[''] before:absolute before:top-0 before:left-0 before:w-full before:h-1 before:bg-medical-500"
    )}>
      <Quote className="text-medical-100 w-10 h-10 mb-4" />
      <div className="pt-2">
        <p className="text-gray-700 italic mb-6">{quote}</p>
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full overflow-hidden bg-medical-100">
            <img 
              src={image} 
              alt={author} 
              className="w-full h-full object-cover"
            />
          </div>
          <p className="font-semibold text-medical-700">{author}</p>
        </div>
      </div>
    </Card>
  );
};

export default Index;
