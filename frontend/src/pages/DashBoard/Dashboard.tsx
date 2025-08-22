import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { authThunks } from "../../store/thunks/auth.thunks"
import { useAppDispatch } from "../../store/hooks"
import { AppointmentModel } from "../../models/appointment.model"
import { AppointmentService } from "../../services/appointment.service"
import { AppointmentList } from "./AppointmentList"



export function Dashboard(){

    const navigate = useNavigate()
    const dispatch = useAppDispatch()
    const [appointments, setAppointments] = useState<AppointmentModel[]>([])

    useEffect(()=>{
        loadAppointments()
    },[])

    async function loadAppointments(){
        const aps = await AppointmentService.getAppointments()
        if(aps) setAppointments(aps)
    }

    async function onLogout(){
        await dispatch(authThunks.logout())
    }

    return(
        <section className="dashboard">
            <h1>Dashboard Page</h1>
            <button onClick={onLogout}>logout</button>
            <button onClick={()=>navigate('/appointment-management')}>appointment management</button>
            <button onClick={()=>navigate('/booking-appointment')}>book an appointment</button>

            <AppointmentList appointments={appointments}/>
        </section>
    )
}