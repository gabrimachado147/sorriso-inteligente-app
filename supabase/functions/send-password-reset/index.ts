import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface PasswordResetRequest {
  email: string;
  resetUrl: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { email, resetUrl }: PasswordResetRequest = await req.json();

    console.log("Sending password reset email to:", email);
    console.log("Reset URL:", resetUrl);

    const emailResponse = await resend.emails.send({
      from: "Senhor Sorriso <onboarding@resend.dev>",
      to: [email],
      subject: "🦷 Redefinir Senha - Senhor Sorriso",
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Redefinir Senha</title>
        </head>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #0ea5e9; margin-bottom: 10px;">🦷 Senhor Sorriso</h1>
            <h2 style="color: #64748b; font-weight: normal;">Redefinição de Senha</h2>
          </div>
          
          <div style="background-color: #f8fafc; padding: 30px; border-radius: 10px; border-left: 4px solid #0ea5e9;">
            <p style="font-size: 16px; margin-bottom: 20px;">
              Olá! 👋
            </p>
            
            <p style="font-size: 16px; margin-bottom: 20px;">
              Recebemos uma solicitação para redefinir a senha da sua conta no <strong>Senhor Sorriso</strong>.
            </p>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${resetUrl}" 
                 style="background-color: #0ea5e9; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block; font-size: 16px;">
                🔑 Redefinir Minha Senha
              </a>
            </div>
            
            <p style="font-size: 14px; color: #64748b; margin-bottom: 15px;">
              <strong>Ou copie e cole este link no seu navegador:</strong>
            </p>
            <p style="background-color: #e2e8f0; padding: 10px; border-radius: 5px; font-family: monospace; font-size: 12px; word-break: break-all;">
              ${resetUrl}
            </p>
            
            <p style="font-size: 14px; color: #64748b; margin-top: 20px;">
              ⏰ Este link é válido por <strong>1 hora</strong> após o envio deste email.
            </p>
          </div>
          
          <div style="margin-top: 30px; padding: 20px; background-color: #fef2f2; border-radius: 10px; border-left: 4px solid #ef4444;">
            <p style="font-size: 14px; color: #dc2626; margin: 0;">
              <strong>⚠️ Importante:</strong> Se você não solicitou esta redefinição de senha, pode ignorar este email com segurança. Sua conta permanecerá protegida.
            </p>
          </div>
          
          <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e2e8f0;">
            <p style="font-size: 12px; color: #94a3b8; margin: 0;">
              Este email foi enviado pelo sistema <strong>Senhor Sorriso</strong><br>
              Sistema de agendamento odontológico inteligente
            </p>
          </div>
        </body>
        </html>
      `,
    });

    console.log("Email sent successfully:", emailResponse);

    return new Response(JSON.stringify({ success: true, emailResponse }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error) {
    console.error("Error in send-password-reset function:", error);
    return new Response(
      JSON.stringify({ error: (error as Error).message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
