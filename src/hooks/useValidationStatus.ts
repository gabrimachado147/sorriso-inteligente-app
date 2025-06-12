import { useState } from 'react';

// Validation status hook for real-time feedback
export const useValidationStatus = () => {
  const [validationQueue, setValidationQueue] = useState<string[]>([]);
  const [isConnected, setIsConnected] = useState(true);
  
  const addToQueue = (validationType: string) => {
    setValidationQueue(prev => [...prev, validationType]);
  };
  
  const removeFromQueue = (validationType: string) => {
    setValidationQueue(prev => prev.filter(item => item !== validationType));
  };
  
  return {
    validationQueue,
    isConnected,
    addToQueue,
    removeFromQueue,
    queueLength: validationQueue.length
  };
};
