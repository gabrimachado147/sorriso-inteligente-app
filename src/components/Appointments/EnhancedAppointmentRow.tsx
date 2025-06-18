
import React, { useState } from 'react';
import { TableRow, TableCell } from '@/components/ui/table';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Pencil, Phone, Mail, MapPin, Clock, User, DollarSign, FileText } from 'lucide-react';
import { AppointmentRecord } from '@/services/supabase/appointments';
import { formatPhone } from '@/lib/utils';

interface EnhancedAppointmentRowProps {
  appointment: AppointmentRecord;
  isSelected: boolean;
  onSelect: (appointmentId: string, checked: boolean) => void;
  onStatusChange: (appointmentId: string, newStatus: 'confirmed' | 'cancelled' | 'completed' | 'no_show') => void;
  onServiceUpdate: (appointmentId: string, service: string, price?: number) => void;
  isUpdating: boolean;
}

export const EnhancedAppointmentRow: React.FC<EnhancedAppointmentRowProps> = ({
  appointment,
  isSelected,
  onSelect,
  onStatusChange,
  onServiceUpdate,
  isUpdating
}) => {
  const [isEditingService, setIsEditingService] = useState(false);
  const [editedService, setEditedService] = useState(appointment.service);
  const [editedPrice, setEditedPrice] = useState(appointment.price?.toString() || '');
  const [notes, setNotes] = useState(appointment.notes || '');
  const [isNotesDialogOpen, setIsNotesDialogOpen] = useState(false);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'bg-green-100 text-green-800 border-green-200';
      case 'completed': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'cancelled': return 'bg-red-100 text-red-800 border-red-200';
      case 'no_show': return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'confirmed': return 'Confirmado';
      case 'completed': return 'Concluído';
      case 'cancelled': return 'Cancelado';
      case 'no_show': return 'Faltou';
      case 'pending': return 'Pendente';
      default: return status;
    }
  };

  const handleServiceSave = () => {
    const price = editedPrice ? parseFloat(editedPrice) : undefined;
    onServiceUpdate(appointment.id, editedService, price);
    setIsEditingService(false);
  };

  const handleServiceCancel = () => {
    setEditedService(appointment.service);
    setEditedPrice(appointment.price?.toString() || '');
    setIsEditingService(false);
  };

  const handleNotesUpdate = () => {
    // In a real app, you'd call an API to update notes
    console.log('Updating notes for appointment:', appointment.id, notes);
    setIsNotesDialogOpen(false);
  };

  // Clean clinic name (remove duplicates)
  const cleanClinicName = (clinic: string) => {
    const words = clinic.split(' ');
    const uniqueWords = words.filter((word, index) => 
      words.indexOf(word) === index || word.length <= 2
    );
    return uniqueWords.join(' ');
  };

  return (
    <TableRow className="hover:bg-gray-50 transition-colors">
      <TableCell className="w-12">
        <Checkbox
          checked={isSelected}
          onCheckedChange={(checked) => onSelect(appointment.id, checked as boolean)}
        />
      </TableCell>
      
      <TableCell className="min-w-[180px]">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
            <User className="h-4 w-4 text-blue-600" />
          </div>
          <div>
            <div className="font-medium text-gray-900">{appointment.name}</div>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Phone className="h-3 w-3" />
              {formatPhone(appointment.phone)}
            </div>
            {appointment.email && (
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <Mail className="h-3 w-3" />
                {appointment.email}
              </div>
            )}
          </div>
        </div>
      </TableCell>

      <TableCell className="min-w-[120px]">
        <div className="flex items-center gap-2">
          <Clock className="h-4 w-4 text-gray-400" />
          <div>
            <div className="font-medium">{new Date(appointment.date).toLocaleDateString('pt-BR')}</div>
            <div className="text-sm text-gray-500">{appointment.time}</div>
          </div>
        </div>
      </TableCell>

      <TableCell className="min-w-[200px]">
        {isEditingService ? (
          <div className="space-y-2">
            <Input
              value={editedService}
              onChange={(e) => setEditedService(e.target.value)}
              placeholder="Serviço"
              className="text-sm"
            />
            <div className="flex items-center gap-2">
              <span className="text-sm">R$</span>
              <Input
                type="number"
                value={editedPrice}
                onChange={(e) => setEditedPrice(e.target.value)}
                placeholder="Preço"
                className="text-sm"
              />
            </div>
            <div className="flex gap-2">
              <Button size="sm" onClick={handleServiceSave} disabled={isUpdating}>
                Salvar
              </Button>
              <Button size="sm" variant="outline" onClick={handleServiceCancel}>
                Cancelar
              </Button>
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <div>
              <div className="font-medium">{appointment.service}</div>
              {appointment.price && (
                <div className="flex items-center gap-1 text-sm text-green-600">
                  <DollarSign className="h-3 w-3" />
                  R$ {appointment.price.toFixed(2)}
                </div>
              )}
            </div>
            <div className="flex gap-1">
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setIsEditingService(true)}
                className="h-6 w-6 p-0"
              >
                <Pencil className="h-3 w-3" />
              </Button>
              <Dialog open={isNotesDialogOpen} onOpenChange={setIsNotesDialogOpen}>
                <DialogTrigger asChild>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-6 w-6 p-0"
                  >
                    <FileText className="h-3 w-3" />
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Observações - {appointment.name}</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="notes">Observações</Label>
                      <Textarea
                        id="notes"
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        placeholder="Adicione observações sobre o serviço..."
                        rows={4}
                      />
                    </div>
                    <div className="flex justify-end gap-2">
                      <Button variant="outline" onClick={() => setIsNotesDialogOpen(false)}>
                        Cancelar
                      </Button>
                      <Button onClick={handleNotesUpdate}>
                        Salvar Observações
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        )}
      </TableCell>

      <TableCell className="min-w-[140px]">
        <div className="flex items-center gap-2">
          <MapPin className="h-4 w-4 text-gray-400" />
          <span className="text-sm">{cleanClinicName(appointment.clinic)}</span>
        </div>
      </TableCell>

      <TableCell className="min-w-[140px]">
        <Select
          value={appointment.status}
          onValueChange={(value) => onStatusChange(appointment.id, value as any)}
          disabled={isUpdating}
        >
          <SelectTrigger className="w-32">
            <SelectValue>
              <Badge className={getStatusColor(appointment.status)}>
                {getStatusLabel(appointment.status)}
              </Badge>
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="confirmed">
              <Badge className="bg-green-100 text-green-800">Confirmado</Badge>
            </SelectItem>
            <SelectItem value="completed">
              <Badge className="bg-blue-100 text-blue-800">Concluído</Badge>
            </SelectItem>
            <SelectItem value="cancelled">
              <Badge className="bg-red-100 text-red-800">Cancelado</Badge>
            </SelectItem>
            <SelectItem value="no_show">
              <Badge className="bg-gray-100 text-gray-800">Faltou</Badge>
            </SelectItem>
            <SelectItem value="pending">
              <Badge className="bg-yellow-100 text-yellow-800">Pendente</Badge>
            </SelectItem>
          </SelectContent>
        </Select>
      </TableCell>
    </TableRow>
  );
};
