import { useEffect } from 'react'
import { useRoutes, useLocation, useNavigate } from 'react-router-dom'
import { routes } from './router/routes'
import { useAppSelector } from './store/hooks'

function App() {

  const navigate = useNavigate()
  const location = useLocation()
  const routeElements = useRoutes(routes)
  const loggedInUser = useAppSelector(state => state.authModule.loggedInUser)

  // redirect to registration if not logged in
  useEffect(() => {
    if (!loggedInUser && location.pathname !== '/') {
      navigate('/', { replace: true })
    }
  }, [loggedInUser, location.pathname])

  return <> {routeElements} </>
}

export default App

// basic UI Layout:

// Registration ✅
// DashboardRegular
// DashboardWelcome
// BookingFlow
// AppointmentManagement

// a. make ui basic
// b. polish core
  // 1. qa your web
    // dont show time slots in the past
    // fix day with one timeslot disappear
    // enable on RegistrationVerification go back with browser arrow 
  // 2. handle error feedback to the user
  // 3. make sure the is loading states in pages
  // 4. add extra data and show in front
// c. polish ui
