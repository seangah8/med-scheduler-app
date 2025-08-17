
import { AuthAction, AuthActionsType, AuthState } from "../interfaces/auth.store.js"
import { authService } from "../../services/auth.service.js"

const initialState: AuthState = {
    loggedInUser: authService.getLoggedinUser(),
}

export function authReducer(state = initialState, cmd = {} as AuthAction): AuthState {
    switch (cmd.type) {

        case AuthActionsType.SET_USER:
            return {
                ...state,
                loggedInUser: cmd.loggedInUser
            }      
       
        default:
            return state
    }
}