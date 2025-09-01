import { toast } from 'react-toastify'
import { AuthActionsType } from "../interfaces/auth.store"
import { authService } from "../../services/auth.service"
import { UserModel } from "@/models/user.model"
import { AppThunk } from "../store"

export const authThunks = {
    login,
    logout,
    updateUserToRegular,
}

function login(phone: string, password: string): AppThunk<Promise<UserModel | null>>{

    return async function (dispatch) {
        try {
            const user = await authService.verifyOtp(phone, password)
            dispatch({
                type: AuthActionsType.SET_USER,
                loggedInUser: user,
            })
            return user

        } catch (err) {
            import.meta.env.MODE === "development"
            ? console.log("Cannot login", err)
            : toast.error("Something went wrong, please try again.")

            return null
        }
    }
}

function logout() : AppThunk<Promise<void>>{

    return async function (dispatch){
        try {
            await authService.logout()

            dispatch({
                type: AuthActionsType.SET_USER,
                loggedInUser: null,
            })

        } catch (err) {
            import.meta.env.MODE === "development"
            ? console.log("Cannot logout", err)
            : toast.error("Something went wrong, please try again.")

            throw err
        }
    }
}


function updateUserToRegular(userId: string): AppThunk<Promise<UserModel | null>> {

  return async function (dispatch) {
    try {
      const updatedUser = await authService.updateUserToRegular(userId)

      dispatch({
        type: AuthActionsType.SET_USER,
        loggedInUser: updatedUser,
      })

      return updatedUser

    } catch (err) {
      import.meta.env.MODE === "development"
      ? console.log("Cannot update isUserNew", err)
      : toast.error("Something went wrong, please try again.")

      return null
    }
  }
}


