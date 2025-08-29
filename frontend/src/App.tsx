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

// extra features

// 1. Book Appointments for Family Members
  // add to users idNumber value
  // add in seeding idNumber
  // when user register and id input and make sure in front and back its valid
  // add membersId[] into user schema
  // make phone number optional
  // add page for adding members and at the end of form create user without number
  // if user register and he doesnt has number update add the phone
  // in booking flow add so you can appoint for one of your members
  // in dashboard update filter to choose member
  // update seeding with members[] 

// 2. Symptom-to-Field Helper (Open AI)

// 3. Advanced Appointment Filtering & Search
  // filter with medical field
  // filter by date range
  // (mabye) button for expand appointments

// 4. Add to Calendar Button (Google) on appointment confirmation
// 5. Button on header navigate to goole map hospital location 
// 6. replace loading text with centered icon
