// src/router/routes.tsx
import { RouteObject } from 'react-router-dom'
import { Registration } from '../pages/Registration'
import { Dashboard } from '../pages/Dashboard'
import { BookingFlow } from '../pages/BookingFlow/BookingFlow'

export const routes: RouteObject[] = [
  {
    path: '/registration',
    element: <Registration />
  },

  // dashboard = homepage
  {
    path: '/',
    element: <Dashboard />
  },
  
  {
    path: '/dashboard',
    element: <Dashboard />
  },

  {
    path: '/booking-appointment',
    element: <BookingFlow />
  }
]
