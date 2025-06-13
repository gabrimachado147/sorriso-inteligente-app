
import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Switch } from '@/components/ui/switch'
import { Button } from '@/components/ui/button'
import { Bell, MessageSquare, Mail, Smartphone } from 'lucide-react'
import { toastSuccess } from '@/components/ui/custom-toast'

export const ReminderSettings = () => {
  const [settings, setSettings] = useState({
    push_notifications: true,
    whatsapp_reminders: true,
    sms_reminders: false,
    email_reminders: true,
    reminder_24h: true,
    reminder_2h: true,
    reminder_30min: true
  })

  const handleSettingChange = (key: string, value: boolean) => {
    setSettings(prev => ({ ...prev, [key]: value }))
  }

  const handleSave = () => {
    // Salvar configurações
    toastSuccess('Configurações salvas!', 'Suas preferências de lembrete foram atualizadas')
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bell className="w-5 h-5" />
          Configurações de Lembretes
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Métodos de Notificação */}
        <div className="space-y-4">
          <h4 className="font-medium">Métodos de Notificação</h4>
          
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Smartphone className="w-5 h-5 text-blue-600" />
                <div>
                  <p className="font-medium">Notificações Push</p>
                  <p className="text-sm text-gray-600">Receber no aplicativo</p>
                </div>
              </div>
              <Switch
                checked={settings.push_notifications}
                onCheckedChange={(value) => handleSettingChange('push_notifications', value)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <MessageSquare className="w-5 h-5 text-green-600" />
                <div>
                  <p className="font-medium">WhatsApp</p>
                  <p className="text-sm text-gray-600">Mensagens no WhatsApp</p>
                </div>
              </div>
              <Switch
                checked={settings.whatsapp_reminders}
                onCheckedChange={(value) => handleSettingChange('whatsapp_reminders', value)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Smartphone className="w-5 h-5 text-purple-600" />
                <div>
                  <p className="font-medium">SMS</p>
                  <p className="text-sm text-gray-600">Mensagens de texto</p>
                </div>
              </div>
              <Switch
                checked={settings.sms_reminders}
                onCheckedChange={(value) => handleSettingChange('sms_reminders', value)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-red-600" />
                <div>
                  <p className="font-medium">Email</p>
                  <p className="text-sm text-gray-600">Mensagens por email</p>
                </div>
              </div>
              <Switch
                checked={settings.email_reminders}
                onCheckedChange={(value) => handleSettingChange('email_reminders', value)}
              />
            </div>
          </div>
        </div>

        {/* Horários dos Lembretes */}
        <div className="space-y-4">
          <h4 className="font-medium">Horários dos Lembretes</h4>
          
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">24 horas antes</p>
                <p className="text-sm text-gray-600">Lembrete com 1 dia de antecedência</p>
              </div>
              <Switch
                checked={settings.reminder_24h}
                onCheckedChange={(value) => handleSettingChange('reminder_24h', value)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">2 horas antes</p>
                <p className="text-sm text-gray-600">Lembrete no dia da consulta</p>
              </div>
              <Switch
                checked={settings.reminder_2h}
                onCheckedChange={(value) => handleSettingChange('reminder_2h', value)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">30 minutos antes</p>
                <p className="text-sm text-gray-600">Lembrete de última hora</p>
              </div>
              <Switch
                checked={settings.reminder_30min}
                onCheckedChange={(value) => handleSettingChange('reminder_30min', value)}
              />
            </div>
          </div>
        </div>

        <Button onClick={handleSave} className="w-full">
          Salvar Configurações
        </Button>
      </CardContent>
    </Card>
  )
}
