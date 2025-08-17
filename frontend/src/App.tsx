import { useRoutes, useLocation, Navigate } from 'react-router-dom'
import { routes } from './router/routes'
import { useAppSelector } from './store/hooks'

function App() {

  const location = useLocation()
  const routeElements = useRoutes(routes)
  const loggedInUser = useAppSelector(state => state.authModule.loggedInUser)

  // redirect to registration if not logged in
  if (!loggedInUser && location.pathname !== '/registration') {
    return <Navigate to="/registration" replace />
  }

  console.log('loggedInUser', loggedInUser)

  return <> {routeElements} </>
}

export default App
