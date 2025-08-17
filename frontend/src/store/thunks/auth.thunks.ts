import { AuthActionsType } from "../interfaces/auth.store"
import { authService } from "../../services/auth.service"
import { UserModel } from "@/models/user.model"
import { AppThunk } from "../store"

export const authThunks = {
    login,
    logout,
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
            console.log("Cannot login", err)
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
            console.log("Cannot logout", err)
            throw err
        }
    }
}