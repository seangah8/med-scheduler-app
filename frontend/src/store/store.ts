import { legacy_createStore as createStore, applyMiddleware, compose, combineReducers, UnknownAction } from 'redux'
import { ThunkDispatch, ThunkAction, thunk as thunkMiddleware } from 'redux-thunk'
import { authReducer } from './reducers/auth.reducer'
import { AuthState } from './interfaces/auth.store'

// redux devTools support
const composeEnhancers = (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose

// define shape of redux state
export interface RootState {
  authModule: AuthState
}

// define type for thunks
export type AppThunk<ReturnType = any> = 
    ThunkAction< ReturnType, RootState, unknown, UnknownAction >

// all reducers combined
const rootReducer = combineReducers({
  authModule: authReducer, 
})

export const store = createStore(
  rootReducer,
  // availability of async logic in actions
  composeEnhancers(applyMiddleware(thunkMiddleware))
)

export type AppDispatch = ThunkDispatch<RootState, unknown, UnknownAction>

