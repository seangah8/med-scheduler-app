import { useParams } from "react-router-dom"

export function AppointmentManagement(){

    const { id } = useParams<{ id: string }>()

    return(
        <section className="appointment-management">
            <h1>Appointment Management</h1>
            <p>Appointment id: {id}</p>
        </section>
    )
}