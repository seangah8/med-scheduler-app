import { UserModel } from "./models/user.model"
import { httpService } from "./services/http.service"

function App() {
 
  
  async function testApis(phone : string){

    // test getting otp from server
    const otp : string = await httpService.post('auth/send-otp', { phone })
    console.log('otp', otp)

    // test verify otp from server
    const loggedInUser : UserModel = await httpService.
      post('auth/verify-otp', {phone, password: otp})
    console.log('loggedInUser', loggedInUser)

    // test logging out
    await httpService.post('auth/logout', {})
    console.log('user logged out')
  } 

  testApis('0549199728')

  return (
    <>
      <h1>Medical Scheduler App</h1>
    </>
  )
}

export default App
