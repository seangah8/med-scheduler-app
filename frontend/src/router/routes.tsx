import { Navigate } from 'react-router-dom'
import { RouteObject } from 'react-router-dom'
import { Registration } from '../pages/Registration'
import { Dashboard } from '../pages/DashBoard'
import { BookingFlow } from '../pages/BookingFlow'
import { AppointmentManagement } from '../pages/AppointmentManagement'
import { NotFound } from '../pages/NotFound'

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

  {
    path: '*',
    element: <NotFound />
  }
]
