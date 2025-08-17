
// defines the structure of a user object 
import { UserModel } from "../../models/user.model"

// define the shape of the user slice of the Redux state
export interface AuthState {
    loggedInUser: UserModel | null
}

// define all possible action types for the user state
export enum AuthActionsType {
    SET_USER = 'SET_USER'
}

// define the structure of the CHANGE_USERNAME action
interface SetAuthAction {
    type: AuthActionsType.SET_USER
    loggedInUser: UserModel | null
}

// Combine all user-related actions into a single type
export type AuthAction = SetAuthAction
