
// Sistema de animações globais para o app
export const animations = {
  // Fade animations
  fadeIn: "animate-in fade-in duration-300 ease-out",
  fadeOut: "animate-out fade-out duration-300 ease-out",
  
  // Slide animations
  slideInRight: "animate-in slide-in-from-right duration-300 ease-out",
  slideInLeft: "animate-in slide-in-from-left duration-300 ease-out",
  slideInBottom: "animate-in slide-in-from-bottom duration-300 ease-out",
  slideOutRight: "animate-out slide-out-to-right duration-300 ease-out",
  slideOutLeft: "animate-out slide-out-to-left duration-300 ease-out",
  
  // Scale animations
  scaleIn: "animate-in zoom-in-95 duration-200 ease-out",
  scaleOut: "animate-out zoom-out-95 duration-200 ease-out",
  
  // Combined animations
  modalEnter: "animate-in fade-in zoom-in-95 duration-200 ease-out",
  modalExit: "animate-out fade-out zoom-out-95 duration-200 ease-out",
  pageEnter: "animate-in fade-in slide-in-from-bottom duration-300 ease-out",
  
  // Hover effects
  buttonHover: "transition-all duration-200 hover:scale-105 hover:shadow-md",
  cardHover: "transition-all duration-200 hover:shadow-lg hover:-translate-y-1",
  
  // Loading animations
  pulse: "animate-pulse",
  shimmer: "animate-pulse bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 bg-[length:200%_100%]",
  spin: "animate-spin",
};

export const getPageTransition = (direction: 'enter' | 'exit' = 'enter') => {
  return direction === 'enter' ? animations.pageEnter : animations.fadeOut;
};
