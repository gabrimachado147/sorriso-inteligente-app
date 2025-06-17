
import { useState, useEffect } from 'react';

export const usePhoneValidation = () => {
  const [userPhone, setUserPhone] = useState('');
  const [isPhoneCollected, setIsPhoneCollected] = useState(true); // Sempre true para permitir conversas

  const handlePhoneSubmission = (phone: string) => {
    setUserPhone(phone);
    setIsPhoneCollected(true);
  };

  return {
    userPhone,
    isPhoneCollected,
    handlePhoneSubmission,
    setUserPhone
  };
};
