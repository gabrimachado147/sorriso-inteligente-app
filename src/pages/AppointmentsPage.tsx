
import React, { useState, useMemo } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Calendar, User, MapPin, Activity, LogOut } from 'lucide-react'
import { useAppointments } from '@/hooks/useAppointments'
import { EnhancedSkeleton } from '@/components/ui/enhanced-skeleton'
import { animations } from '@/lib/animations'
import { StaffLogin, CLINIC_NAMES } from '@/components/Auth/StaffLogin'
import { AppointmentsTable } from '@/components/Appointments/AppointmentsTable'
import { AppointmentsFilters } from '@/components/Appointments/AppointmentsFilters'

const AppointmentsPage = () => {
  const [loggedInUser, setLoggedInUser] = useState<string | null>(
    localStorage.getItem('staff_logged_in')
  )
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedClinic, setSelectedClinic] = useState('all')
  const [selectedStatus, setSelectedStatus] = useState('all')
  const [selectedDate, setSelectedDate] = useState('')

  const { appointments, isLoading, stats, statsLoading, updateAppointmentStatus } = useAppointments()

  const handleLogin = (username: string) => {
    setLoggedInUser(username)
    localStorage.setItem('staff_logged_in', username)
  }

  const handleLogout = () => {
    setLoggedInUser(null)
    localStorage.removeItem('staff_logged_in')
  }

  // Filter appointments based on user's clinic
  const userClinicName = loggedInUser ? CLINIC_NAMES[loggedInUser as keyof typeof CLINIC_NAMES] : ''
  
  const filteredAppointments = useMemo(() => {
    let filtered = appointments

    // Filter by user's clinic first (only show appointments for their clinic)
    if (loggedInUser && userClinicName) {
      filtered = filtered.filter(apt => {
        // Check if appointment clinic matches the user's clinic
        const appointmentClinic = apt.clinic.toLowerCase()
        const userClinicKey = loggedInUser.toLowerCase()
        const userClinicFullName = userClinicName.toLowerCase()
        
        // Match by clinic key (e.g., "campobelo") or full clinic name
        return appointmentClinic.includes(userClinicKey) || 
               appointmentClinic.includes(userClinicFullName) ||
               apt.clinic === userClinicName
      })
    }

    // Apply additional filters
    if (searchTerm) {
      const search = searchTerm.toLowerCase()
      filtered = filtered.filter(apt => 
        apt.name.toLowerCase().includes(search) ||
        apt.phone.includes(search) ||
        apt.email?.toLowerCase().includes(search) ||
        apt.service.toLowerCase().includes(search)
      )
    }

    if (selectedClinic !== 'all') {
      filtered = filtered.filter(apt => apt.clinic === selectedClinic)
    }

    if (selectedStatus !== 'all') {
      filtered = filtered.filter(apt => apt.status === selectedStatus)
    }

    if (selectedDate) {
      filtered = filtered.filter(apt => apt.date === selectedDate)
    }

    return filtered
  }, [appointments, loggedInUser, userClinicName, searchTerm, selectedClinic, selectedStatus, selectedDate])

  // Get unique clinics from filtered appointments for filter (only show user's clinic)
  const availableClinics = useMemo(() => {
    if (loggedInUser && userClinicName) {
      // Only show the user's clinic in the filter
      const userAppointments = appointments.filter(apt => {
        const appointmentClinic = apt.clinic.toLowerCase()
        const userClinicKey = loggedInUser.toLowerCase()
        const userClinicFullName = userClinicName.toLowerCase()
        
        return appointmentClinic.includes(userClinicKey) || 
               appointmentClinic.includes(userClinicFullName) ||
               apt.clinic === userClinicName
      })
      
      const clinics = new Set(userAppointments.map(apt => apt.clinic))
      return Array.from(clinics).sort()
    }
    
    const clinics = new Set(appointments.map(apt => apt.clinic))
    return Array.from(clinics).sort()
  }, [appointments, loggedInUser, userClinicName])

  const handleStatusChange = (appointmentId: string, newStatus: 'confirmed' | 'cancelled' | 'completed' | 'no_show') => {
    updateAppointmentStatus.mutate({ appointmentId, status: newStatus })
  }

  if (!loggedInUser) {
    return <StaffLogin onLogin={handleLogin} />
  }

  if (isLoading) {
    return (
      <div className="p-6 space-y-6">
        <EnhancedSkeleton variant="card" count={3} />
      </div>
    )
  }

  return (
    <div className={`p-6 space-y-6 ${animations.pageEnter}`}>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Calendar className="h-6 w-6 text-primary" />
            Agendamentos - {userClinicName}
          </h1>
          <p className="text-gray-600 mt-1">
            Logado como: <span className="font-medium">{loggedInUser}</span>
          </p>
        </div>
        <Button variant="outline" onClick={handleLogout} className="flex items-center gap-2">
          <LogOut className="h-4 w-4" />
          Sair
        </Button>
      </div>

      {/* Estatísticas */}
      {!statsLoading && stats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className={animations.fadeIn}>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Activity className="h-5 w-5 text-blue-500" />
                <div>
                  <p className="text-sm text-gray-600">Total</p>
                  <p className="text-2xl font-bold">{filteredAppointments.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className={animations.fadeIn}>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-green-500" />
                <div>
                  <p className="text-sm text-gray-600">Hoje</p>
                  <p className="text-2xl font-bold">
                    {filteredAppointments.filter(apt => 
                      apt.date === new Date().toISOString().split('T')[0]
                    ).length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className={animations.fadeIn}>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <User className="h-5 w-5 text-blue-500" />
                <div>
                  <p className="text-sm text-gray-600">Confirmados</p>
                  <p className="text-2xl font-bold">
                    {filteredAppointments.filter(apt => apt.status === 'confirmed').length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className={animations.fadeIn}>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <MapPin className="h-5 w-5 text-red-500" />
                <div>
                  <p className="text-sm text-gray-600">Cancelados</p>
                  <p className="text-2xl font-bold">
                    {filteredAppointments.filter(apt => apt.status === 'cancelled').length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Filtros */}
      <AppointmentsFilters
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        selectedClinic={selectedClinic}
        onClinicChange={setSelectedClinic}
        selectedStatus={selectedStatus}
        onStatusChange={setSelectedStatus}
        selectedDate={selectedDate}
        onDateChange={setSelectedDate}
        clinics={availableClinics}
        totalCount={appointments.length}
        filteredCount={filteredAppointments.length}
      />

      {/* Tabela de Agendamentos */}
      <AppointmentsTable
        appointments={filteredAppointments}
        onStatusChange={handleStatusChange}
        isUpdating={updateAppointmentStatus.isPending}
      />
    </div>
  )
}

export default AppointmentsPage
