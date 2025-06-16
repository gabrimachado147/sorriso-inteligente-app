
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Lock, Building2, AlertCircle } from 'lucide-react';
import { animations } from '@/lib/animations';

interface StaffLoginProps {
  onLogin: (username: string) => void;
}

const STAFF_CREDENTIALS = {
  'capao-bonito': 'sscapaobonito',
  'campo-belo': 'sscampobelo',
  'itapeva': 'ssitapeva',
  'itarare': 'ssitarare',
  'formiga': 'ssformiga'
};

const CLINIC_OPTIONS = [
  { value: 'capao-bonito', label: 'Senhor Sorriso Capão Bonito' },
  { value: 'campo-belo', label: 'Senhor Sorriso Campo Belo' },
  { value: 'itapeva', label: 'Senhor Sorriso Itapeva' },
  { value: 'itarare', label: 'Senhor Sorriso Itararé' },
  { value: 'formiga', label: 'Senhor Sorriso Formiga' }
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
    <div className={`min-h-screen flex items-center justify-center bg-gray-50 p-4 ${animations.fadeIn}`}>
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <div className="flex items-center justify-center mb-4">
            <div className="bg-primary rounded-full p-3">
              <Lock className="h-6 w-6 text-white" />
            </div>
          </div>
          <CardTitle className="text-2xl text-center">Acesso Funcionários</CardTitle>
          <p className="text-sm text-gray-600 text-center">
            Selecione sua clínica e digite a senha para acessar os agendamentos
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="clinic">Clínica</Label>
              <div className="relative">
                <Building2 className="absolute left-3 top-3 h-4 w-4 text-gray-400 z-10" />
                <Select value={selectedClinic} onValueChange={setSelectedClinic}>
                  <SelectTrigger className="pl-10">
                    <SelectValue placeholder="Selecione sua clínica" />
                  </SelectTrigger>
                  <SelectContent>
                    {CLINIC_OPTIONS.map((clinic) => (
                      <SelectItem key={clinic.value} value={clinic.value}>
                        {clinic.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Senha</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="password"
                  type="password"
                  placeholder="Digite a senha da clínica"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10"
                  required
                />
              </div>
            </div>

            {error && (
              <div className="flex items-center gap-2 text-red-600 text-sm">
                <AlertCircle className="h-4 w-4" />
                {error}
              </div>
            )}

            <Button 
              type="submit" 
              className="w-full" 
              disabled={isLoading || !selectedClinic}
            >
              {isLoading ? 'Entrando...' : 'Entrar'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export { CLINIC_OPTIONS };
