import { AppointmentModel } from "../../models/appointment.model"
import { useNavigate } from "react-router-dom"



interface AppointmentPreview{
    appointment: AppointmentModel
    doctorMap: Record<string, string>  
    medicalFieldMap: Record<string, string>  
}

export function AppointmentPreview({ appointment, doctorMap, medicalFieldMap  } : AppointmentPreview){
    const navigate = useNavigate()

    return(
        <tr className="appointment-preview" 
            onClick={()=>{navigate(`/appointment/${appointment._id}`)}}>

            <td>{medicalFieldMap[appointment.medicalFieldId]}</td>
            <td>{doctorMap[appointment.doctorId]}</td>
            <td>{appointment.startAt.toISOString()}</td>
            
        </tr>
    )
}