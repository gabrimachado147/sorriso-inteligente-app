
import React from 'react';
import { TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Checkbox } from '@/components/ui/checkbox';

interface AppointmentTableHeaderProps {
  isAllSelected: boolean;
  isPartiallySelected: boolean;
  onSelectAll: (checked: boolean) => void;
}

export const AppointmentTableHeader: React.FC<AppointmentTableHeaderProps> = ({
  isAllSelected,
  isPartiallySelected,
  onSelectAll
}) => {
  return (
    <TableHeader>
      <TableRow>
        <TableHead className="w-12">
          <Checkbox
            checked={isAllSelected}
            onCheckedChange={onSelectAll}
            aria-label="Selecionar todos"
            className={`h-5 w-5 ${isPartiallySelected ? "data-[state=checked]:bg-primary" : ""}`}
          />
        </TableHead>
        <TableHead>Paciente</TableHead>
        <TableHead>Contato</TableHead>
        <TableHead>Data/Hora</TableHead>
        <TableHead>Serviço</TableHead>
        <TableHead>Clínica</TableHead>
        <TableHead>Status</TableHead>
      </TableRow>
    </TableHeader>
  );
};
