import { useRoutes, useLocation, Navigate } from 'react-router-dom'
import { routes } from './router/routes'
import { useSelector } from 'react-redux'
import { RootState } from './store/store'

function App() {

  const location = useLocation()
  const routeElements = useRoutes(routes)
  const loggedInUser = useSelector((storeState : RootState) => 
        storeState.authModule.loggedInUser)

  // redirect to registration if not logged in
  if (!loggedInUser && location.pathname !== '/registration') {
    return <Navigate to="/registration" replace />
  }

  return <> {routeElements} </>
}

export default App
