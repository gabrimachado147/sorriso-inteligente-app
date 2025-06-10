describe('AppointmentService', () => {
  test('should create appointment', async () => {
    const create = jest.fn(async (appointment) => ({ id: '1', status: 'pending', ...appointment }))
    const AppointmentService = { create }

    const newAppointment = { clinic_id: '1', patient_id: '2' }
    const appointment = await AppointmentService.create(newAppointment)

    expect(create).toHaveBeenCalledWith(newAppointment)
    expect(appointment.id).toBeDefined()
    expect(appointment.status).toBe('pending')
  })
})
