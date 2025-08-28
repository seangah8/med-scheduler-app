import { useNavigate } from "react-router-dom"
import { AppointmentList } from "./AppointmentList"
import { AppointmentModel } from "@/models/appointment.model"


interface DashboardRegularProps{
    appointments: AppointmentModel[]
    doctorMap: Record<string, string>
    medicalFieldMap: Record<string, string>
    onPast: boolean
    loadingApps: boolean
    setOnPast : (boolean : boolean) => void
}

export function DashboardRegular({
    appointments, 
    doctorMap, 
    medicalFieldMap, 
    onPast, 
    loadingApps, 
    setOnPast
    } : DashboardRegularProps){

    const navigate = useNavigate()

    return(
        <section className="dashboard-regular">
            <h2>My Appointments</h2>
            <button className="book-appointment-button" 
                onClick={()=>navigate('/booking-appointment')}>
                <span>New Appointment </span>
                <i className="fa-solid fa-plus"></i>
            </button>
            <div className="filter">
                <button onClick={()=>setOnPast(false)} disabled={!onPast}>Upcoming Appointments</button>
                <button onClick={()=>setOnPast(true)} disabled={onPast}>Previous Appointments</button>
            </div>
            {   loadingApps 
                ? <p className="fetch-info-txt">loading appointments...</p>
                : appointments.length === 0 
                ? <p className="fetch-info-txt">no appointments found</p> 
                : <AppointmentList 
                appointments={appointments} 
                doctorMap={doctorMap}
                medicalFieldMap={medicalFieldMap}
            />
            }
        </section>
    )
}