
import { useState, useEffect } from 'react';
import { useAuth } from './useAuth';
import { supabase } from '@/integrations/supabase/client';

interface NotificationPreferences {
  id?: string;
  email_reminders: boolean;
  sms_reminders: boolean;
  push_notifications: boolean;
  marketing_emails: boolean;
}

export const useNotificationPreferences = () => {
  const { user, isAuthenticated } = useAuth();
  const [preferences, setPreferences] = useState<NotificationPreferences | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadPreferences = async () => {
      if (!isAuthenticated || !user) {
        setPreferences(null);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        const { data, error } = await supabase
          .from('notification_preferences')
          .select('*')
          .eq('user_id', user.id)
          .single();

        if (error && error.code !== 'PGRST116') {
          throw error;
        }

        if (data) {
          setPreferences({
            id: data.id,
            email_reminders: data.email_reminders ?? true,
            sms_reminders: data.sms_reminders ?? true,
            push_notifications: data.push_notifications ?? true,
            marketing_emails: data.marketing_emails ?? false
          });
        } else {
          // Create default preferences
          const defaultPrefs = {
            user_id: user.id,
            email_reminders: true,
            sms_reminders: true,
            push_notifications: true,
            marketing_emails: false
          };

          const { data: newPrefs, error: createError } = await supabase
            .from('notification_preferences')
            .insert(defaultPrefs)
            .select()
            .single();

          if (createError) throw createError;
          setPreferences({
            id: newPrefs.id,
            email_reminders: newPrefs.email_reminders ?? true,
            sms_reminders: newPrefs.sms_reminders ?? true,
            push_notifications: newPrefs.push_notifications ?? true,
            marketing_emails: newPrefs.marketing_emails ?? false
          });
        }
      } catch (err) {
        console.error('Error loading notification preferences:', err);
        setError('Erro ao carregar preferências');
      } finally {
        setLoading(false);
      }
    };

    loadPreferences();
  }, [user, isAuthenticated]);

  const updatePreferences = async (updates: Partial<NotificationPreferences>) => {
    if (!user || !preferences) return;

    try {
      setError(null);

      const { data, error } = await supabase
        .from('notification_preferences')
        .update(updates)
        .eq('user_id', user.id)
        .select()
        .single();

      if (error) throw error;
      setPreferences({
        id: data.id,
        email_reminders: data.email_reminders ?? true,
        sms_reminders: data.sms_reminders ?? true,
        push_notifications: data.push_notifications ?? true,
        marketing_emails: data.marketing_emails ?? false
      });
      return { success: true };
    } catch (err) {
      console.error('Error updating notification preferences:', err);
      setError('Erro ao atualizar preferências');
      return { success: false, error: 'Erro ao atualizar preferências' };
    }
  };

  return {
    preferences,
    loading,
    error,
    updatePreferences,
    clearError: () => setError(null)
  };
};
