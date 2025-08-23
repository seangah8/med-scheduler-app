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

// 1. create appointments table in dashboard ✅
// 2. make so you can see doctor + field names ✅
// 3. have an upcoming / past filter ✅

// 4. on click go to appointment managment teroght url link  ✅
// 5. re-fech doctor and field names from backend ✅
// 6. be able to cancel appointments ✅
// 7. be able to rescesule appointments

// 8. make in booking flow so going back will go back in the flow
// 9. create / take from library component an input+scroll comp 
// and use it in booking flow 
// 10. hable error feedback to the user
// 11. make sure the is loading states in pages
// 12. add extra data and show in front

// b. make ui
// c. deliver exstra optional featurs
// d. deployment
// e. presetaition practice
