import { authThunks } from "../store/thunks/auth.thunks"
import { useAppDispatch } from "../store/hooks"
import { useNavigate } from "react-router-dom"

export function Dashboard(){

    const navigate = useNavigate()
    const dispatch = useAppDispatch()

    async function onLogout(){
        await dispatch(authThunks.logout())
    }

    return(
        <section className="dashboard">
            <h1>Dashboard Page</h1>
            <button onClick={onLogout}>logout</button>
            <button onClick={()=>navigate('/booking-appointment')}>book an appointment</button>
        </section>
    )
}