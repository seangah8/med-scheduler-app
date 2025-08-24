import { MedicalFieldModel } from "@/models/medicalField.model"
import { useNavigate } from "react-router-dom"

interface DashboardWelcomeProps{
    medicalFields: MedicalFieldModel[]
}

export function DashboardWelcome({medicalFields} : DashboardWelcomeProps){

    const navigate = useNavigate()

    return(
        <section className="dashboard-welcome">
            <h1>Welcome To Shiba Connect!</h1>
            <button onClick={()=>navigate('/booking-appointment')}>
                book your first appointment here!
            </button>
            <ul>
                {
                    medicalFields.map(field => 
                        <li key={field._id}>
                            <p>{field.name}</p>
                            <p>{field.details}</p>
                        </li>
                    )
                }
            </ul>
        </section>
    )
}