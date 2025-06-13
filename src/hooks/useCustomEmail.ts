
import { useState } from 'react';

interface EmailResponse {
  success: boolean;
  error?: string;
}

export const useCustomEmail = () => {
  const [loading, setLoading] = useState(false);

  const sendPasswordResetEmail = async (email: string, resetUrl: string): Promise<EmailResponse> => {
    setLoading(true);
    try {
      const response = await fetch('/functions/v1/send-password-reset', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          resetUrl
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        return { success: false, error: errorData.error || 'Erro ao enviar email' };
      }

      return { success: true };
    } catch (error) {
      console.error('Custom email error:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Erro ao enviar email personalizado' 
      };
    } finally {
      setLoading(false);
    }
  };

  return {
    sendPasswordResetEmail,
    loading
  };
};
