
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Lock, AlertCircle } from 'lucide-react';
import { animations } from '@/lib/animations';

interface StaffLoginProps {
  onLogin: (username: string) => void;
}

const STAFF_CREDENTIALS = {
  campobelo: 'sscampobelo',
  formiga: 'ssformiga',
  itarare: 'ssitarare',
  capaobonito: 'sscapaobonito',
  itapeva: 'ssitapeva',
  'gerencia-ss': 'ssgerencia'
};

const CLINIC_OPTIONS = [
  { value: 'campobelo', label: 'Senhor Sorriso Campobelo' },
  { value: 'formiga', label: 'Senhor Sorriso Formiga' },
  { value: 'itarare', label: 'Senhor Sorriso Itararé' },
  { value: 'capaobonito', label: 'Senhor Sorriso Capão Bonito' },
  { value: 'itapeva', label: 'Senhor Sorriso Itapeva' },
  { value: 'gerencia-ss', label: 'Gerência - Senhor Sorriso' }
];

export const StaffLogin: React.FC<StaffLoginProps> = ({ onLogin }) => {
  const [selectedClinic, setSelectedClinic] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      if (!selectedClinic) {
        setError('Por favor, selecione uma clínica');
        setIsLoading(false);
        return;
      }

      const credentials = STAFF_CREDENTIALS as Record<string, string>;
      
      if (credentials[selectedClinic] === password) {
        onLogin(selectedClinic);
      } else {
        setError('Senha incorreta para a clínica selecionada');
      }
    } catch (err) {
      setError('Erro ao fazer login');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className={`w-full mobile-card-spacing ${animations.fadeIn}`}>
      <CardHeader className="space-y-1 text-center pb-6">
        <div className="flex items-center justify-center mb-6">
          <div className="bg-primary rounded-full p-3">
            <Lock className="h-6 w-6 text-white" />
          </div>
        </div>
        <CardTitle className="text-lg text-center">Acesso Funcionários</CardTitle>
        <p className="text-sm text-muted-foreground text-center mt-2">
          Selecione sua clínica e digite a senha para acessar os agendamentos
        </p>
      </CardHeader>
      <CardContent className="pt-0">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-3">
            <Label htmlFor="clinic" className="text-sm font-medium">Clínica</Label>
            <Select value={selectedClinic} onValueChange={setSelectedClinic}>
              <SelectTrigger className="h-12 mobile-input text-left">
                <SelectValue placeholder="Selecione sua clínica" />
              </SelectTrigger>
              <SelectContent className="z-50 bg-white border shadow-lg">
                {CLINIC_OPTIONS.map((clinic) => (
                  <SelectItem key={clinic.value} value={clinic.value}>
                    {clinic.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-3">
            <Label htmlFor="password" className="text-sm font-medium">Senha</Label>
            <Input
              id="password"
              type="password"
              placeholder="Digite a senha da clínica"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="h-12 mobile-input"
              required
            />
          </div>

          {error && (
            <div className="flex items-center gap-2 text-red-600 text-sm bg-red-50 p-3 rounded-md">
              <AlertCircle className="h-4 w-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <Button 
            type="submit" 
            className="w-full h-12 mobile-button text-base font-medium" 
            disabled={isLoading || !selectedClinic}
          >
            {isLoading ? 'Entrando...' : 'Entrar'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export { CLINIC_OPTIONS };
