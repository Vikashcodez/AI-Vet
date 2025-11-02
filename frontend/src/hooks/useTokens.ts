import { useState, useEffect, useContext } from 'react';
import { AppContext } from '../App'; // Adjust the import path

export const useTokens = () => {
  const [tokens, setTokens] = useState(5);
  const [showPricing, setShowPricing] = useState(false);
  const { subscription, user } = useContext(AppContext);

  useEffect(() => {
    // Only use token system for non-subscribed users
    if (!subscription || subscription.status !== 'active') {
      const savedTokens = localStorage.getItem("aivet-tokens");
      if (savedTokens) {
        setTokens(parseInt(savedTokens));
      }
    }
  }, [subscription]);

  const useToken = () => {
    // If user has active subscription, always return true without consuming tokens
    if (subscription && subscription.status === 'active') {
      return true;
    }

    // For non-subscribed users, use token system
    if (tokens > 0) {
      const newTokens = tokens - 1;
      setTokens(newTokens);
      localStorage.setItem("aivet-tokens", newTokens.toString());
      return true;
    } else {
      setShowPricing(true);
      return false;
    }
  };

  const hasUnlimitedAccess = subscription && subscription.status === 'active';

  return {
    tokens: hasUnlimitedAccess ? 'unlimited' : tokens,
    useToken,
    showPricing,
    setShowPricing,
    hasUnlimitedAccess
  };
};