
import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Calendar, CheckCircle, XCircle, Clock, Star, TrendingUp } from 'lucide-react'
import { EnhancedSkeleton } from '@/components/ui/enhanced-skeleton'
import type { DashboardStats } from '@/services/analytics'

interface DashboardStatsProps {
  stats?: DashboardStats
  loading: boolean
}

export const DashboardStats: React.FC<DashboardStatsProps> = ({ stats, loading }) => {
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <EnhancedSkeleton key={i} variant="card" />
        ))}
      </div>
    )
  }

  const statsCards = [
    {
      title: 'Total de Agendamentos',
      value: stats?.total_appointments || 0,
      icon: Calendar,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      title: 'Pendentes',
      value: stats?.pending_appointments || 0,
      icon: Clock,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50'
    },
    {
      title: 'Concluídos',
      value: stats?.completed_appointments || 0,
      icon: CheckCircle,
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    {
      title: 'Cancelados',
      value: stats?.cancelled_appointments || 0,
      icon: XCircle,
      color: 'text-red-600',
      bgColor: 'bg-red-50'
    },
    {
      title: 'Avaliação Média',
      value: stats?.average_rating || 0,
      icon: Star,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      suffix: '⭐'
    },
    {
      title: 'Crescimento',
      value: stats?.growth_percentage || 0,
      icon: TrendingUp,
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-50',
      suffix: '%'
    }
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
      {statsCards.map((stat, index) => {
        const Icon = stat.icon
        return (
          <Card key={index} className="hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {stat.value}{stat.suffix || ''}
                  </p>
                </div>
                <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                  <Icon className={`w-5 h-5 ${stat.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
