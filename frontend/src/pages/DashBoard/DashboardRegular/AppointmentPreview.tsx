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
        <article className="appointment-preview" 
            onClick={()=>{navigate(`/appointment/${appointment._id}`)}}>

            <div className="appointment-info">
                <h3>{doctorName}</h3>
                <p>{medicalFieldName}</p>
                <p>{TimeSlotService.formatDateTimeLong(appointment.startAt)}</p>
            </div>
            <i className="fa-solid fa-angle-right"></i>

            
        </article>
    )
}