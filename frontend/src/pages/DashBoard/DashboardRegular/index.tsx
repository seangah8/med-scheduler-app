import { useNavigate } from "react-router-dom"
import { AppointmentList } from "./AppointmentList"
import { AppointmentFilterModel, AppointmentModel } from "@/models/appointment.model"
import { AppointmentFilter } from "./AppointmentFilter"


interface DashboardRegularProps{
    appointments: AppointmentModel[]
    doctorMap: Record<string, string>
    medicalFieldMap: Record<string, string>
    filter: AppointmentFilterModel
    loadingApps: boolean
    setFilter : (updatedFilter : AppointmentFilterModel) => void
}

export function DashboardRegular({
    appointments, 
    doctorMap, 
    medicalFieldMap, 
    filter, 
    loadingApps, 
    setFilter
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

            <AppointmentFilter
                filter={filter}
                medicalFieldMap={medicalFieldMap}
                setFilter={setFilter}
            />

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