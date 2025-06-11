import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toastSuccess, toastError } from '@/components/ui/custom-toast';
import { supabase } from '@/integrations/supabase/client';
import { emailService } from '@/services/email';

const RegisterPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !phone) {
      toastError('Erro', 'Preencha todos os campos obrigatórios.');
      return;
    }
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('users')
        .insert({ full_name: name, email, phone })
        .select()
        .single();
      if (error) throw error;
      localStorage.setItem('registeredUser', JSON.stringify({ id: data.id, name, email, phone }));
      await emailService.sendRegistration({ name, email, phone });
      toastSuccess('Cadastro realizado', 'Em breve entraremos em contato.');
      setName('');
      setEmail('');
      setPhone('');
    } catch (err) {
      console.error(err);
      toastError('Erro', 'Não foi possível registrar.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <Card className="max-w-md mx-auto">
        <CardHeader>
          <CardTitle>Cadastro</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              placeholder="Nome completo"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
            <Input
              type="email"
              placeholder="E-mail"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <Input
              placeholder="Telefone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
            />
            <Button type="submit" className="w-full" disabled={loading}>
              Registrar
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default RegisterPage;
