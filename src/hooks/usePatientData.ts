
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface Patient {
  id: string;
  name: string;
  phone: string;
  email?: string;
  lastAppointment?: string;
  status: 'active' | 'inactive' | 'pending';
  city?: string;
  createdAt: string;
}

interface UsePatientDataReturn {
  patients: Patient[];
  loading: boolean;
  error: string | null;
  createPatient: (patient: Omit<Patient, 'id' | 'createdAt'>) => Promise<void>;
  updatePatient: (id: string, patient: Partial<Patient>) => Promise<void>;
  deletePatient: (id: string) => Promise<void>;
  refetch: () => Promise<void>;
}

export const usePatientData = (): UsePatientDataReturn => {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPatients = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Mock data for now - replace with actual Supabase query
      const mockPatients: Patient[] = [
        {
          id: '1',
          name: 'Maria Silva',
          phone: '(11) 99999-9999',
          email: 'maria@email.com',
          lastAppointment: '2024-01-15',
          status: 'active',
          city: 'São Paulo',
          createdAt: '2024-01-01'
        },
        {
          id: '2',
          name: 'João Santos',
          phone: '(11) 88888-8888',
          status: 'pending',
          city: 'São Paulo',
          createdAt: '2024-01-02'
        }
      ];
      
      setPatients(mockPatients);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro desconhecido');
    } finally {
      setLoading(false);
    }
  };

  const createPatient = async (patient: Omit<Patient, 'id' | 'createdAt'>) => {
    try {
      setError(null);
      // Mock implementation - replace with actual Supabase insert
      const newPatient: Patient = {
        ...patient,
        id: Date.now().toString(),
        createdAt: new Date().toISOString()
      };
      setPatients(prev => [...prev, newPatient]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao criar paciente');
      throw err;
    }
  };

  const updatePatient = async (id: string, updatedPatient: Partial<Patient>) => {
    try {
      setError(null);
      // Mock implementation - replace with actual Supabase update
      setPatients(prev => 
        prev.map(patient => 
          patient.id === id ? { ...patient, ...updatedPatient } : patient
        )
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao atualizar paciente');
      throw err;
    }
  };

  const deletePatient = async (id: string) => {
    try {
      setError(null);
      // Mock implementation - replace with actual Supabase delete
      setPatients(prev => prev.filter(patient => patient.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao deletar paciente');
      throw err;
    }
  };

  const refetch = async () => {
    await fetchPatients();
  };

  useEffect(() => {
    fetchPatients();
  }, []);

  return {
    patients,
    loading,
    error,
    createPatient,
    updatePatient,
    deletePatient,
    refetch
  };
};
