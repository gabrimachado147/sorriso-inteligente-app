
import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Calendar, Clock, Phone, User, MapPin, Activity } from 'lucide-react'
import { useAppointments } from '@/hooks/useAppointments'
import { EnhancedSkeleton } from '@/components/ui/enhanced-skeleton'
import { animations } from '@/lib/animations'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'

const AppointmentsPage = () => {
  const { appointments, isLoading, stats, statsLoading, updateAppointmentStatus } = useAppointments()

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'bg-green-500'
      case 'cancelled': return 'bg-red-500'
      case 'completed': return 'bg-blue-500'
      case 'no_show': return 'bg-gray-500'
      default: return 'bg-yellow-500'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'confirmed': return 'Confirmado'
      case 'cancelled': return 'Cancelado'
      case 'completed': return 'Concluído'
      case 'no_show': return 'Não Compareceu'
      default: return 'Pendente'
    }
  }

  const handleStatusChange = (appointmentId: string, newStatus: 'confirmed' | 'cancelled' | 'completed' | 'no_show') => {
    updateAppointmentStatus.mutate({ appointmentId, status: newStatus })
  }

  if (isLoading) {
    return (
      <div className="p-6 space-y-6">
        <EnhancedSkeleton variant="card" count={3} />
      </div>
    )
  }

  return (
    <div className={`p-6 space-y-6 ${animations.pageEnter}`}>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Calendar className="h-6 w-6 text-primary" />
          Agendamentos
        </h1>
      </div>

      {/* Estatísticas */}
      {!statsLoading && stats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className={animations.fadeIn}>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Activity className="h-5 w-5 text-blue-500" />
                <div>
                  <p className="text-sm text-gray-600">Total</p>
                  <p className="text-2xl font-bold">{stats.total}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className={animations.fadeIn}>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-green-500" />
                <div>
                  <p className="text-sm text-gray-600">Hoje</p>
                  <p className="text-2xl font-bold">{stats.today}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className={animations.fadeIn}>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <User className="h-5 w-5 text-blue-500" />
                <div>
                  <p className="text-sm text-gray-600">Confirmados</p>
                  <p className="text-2xl font-bold">{stats.confirmed}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className={animations.fadeIn}>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-red-500" />
                <div>
                  <p className="text-sm text-gray-600">Cancelados</p>
                  <p className="text-2xl font-bold">{stats.cancelled}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Lista de Agendamentos */}
      <div className="space-y-4">
        {appointments.length === 0 ? (
          <Card className={animations.fadeIn}>
            <CardContent className="p-8 text-center">
              <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-600 mb-2">
                Nenhum agendamento encontrado
              </h3>
              <p className="text-gray-500">
                Os agendamentos criados via webhook aparecerão aqui.
              </p>
            </CardContent>
          </Card>
        ) : (
          appointments.map((appointment, index) => (
            <Card key={appointment.id} className={`${animations.fadeIn} ${animations.cardHover}`}
                  style={{ animationDelay: `${index * 100}ms` }}>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5" />
                    {appointment.name}
                  </CardTitle>
                  <Badge className={`${getStatusColor(appointment.status)} text-white`}>
                    {getStatusText(appointment.status)}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <Phone className="h-4 w-4 text-gray-500" />
                      <span>{appointment.phone}</span>
                    </div>
                    
                    {appointment.email && (
                      <div className="flex items-center gap-2 text-sm">
                        <span className="text-gray-500">📧</span>
                        <span>{appointment.email}</span>
                      </div>
                    )}

                    <div className="flex items-center gap-2 text-sm">
                      <MapPin className="h-4 w-4 text-gray-500" />
                      <span>{appointment.clinic}</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <Calendar className="h-4 w-4 text-gray-500" />
                      <span>{format(new Date(appointment.date), 'dd/MM/yyyy', { locale: ptBR })}</span>
                    </div>

                    <div className="flex items-center gap-2 text-sm">
                      <Clock className="h-4 w-4 text-gray-500" />
                      <span>{appointment.time}</span>
                    </div>

                    <div className="flex items-center gap-2 text-sm">
                      <Activity className="h-4 w-4 text-gray-500" />
                      <span>{appointment.service}</span>
                    </div>
                  </div>
                </div>

                {appointment.notes && (
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <p className="text-sm text-gray-600">
                      <strong>Observações:</strong> {appointment.notes.slice(0, 150)}...
                    </p>
                  </div>
                )}

                <div className="flex gap-2 pt-2">
                  {appointment.status === 'confirmed' && (
                    <>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleStatusChange(appointment.id, 'completed')}
                        disabled={updateAppointmentStatus.isPending}
                      >
                        Concluído
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleStatusChange(appointment.id, 'cancelled')}
                        disabled={updateAppointmentStatus.isPending}
                      >
                        Cancelar
                      </Button>
                    </>
                  )}
                  
                  {appointment.status === 'cancelled' && (
                    <Button
                      size="sm"
                      variant="default"
                      onClick={() => handleStatusChange(appointment.id, 'confirmed')}
                      disabled={updateAppointmentStatus.isPending}
                    >
                      Reativar
                    </Button>
                  )}
                </div>

                <div className="text-xs text-gray-400 border-t pt-2">
                  Criado: {format(new Date(appointment.created_at), 'dd/MM/yyyy HH:mm', { locale: ptBR })}
                  {appointment.source && ` • Origem: ${appointment.source}`}
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}

export default AppointmentsPage
