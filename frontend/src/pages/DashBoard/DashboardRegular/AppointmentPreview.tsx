import { TimeSlotService } from "../../../services/timeSlot.service"
import { AppointmentModel } from "../../../models/appointment.model"
import { useNavigate } from "react-router-dom"



interface AppointmentPreview{
    appointment: AppointmentModel
    doctorName: string
    medicalFieldName: string 
}

export function AppointmentPreview({ appointment, doctorName, medicalFieldName  } : AppointmentPreview){
    const navigate = useNavigate()

    return(
        <tr className="appointment-preview" 
            onClick={()=>{navigate(`/appointment/${appointment._id}`)}}>

            <td>{doctorName}</td>
            <td>{medicalFieldName}</td>
            <td>{TimeSlotService.formatDateTimeLong(appointment.startAt)}</td>
            
        </tr>
    )
}