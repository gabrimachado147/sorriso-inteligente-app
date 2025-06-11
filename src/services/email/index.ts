export interface RegistrationEmail {
  name: string;
  email: string;
  phone: string;
}

export interface AppointmentEmail {
  name: string;
  email: string;
  phone: string;
  clinic: string;
  service: string;
  date: string;
  time: string;
}

const API_URL = '/api/send-email';

export const emailService = {
  async sendRegistration(data: RegistrationEmail) {
    try {
      await fetch(API_URL + '/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
    } catch (err) {
      console.error('Failed to send registration email', err);
    }
  },
  async sendAppointment(data: AppointmentEmail) {
    try {
      await fetch(API_URL + '/appointment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
    } catch (err) {
      console.error('Failed to send appointment email', err);
    }
  }
};
