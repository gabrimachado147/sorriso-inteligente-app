
import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts'
import { useAppointmentsByPeriod } from '@/hooks/useAnalytics'
import { EnhancedSkeleton } from '@/components/ui/enhanced-skeleton'
import { format, subDays, eachDayOfInterval } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import type { AppointmentsByPeriod } from '@/services/analytics'

interface AppointmentsChartProps {
  clinicId?: string
}

export const AppointmentsChart: React.FC<AppointmentsChartProps> = ({ clinicId }) => {
  const [period, setPeriod] = useState('7days')

  const getPeriodDates = () => {
    const endDate = new Date()
    const startDate = subDays(endDate, period === '7days' ? 7 : period === '30days' ? 30 : 90)
    
    return {
      startDate: format(startDate, 'yyyy-MM-dd'),
      endDate: format(endDate, 'yyyy-MM-dd')
    }
  }

  const { startDate, endDate } = getPeriodDates()
  const { data: appointments, isLoading } = useAppointmentsByPeriod(startDate, endDate, clinicId)

  const processChartData = () => {
    if (!appointments) return []

    const days = eachDayOfInterval({
      start: new Date(startDate),
      end: new Date(endDate)
    })

    return days.map(day => {
      const dayStr = format(day, 'yyyy-MM-dd')
      const dayAppointments = appointments.filter((apt: AppointmentsByPeriod) => apt.date === dayStr)
      
      return {
        date: format(day, 'dd/MM', { locale: ptBR }),
        total: dayAppointments.length,
        confirmed: dayAppointments.filter((apt: AppointmentsByPeriod) => apt.status === 'confirmed').length,
        pending: dayAppointments.filter((apt: AppointmentsByPeriod) => apt.status === 'pending').length,
        cancelled: dayAppointments.filter((apt: AppointmentsByPeriod) => apt.status === 'cancelled').length,
        completed: dayAppointments.filter((apt: AppointmentsByPeriod) => apt.status === 'completed').length
      }
    })
  }

  const chartData = processChartData()

  if (isLoading) {
    return <EnhancedSkeleton variant="card" />
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Agendamentos por Período</CardTitle>
          <Select value={period} onValueChange={setPeriod}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7days">7 dias</SelectItem>
              <SelectItem value="30days">30 dias</SelectItem>
              <SelectItem value="90days">90 dias</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="confirmed" stackId="a" fill="#10b981" name="Confirmados" />
              <Bar dataKey="pending" stackId="a" fill="#f59e0b" name="Pendentes" />
              <Bar dataKey="completed" stackId="a" fill="#3b82f6" name="Concluídos" />
              <Bar dataKey="cancelled" stackId="a" fill="#ef4444" name="Cancelados" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
