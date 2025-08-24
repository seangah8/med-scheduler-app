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


// 1. seperate components that will be shown seperatly:
  // send and verify otp (add on verify otp cmp "did not get a code, try again" )
  // dashboard regular vs new user


// a. finish core
// b. make ui basic
// c. polish core
  // 1. qa your web
    // dont show time slots in the past
    // fix day with one timeslot disappear
  // 2. handle error feedback to the user
  // 3. make sure the is loading states in pages
  // 4. add extra data and show in front
// d. polish ui
