// src/router/routes.tsx
import { RouteObject } from 'react-router-dom'
import { Registration } from '../pages/Registration'
import { Dashboard } from '../pages/DashBoard/Dashboard'
import { BookingFlow } from '../pages/BookingFlow/BookingFlow'
import { AppointmentManagement } from '../pages/AppointmentManagement'

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
    path: '/booking-appointment',
    element: <BookingFlow />
  },

    {
    path: '/appointment/:id',
    element: <AppointmentManagement />
  },
]
