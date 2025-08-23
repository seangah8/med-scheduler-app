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
    const [doctorMap, setDoctorMap] = useState<Record<string, string>>({})
    const [medicalFieldMap, setMedicalFieldMap] = useState<Record<string, string>>({})
    const [onPast, setOnPast] = useState<boolean>(false)

    useEffect(()=>{
        loadAppointments()
    },[onPast])

    async function loadAppointments(){
        const status = onPast ? 'completed' : 'scheduled'
        const data = await AppointmentService.getAppointmentsData(status)
        if(data) {
            const { appointments: aps, doctorMap: drMap, 
                medicalFieldMap: fieldMap } = data
            setAppointments(aps)
            setDoctorMap(drMap)
            setMedicalFieldMap(fieldMap)
        }
    }

    async function onLogout(){
        await dispatch(authThunks.logout())
    }

    return(
        <section className="dashboard">
            <h1>Dashboard Page</h1>
            <button onClick={onLogout}>logout</button>
            <button onClick={()=>navigate('/booking-appointment')}>book an appointment</button>

            <button onClick={()=>setOnPast(true)}>Past</button>
            <button onClick={()=>setOnPast(false)}>Upcoming</button>

            <AppointmentList 
                appointments={appointments} 
                doctorMap={doctorMap}
                medicalFieldMap={medicalFieldMap}
            />
        </section>
    )
}