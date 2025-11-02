import { useState, useEffect } from 'react';

export const useTokens = () => {
  const [tokens, setTokens] = useState(5);
  const [showPricing, setShowPricing] = useState(false);

  useEffect(() => {
    const savedTokens = localStorage.getItem("aivet-tokens");
    if (savedTokens) {
      setTokens(parseInt(savedTokens));
    }
  }, []);

  const useToken = () => {
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

  return {
    tokens,
    useToken,
    showPricing,
    setShowPricing
  };
};