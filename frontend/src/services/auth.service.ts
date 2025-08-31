import { toast } from 'react-toastify'
import { UserModel } from "@/models/user.model"
import { httpService } from "./http.service"


export const authService = {
    sendOtp,
    verifyOtp,
    logout,
    getLoggedinUser,
    saveLocalIsUserNew,
    getIsUserNew,
}


async function sendOtp(phone : string) : Promise<string | null> {
  try{
    return await httpService.post<string>('auth/send-otp', { phone })

  } catch(err) {
    import.meta.env.MODE === "development"
    ? console.error("It seems there was a proble sending you a password:", err)
    : toast.error("Something went wrong, please try again.")

    return null
  }
}

async function verifyOtp(phone : string, password : string) : Promise<UserModel | null> {

  try{
    const {user, isUserNew}  = await httpService.post<{user: UserModel, isUserNew: boolean}>('auth/verify-otp', { phone, password })
    _saveLocalUser(user)
    saveLocalIsUserNew(isUserNew)
    return user

  } catch(err){
    import.meta.env.MODE === "development"
    ? console.error("Could't verify password:", err)
    : toast.error("Something went wrong, please try again.")
    return null
  }

}

async function logout() : Promise<void> {
  try{
    await httpService.post<void>('auth/logout')
    sessionStorage.removeItem('loggedInUser')
    sessionStorage.removeItem('isUserNew')
    sessionStorage.removeItem('bookingFlow')

  } catch (err){
    import.meta.env.MODE === "development"
    ? console.error("Could not log out:", err)
    : toast.error("Something went wrong, please try again.")
  }

}

function getLoggedinUser(): UserModel | null{
  const userStr = sessionStorage.getItem('loggedInUser')
  if(!userStr) return null
  return JSON.parse(userStr)
}

function saveLocalIsUserNew(isUserNew: boolean) : boolean{
  if(import.meta.env.MODE === "development")
    sessionStorage.setItem('isUserNew', JSON.stringify(isUserNew))
  return isUserNew
}

function getIsUserNew(): boolean | null{
  const isUserNew = sessionStorage.getItem('isUserNew')
  if(!isUserNew) return null
  return JSON.parse(isUserNew)
}

function _saveLocalUser(user : UserModel) : UserModel {
	sessionStorage.setItem('loggedInUser', JSON.stringify(user))
	return user
}

