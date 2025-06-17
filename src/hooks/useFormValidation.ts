
import { useState } from 'react';

interface ValidationRules {
  required?: boolean;
  email?: boolean;
  phone?: boolean;
  minLength?: number;
  maxLength?: number;
}

interface FormField {
  value: string;
  error?: string;
  rules?: ValidationRules;
}

interface FormState {
  [key: string]: FormField;
}

export const useFormValidation = (initialState: FormState) => {
  const [formState, setFormState] = useState<FormState>(initialState);

  const validateField = (name: string, value: string, rules?: ValidationRules): string | undefined => {
    if (!rules) return undefined;

    // Required validation
    if (rules.required && !value.trim()) {
      return 'Este campo é obrigatório';
    }

    // Email validation
    if (rules.email && value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      return 'Email inválido';
    }

    // Phone validation (Brazilian format)
    if (rules.phone && value && !/^\(\d{2}\)\s\d{4,5}-\d{4}$/.test(value)) {
      return 'Formato: (11) 99999-9999';
    }

    // Min length validation
    if (rules.minLength && value.length < rules.minLength) {
      return `Mínimo ${rules.minLength} caracteres`;
    }

    // Max length validation
    if (rules.maxLength && value.length > rules.maxLength) {
      return `Máximo ${rules.maxLength} caracteres`;
    }

    return undefined;
  };

  const updateField = (name: string, value: string) => {
    setFormState(prev => {
      const field = prev[name];
      const error = validateField(name, value, field?.rules);
      
      return {
        ...prev,
        [name]: {
          ...field,
          value,
          error
        }
      };
    });
  };

  const validateForm = (): boolean => {
    let isValid = true;
    const newState = { ...formState };

    Object.keys(newState).forEach(name => {
      const field = newState[name];
      const error = validateField(name, field.value, field.rules);
      
      newState[name] = { ...field, error };
      
      if (error) {
        isValid = false;
      }
    });

    setFormState(newState);
    return isValid;
  };

  const resetForm = () => {
    const resetState = Object.keys(formState).reduce((acc, key) => ({
      ...acc,
      [key]: {
        ...formState[key],
        value: '',
        error: undefined
      }
    }), {});
    
    setFormState(resetState);
  };

  const getFieldProps = (name: string) => ({
    value: formState[name]?.value || '',
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => updateField(name, e.target.value),
    error: formState[name]?.error
  });

  return {
    formState,
    updateField,
    validateForm,
    resetForm,
    getFieldProps,
    isValid: Object.values(formState).every(field => !field.error)
  };
};
