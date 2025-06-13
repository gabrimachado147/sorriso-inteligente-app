
import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Calendar, CheckCircle, Smartphone, Monitor } from 'lucide-react'
import { useCalendar } from '@/hooks/useCalendar'

export const CalendarIntegration = () => {
  const [connecting, setConnecting] = useState<string | null>(null)
  const { connectGoogle, connectApple } = useCalendar()

  const handleGoogleConnect = async () => {
    setConnecting('google')
    try {
      // Simular processo de autenticação OAuth
      const authCode = 'mock_auth_code'
      await connectGoogle.mutateAsync(authCode)
    } catch (error) {
      console.error('Error connecting Google Calendar:', error)
    } finally {
      setConnecting(null)
    }
  }

  const handleAppleConnect = async () => {
    setConnecting('apple')
    try {
      // Simular processo de autenticação
      const credentials = { token: 'mock_token' }
      await connectApple.mutateAsync(credentials)
    } catch (error) {
      console.error('Error connecting Apple Calendar:', error)
    } finally {
      setConnecting(null)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="w-5 h-5" />
          Integração com Calendário
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-gray-600 text-sm">
          Conecte seu calendário para receber lembretes automáticos dos seus agendamentos.
        </p>

        <div className="space-y-3">
          {/* Google Calendar */}
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
                <Monitor className="w-5 h-5 text-white" />
              </div>
              <div>
                <h4 className="font-medium">Google Calendar</h4>
                <p className="text-sm text-gray-600">Sincronizar com Google</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline">Desconectado</Badge>
              <Button
                size="sm"
                onClick={handleGoogleConnect}
                disabled={connecting === 'google'}
              >
                {connecting === 'google' ? 'Conectando...' : 'Conectar'}
              </Button>
            </div>
          </div>

          {/* Apple Calendar */}
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center">
                <Smartphone className="w-5 h-5 text-white" />
              </div>
              <div>
                <h4 className="font-medium">Apple Calendar</h4>
                <p className="text-sm text-gray-600">Sincronizar com iCloud</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline">Desconectado</Badge>
              <Button
                size="sm"
                onClick={handleAppleConnect}
                disabled={connecting === 'apple'}
              >
                {connecting === 'apple' ? 'Conectando...' : 'Conectar'}
              </Button>
            </div>
          </div>
        </div>

        <div className="bg-blue-50 p-4 rounded-lg">
          <div className="flex items-start gap-3">
            <CheckCircle className="w-5 h-5 text-blue-600 mt-0.5" />
            <div className="text-sm">
              <p className="font-medium text-blue-900">Benefícios da integração:</p>
              <ul className="text-blue-700 mt-1 space-y-1">
                <li>• Lembretes automáticos no seu celular</li>
                <li>• Sincronização com outros dispositivos</li>
                <li>• Evita conflitos de horários</li>
              </ul>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
