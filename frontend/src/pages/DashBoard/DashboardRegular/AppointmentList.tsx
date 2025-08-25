import { AppointmentModel } from "../../../models/appointment.model"
import { AppointmentPreview } from "./AppointmentPreview"

interface AppointmentListProps{
    appointments: AppointmentModel[]
    doctorMap: Record<string, string>  
    medicalFieldMap: Record<string, string>  

}

export function AppointmentList({ appointments, doctorMap, medicalFieldMap } : AppointmentListProps){

    return(
        <ul className="appointment-list">
            {
                appointments.map(app=>
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
    )
}