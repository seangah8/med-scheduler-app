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

// 1. clear calendar interface
  // handle timezone considerations

// 2. for new users: 
  // welcome message 
  // clear call to action to start booking their first appointment
  // quick overview of available medical services that our facility provide

// 3. cancel + rescedule
  // confirmation notification for canceling + reschedule appointments
  // make so cancel and rescedule modals wont open at the same time
  // when canceling -> move to dashboard, when rescedule -> update the time in front
  // remove cancle and rescedule buttons in completed appointmens

// 4. add details for appointments and show in booking flow and appointmemt managment

// 5. make send and verify otp in seperate components that will be shown seperatly


// a. finish core
// b. make ui basic
// c. polish core
  // 1. handle error feedback to the user
  // 2. make sure the is loading states in pages
  // 3. qa your web
  // 3. add extra data and show in front
// d. polish ui
