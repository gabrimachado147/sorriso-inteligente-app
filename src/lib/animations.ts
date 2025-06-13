
// Sistema de animações globais para o app - APRIMORADO
export const animations = {
  // Fade animations - aprimoradas
  fadeIn: "animate-in fade-in duration-300 ease-out",
  fadeOut: "animate-out fade-out duration-300 ease-out",
  fadeInSlow: "animate-in fade-in duration-500 ease-out",
  fadeInFast: "animate-in fade-in duration-150 ease-out",
  fadeInUp: "animate-in fade-in slide-in-from-bottom-4 duration-400 ease-out",
  
  // Slide animations - melhoradas
  slideInRight: "animate-in slide-in-from-right duration-300 ease-out",
  slideInLeft: "animate-in slide-in-from-left duration-300 ease-out",
  slideInBottom: "animate-in slide-in-from-bottom duration-300 ease-out",
  slideInTop: "animate-in slide-in-from-top duration-300 ease-out",
  slideOutRight: "animate-out slide-out-to-right duration-300 ease-out",
  slideOutLeft: "animate-out slide-out-to-left duration-300 ease-out",
  
  // Scale animations - aprimoradas
  scaleIn: "animate-in zoom-in-95 duration-200 ease-out",
  scaleOut: "animate-out zoom-out-95 duration-200 ease-out",
  scaleInSlow: "animate-in zoom-in-90 duration-400 ease-out",
  scaleInBounce: "animate-in zoom-in-95 duration-300 ease-[cubic-bezier(0.68,-0.55,0.265,1.55)]",
  
  // Combined animations - mais suaves
  modalEnter: "animate-in fade-in zoom-in-95 duration-200 ease-out",
  modalExit: "animate-out fade-out zoom-out-95 duration-200 ease-out",
  pageEnter: "animate-in fade-in slide-in-from-bottom-4 duration-400 ease-out",
  drawerEnter: "animate-in slide-in-from-right duration-300 ease-out",
  drawerExit: "animate-out slide-out-to-right duration-300 ease-out",
  
  // Hover effects - melhorados com mais micro-interações
  buttonHover: "transition-all duration-200 hover:scale-105 hover:shadow-md active:scale-95",
  cardHover: "transition-all duration-300 hover:shadow-lg hover:-translate-y-2 hover:shadow-primary/20",
  serviceCardHover: "transition-all duration-300 hover:shadow-xl hover:-translate-y-3 hover:shadow-primary/25 hover:border-primary/40",
  iconHover: "transition-all duration-200 hover:scale-110 hover:text-primary",
  linkHover: "transition-all duration-200 hover:text-primary hover:underline",
  
  // Loading animations - expandidos
  pulse: "animate-pulse",
  shimmer: "animate-pulse bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 bg-[length:200%_100%]",
  spin: "animate-spin",
  bounce: "animate-bounce",
  heartbeat: "animate-pulse",
  breathe: "animate-[pulse_3s_ease-in-out_infinite]",
  
  // Stagger animations para listas - melhoradas
  staggerItem: (index: number) => `animate-in fade-in slide-in-from-bottom-2 duration-300 ease-out`,
  staggerDelay: (index: number) => ({ 
    animationDelay: `${index * 100}ms`,
    animationFillMode: 'both'
  }),
  
  // Estados de interação - aprimorados
  pressed: "scale-95 shadow-sm transition-all duration-100",
  focused: "ring-2 ring-primary ring-offset-2 transition-all duration-200",
  disabled: "opacity-50 cursor-not-allowed transition-opacity duration-200",
  
  // Animações específicas para dental - melhoradas
  toothGlow: "animate-pulse drop-shadow-md",
  emergencyPulse: "animate-pulse text-red-600 drop-shadow-sm",
  successGlow: "animate-pulse text-green-600 drop-shadow-md",
  
  // Novas animações suaves para navegação
  navItemHover: "transition-all duration-200 hover:bg-primary/10 hover:text-primary",
  tabTransition: "transition-all duration-300 ease-out",
  smoothEntry: "animate-in fade-in slide-in-from-bottom-1 duration-500 ease-out",
  gentleBounce: "animate-[bounce_1s_ease-in-out_1]",
};

export const getPageTransition = (direction: 'enter' | 'exit' = 'enter') => {
  return direction === 'enter' ? animations.smoothEntry : animations.fadeOut;
};

// Função para aplicar delay escalonado em listas - melhorada
export const getStaggerStyle = (index: number, baseDelay: number = 75) => ({
  animationDelay: `${index * baseDelay}ms`,
  animationFillMode: 'both'
});

// Animações de micro-interação para elementos específicos - expandidas
export const microAnimations = {
  notification: "animate-in slide-in-from-right duration-300 ease-out",
  toast: "animate-in slide-in-from-top duration-300 ease-out",
  tooltip: "animate-in fade-in zoom-in-95 duration-150 ease-out",
  dropdown: "animate-in fade-in slide-in-from-top-2 duration-200 ease-out",
  modal: "animate-in fade-in zoom-in-95 duration-300 ease-out",
  drawer: "animate-in slide-in-from-right duration-300 ease-out",
  calendar: "animate-in fade-in zoom-in-98 duration-250 ease-out",
  appointmentCard: "animate-in fade-in slide-in-from-left duration-300 ease-out",
  heroSection: "animate-in fade-in slide-in-from-bottom-6 duration-600 ease-out",
};

// Função para criar animações em cascata
export const createStaggerAnimation = (totalItems: number, baseDelay: number = 100) => {
  return Array.from({ length: totalItems }, (_, index) => ({
    animationDelay: `${index * baseDelay}ms`,
    animationFillMode: 'both'
  }));
};
