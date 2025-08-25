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
            <h2>My Appointments</h2>
            <button className="book-appointment-button" 
                onClick={()=>navigate('/booking-appointment')}>
                book appointment +
            </button>
            <div className="filter">
                <button onClick={()=>setOnPast(true)}>Past Appointments</button>
                <button onClick={()=>setOnPast(false)}>Upcoming Appointments</button>
            </div>
            <AppointmentList 
                appointments={appointments} 
                doctorMap={doctorMap}
                medicalFieldMap={medicalFieldMap}
            />

            {
                appointments.length === 0 &&
                <p>no appointments found</p>
            }
        </section>
    )
}