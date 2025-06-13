
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    console.log('Processing reminders...');

    // Buscar lembretes pendentes
    const { data: reminders, error: remindersError } = await supabase
      .from('reminders')
      .select(`
        *,
        appointments(
          id,
          name,
          phone,
          date,
          time,
          clinic,
          service
        )
      `)
      .eq('status', 'pending');

    if (remindersError) {
      throw remindersError;
    }

    const now = new Date();
    const processedReminders = [];

    for (const reminder of reminders || []) {
      const appointment = reminder.appointments;
      if (!appointment) continue;

      const appointmentDateTime = new Date(`${appointment.date}T${appointment.time}`);
      const timeDiff = appointmentDateTime.getTime() - now.getTime();
      const hoursDiff = timeDiff / (1000 * 60 * 60);

      let shouldSend = false;
      
      switch (reminder.reminder_type) {
        case '24h':
          shouldSend = hoursDiff <= 24 && hoursDiff > 2;
          break;
        case '2h':
          shouldSend = hoursDiff <= 2 && hoursDiff > 0.5;
          break;
        case '30min':
          shouldSend = hoursDiff <= 0.5 && hoursDiff > 0;
          break;
      }

      if (shouldSend) {
        // Construir mensagem
        const timeText = {
          '24h': '24 horas',
          '2h': '2 horas',
          '30min': '30 minutos'
        }[reminder.reminder_type] || reminder.reminder_type;

        const message = `🦷 Lembrete: Sua consulta na ${appointment.clinic} está em ${timeText}!

📅 Data: ${new Date(appointment.date).toLocaleDateString('pt-BR')}
🕐 Horário: ${appointment.time}
⚕️ Serviço: ${appointment.service}

Por favor, chegue 15 minutos antes do horário.

Sorriso Inteligente App`;

        let success = false;

        // Enviar lembrete baseado no método
        if (reminder.method === 'whatsapp') {
          // Integração com WhatsApp API
          try {
            const webhookResponse = await fetch('https://n8nwebhook.enigmabot.store/webhook/9598a25e-5915-4fe1-b136-90cbcc05bbe0', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                phone: appointment.phone,
                message: message,
                sessionId: `reminder_${reminder.id}`,
                threadId: `thread_reminder_${reminder.id}`
              })
            });

            success = webhookResponse.ok;
            console.log(`WhatsApp reminder sent to ${appointment.phone}: ${success}`);
          } catch (error) {
            console.error('Error sending WhatsApp reminder:', error);
            success = false;
          }
        } else if (reminder.method === 'push') {
          // Simular envio de push notification
          console.log(`Push notification sent: ${message}`);
          success = true;
        }

        // Atualizar status do lembrete
        const { error: updateError } = await supabase
          .from('reminders')
          .update({
            status: success ? 'sent' : 'failed',
            sent_at: new Date().toISOString()
          })
          .eq('id', reminder.id);

        if (updateError) {
          console.error('Error updating reminder status:', updateError);
        }

        processedReminders.push({
          id: reminder.id,
          status: success ? 'sent' : 'failed',
          method: reminder.method
        });
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        processed: processedReminders.length,
        reminders: processedReminders
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );

  } catch (error) {
    console.error('Error processing reminders:', error);
    
    return new Response(
      JSON.stringify({
        error: error.message,
        success: false
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    );
  }
});
