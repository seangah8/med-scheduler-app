import { AppointmentModel } from "../../models/appointment.model"


interface AppointmentPreview{
    appointment: AppointmentModel
    doctorMap: Record<string, string>  
    medicalFieldMap: Record<string, string>  
}

export function AppointmentPreview({ appointment, doctorMap, medicalFieldMap  } : AppointmentPreview){

    return(
        <tr className="appointment-preview">
            <td>{medicalFieldMap[appointment.medicalFieldId]}</td>
            <td>{doctorMap[appointment.doctorId]}</td>
            <td>{appointment.startAt.toISOString()}</td>
        </tr>
    )
}