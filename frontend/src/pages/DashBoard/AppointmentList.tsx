import { AppointmentModel } from "../../models/appointment.model"
import { AppointmentPreview } from "./AppointmentPreview"

interface AppointmentListProps{
    appointments: AppointmentModel[]
}

export function AppointmentList({ appointments } : AppointmentListProps){

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
                    <AppointmentPreview key={app._id} appointment={app}/>
                )
            }
            </tbody>
        </table>
    )
}