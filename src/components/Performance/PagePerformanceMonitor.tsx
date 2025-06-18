
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Zap, Clock, Eye, TrendingUp } from 'lucide-react';

interface PerformanceMetrics {
  loadTime: number;
  renderTime: number;
  interactionScore: number;
  scrollDepth: number;
  timeOnPage: number;
}

export const PagePerformanceMonitor: React.FC = () => {
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    loadTime: 0,
    renderTime: 0,
    interactionScore: 0,
    scrollDepth: 0,
    timeOnPage: 0
  });

  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Mostrar apenas em desenvolvimento
    if (process.env.NODE_ENV === 'development') {
      setIsVisible(true);
    }

    const startTime = performance.now();
    let pageStartTime = Date.now();

    // Medir tempo de carregamento
    window.addEventListener('load', () => {
      const loadTime = performance.now() - startTime;
      setMetrics(prev => ({ ...prev, loadTime }));
    });

    // Medir interações
    let interactionCount = 0;
    const trackInteraction = () => {
      interactionCount++;
      setMetrics(prev => ({ 
        ...prev, 
        interactionScore: Math.min(interactionCount * 10, 100) 
      }));
    };

    // Medir scroll depth
    const trackScroll = () => {
      const scrollPercentage = Math.round(
        (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100
      );
      setMetrics(prev => ({ 
        ...prev, 
        scrollDepth: Math.max(prev.scrollDepth, scrollPercentage) 
      }));
    };

    // Medir tempo na página
    const updateTimeOnPage = () => {
      const timeOnPage = Math.round((Date.now() - pageStartTime) / 1000);
      setMetrics(prev => ({ ...prev, timeOnPage }));
    };

    // Event listeners
    document.addEventListener('click', trackInteraction);
    document.addEventListener('keydown', trackInteraction);
    window.addEventListener('scroll', trackScroll, { passive: true });
    
    const timeInterval = setInterval(updateTimeOnPage, 1000);

    // Cleanup
    return () => {
      document.removeEventListener('click', trackInteraction);
      document.removeEventListener('keydown', trackInteraction);
      window.removeEventListener('scroll', trackScroll);
      clearInterval(timeInterval);
    };
  }, []);

  const getPerformanceGrade = (loadTime: number) => {
    if (loadTime < 1000) return { grade: 'A+', color: 'bg-green-500' };
    if (loadTime < 2000) return { grade: 'A', color: 'bg-green-400' };
    if (loadTime < 3000) return { grade: 'B', color: 'bg-yellow-400' };
    if (loadTime < 5000) return { grade: 'C', color: 'bg-orange-400' };
    return { grade: 'D', color: 'bg-red-400' };
  };

  if (!isVisible) return null;

  const performanceGrade = getPerformanceGrade(metrics.loadTime);

  return (
    <div className="fixed bottom-4 right-4 z-50 max-w-sm">
      <Card className="border-purple-200 bg-white/95 backdrop-blur-sm shadow-lg">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm flex items-center gap-2">
            <Zap className="h-4 w-4 text-purple-600" />
            Performance Monitor
            <Badge className={`${performanceGrade.color} text-white border-0`}>
              {performanceGrade.grade}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="space-y-1">
              <div className="flex items-center gap-1">
                <Clock className="h-3 w-3 text-blue-500" />
                <span>Load: {metrics.loadTime.toFixed(0)}ms</span>
              </div>
              <div className="flex items-center gap-1">
                <Eye className="h-3 w-3 text-green-500" />
                <span>Time: {metrics.timeOnPage}s</span>
              </div>
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-1">
                <TrendingUp className="h-3 w-3 text-purple-500" />
                <span>Scroll: {metrics.scrollDepth}%</span>
              </div>
              <div className="flex items-center gap-1">
                <Zap className="h-3 w-3 text-orange-500" />
                <span>UX: {metrics.interactionScore}/100</span>
              </div>
            </div>
          </div>
          
          <div className="space-y-2">
            <div>
              <div className="text-xs text-gray-600 mb-1">UX Score</div>
              <Progress value={metrics.interactionScore} className="h-1" />
            </div>
            <div>
              <div className="text-xs text-gray-600 mb-1">Page Depth</div>
              <Progress value={metrics.scrollDepth} className="h-1" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
