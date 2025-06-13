
import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useAnalytics } from '@/hooks/useAnalytics'
import { DashboardStats } from './DashboardStats'
import { AppointmentsChart } from './AppointmentsChart'
import { ReviewsOverview } from './ReviewsOverview'
import { ChatConversionReport } from './ChatConversionReport'
import { ClinicScheduleManager } from './ClinicScheduleManager'
import { Calendar, BarChart3, MessageSquare, Star, Settings } from 'lucide-react'

interface AdminDashboardProps {
  clinicId?: string
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ clinicId }) => {
  const { dashboardStats, chatConversion, statsLoading, conversionLoading } = useAnalytics(clinicId)

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Dashboard Administrativo</h1>
            <p className="text-gray-600 mt-1">Gerencie agendamentos e visualize estatísticas</p>
          </div>
        </div>

        {/* Estatísticas Principais */}
        <DashboardStats stats={dashboardStats} loading={statsLoading} />

        {/* Tabs do Dashboard */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4" />
              Visão Geral
            </TabsTrigger>
            <TabsTrigger value="appointments" className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              Agendamentos
            </TabsTrigger>
            <TabsTrigger value="reviews" className="flex items-center gap-2">
              <Star className="w-4 h-4" />
              Avaliações
            </TabsTrigger>
            <TabsTrigger value="chat" className="flex items-center gap-2">
              <MessageSquare className="w-4 h-4" />
              Chat Analytics
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center gap-2">
              <Settings className="w-4 h-4" />
              Configurações
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <AppointmentsChart clinicId={clinicId} />
              <ChatConversionReport data={chatConversion} loading={conversionLoading} />
            </div>
          </TabsContent>

          <TabsContent value="appointments">
            <AppointmentsChart clinicId={clinicId} />
          </TabsContent>

          <TabsContent value="reviews">
            <ReviewsOverview clinicId={clinicId} />
          </TabsContent>

          <TabsContent value="chat">
            <ChatConversionReport data={chatConversion} loading={conversionLoading} />
          </TabsContent>

          <TabsContent value="settings">
            <ClinicScheduleManager clinicId={clinicId} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
