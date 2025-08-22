import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { AppointmentService } from "../services/appointment.service"
import { AppointmentModel } from "../models/appointment.model"

export function AppointmentManagement(){

    const { id } = useParams<{ id: string }>()
    const [appointment, setAppointment] = useState<AppointmentModel | null>(null)
    const [doctorName, setDoctorName] = useState<string>('')
    const [medicalFieldName, setMedicalFieldName] = useState<string>('')

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

    if(!appointment) return <h3>Loading...</h3>

    return(
        <section className="appointment-management">
            <h1>Appointment Management</h1>
            <p>Field: {medicalFieldName}</p>
            <p>Doctor: {doctorName}</p>
            <p>Date: {appointment.startAt.toString()}</p>
        </section>
    )
}