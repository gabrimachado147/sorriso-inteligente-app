
import DOMPurify from 'dompurify';
import { supabase } from '@/integrations/supabase/client';

export class SecurityService {
  /**
   * Sanitize HTML input to prevent XSS attacks
   */
  static sanitizeHTML(input: string): string {
    return DOMPurify.sanitize(input);
  }

  /**
   * Validate and sanitize text input
   */
  static sanitizeText(input: string): string {
    return input
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '') // Remove script tags
      .replace(/[<>]/g, '') // Remove angle brackets
      .trim();
  }

  /**
   * Validate email format securely
   */
  static validateEmail(email: string): boolean {
    const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
    return emailRegex.test(email) && email.length <= 254;
  }

  /**
   * Validate phone number format
   */
  static validatePhone(phone: string): boolean {
    const phoneRegex = /^\(\d{2}\)\s\d{4,5}-\d{4}$/;
    const cleanPhone = phone.replace(/\D/g, '');
    return phoneRegex.test(phone) && (cleanPhone.length === 10 || cleanPhone.length === 11);
  }

  /**
   * Validate password strength
   */
  static validatePassword(password: string): {
    isValid: boolean;
    errors: string[];
    strength: 'weak' | 'medium' | 'strong';
  } {
    const errors: string[] = [];
    let score = 0;

    if (password.length < 8) {
      errors.push('A senha deve ter pelo menos 8 caracteres');
    } else {
      score += 1;
    }

    if (!/[a-z]/.test(password)) {
      errors.push('A senha deve conter pelo menos uma letra minúscula');
    } else {
      score += 1;
    }

    if (!/[A-Z]/.test(password)) {
      errors.push('A senha deve conter pelo menos uma letra maiúscula');
    } else {
      score += 1;
    }

    if (!/\d/.test(password)) {
      errors.push('A senha deve conter pelo menos um número');
    } else {
      score += 1;
    }

    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      errors.push('A senha deve conter pelo menos um caractere especial');
    } else {
      score += 1;
    }

    let strength: 'weak' | 'medium' | 'strong' = 'weak';
    if (score >= 4) strength = 'strong';
    else if (score >= 2) strength = 'medium';

    return {
      isValid: errors.length === 0,
      errors,
      strength
    };
  }

  /**
   * Generate secure session token
   */
  static generateSecureToken(): string {
    const array = new Uint8Array(32);
    crypto.getRandomValues(array);
    return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
  }

  /**
   * Check if current session is valid
   */
  static async validateSession(): Promise<boolean> {
    try {
      const { data: { session }, error } = await supabase.auth.getSession();
      
      if (error || !session) {
        return false;
      }

      // Check if session is expired
      const expiresAt = new Date(session.expires_at! * 1000);
      const now = new Date();
      
      if (expiresAt <= now) {
        console.warn('Session expired');
        return false;
      }

      return true;
    } catch (error) {
      console.error('Session validation error:', error);
      return false;
    }
  }

  /**
   * Secure storage helpers (avoid localStorage for sensitive data)
   */
  static setSecureItem(key: string, value: string): void {
    // Only use sessionStorage for non-sensitive data
    // Sensitive data should only be handled by Supabase auth
    if (key.includes('token') || key.includes('password') || key.includes('secret')) {
      console.warn('Attempted to store sensitive data in browser storage');
      return;
    }
    sessionStorage.setItem(key, value);
  }

  static getSecureItem(key: string): string | null {
    return sessionStorage.getItem(key);
  }

  static removeSecureItem(key: string): void {
    sessionStorage.removeItem(key);
  }

  /**
   * Rate limiting check (basic client-side)
   */
  static checkRateLimit(action: string, maxAttempts: number = 5, windowMs: number = 900000): boolean {
    const key = `rate_limit_${action}`;
    const now = Date.now();
    const attempts = JSON.parse(sessionStorage.getItem(key) || '[]') as number[];
    
    // Remove old attempts outside the window
    const validAttempts = attempts.filter(timestamp => now - timestamp < windowMs);
    
    if (validAttempts.length >= maxAttempts) {
      return false; // Rate limited
    }
    
    validAttempts.push(now);
    sessionStorage.setItem(key, JSON.stringify(validAttempts));
    return true;
  }

  /**
   * Log security events (without sensitive data)
   */
  static logSecurityEvent(event: string, details?: Record<string, any>): void {
    const logData = {
      timestamp: new Date().toISOString(),
      event,
      userAgent: navigator.userAgent,
      url: window.location.href,
      ...details
    };
    
    // Remove any potentially sensitive data
    delete logData.password;
    delete logData.token;
    delete logData.email;
    
    console.log('Security Event:', logData);
    
    // In production, send to monitoring service
    // await fetch('/api/security-logs', { method: 'POST', body: JSON.stringify(logData) });
  }

  /**
   * Content Security Policy helpers
   */
  static sanitizeImageSrc(src: string): string {
    try {
      const url = new URL(src);
      // Only allow specific domains for images
      const allowedDomains = ['localhost', 'supabase.co', 'lovable.dev'];
      
      if (allowedDomains.some(domain => url.hostname.includes(domain))) {
        return src;
      }
      
      return ''; // Block suspicious URLs
    } catch {
      return ''; // Invalid URL
    }
  }

  /**
   * Secure form data processing
   */
  static processFormData(formData: Record<string, any>): Record<string, any> {
    const sanitized: Record<string, any> = {};
    
    for (const [key, value] of Object.entries(formData)) {
      if (typeof value === 'string') {
        sanitized[key] = this.sanitizeText(value);
      } else if (typeof value === 'number') {
        sanitized[key] = value;
      } else if (typeof value === 'boolean') {
        sanitized[key] = value;
      } else {
        // Don't process unknown types
        console.warn(`Skipping unknown form field type: ${key}`);
      }
    }
    
    return sanitized;
  }
}
