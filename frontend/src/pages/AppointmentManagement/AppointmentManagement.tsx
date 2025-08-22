import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { AppointmentService } from "../../services/appointment.service"
import { AppointmentModel } from "../../models/appointment.model"
import { CancelModal } from "./CancelModal"

export function AppointmentManagement(){

    const { id } = useParams<{ id: string }>()
    const [appointment, setAppointment] = useState<AppointmentModel | null>(null)
    const [doctorName, setDoctorName] = useState<string>('')
    const [medicalFieldName, setMedicalFieldName] = useState<string>('')
    const [showCancelModal, setShowCancelModal] = useState<boolean>(false)

    useEffect(()=>{
        if(id){
            loadAppointment(id)
        }
    },[id])

    async function loadAppointment(appointmentId : string) {
        const data = await AppointmentService.getAppointmentData(appointmentId)
        if(data){
            const {appointment : app, doctorName: drName, 
                medicalFieldName: mfieldName} = data
            setAppointment(app)
            setDoctorName(drName)
            setMedicalFieldName(mfieldName)
        }
    }

    async function onCancelAppointment() {
        if(appointment)
            AppointmentService.cancelAppointment(appointment._id)
        setShowCancelModal(false)
    }

    if(!appointment) return <h3>Loading...</h3>

    return(
        <section className="appointment-management">
            <h1>Appointment Management</h1>
            <p>Field: {medicalFieldName}</p>
            <p>Doctor: {doctorName}</p>
            <p>Date: {appointment.startAt.toString()}</p>

            <button onClick={()=>setShowCancelModal(true)}>Cancel</button>


            {
                showCancelModal && 
                <CancelModal
                    setShowCancelModal={setShowCancelModal}
                    onCancelAppointment={onCancelAppointment}
                />
            }
        </section>
    )
}