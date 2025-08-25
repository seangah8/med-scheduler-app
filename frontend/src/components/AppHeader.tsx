import { authThunks } from '../store/thunks/auth.thunks'
import { useAppDispatch } from '../store/hooks'

export function AppHeader(){

    const dispatch = useAppDispatch()
    const shebaHeaderImage = "https://play-lh.googleusercontent.com/3eLZej2ZDq1EcneA28FOj4xfKvaoSqZ2XNcGwIz5U8vPNe2wgCeSkcfSmnUE-kQvmA"


    async function onLogout(){
        await dispatch(authThunks.logout())
    }

    return(
        <section className='app-header'>
            <button onClick={onLogout}>Logout</button>
            <img src={shebaHeaderImage} alt='sheba-connect-image'/>
        </section>
    )
}