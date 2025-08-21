import { UserModel } from "@/models/user.model"
import { httpService } from "./http.service"


export const authService = {
    sendOtp,
    verifyOtp,
    logout,
    getLoggedinUser,
}


async function sendOtp(phone : string) : Promise<string | null> {
  try{
    return await httpService.post<string>('auth/send-otp', { phone })
  } catch(err) {
    console.error("It seems there was a proble sending you a password:", err)
    return null
  }
}

async function verifyOtp(phone : string, password : string) : Promise<UserModel | null> {
  try{
    const user = await httpService.post<UserModel>('auth/verify-otp', { phone, password })
    _saveLocalUser(user)
    return user

  } catch(err){
    console.error("Could't verify password:", err)
    return null
  }

}

async function logout() : Promise<void> {
  try{
    await httpService.post<void>('auth/logout')
    sessionStorage.removeItem('loggedInUser')

  } catch (err){
    console.error("Could not log out:", err)
  }

}

function getLoggedinUser(): UserModel | null{
  const userStr = sessionStorage.getItem('loggedInUser')
  if(!userStr) return null
  return JSON.parse(userStr)
}

function _saveLocalUser(user : UserModel) : UserModel {
	sessionStorage.setItem('loggedInUser', JSON.stringify(user))
	return user
}

