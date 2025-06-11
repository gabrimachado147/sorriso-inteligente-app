/**
 * Supabase Integration Example Component
 * Demonstrates how to use authentication and database services
 * Copy this code into your React components as needed
 */

import React, { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { appointmentService } from '../../services/supabase/appointments';
import { clinicService } from '../../services/supabase/clinics';
import type { Appointment, Clinic } from '../../integrations/supabase/types';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Alert, AlertDescription } from '../ui/alert';

export const SupabaseIntegrationExample: React.FC = () => {
  const {
    user,
    profile,
    loading: authLoading,
    error: authError,
    login,
    register,
    logout,
    isAuthenticated
  } = useAuth();

  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [clinics, setClinics] = useState<Clinic[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load data when user is authenticated
  useEffect(() => {
    if (isAuthenticated && user) {
      loadUserData();
    }
  }, [isAuthenticated, user, loadUserData]);

  const loadUserData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Load user appointments
      if (user?.id) {
        const userAppointments = await appointmentService.getUserAppointments(user.id);
        setAppointments(userAppointments);
      }

      // Load available clinics
      const availableClinics = await clinicService.getAll();
      setClinics(availableClinics);

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load data');
    } finally {
      setLoading(false);
    }
  };

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

  const bookAppointment = async (clinicId: string) => {
    if (!user) return;

    try {
      setLoading(true);
      
      const appointmentData = {
        patient_id: user.id,
        dentist_id: 'default-dentist-id', // This should come from selected dentist
        clinic_id: clinicId,
        service_id: 'cleaning-service', // This should come from selected service
        appointment_date: new Date('2024-12-31T14:00:00').toISOString(),
        status: 'scheduled' as const,
        notes: 'Regular checkup appointment'
      };

      const newAppointment = await appointmentService.create(appointmentData);
      
      if (newAppointment) {
        setAppointments(prev => [...prev, newAppointment]);
        alert('Appointment booked successfully!');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to book appointment');
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
            Welcome, {profile?.full_name || user?.email}!
            <Button onClick={logout} variant="outline" size="sm">
              Logout
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <strong>Email:</strong> {profile?.email}
            </div>
            <div>
              <strong>Phone:</strong> {profile?.phone || 'Not provided'}
            </div>
            <div>
              <strong>User Type:</strong> Patient
            </div>
            <div>
              <strong>Member Since:</strong> {profile?.created_at ? new Date(profile.created_at).toLocaleDateString() : 'N/A'}
            </div>
          </div>
        </CardContent>
      </Card>

      {error && (
        <Alert>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Available Clinics */}
      <Card>
        <CardHeader>
          <CardTitle>Available Clinics</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center">Loading clinics...</div>
          ) : clinics.length > 0 ? (
            <div className="grid gap-4">
              {clinics.map((clinic) => (
                <div key={clinic.id} className="p-4 border rounded-lg">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold">{clinic.name}</h3>
                      <p className="text-sm text-gray-600">{clinic.address}</p>
                      <p className="text-sm text-gray-600">{clinic.city}, {clinic.state}</p>
                      <p className="text-sm">
                        ⭐ {clinic.rating} ({clinic.total_reviews} reviews)
                      </p>
                    </div>
                    <Button 
                      onClick={() => bookAppointment(clinic.id)}
                      disabled={loading}
                    >
                      Book Appointment
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center text-gray-500">
              No clinics available. Make sure you've loaded the sample data.
            </div>
          )}
        </CardContent>
      </Card>

      {/* User Appointments */}
      <Card>
        <CardHeader>
          <CardTitle>Your Appointments</CardTitle>
        </CardHeader>
        <CardContent>
          {appointments.length > 0 ? (
            <div className="space-y-4">
              {appointments.map((appointment) => (
                <div key={appointment.id} className="p-4 border rounded-lg">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-semibold">
                        {appointment.appointment_date} at {appointment.appointment_time}
                      </p>
                      <p className="text-sm text-gray-600">
                        Status: <span className="capitalize">{appointment.status}</span>
                      </p>
                      {appointment.notes && (
                        <p className="text-sm text-gray-600">
                          Notes: {appointment.notes}
                        </p>
                      )}
                    </div>
                    <span className={`px-2 py-1 rounded text-xs ${
                      appointment.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                      appointment.status === 'completed' ? 'bg-blue-100 text-blue-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {appointment.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center text-gray-500">
              No appointments yet. Book your first appointment above!
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
              <span>PWA Sync: Ready (not active)</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SupabaseIntegrationExample;
