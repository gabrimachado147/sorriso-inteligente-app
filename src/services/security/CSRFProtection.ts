
import { SecurityService } from './SecurityService';

export class CSRFProtection {
  private static tokenKey = 'csrf_token';
  
  /**
   * Generate CSRF token for forms
   */
  static generateToken(): string {
    const token = SecurityService.generateSecureToken();
    SecurityService.setSecureItem(this.tokenKey, token);
    return token;
  }

  /**
   * Validate CSRF token
   */
  static validateToken(token: string): boolean {
    const storedToken = SecurityService.getSecureItem(this.tokenKey);
    return storedToken === token && token.length > 0;
  }

  /**
   * Create hidden CSRF input for forms
   */
  static createHiddenInput(): HTMLInputElement {
    const input = document.createElement('input');
    input.type = 'hidden';
    input.name = 'csrf_token';
    input.value = this.generateToken();
    return input;
  }

  /**
   * Add CSRF protection to fetch requests
   */
  static async secureRequest(url: string, options: RequestInit = {}): Promise<Response> {
    const token = this.generateToken();
    
    const headers = new Headers(options.headers);
    headers.set('X-CSRF-Token', token);
    headers.set('Content-Type', 'application/json');
    
    const secureOptions: RequestInit = {
      ...options,
      headers,
      credentials: 'same-origin', // Prevent CSRF attacks
    };

    return fetch(url, secureOptions);
  }
}
