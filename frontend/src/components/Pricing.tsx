import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Check, Crown, Globe, Loader2, CreditCard, Shield, Calendar, UserCheck } from "lucide-react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

// Declare Razorpay types
declare global {
  interface Window {
    Razorpay: any;
  }
}

interface Subscription {
  id: number;
  plan: string;
  startDate: string;
  endDate: string;
  status: string;
  includes: string[];
}

const Pricing = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [currency, setCurrency] = useState("INR");
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [userSubscription, setUserSubscription] = useState<Subscription | null>(null);
  const [isLoadingSubscription, setIsLoadingSubscription] = useState(true);

  const currencies = {
    INR: { symbol: "₹", monthly: 399, yearly: 4500 },
    USD: { symbol: "$", monthly: 4.99, yearly: 54.99 },
    EUR: { symbol: "€", monthly: 4.49, yearly: 49.99 },
    GBP: { symbol: "£", monthly: 3.99, yearly: 43.99 },
  };

  // Amounts in paise/cents for Razorpay
  const planAmounts = {
    monthly: {
      INR: 39900, // 399 INR in paise
      USD: 499,   // 4.99 USD in cents
      EUR: 449,   // 4.49 EUR in cents
      GBP: 399    // 3.99 GBP in pence
    },
    yearly: {
      INR: 450000, // 4500 INR in paise
      USD: 5499,   // 54.99 USD in cents
      EUR: 4999,   // 49.99 EUR in cents
      GBP: 4399    // 43.99 GBP in pence
    }
  };

  // Fetch user subscription
  const fetchUserSubscription = async () => {
    if (!user) {
      setIsLoadingSubscription(false);
      return;
    }

    try {
      const response = await fetch(`http://localhost:5000/api/subscriptions/user/${user.id}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        }
      });

      const data = await response.json();

      if (data.success && data.data && data.data.subscription) {
        setUserSubscription(data.data.subscription);
      }
    } catch (error) {
      console.error('Error fetching subscription:', error);
    } finally {
      setIsLoadingSubscription(false);
    }
  };

  useEffect(() => {
    fetchUserSubscription();
  }, [user]);

  const handleGetStarted = () => {
    navigate('/symptoms');
  };

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      if (window.Razorpay) {
        resolve(true);
        return;
      }

      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handleChoosePlan = async (planType: 'monthly' | 'yearly') => {
    if (!user) {
      alert('Please login to subscribe to a plan');
      navigate('/login');
      return;
    }

    if (userSubscription) {
      alert('You already have an active subscription. Please manage your subscription from your account.');
      return;
    }

    setIsProcessing(true);
    setSelectedPlan(planType);

    try {
      // Load Razorpay script
      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded) {
        alert('Razorpay SDK failed to load. Please try again.');
        return;
      }

      // Create order on backend
      const response = await fetch('http://localhost:5000/api/subscriptions/create-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        },
        body: JSON.stringify({ 
          planType, 
          currency 
        })
      });

      const orderData = await response.json();

      if (!orderData.success) {
        throw new Error(orderData.message);
      }

      // Get display amount for the modal
      const displayAmount = currencies[currency as keyof typeof currencies][planType];

      // Payment options
      const options = {
        key: orderData.data.key,
        amount: orderData.data.amount,
        currency: orderData.data.currency,
        name: 'AI Veterinary Assistant',
        description: `${planType.charAt(0).toUpperCase() + planType.slice(1)} Subscription - ${currencies[currency as keyof typeof currencies].symbol}${displayAmount}/${planType === 'monthly' ? 'month' : 'year'}`,
        order_id: orderData.data.orderId,
        handler: async function (response: any) {
          // Verify payment on backend
          const verifyResponse = await fetch('http://localhost:5000/api/subscriptions/verify-payment', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${localStorage.getItem('authToken')}`
            },
            body: JSON.stringify({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature
            })
          });

          const verifyData = await verifyResponse.json();

          if (verifyData.success) {
            alert('🎉 Payment successful! Your subscription is now active.');
            // Refresh subscription data
            await fetchUserSubscription();
            // Redirect to dashboard or refresh page
            window.location.href = '/dashboard';
          } else {
            alert('❌ Payment verification failed: ' + verifyData.message);
          }
        },
        prefill: {
          name: `${user.firstName} ${user.lastName}`,
          email: user.email,
          contact: user.phone || ''
        },
        theme: {
          color: '#00BFA6'
        },
        modal: {
          ondismiss: function() {
            setIsProcessing(false);
            setSelectedPlan(null);
          }
        },
        notes: {
          plan: planType,
          features: planType === 'monthly' ? 'All Premium Features' : 'All Premium Features + Extras'
        }
      };

      // Open Razorpay checkout
      const razorpay = new window.Razorpay(options);
      razorpay.open();

    } catch (error: any) {
      console.error('Payment error:', error);
      alert('Payment failed: ' + (error.message || 'Something went wrong'));
    } finally {
      setIsProcessing(false);
      setSelectedPlan(null);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const isSubscriptionActive = () => {
    if (!userSubscription) return false;
    
    const now = new Date();
    const endDate = new Date(userSubscription.endDate);
    return userSubscription.status === 'active' && now < endDate;
  };

  const getSubscriptionButtonText = (planType: string) => {
    if (isLoadingSubscription) {
      return "Checking Subscription...";
    }
    
    if (userSubscription) {
      if (userSubscription.plan === planType && isSubscriptionActive()) {
        return "Current Plan";
      }
      return "Already Subscribed";
    }
    
    return planType === 'monthly' ? "Subscribe Now" : "Get Best Value";
  };

  const isButtonDisabled = (planType: string) => {
    if (isLoadingSubscription) return true;
    if (isProcessing) return true;
    if (!user) return false; // Allow login redirect
    return userSubscription !== null;
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Choose Your Plan
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Select the plan that works best for you and your animal's healthcare needs
          </p>
        </div>

        {/* User Subscription Status */}
        {userSubscription && isSubscriptionActive() && (
          <div className="max-w-2xl mx-auto mb-8">
            <Card className="bg-green-50 border-green-200">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="bg-green-100 p-3 rounded-full">
                      <UserCheck className="h-6 w-6 text-green-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-green-800">
                        Active {userSubscription.plan.charAt(0).toUpperCase() + userSubscription.plan.slice(1)} Subscription
                      </h3>
                      <div className="flex items-center space-x-4 text-sm text-green-700 mt-1">
                        <div className="flex items-center space-x-1">
                          <Calendar className="h-4 w-4" />
                          <span>Started: {formatDate(userSubscription.startDate)}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Calendar className="h-4 w-4" />
                          <span>Renews: {formatDate(userSubscription.endDate)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                    Active
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Currency Selector */}
        <div className="flex justify-center mb-12">
          <div className="flex items-center space-x-2 bg-white rounded-lg border border-gray-200 p-3 shadow-sm">
            <Globe className="h-5 w-5 text-gray-500" />
            <span className="text-sm text-gray-600">Currency:</span>
            <Select value={currency} onValueChange={setCurrency}>
              <SelectTrigger className="w-32 border-0 focus:ring-0">
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

        {/* Payment Method Info */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 bg-blue-50 border border-blue-200 rounded-full px-4 py-2">
            <CreditCard className="h-4 w-4 text-blue-600" />
            <span className="text-sm text-blue-700">Secure payments powered by Razorpay</span>
            <Shield className="h-4 w-4 text-green-600" />
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {/* Free Plan */}
          <Card className="relative overflow-hidden border-2 border-gray-200 hover:border-gray-300 transition-all">
            <CardContent className="p-6">
              <div className="text-center space-y-4">
                <h3 className="text-xl font-semibold text-gray-900">Free Plan</h3>
                <div className="space-y-2">
                  <div className="text-3xl font-bold text-gray-900">Free</div>
                  <p className="text-sm text-muted-foreground">Forever</p>
                </div>
                
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-center">
                    <Check className="h-4 w-4 text-green-500 mr-2" />
                    AI Symptom Checker (3 uses)
                  </li>
                  <li className="flex items-center text-gray-400">
                    <Check className="h-4 w-4 text-gray-300 mr-2" />
                    Disease Prediction Analysis
                  </li>
                  <li className="flex items-center text-gray-400">
                    <Check className="h-4 w-4 text-gray-300 mr-2" />
                    Diet Evaluation & Planning
                  </li>
                  <li className="flex items-center text-gray-400">
                    <Check className="h-4 w-4 text-gray-300 mr-2" />
                    Preventive Healthcare Tips
                  </li>
                  <li className="flex items-center text-gray-400">
                    <Check className="h-4 w-4 text-gray-300 mr-2" />
                    Health Risk Predictor
                  </li>
                  <li className="flex items-center text-gray-400">
                    <Check className="h-4 w-4 text-gray-300 mr-2" />
                    AI Veterinary Assistant
                  </li>
                  <li className="flex items-center text-gray-400">
                    <Check className="h-4 w-4 text-gray-300 mr-2" />
                    Activity Level Assessment
                  </li>
                  <li className="flex items-center text-gray-400">
                    <Check className="h-4 w-4 text-gray-300 mr-2" />
                    Digital Prescription Generator
                  </li>
                  <li className="flex items-center text-gray-400">
                    <Check className="h-4 w-4 text-gray-300 mr-2" />
                    24/7 Support
                  </li>
                </ul>
                
                <Button 
                  className="w-full" 
                  variant="outline"
                  onClick={handleGetStarted}
                >
                  Get Started Free
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Monthly Plan */}
          <Card className="relative overflow-hidden border-2 border-[#00BFA6] shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1">
            <div className="absolute top-0 left-0 right-0 bg-[#00BFA6] text-white text-center py-2 text-sm font-medium">
              Popular
            </div>
            <CardContent className="p-6 pt-12">
              <div className="text-center space-y-4">
                <h3 className="text-xl font-semibold text-gray-900">Monthly Plan</h3>
                <div className="space-y-2">
                  <div className="text-3xl font-bold text-[#00BFA6]">
                    {currencies[currency as keyof typeof currencies].symbol}
                    {currencies[currency as keyof typeof currencies].monthly}
                  </div>
                  <p className="text-sm text-muted-foreground">per month</p>
                  <p className="text-xs text-gray-500">Billed monthly</p>
                </div>
                
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-center">
                    <Check className="h-4 w-4 text-green-500 mr-2" />
                    AI Symptom Checker (Unlimited)
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
                
                <Button 
                  className="w-full bg-[#00BFA6] hover:bg-[#00A896] text-white relative"
                  onClick={() => handleChoosePlan('monthly')}
                  disabled={isButtonDisabled('monthly')}
                >
                  {isProcessing && selectedPlan === 'monthly' ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <CreditCard className="w-4 h-4 mr-2" />
                      {getSubscriptionButtonText('monthly')}
                    </>
                  )}
                </Button>
                <p className="text-xs text-gray-500 mt-2">
                  Secure payment • Cancel anytime
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Yearly Plan */}
          <Card className="relative overflow-hidden border-2 border-yellow-400 shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1">
            <div className="absolute top-0 left-0 right-0 bg-yellow-400 text-gray-900 text-center py-2 text-sm font-medium">
              Best Value
            </div>
            <CardContent className="p-6 pt-12">
              <div className="text-center space-y-4">
                <h3 className="text-xl font-semibold text-gray-900">Yearly Plan</h3>
                <div className="space-y-2">
                  <div className="text-3xl font-bold text-yellow-600">
                    {currencies[currency as keyof typeof currencies].symbol}
                    {currencies[currency as keyof typeof currencies].yearly}
                  </div>
                  <p className="text-sm text-muted-foreground">per year</p>
                  <p className="text-xs text-green-600 font-medium">Save 25%</p>
                  <p className="text-xs text-gray-500">
                    {currencies[currency as keyof typeof currencies].symbol}
                    {Math.round(currencies[currency as keyof typeof currencies].yearly / 12)}/month
                  </p>
                </div>
                
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-center">
                    <Check className="h-4 w-4 text-green-500 mr-2" />
                    AI Symptom Checker (Unlimited)
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
                
                <Button 
                  className="w-full bg-yellow-400 hover:bg-yellow-500 text-gray-900"
                  onClick={() => handleChoosePlan('yearly')}
                  disabled={isButtonDisabled('yearly')}
                >
                  {isProcessing && selectedPlan === 'yearly' ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <Crown className="w-4 h-4 mr-2" />
                      {getSubscriptionButtonText('yearly')}
                    </>
                  )}
                </Button>
                <p className="text-xs text-gray-500 mt-2">
                  Secure payment • 7-day money-back guarantee
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Additional Info */}
        <div className="text-center mt-12 space-y-4">
          <div className="bg-white rounded-lg border border-gray-200 p-6 max-w-2xl mx-auto">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">💳 Payment Information</h3>
            <div className="grid md:grid-cols-2 gap-4 text-sm text-gray-600 text-left">
              <div>
                <h4 className="font-medium mb-2">Accepted Payment Methods:</h4>
                <ul className="space-y-1">
                  <li>• Credit & Debit Cards</li>
                  <li>• Net Banking</li>
                  <li>• UPI</li>
                  <li>• Wallet</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium mb-2">Security & Support:</h4>
                <ul className="space-y-1">
                  <li>• 256-bit SSL Encryption</li>
                  <li>• PCI DSS Compliant</li>
                  <li>• 24/7 Support</li>
                  <li>• Cancel Anytime</li>
                </ul>
              </div>
            </div>
          </div>
          <p className="text-gray-600 text-sm">
            All payments are securely processed by Razorpay. Your financial information is never stored on our servers.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Pricing;