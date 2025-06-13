
import { useState, useEffect } from 'react';
import { useAuth } from './useAuth';
import { supabase } from '@/integrations/supabase/client';

interface NotificationPreferences {
  id: string;
  user_id: string;
  email_reminders: boolean;
  push_notifications: boolean;
  sms_reminders: boolean;
  marketing_emails: boolean;
  created_at: string;
  updated_at: string;
}

export const useNotificationPreferences = () => {
  const { user } = useAuth();
  const [preferences, setPreferences] = useState<NotificationPreferences | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchPreferences = async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('notification_preferences')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching preferences:', error);
        return;
      }

      if (data) {
        const formattedData: NotificationPreferences = {
          id: data.id,
          user_id: data.user_id,
          email_reminders: data.email_reminders ?? true,
          push_notifications: data.push_notifications ?? true,
          sms_reminders: data.sms_reminders ?? true,
          marketing_emails: data.marketing_emails ?? false,
          created_at: data.created_at,
          updated_at: data.updated_at
        };
        setPreferences(formattedData);
      } else {
        // Criar preferências padrão se não existirem
        const defaultPreferences = {
          user_id: user.id,
          email_reminders: true,
          push_notifications: true,
          sms_reminders: true,
          marketing_emails: false
        };

        const { data: newData, error: createError } = await supabase
          .from('notification_preferences')
          .insert(defaultPreferences)
          .select()
          .single();

        if (!createError && newData) {
          const formattedNewData: NotificationPreferences = {
            id: newData.id,
            user_id: newData.user_id,
            email_reminders: newData.email_reminders ?? true,
            push_notifications: newData.push_notifications ?? true,
            sms_reminders: newData.sms_reminders ?? true,
            marketing_emails: newData.marketing_emails ?? false,
            created_at: newData.created_at,
            updated_at: newData.updated_at
          };
          setPreferences(formattedNewData);
        }
      }
    } catch (error) {
      console.error('Error in fetchPreferences:', error);
    } finally {
      setLoading(false);
    }
  };

  const updatePreferences = async (updates: Partial<NotificationPreferences>) => {
    if (!user || !preferences) {
      return { success: false, error: 'User not authenticated or preferences not loaded' };
    }

    try {
      const { data, error } = await supabase
        .from('notification_preferences')
        .update(updates)
        .eq('user_id', user.id)
        .select()
        .single();

      if (error) {
        console.error('Error updating preferences:', error);
        return { success: false, error: error.message };
      }

      if (data) {
        const formattedData: NotificationPreferences = {
          id: data.id,
          user_id: data.user_id,
          email_reminders: data.email_reminders ?? true,
          push_notifications: data.push_notifications ?? true,
          sms_reminders: data.sms_reminders ?? true,
          marketing_emails: data.marketing_emails ?? false,
          created_at: data.created_at,
          updated_at: data.updated_at
        };
        setPreferences(formattedData);
        return { success: true, data: formattedData };
      }

      return { success: false, error: 'No data returned' };
    } catch (error) {
      console.error('Error in updatePreferences:', error);
      return { success: false, error: 'Internal error' };
    }
  };

  useEffect(() => {
    fetchPreferences();
  }, [user]);

  return {
    preferences,
    loading,
    updatePreferences,
    refetch: fetchPreferences
  };
};
