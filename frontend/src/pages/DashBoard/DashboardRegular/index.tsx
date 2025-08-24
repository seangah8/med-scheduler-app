import { useNavigate } from "react-router-dom"
import { AppointmentList } from "./AppointmentList"
import { AppointmentModel } from "@/models/appointment.model"


interface DashboardRegularProps{
    appointments: AppointmentModel[]
    doctorMap: Record<string, string>
    medicalFieldMap: Record<string, string>
    setOnPast : (boolean : boolean) => void
}

export function DashboardRegular({appointments, doctorMap, medicalFieldMap, setOnPast} 
    : DashboardRegularProps){

    const navigate = useNavigate()

    return(
        <section className="dashboard-regular">
            <button onClick={()=>navigate('/booking-appointment')}>
                book appointment +
            </button>
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