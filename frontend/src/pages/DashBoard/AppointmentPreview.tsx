import { AppointmentModel } from "../../models/appointment.model"


interface AppointmentPreview{
    appointment: AppointmentModel
}

export function AppointmentPreview({ appointment } : AppointmentPreview){

    console.log('_id', appointment._id)
    return(
        <tr className="appointment-preview">
            <td>{appointment.medicalFieldId}</td>
            <td>{appointment.doctorId}</td>
            <td>{appointment.startAt.toISOString()}</td>
        </tr>
    )
}