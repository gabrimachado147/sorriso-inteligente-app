import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Edit3, DollarSign, Save, X, Calendar, Clock, User, Phone, Mail, MapPin } from 'lucide-react';
import { AppointmentRecord } from '@/services/supabase/appointments';
import { animations } from '@/lib/animations';
import { toastSuccess, toastError } from '@/components/ui/custom-toast';

interface ServiceEditorProps {
  appointment: AppointmentRecord;
  onUpdate: (appointmentId: string, service: string, price?: number) => void;
  onStatusChange?: (appointmentId: string, newStatus: 'confirmed' | 'cancelled' | 'completed' | 'no_show') => void;
  onPatientUpdate?: (appointmentId: string, updates: { name?: string; phone?: string; email?: string; date?: string; time?: string; clinic?: string; notes?: string }) => void;
  isUpdating: boolean;
}

const availableServices = [
  'Avaliação Gratuita',
  'Limpeza Dental',
  'Clareamento Dental',
  'Ortodontia',
  'Implantodontia',
  'Restauração',
  'Extração',
  'Canal',
  'Prótese Dental',
  'Cirurgia Oral',
  'Periodontia',
  'Endodontia',
  'Estética Dental',
  'Urgência Dentária',
  'Consulta de Retorno',
  'Profilaxia',
  'Radiografia',
  'Moldagem'
];

const availableClinics = [
  'Senhor Sorriso Capão Bonito - Capão',
  'Senhor Sorriso Capão Bonito - Centro',
  'Senhor Sorriso Campobelo',
  'Senhor Sorriso Itapeva',
  'Senhor Sorriso Taquarivaí'
];

