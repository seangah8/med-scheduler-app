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

// final fixes

// 1. in appointment managment if something goes wrong with action buttons make sure user can try again
// 2. when looking at upcoming appointments, remove the startDate and endDate at filter
// 3. make sure its ok from backend to not having doctors in medical field (dont throw error)

// 4. change soonest doctor to another word
// 5. if downloading pdf goes wrong show message on page for the user
// 6. make log middleware only be in necceray routs
// 7. add to create appointment buttons icon of +
// 8. when caceling appointment and its not working make sure the button dont say back to home page




