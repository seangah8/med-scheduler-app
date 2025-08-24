import { Navigate } from 'react-router-dom'
import { RouteObject } from 'react-router-dom'
import { Registration } from '../pages/Registration/Registration'
import { Dashboard } from '../pages/DashBoard/Dashboard'
import { BookingFlow } from '../pages/BookingFlow/BookingFlow'
import { AppointmentManagement } from '../pages/AppointmentManagement/AppointmentManagement'

export const routes: RouteObject[] = [

  {
    path: '/',
    element: <Registration />
  },

  {
    path: '/registration',
    element: <Registration />
  },
  
  {
    path: '/dashboard',
    element: <Dashboard />
  },

  {
    path: '/booking-appointment/:step',
    element: <BookingFlow />
  },

  {
    path: '/booking-appointment',
    element: <Navigate to="/booking-appointment/medical_field" replace />
  },

  {
    path: '/appointment/:id',
    element: <AppointmentManagement />
  },
]
