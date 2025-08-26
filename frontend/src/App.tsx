import { useEffect, useState, useLayoutEffect } from 'react'
import { useRoutes, useLocation, useNavigate } from 'react-router-dom'
import { routes } from './router/routes'
import { useAppSelector } from './store/hooks'
import { AppHeader } from './components/AppHeader'


function App() {

  const navigate = useNavigate()
  const location = useLocation()
  const routeElements = useRoutes(routes)
  const loggedInUser = useAppSelector(state => state.authModule.loggedInUser)
  const [isUnderRegistration, setIsUnderRegistration] = useState<boolean>(false)

  useLayoutEffect(() => {
    const registrationPaths = ['/', '/registration']
    setIsUnderRegistration(registrationPaths.includes(location.pathname))
  }, [location.pathname])

  // redirect to registration if not logged in
  useEffect(() => {
    if (!loggedInUser && !isUnderRegistration) {
      navigate('/', { replace: true })
    }
  }, [loggedInUser, location.pathname])

  return (

    <section className='app' style={!isUnderRegistration ? {width: '75%'} : undefined}> 

      {/* show app header all the time but the registration page*/}
      { 
        !isUnderRegistration &&
        <AppHeader/>
      }

      {routeElements} 

    </section>
  )
}

export default App

// 1. qa your web
  // dont show time slots in the past
  // fix so day with one timeslot wont disappear
  // enable on RegistrationVerification go back with browser arrow 
  // (mabye) replace in booking flow session -> urls 
  // make buttons of confirmation to load and be disable
  // add "back to home page button next to logout"
  // remove prev and next buttons in first/last pages
// 2. add extra data and show in front
  // 
// 3. handle error feedback to the user
// 4. make sure the is loading states in pages



// a. polish core
// b. polish ui
