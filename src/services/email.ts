const WEBHOOK_URL = import.meta.env.VITE_N8N_WEBHOOK_URL;

export interface RegistrationData {
  name: string;
  email: string;
  phone: string;
}

export interface AppointmentEmailData extends RegistrationData {
  clinic: string;
  service: string;
  date: string;
  time: string;
}

async function send(payload: any) {
  await fetch(WEBHOOK_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
}

export const emailService = {
  sendRegistration(data: RegistrationData) {
    return send({ type: 'registration', data });
  },
  sendAppointment(data: AppointmentEmailData) {
    return send({ type: 'appointment', data });
  }
};
