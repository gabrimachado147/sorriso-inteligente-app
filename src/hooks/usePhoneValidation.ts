
import { useState } from 'react';

export const usePhoneValidation = () => {
  const [userPhone, setUserPhone] = useState('');
  const [isPhoneCollected, setIsPhoneCollected] = useState(false);

  const validatePhoneNumber = (phone: string): boolean => {
    // Remove all non-numeric characters
    const cleanPhone = phone.replace(/\D/g, '');
    // Brazilian phone numbers: 11 digits (with area code) or 10 digits (landline)
    return cleanPhone.length >= 10 && cleanPhone.length <= 11;
  };

  const formatPhoneNumber = (phone: string): string => {
    const cleanPhone = phone.replace(/\D/g, '');
    // Add +55 prefix if not present
    if (!cleanPhone.startsWith('55')) {
      return `+55${cleanPhone}`;
    }
    return `+${cleanPhone}`;
  };

  const handlePhoneSubmission = (phone: string) => {
    if (validatePhoneNumber(phone)) {
      const formattedPhone = formatPhoneNumber(phone);
      setUserPhone(formattedPhone);
      setIsPhoneCollected(true);
      return formattedPhone;
    }
    return null;
  };

  return {
    userPhone,
    isPhoneCollected,
    validatePhoneNumber,
    formatPhoneNumber,
    handlePhoneSubmission
  };
};
