// src/router/routes.tsx
import { RouteObject } from 'react-router-dom'
import { Registration } from '../pages/Registration'
import { Dashboard } from '../pages/Dashboard'

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
  }
]
