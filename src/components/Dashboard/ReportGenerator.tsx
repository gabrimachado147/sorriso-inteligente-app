
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { 
  FileText, Download, Calendar as CalendarIcon, Filter, 
  BarChart3, Users, DollarSign, Clock, Settings 
} from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { animations } from '@/lib/animations';

interface ReportTemplate {
  id: string;
  name: string;
  description: string;
  icon: React.ComponentType<any>;
  fields: string[];
  defaultFormat: 'pdf' | 'excel' | 'csv';
}

interface ReportGeneratorProps {
  templates: ReportTemplate[];
  onGenerateReport: (config: ReportConfig) => Promise<void>;
  isGenerating?: boolean;
}

interface ReportConfig {
  templateId: string;
  name: string;
  format: 'pdf' | 'excel' | 'csv';
  dateRange: {
    from: Date;
    to: Date;
  };
  selectedFields: string[];
  filters: Record<string, any>;
}

export const ReportGenerator: React.FC<ReportGeneratorProps> = ({
  templates,
  onGenerateReport,
  isGenerating = false
}) => {
  const [selectedTemplate, setSelectedTemplate] = useState<ReportTemplate | null>(null);
  const [reportName, setReportName] = useState('');
  const [reportFormat, setReportFormat] = useState<'pdf' | 'excel' | 'csv'>('pdf');
  const [dateRange, setDateRange] = useState<{from: Date; to: Date}>({
    from: new Date(new Date().setDate(new Date().getDate() - 30)),
    to: new Date()
  });
  const [selectedFields, setSelectedFields] = useState<string[]>([]);
  const [filters, setFilters] = useState<Record<string, any>>({});

  const handleTemplateSelect = (template: ReportTemplate) => {
    setSelectedTemplate(template);
    setSelectedFields(template.fields);
    setReportFormat(template.defaultFormat);
    setReportName(`Relatório ${template.name} - ${format(new Date(), 'dd/MM/yyyy', { locale: ptBR })}`);
  };

  const handleFieldToggle = (field: string) => {
    setSelectedFields(prev => 
      prev.includes(field) 
        ? prev.filter(f => f !== field)
        : [...prev, field]
    );
  };

  const handleGenerateReport = async () => {
    if (!selectedTemplate) return;

    const config: ReportConfig = {
      templateId: selectedTemplate.id,
      name: reportName,
      format: reportFormat,
      dateRange,
      selectedFields,
      filters
    };

    await onGenerateReport(config);
  };

  const canGenerate = selectedTemplate && reportName && selectedFields.length > 0;

  return (
    <div className={`space-y-6 ${animations.fadeIn}`}>
      {/* Template Selection */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Gerador de Relatórios
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {templates.map((template) => {
              const IconComponent = template.icon;
              return (
                <Card 
                  key={template.id}
                  className={`cursor-pointer transition-all hover:shadow-md ${
                    selectedTemplate?.id === template.id ? 'ring-2 ring-primary' : ''
                  }`}
                  onClick={() => handleTemplateSelect(template)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3 mb-2">
                      <IconComponent className="h-6 w-6 text-primary" />
                      <h3 className="font-semibold">{template.name}</h3>
                    </div>
                    <p className="text-sm text-gray-600">{template.description}</p>
                    <div className="mt-2">
                      <span className="text-xs bg-gray-100 px-2 py-1 rounded">
                        {template.fields.length} campos
                      </span>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Report Configuration */}
      {selectedTemplate && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Configuração do Relatório
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Basic Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="reportName">Nome do Relatório</Label>
                <Input
                  id="reportName"
                  value={reportName}
                  onChange={(e) => setReportName(e.target.value)}
                  placeholder="Nome do relatório"
                />
              </div>
              <div>
                <Label htmlFor="format">Formato</Label>
                <Select value={reportFormat} onValueChange={(value: 'pdf' | 'excel' | 'csv') => setReportFormat(value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pdf">PDF</SelectItem>
                    <SelectItem value="excel">Excel</SelectItem>
                    <SelectItem value="csv">CSV</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Date Range */}
            <div>
              <Label>Período</Label>
              <div className="flex items-center gap-4 mt-2">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-48">
                      <CalendarIcon className="h-4 w-4 mr-2" />
                      {format(dateRange.from, 'dd/MM/yyyy', { locale: ptBR })}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={dateRange.from}
                      onSelect={(date) => date && setDateRange(prev => ({ ...prev, from: date }))}
                    />
                  </PopoverContent>
                </Popover>
                <span>até</span>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-48">
                      <CalendarIcon className="h-4 w-4 mr-2" />
                      {format(dateRange.to, 'dd/MM/yyyy', { locale: ptBR })}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={dateRange.to}
                      onSelect={(date) => date && setDateRange(prev => ({ ...prev, to: date }))}
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            {/* Field Selection */}
            <div>
              <Label>Campos do Relatório</Label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-2">
                {selectedTemplate.fields.map((field) => (
                  <div key={field} className="flex items-center space-x-2">
                    <Checkbox
                      id={field}
                      checked={selectedFields.includes(field)}
                      onCheckedChange={() => handleFieldToggle(field)}
                    />
                    <Label htmlFor={field} className="text-sm">{field}</Label>
                  </div>
                ))}
              </div>
            </div>

            {/* Generate Button */}
            <div className="flex justify-end">
              <Button
                onClick={handleGenerateReport}
                disabled={!canGenerate || isGenerating}
                className="flex items-center gap-2"
              >
                <Download className="h-4 w-4" />
                {isGenerating ? 'Gerando...' : 'Gerar Relatório'}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

// Default templates
export const defaultReportTemplates: ReportTemplate[] = [
  {
    id: 'financial',
    name: 'Financeiro',
    description: 'Relatório completo de receitas, custos e lucros',
    icon: DollarSign,
    fields: ['Receita Total', 'Custos', 'Lucro', 'Margem', 'Formas de Pagamento'],
    defaultFormat: 'excel'
  },
  {
    id: 'appointments',
    name: 'Agendamentos',
    description: 'Análise detalhada de agendamentos e atendimentos',
    icon: Clock,
    fields: ['Total de Agendamentos', 'Status', 'Serviços', 'Clínicas', 'Horários'],
    defaultFormat: 'pdf'
  },
  {
    id: 'patients',
    name: 'Pacientes',
    description: 'Dados demográficos e histórico de pacientes',
    icon: Users,
    fields: ['Novos Pacientes', 'Retornos', 'Demografia', 'Histórico Médico'],
    defaultFormat: 'excel'
  },
  {
    id: 'performance',
    name: 'Performance',
    description: 'KPIs e métricas de performance das clínicas',
    icon: BarChart3,
    fields: ['Taxa de Conversão', 'Satisfação', 'Tempo Médio', 'Eficiência'],
    defaultFormat: 'pdf'
  }
];
