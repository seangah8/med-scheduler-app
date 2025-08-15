import { httpService } from "./services/http.service"

function App() {
 
  // test getting otp from server
  async function getOtp(){
    const otp : string = await httpService.post('auth/send-otp', {phone: '0512345675'})
    console.log('otp', otp)
  } 
  getOtp()

  return (
    <>
      <h1>Medical Scheduler App</h1>
    </>
  )
}

export default App
