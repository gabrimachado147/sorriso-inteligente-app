
import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Settings, Clock, Plus, Trash2 } from 'lucide-react'

interface ClinicScheduleManagerProps {
  clinicId?: string
}

interface Schedule {
  id: string
  day: string
  startTime: string
  endTime: string
  isActive: boolean
}

export const ClinicScheduleManager: React.FC<ClinicScheduleManagerProps> = ({ clinicId }) => {
  const [schedules, setSchedules] = useState<Schedule[]>([
    { id: '1', day: 'Segunda-feira', startTime: '08:00', endTime: '18:00', isActive: true },
    { id: '2', day: 'Terça-feira', startTime: '08:00', endTime: '18:00', isActive: true },
    { id: '3', day: 'Quarta-feira', startTime: '08:00', endTime: '18:00', isActive: true },
    { id: '4', day: 'Quinta-feira', startTime: '08:00', endTime: '18:00', isActive: true },
    { id: '5', day: 'Sexta-feira', startTime: '08:00', endTime: '18:00', isActive: true },
    { id: '6', day: 'Sábado', startTime: '08:00', endTime: '13:00', isActive: true },
    { id: '7', day: 'Domingo', startTime: '09:00', endTime: '12:00', isActive: false }
  ])

  const updateSchedule = (id: string, field: keyof Schedule, value: string | boolean) => {
    setSchedules(prev => prev.map(schedule => 
      schedule.id === id ? { ...schedule, [field]: value } : schedule
    ))
  }

  const saveSchedules = () => {
    console.log('Salvando horários:', schedules)
    // Aqui implementaria a chamada para a API
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Settings className="w-5 h-5" />
          Configurações de Horário
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          {schedules.map((schedule) => (
            <div key={schedule.id} className="flex items-center gap-4 p-4 border rounded-lg">
              <div className="flex items-center space-x-2">
                <Switch
                  checked={schedule.isActive}
                  onCheckedChange={(checked) => updateSchedule(schedule.id, 'isActive', checked)}
                />
                <Label className="min-w-[100px]">{schedule.day}</Label>
              </div>
              
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-gray-500" />
                <Input
                  type="time"
                  value={schedule.startTime}
                  onChange={(e) => updateSchedule(schedule.id, 'startTime', e.target.value)}
                  disabled={!schedule.isActive}
                  className="w-24"
                />
                <span className="text-gray-500">às</span>
                <Input
                  type="time"
                  value={schedule.endTime}
                  onChange={(e) => updateSchedule(schedule.id, 'endTime', e.target.value)}
                  disabled={!schedule.isActive}
                  className="w-24"
                />
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-end">
          <Button onClick={saveSchedules} className="flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Salvar Configurações
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
