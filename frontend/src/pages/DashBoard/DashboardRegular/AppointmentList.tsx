import { useState } from "react"
import { AppointmentModel } from "../../../models/appointment.model"
import { AppointmentPreview } from "./AppointmentPreview"

interface AppointmentListProps{
    appointments: AppointmentModel[]
    doctorMap: Record<string, string>  
    medicalFieldMap: Record<string, string>  

}

export function AppointmentList({ appointments, doctorMap, medicalFieldMap } 
    : AppointmentListProps){

    const [showAll, setShowAll] = useState(false)

    const MAX_VISIBLE = 5
    const visibleAppointments = showAll 
    ? appointments 
    : appointments.slice(0, MAX_VISIBLE)

    return(
        <section className="appointment-list">
            <ul>
                {
                    visibleAppointments.map(app=>
                        <li key={app._id} >
                            <AppointmentPreview 
                                appointment={app}
                                doctorName={doctorMap[app.doctorId]}
                                medicalFieldName={medicalFieldMap[app.medicalFieldId]}
                            />
                        </li>
                    )
                }
            </ul>

            {
                appointments.length > MAX_VISIBLE && (
                    <button className="toggle-length" onClick={() => setShowAll(prev=>!prev)}>
                        {showAll ? 'Show less appointments' : 'Show all appointments'}
                        {
                            showAll 
                            ? <i className="fa-solid fa-angle-up"/> 
                            : <i className="fa-solid fa-angle-down"/>
                        }
                        
                    </button>
                )
            }
        </section>
        
    )
}