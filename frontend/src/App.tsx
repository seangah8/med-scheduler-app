import { httpService } from "./services/http.service"

function App() {

  // test connection with server
  async function testConnection(){
    const answer = await httpService.get('test')
    console.log(answer)
  } 
  testConnection()

  return (
    <>
      <h1>Medical Scheduler App</h1>
    </>
  )
}

export default App
