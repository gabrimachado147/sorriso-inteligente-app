
import { useState } from 'react';

export interface AuthFormData {
  nomeCompleto: string;
  telefone: string;
  email: string;
  password: string;
}

export const useAuthForm = () => {
  const [formData, setFormData] = useState<AuthFormData>({
    nomeCompleto: '',
    telefone: '',
    email: '',
    password: ''
  });

  const handleInputChange = (field: keyof AuthFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const formatPhone = (phone: string) => {
    const numbers = phone.replace(/\D/g, '');
    if (numbers.length <= 11) {
      return numbers.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
    }
    return phone;
  };

  const handlePhoneChange = (value: string) => {
    const formatted = formatPhone(value);
    handleInputChange('telefone', formatted);
  };

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const resetForm = () => {
    setFormData({
      nomeCompleto: '',
      telefone: '',
      email: '',
      password: ''
    });
  };

  return {
    formData,
    handleInputChange,
    handlePhoneChange,
    validateEmail,
    resetForm
  };
};
