import { Reducer, combineReducers, compose, legacy_createStore as createStore } from 'redux'
import { authReducer } from './reducers/auth.reducer'
import { AuthAction, AuthState } from './interfaces/auth.store'

const composeEnhancers = (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose

export interface RootState {
    authModule: AuthState
}

type AppAction = AuthAction
type RootReducer = Reducer<RootState, AppAction>

const rootReducer = combineReducers({
    authModule: authReducer,
}) as RootReducer

export const store = createStore(rootReducer, composeEnhancers())

// window.gStore = store