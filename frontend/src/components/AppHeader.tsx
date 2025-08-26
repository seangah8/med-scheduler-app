import { authThunks } from '../store/thunks/auth.thunks'
import { useAppDispatch } from '../store/hooks'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

export function AppHeader(){

    const navigation = useNavigate()
    const dispatch = useAppDispatch()
    const shebaHeaderImage = "https://shebaconnect.sheba.co.il/assets/images/sheba-logo-header-new.svg"
    const [isLogingOut, setIsLogingOut] = useState<boolean>(false)

    async function onLogout(){
        setIsLogingOut(true)
        await dispatch(authThunks.logout())
        setIsLogingOut(false)
    }

    return(
        <section className='app-header'>
            <div className='buttons-area'>

                <button 
                    className='logout' 
                    onClick={onLogout} 
                    disabled={isLogingOut}
                >Logout</button>

                <button 
                    className='home-page' 
                    onClick={()=>navigation('/dashboard')} 
                    disabled={isLogingOut}
                >Home Page</button>

            </div>
            <img src={shebaHeaderImage} alt='sheba-connect-image'/>
        </section>
    )
}