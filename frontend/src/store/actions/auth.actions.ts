import { store } from "../store"
import { AuthActionsType } from "../interfaces/auth.store"
import { authService } from "../../services/auth.service"
import { UserModel } from "@/models/user.model"

export const authActions = {
    login,
    logout,
}

async function login(phone: string, password: string) : Promise<UserModel | null> {
    try {
        const user = await authService.verifyOtp(phone, password)
        store.dispatch({
            type: AuthActionsType.SET_USER,
            loggedInUser: user
        })
        return user
    } catch (err) {
        console.log('Cannot login', err)
        return null
    }
}

async function logout() : Promise<void> {
    try {
        await authService.logout()
        store.dispatch({
            type: AuthActionsType.SET_USER,
            loggedInUser: null
        })
    } catch (err) {
        console.log('Cannot logout', err)
        throw err
    }
}
