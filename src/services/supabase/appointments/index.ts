
import { AppointmentQueries } from './queries';
import { AppointmentMutations } from './mutations';
import { AppointmentAnalytics } from './analytics';

export class RealAppointmentService {
  // Query methods
  static getAllAppointments = AppointmentQueries.getAllAppointments;
  static getAppointmentsByPhone = AppointmentQueries.getAppointmentsByPhone;
  static getUserAppointments = AppointmentQueries.getUserAppointments;

  // Mutation methods
  static createAppointment = AppointmentMutations.createAppointment;
  static updateAppointmentStatus = AppointmentMutations.updateAppointmentStatus;
  static linkUserAppointment = AppointmentMutations.linkUserAppointment;

  // Analytics methods
  static getAppointmentStats = AppointmentAnalytics.getAppointmentStats;
}

// Export types
export type {
  RealAppointmentRecord,
  CreateRealAppointmentData,
  AppointmentStatus
} from './types';
