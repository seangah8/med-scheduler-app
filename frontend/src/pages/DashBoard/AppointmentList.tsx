import { AppointmentModel } from "../../models/appointment.model"
import { AppointmentPreview } from "./AppointmentPreview"

interface AppointmentListProps{
    appointments: AppointmentModel[]
    doctorMap: Record<string, string>  
    medicalFieldMap: Record<string, string>  

}

export function AppointmentList({ appointments, doctorMap, medicalFieldMap } : AppointmentListProps){

    return(
        <table className="appointment-list">
            <thead>
                <tr>
                    <th>Medical Field</th>
                    <th>Doctor</th>
                    <th>Date</th>
                </tr>
            </thead>
            <tbody>
            {
                appointments.map(app=>
                    <AppointmentPreview 
                        key={app._id} 
                        appointment={app}
                        doctorName={doctorMap[app.doctorId]}
                        medicalFieldName={medicalFieldMap[app.medicalFieldId]}
                    />
                )
            }
            </tbody>
        </table>
    )
}