export const ServiceEditor: React.FC<ServiceEditorProps> = ({
  appointment,
  onUpdate,
  onStatusChange,
  onPatientUpdate,
  isUpdating
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'service' | 'patient' | 'status'>('service');
  
  // Service tab state
  const [selectedService, setSelectedService] = useState(appointment.service);
  const [priceValue, setPriceValue] = useState<string>(
    typeof (appointment as AppointmentRecord & { price?: number }).price === 'number'
      ? ((appointment as AppointmentRecord & { price?: number }).price as number).toString()
      : ''
  );
  
  // Patient tab state
  const [patientName, setPatientName] = useState(appointment.name);
  const [patientPhone, setPatientPhone] = useState(appointment.phone);
  const [patientEmail, setPatientEmail] = useState(appointment.email || '');
  const [appointmentDate, setAppointmentDate] = useState(appointment.date);
  const [appointmentTime, setAppointmentTime] = useState(appointment.time);
  const [appointmentClinic, setAppointmentClinic] = useState(appointment.clinic);
  const [appointmentNotes, setAppointmentNotes] = useState(appointment.notes || '');
  
  // Status tab state
  const [selectedStatus, setSelectedStatus] = useState(appointment.status);

  const handleSaveService = async () => {
    try {
      const price = priceValue ? parseFloat(priceValue.replace(',', '.')) : undefined;
      console.log('Salvando serviço:', { appointmentId: appointment.id, service: selectedService, price });
      
      await onUpdate(appointment.id, selectedService, price);
      toastSuccess('Sucesso', 'Serviço atualizado com sucesso!');
      setIsOpen(false);
    } catch (error) {
      console.error('Erro ao salvar serviço:', error);
      toastError('Erro', 'Não foi possível atualizar o serviço');
    }
  };

  const handleSavePatient = async () => {
    try {
      if (onPatientUpdate) {
        console.log('Salvando dados do paciente:', { 
          appointmentId: appointment.id, 
          updates: {
            name: patientName,
            phone: patientPhone,
            email: patientEmail,
            date: appointmentDate,
            time: appointmentTime,
            clinic: appointmentClinic,
            notes: appointmentNotes
          }
        });
        
        await onPatientUpdate(appointment.id, {
          name: patientName,
          phone: patientPhone,
          email: patientEmail,
          date: appointmentDate,
          time: appointmentTime,
          clinic: appointmentClinic,
          notes: appointmentNotes
        });
        toastSuccess('Sucesso', 'Dados do paciente atualizados com sucesso!');
        setIsOpen(false);
      }
    } catch (error) {
      console.error('Erro ao salvar dados do paciente:', error);
      toastError('Erro', 'Não foi possível atualizar os dados do paciente');
    }
  };

  const handleSaveStatus = async () => {
    try {
      if (onStatusChange) {
        console.log('Salvando status:', { appointmentId: appointment.id, status: selectedStatus });
        
        await onStatusChange(appointment.id, selectedStatus as 'confirmed' | 'cancelled' | 'completed' | 'no_show');
        toastSuccess('Sucesso', 'Status atualizado com sucesso!');
        setIsOpen(false);
      }
    } catch (error) {
      console.error('Erro ao salvar status:', error);
      toastError('Erro', 'Não foi possível atualizar o status');
    }
  };

  const handleCancel = () => {
    // Reset all states
    setSelectedService(appointment.service);
    setPriceValue(
      typeof (appointment as AppointmentRecord & { price?: number }).price === 'number'
        ? ((appointment as AppointmentRecord & { price?: number }).price as number).toString()
        : ''
    );
    setPatientName(appointment.name);
    setPatientPhone(appointment.phone);
    setPatientEmail(appointment.email || '');
    setAppointmentDate(appointment.date);
    setAppointmentTime(appointment.time);
    setAppointmentClinic(appointment.clinic);
    setAppointmentNotes(appointment.notes || '');
    setSelectedStatus(appointment.status);
    setIsOpen(false);
  };

  const formatCurrency = (value: string) => {
    const numbers = value.replace(/[^\d.,]/g, '');
    return numbers;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'text-green-600';
      case 'cancelled': return 'text-red-600';
      case 'completed': return 'text-blue-600';
      case 'no_show': return 'text-orange-600';
      default: return 'text-yellow-600';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'confirmed': return 'Confirmado';
      case 'cancelled': return 'Cancelado';
      case 'completed': return 'Concluído';
      case 'no_show': return 'Não Compareceu';
      default: return 'Pendente';
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button 
          variant="ghost" 
          size="sm" 
          className={`h-auto p-2 hover:bg-blue-50 ${animations.buttonHover}`}
        >
          <Edit3 className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Edit3 className="h-5 w-5" />
            Editar Agendamento - {appointment.name}
          </DialogTitle>
        </DialogHeader>
        
        {/* Tab Navigation */}
        <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg mb-4">
          <button
            onClick={() => setActiveTab('service')}
            className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'service' 
                ? 'bg-white text-blue-600 shadow-sm' 
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Serviço & Valor
          </button>
          <button
            onClick={() => setActiveTab('patient')}
            className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'patient' 
                ? 'bg-white text-blue-600 shadow-sm' 
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Dados do Paciente
          </button>
          <button
            onClick={() => setActiveTab('status')}
            className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'status' 
                ? 'bg-white text-blue-600 shadow-sm' 
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Status
          </button>
        </div>

        {/* Service Tab */}
        {activeTab === 'service' && (
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="service" className="flex items-center gap-2">
                <DollarSign className="h-4 w-4" />
                Tipo de Serviço
              </Label>
              <Select value={selectedService} onValueChange={setSelectedService}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o serviço" />
                </SelectTrigger>
                <SelectContent>
                  {availableServices.map((service) => (
                    <SelectItem key={service} value={service}>
                      {service}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="price" className="flex items-center gap-2">
                <DollarSign className="h-4 w-4" />
                Valor & Forma de Pagamento (R$)
              </Label>
              <Textarea
                id="price"
                placeholder="Ex: 150,00 - Cartão de Crédito 3x ou 250,00 - Dinheiro à vista"
                value={priceValue}
                onChange={(e) => setPriceValue(e.target.value)}
                rows={3}
              />
              <p className="text-xs text-gray-500">
                Campo livre - Digite o valor e forma de pagamento
              </p>
            </div>

            <div className="flex gap-2 justify-end pt-4">
              <Button variant="outline" onClick={handleCancel} disabled={isUpdating}>
                <X className="h-4 w-4 mr-1" />
                Cancelar
              </Button>
              <Button onClick={handleSaveService} disabled={isUpdating || !selectedService}>
                <Save className="h-4 w-4 mr-1" />
                {isUpdating ? 'Salvando...' : 'Salvar Serviço'}
              </Button>
            </div>
          </div>
        )}

        {/* Patient Tab */}
        {activeTab === 'patient' && (
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  Nome Completo
                </Label>
                <Input
                  id="name"
                  value={patientName}
                  onChange={(e) => setPatientName(e.target.value)}
                  placeholder="Nome do paciente"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone" className="flex items-center gap-2">
                  <Phone className="h-4 w-4" />
                  Telefone
                </Label>
                <Input
                  id="phone"
                  value={patientPhone}
                  onChange={(e) => setPatientPhone(e.target.value)}
                  placeholder="(11) 99999-9999"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  E-mail
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={patientEmail}
                  onChange={(e) => setPatientEmail(e.target.value)}
                  placeholder="email@exemplo.com"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="clinic" className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  Clínica
                </Label>
                <Select value={appointmentClinic} onValueChange={setAppointmentClinic}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione a clínica" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableClinics.map((clinic) => (
                      <SelectItem key={clinic} value={clinic}>
                        {clinic}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="date" className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Data
                </Label>
                <Input
                  id="date"
                  type="date"
                  value={appointmentDate}
                  onChange={(e) => setAppointmentDate(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="time" className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  Horário
                </Label>
                <Input
                  id="time"
                  type="time"
                  value={appointmentTime}
                  onChange={(e) => setAppointmentTime(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Observações</Label>
              <Textarea
                id="notes"
                value={appointmentNotes}
                onChange={(e) => setAppointmentNotes(e.target.value)}
                placeholder="Observações sobre o agendamento..."
                rows={3}
              />
            </div>

            <div className="flex gap-2 justify-end pt-4">
              <Button variant="outline" onClick={handleCancel} disabled={isUpdating}>
                <X className="h-4 w-4 mr-1" />
                Cancelar
              </Button>
              <Button onClick={handleSavePatient} disabled={isUpdating || !patientName}>
                <Save className="h-4 w-4 mr-1" />
                {isUpdating ? 'Salvando...' : 'Salvar Dados'}
              </Button>
            </div>
          </div>
        )}

        {/* Status Tab */}
        {activeTab === 'status' && (
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="status">Status do Agendamento</Label>
              <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="confirmed">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      Confirmado
                    </div>
                  </SelectItem>
                  <SelectItem value="completed">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      Concluído
                    </div>
                  </SelectItem>
                  <SelectItem value="cancelled">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                      Cancelado
                    </div>
                  </SelectItem>
                  <SelectItem value="no_show">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                      Não Compareceu
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="text-sm font-medium text-gray-900 mb-2">Status Atual</h4>
              <p className={`text-sm font-medium ${getStatusColor(appointment.status)}`}>
                {getStatusLabel(appointment.status)}
              </p>
            </div>

            <div className="flex gap-2 justify-end pt-4">
              <Button variant="outline" onClick={handleCancel} disabled={isUpdating}>
                <X className="h-4 w-4 mr-1" />
                Cancelar
              </Button>
              <Button onClick={handleSaveStatus} disabled={isUpdating || selectedStatus === appointment.status}>
                <Save className="h-4 w-4 mr-1" />
                {isUpdating ? 'Salvando...' : 'Atualizar Status'}
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
