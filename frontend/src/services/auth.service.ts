import { UserModel } from "@/models/user.model"
import { httpService } from "./http.service"


export const authService = {
    sendOtp,
    verifyOtp,
    logout,
    getLoggedInUser,
}


async function sendOtp(phone : string) : Promise<string | null> {
  try{
    return await httpService.post<string>('auth/send-otp', { phone })
  } catch(err) {
    console.log("It seems there was a proble sending you a password:", err)
    return null
  }

  
}

async function verifyOtp(phone : string, password : string) : Promise<UserModel | null> {
  try{
    const user = await httpService.post<UserModel>('auth/verify-otp', { phone, password })
    _saveLocalUser(user)
    return user

  } catch(err){
    console.log("Could't verify password:", err)
    return null
  }

}

async function logout() : Promise<void> {
  await httpService.post<void>('auth/logout')
  sessionStorage.removeItem('loggedInUser')
}

async function getLoggedInUser(): Promise<UserModel | null> {
  try {
    // check in session storage
    const userJson = sessionStorage.getItem('loggedInUser')
    if (userJson) {
      const user: UserModel = JSON.parse(userJson)
      return user
    }

    // if not in storage session, check cookie token
    const user = await httpService.get<UserModel>('auth/me')
    sessionStorage.setItem('loggedInUser', JSON.stringify(user))
    return user

  } catch (err) {
    console.log('No logged in user found:', err)
    return null
  }
}



function _saveLocalUser(user : UserModel) : UserModel {
	sessionStorage.setItem('loggedInUser', JSON.stringify(user))
	return user
}

