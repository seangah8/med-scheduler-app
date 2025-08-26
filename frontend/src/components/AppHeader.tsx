import { authThunks } from '../store/thunks/auth.thunks'
import { useAppDispatch } from '../store/hooks'
import { useState } from 'react'

export function AppHeader(){

    const dispatch = useAppDispatch()
    const shebaHeaderImage = "https://play-lh.googleusercontent.com/3eLZej2ZDq1EcneA28FOj4xfKvaoSqZ2XNcGwIz5U8vPNe2wgCeSkcfSmnUE-kQvmA"
    const [isLogingOut, setIsLogingOut] = useState<boolean>(false)

    async function onLogout(){
        setIsLogingOut(true)
        await dispatch(authThunks.logout())
        setIsLogingOut(false)
    }

    return(
        <section className='app-header'>
            <button onClick={onLogout} disabled={isLogingOut}>Logout</button>
            <img src={shebaHeaderImage} alt='sheba-connect-image'/>
        </section>
    )
}