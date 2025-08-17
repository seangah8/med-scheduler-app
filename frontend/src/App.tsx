import { useRoutes } from 'react-router-dom'
import { routes } from './router/routes'

function App() {

  const routeElements = useRoutes(routes)
  return <> {routeElements} </>
}

export default App
