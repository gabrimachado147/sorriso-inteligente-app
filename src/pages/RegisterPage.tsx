import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { emailService } from '@/services/email';

const RegisterPage = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const result = await register({ email, password, name, phone });
      if (result.success) {
        await emailService.sendRegistration({ name, email, phone });
        navigate('/');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 flex justify-center">
      <Card className="max-w-md w-full">
        <CardHeader>
          <CardTitle>Criar Conta</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input placeholder="Nome completo" value={name} onChange={e => setName(e.target.value)} required />
            <Input placeholder="E-mail" type="email" value={email} onChange={e => setEmail(e.target.value)} required />
            <Input placeholder="Telefone" value={phone} onChange={e => setPhone(e.target.value)} required />
            <Input placeholder="Senha" type="password" value={password} onChange={e => setPassword(e.target.value)} required />
            <Button type="submit" className="w-full" disabled={loading}>{loading ? 'Registrando...' : 'Registrar'}</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default RegisterPage;
