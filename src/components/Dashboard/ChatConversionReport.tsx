
import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { MessageSquare, Calendar, TrendingUp } from 'lucide-react'
import { EnhancedSkeleton } from '@/components/ui/enhanced-skeleton'

interface ChatConversionReportProps {
  data?: {
    chatStarted: number
    appointmentsScheduled: number
    conversionRate: number
  }
  loading: boolean
}

export const ChatConversionReport: React.FC<ChatConversionReportProps> = ({ data, loading }) => {
  if (loading) {
    return <EnhancedSkeleton variant="card" />
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageSquare className="w-5 h-5" />
          Conversão do Chat
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <MessageSquare className="w-8 h-8 text-blue-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-blue-600">{data?.chatStarted || 0}</p>
            <p className="text-sm text-gray-600">Chats Iniciados</p>
          </div>
          
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <Calendar className="w-8 h-8 text-green-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-green-600">{data?.appointmentsScheduled || 0}</p>
            <p className="text-sm text-gray-600">Agendamentos</p>
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Taxa de Conversão</span>
            <span className="text-sm text-gray-600">{data?.conversionRate || 0}%</span>
          </div>
          <Progress value={data?.conversionRate || 0} className="h-3" />
        </div>

        <div className="flex items-center gap-2 text-sm text-gray-600">
          <TrendingUp className="w-4 h-4" />
          <span>
            {data?.conversionRate && data.conversionRate > 0 
              ? 'Conversão positiva' 
              : 'Sem conversões ainda'
            }
          </span>
        </div>
      </CardContent>
    </Card>
  )
}
