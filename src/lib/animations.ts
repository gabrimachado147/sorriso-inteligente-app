
export const animations = {
  // Page transitions
  pageEnter: 'animate-fade-in',
  
  // Element animations
  fadeIn: 'opacity-0 animate-[fade-in_0.6s_ease-out_forwards]',
  fadeInUp: 'opacity-0 translate-y-4 animate-[fade-in-up_0.6s_ease-out_forwards]',
  scaleIn: 'opacity-0 scale-95 animate-[scale-in_0.4s_ease-out_forwards]',
  scaleInBounce: 'opacity-0 scale-90 animate-[scale-in-bounce_0.6s_ease-out_forwards]',
  slideInRight: 'opacity-0 translate-x-8 animate-[slide-in-right_0.6s_ease-out_forwards]',
  slideInLeft: 'opacity-0 -translate-x-8 animate-[slide-in-left_0.6s_ease-out_forwards]',
  slideInBottom: 'opacity-0 translate-y-8 animate-[slide-in-bottom_0.6s_ease-out_forwards]',
  slideInTop: 'opacity-0 -translate-y-8 animate-[slide-in-top_0.6s_ease-out_forwards]',
  
  // Interactive animations
  cardHover: 'transition-all duration-300 hover:shadow-lg hover:-translate-y-1',
  buttonHover: 'transition-all duration-200 hover:scale-105 active:scale-95',
  imageHover: 'transition-transform duration-300 hover:scale-110',
  iconHover: 'transition-transform duration-200 hover:scale-110',
  
  // Modal and overlay animations
  modalEnter: 'animate-[modal-enter_0.3s_ease-out]',
  
  // Emergency and special animations
  emergencyPulse: 'animate-[emergency-pulse_2s_ease-in-out_infinite]',
  
  // Stagger animations
  staggerChildren: 'stagger-animation',
};

export const microAnimations = {
  // Gentle animations for hero sections
  heroSection: 'animate-[gentle-fade-in_1s_ease-out]',
  
  // Subtle hover effects
  subtleHover: 'transition-all duration-200 hover:bg-opacity-80',
  
  // Loading animations
  pulse: 'animate-pulse',
  spin: 'animate-spin',
  
  // Success states
  successBounce: 'animate-[success-bounce_0.6s_ease-out]',
};
