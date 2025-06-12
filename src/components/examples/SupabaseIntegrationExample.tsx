
/**
 * Supabase Integration Example Component
 * Demonstrates how to use authentication and database services
 * Copy this code into your React components as needed
 */

import React, { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useChatMessages, useContacts, useWhatsAppLeads } from '../../hooks/useSupabase';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Alert, AlertDescription } from '../ui/alert';

export const SupabaseIntegrationExample: React.FC = () => {
  const {
    user,
    session,
    loading: authLoading,
    error: authError,
    login,
    register,
    logout,
    isAuthenticated
  } = useAuth();

  const { contacts, createContact } = useContacts();
  const { leads, createLead } = useWhatsAppLeads();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    
    const credentials = {
      email: formData.get('email') as string,
      password: formData.get('password') as string
    };

    const result = await login(credentials);
    if (!result.success) {
      setError(result.error || 'Login failed');
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    
    const credentials = {
      email: formData.get('email') as string,
      password: formData.get('password') as string,
      name: formData.get('name') as string,
      phone: formData.get('phone') as string
    };

    const result = await register(credentials);
    if (!result.success) {
      setError(result.error || 'Registration failed');
    }
  };

  const createSampleContact = async () => {
    try {
      setLoading(true);
      
      await createContact.mutateAsync({
        nome: 'Contato de Exemplo',
        email: 'exemplo@email.com',
        telefone: '(11) 99999-9999',
        empresa: 'Empresa Exemplo',
        objetivo: 'Teste de integração'
      });
      
      alert('Contato criado com sucesso!');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create contact');
    } finally {
      setLoading(false);
    }
  };

  if (authLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="max-w-md mx-auto space-y-6 p-6">
        <Card>
          <CardHeader>
            <CardTitle>Login to Sorriso Inteligente</CardTitle>
          </CardHeader>
          <CardContent>
            {(authError || error) && (
              <Alert className="mb-4">
                <AlertDescription>{authError || error}</AlertDescription>
              </Alert>
            )}
            
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Email</label>
                <input
                  name="email"
                  type="email"
                  required
                  className="w-full p-2 border rounded-md"
                  placeholder="your@email.com"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Password</label>
                <input
                  name="password"
                  type="password"
                  required
                  className="w-full p-2 border rounded-md"
                  placeholder="••••••••"
                />
              </div>
              
              <Button type="submit" className="w-full">
                Login
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Register New Account</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleRegister} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Name</label>
                <input
                  name="name"
                  type="text"
                  required
                  className="w-full p-2 border rounded-md"
                  placeholder="Your full name"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Email</label>
                <input
                  name="email"
                  type="email"
                  required
                  className="w-full p-2 border rounded-md"
                  placeholder="your@email.com"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Phone</label>
                <input
                  name="phone"
                  type="tel"
                  className="w-full p-2 border rounded-md"
                  placeholder="(11) 99999-9999"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Password</label>
                <input
                  name="password"
                  type="password"
                  required
                  className="w-full p-2 border rounded-md"
                  placeholder="••••••••"
                />
              </div>
              
              <Button type="submit" className="w-full">
                Register
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 p-6">
      {/* User Profile */}
      <Card>
        <CardHeader>
          <CardTitle className="flex justify-between items-center">
            Welcome, {user?.email}!
            <Button onClick={logout} variant="outline" size="sm">
              Logout
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <strong>Email:</strong> {user?.email}
            </div>
            <div>
              <strong>User ID:</strong> {user?.id}
            </div>
            <div>
              <strong>User Type:</strong> Authenticated User
            </div>
            <div>
              <strong>Session Active:</strong> {session ? 'Yes' : 'No'}
            </div>
          </div>
        </CardContent>
      </Card>

      {error && (
        <Alert>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Contacts Management */}
      <Card>
        <CardHeader>
          <CardTitle>Contacts ({contacts?.length || 0})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between items-center mb-4">
            <p className="text-sm text-gray-600">
              Manage your contacts in the database
            </p>
            <Button 
              onClick={createSampleContact}
              disabled={loading}
            >
              Create Sample Contact
            </Button>
          </div>
          
          {contacts && contacts.length > 0 ? (
            <div className="grid gap-4">
              {contacts.slice(0, 5).map((contact) => (
                <div key={contact.id} className="p-4 border rounded-lg">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold">{contact.nome}</h3>
                      <p className="text-sm text-gray-600">{contact.email}</p>
                      <p className="text-sm text-gray-600">{contact.telefone}</p>
                      {contact.empresa && (
                        <p className="text-sm text-gray-500">Company: {contact.empresa}</p>
                      )}
                    </div>
                    <span className={`px-2 py-1 rounded text-xs ${
                      contact.stage === 'complete' ? 'bg-green-100 text-green-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {contact.stage}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center text-gray-500">
              No contacts yet. Create your first contact above!
            </div>
          )}
        </CardContent>
      </Card>

      {/* WhatsApp Leads */}
      <Card>
        <CardHeader>
          <CardTitle>WhatsApp Leads ({leads?.length || 0})</CardTitle>
        </CardHeader>
        <CardContent>
          {leads && leads.length > 0 ? (
            <div className="space-y-4">
              {leads.slice(0, 3).map((lead) => (
                <div key={lead.id} className="p-4 border rounded-lg">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-semibold">
                        {lead.name || lead.lead_name || 'Unnamed Lead'}
                      </p>
                      <p className="text-sm text-gray-600">
                        Phone: {lead.phone || lead.number || 'N/A'}
                      </p>
                      {lead.created_at && (
                        <p className="text-sm text-gray-500">
                          Created: {new Date(lead.created_at).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center text-gray-500">
              No WhatsApp leads yet.
            </div>
          )}
        </CardContent>
      </Card>

      {/* Integration Status */}
      <Card>
        <CardHeader>
          <CardTitle>Supabase Integration Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="flex items-center space-x-2">
              <span className="w-2 h-2 bg-green-500 rounded-full"></span>
              <span>Authentication: Connected</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="w-2 h-2 bg-green-500 rounded-full"></span>
              <span>Database: Connected</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="w-2 h-2 bg-yellow-500 rounded-full"></span>
              <span>Real-time: Ready (not active)</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="w-2 h-2 bg-yellow-500 rounded-full"></span>
              <span>Chat System: Active</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SupabaseIntegrationExample;
