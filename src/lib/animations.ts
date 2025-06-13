
// Sistema de animações globais para o app
export const animations = {
  // Fade animations
  fadeIn: "animate-in fade-in duration-300 ease-out",
  fadeOut: "animate-out fade-out duration-300 ease-out",
  fadeInSlow: "animate-in fade-in duration-500 ease-out",
  fadeInFast: "animate-in fade-in duration-150 ease-out",
  
  // Slide animations
  slideInRight: "animate-in slide-in-from-right duration-300 ease-out",
  slideInLeft: "animate-in slide-in-from-left duration-300 ease-out",
  slideInBottom: "animate-in slide-in-from-bottom duration-300 ease-out",
  slideInTop: "animate-in slide-in-from-top duration-300 ease-out",
  slideOutRight: "animate-out slide-out-to-right duration-300 ease-out",
  slideOutLeft: "animate-out slide-out-to-left duration-300 ease-out",
  
  // Scale animations
  scaleIn: "animate-in zoom-in-95 duration-200 ease-out",
  scaleOut: "animate-out zoom-out-95 duration-200 ease-out",
  scaleInSlow: "animate-in zoom-in-90 duration-400 ease-out",
  
  // Combined animations
  modalEnter: "animate-in fade-in zoom-in-95 duration-200 ease-out",
  modalExit: "animate-out fade-out zoom-out-95 duration-200 ease-out",
  pageEnter: "animate-in fade-in slide-in-from-bottom duration-300 ease-out",
  drawerEnter: "animate-in slide-in-from-right duration-300 ease-out",
  drawerExit: "animate-out slide-out-to-right duration-300 ease-out",
  
  // Hover effects - melhorados com mais micro-interações
  buttonHover: "transition-all duration-200 hover:scale-105 hover:shadow-md active:scale-95",
  cardHover: "transition-all duration-200 hover:shadow-lg hover:-translate-y-1 hover:shadow-primary/10",
  serviceCardHover: "transition-all duration-300 hover:shadow-xl hover:-translate-y-2 hover:shadow-primary/20 hover:border-primary/30",
  iconHover: "transition-all duration-200 hover:scale-110 hover:text-primary",
  linkHover: "transition-all duration-200 hover:text-primary hover:underline",
  
  // Loading animations - expandidos
  pulse: "animate-pulse",
  shimmer: "animate-pulse bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 bg-[length:200%_100%]",
  spin: "animate-spin",
  bounce: "animate-bounce",
  heartbeat: "animate-pulse",
  
  // Stagger animations para listas
  staggerItem: (index: number) => `animate-in fade-in slide-in-from-bottom duration-300 ease-out`,
  staggerDelay: (index: number) => ({ animationDelay: `${index * 100}ms` }),
  
  // Estados de interação
  pressed: "scale-95 shadow-sm",
  focused: "ring-2 ring-primary ring-offset-2",
  disabled: "opacity-50 cursor-not-allowed",
  
  // Animações específicas para dental
  toothGlow: "animate-pulse drop-shadow-sm",
  emergencyPulse: "animate-pulse text-red-600",
  successGlow: "animate-pulse text-green-600 drop-shadow-sm",
};

export const getPageTransition = (direction: 'enter' | 'exit' = 'enter') => {
  return direction === 'enter' ? animations.pageEnter : animations.fadeOut;
};

// Função para aplicar delay escalonado em listas
export const getStaggerStyle = (index: number, baseDelay: number = 50) => ({
  animationDelay: `${index * baseDelay}ms`
});

// Animações de micro-interação para elementos específicos
export const microAnimations = {
  notification: "animate-in slide-in-from-right duration-300 ease-out",
  toast: "animate-in slide-in-from-top duration-300 ease-out",
  tooltip: "animate-in fade-in zoom-in-95 duration-150 ease-out",
  dropdown: "animate-in fade-in slide-in-from-top-2 duration-200 ease-out",
  modal: "animate-in fade-in zoom-in-95 duration-300 ease-out",
  drawer: "animate-in slide-in-from-right duration-300 ease-out",
};
