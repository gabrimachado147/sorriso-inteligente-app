
import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatPhone(phone: string): string {
  if (!phone) return '';
  
  // Remove all non-numeric characters
  const numbers = phone.replace(/\D/g, '');
  
  // Format as (XX) XXXXX-XXXX for Brazilian phones
  if (numbers.length === 11) {
    return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 7)}-${numbers.slice(7)}`;
  }
  
  // Format as (XX) XXXX-XXXX for landlines
  if (numbers.length === 10) {
    return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 6)}-${numbers.slice(6)}`;
  }
  
  // Return original if not standard format
  return phone;
}
