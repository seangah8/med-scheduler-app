import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { AppointmentService } from "../../services/appointment.service"
import { AppointmentModel } from "../../models/appointment.model"
import { CancelModal } from "./CancelModal"
import { RescheduleModal } from "./RescheduleModal"
import { DoctorModel } from "@/models/doctor.model"
import { MedicalFieldModel } from "@/models/medicalField.model"

export function AppointmentManagement(){

    const { id } = useParams<{ id: string }>()
    const [appointment, setAppointment] = useState<AppointmentModel | null>(null)
    const [wasAppCompleted, setWasAppCompleted] = useState<boolean>(false)
    const [doctor, setDoctor] = useState<DoctorModel | null>(null)
    const [medicalField, setMedicalField] = useState<MedicalFieldModel | null>(null)
    const [showCancelModal, setShowCancelModal] = useState<boolean>(false)
    const [showRescheduleModal, setShowRescheduleModal] = useState<boolean>(false)

    useEffect(()=>{
        if(id)
            loadAppointment(id)
    },[id])

    useEffect(()=>{
        if(appointment)
            setWasAppCompleted(appointment.status === 'completed')
    },[appointment])

    // if open cancel modal close the reschedule one
    useEffect(()=>{
        if(showCancelModal)
            setShowRescheduleModal(false)
    },[showCancelModal])

    // if open reschedule modal close the cancel one
    useEffect(()=>{
        if(showRescheduleModal)
            setShowCancelModal(false)
    },[showRescheduleModal])

    async function loadAppointment(appointmentId : string) {
        const data = await AppointmentService.getAppointmentData(appointmentId)
        if(data){
            const {appointment : app, doctor: dr, medicalField: mfield} = data
            setAppointment(app)
            setDoctor(dr)
            setMedicalField(mfield)
        }
    }

    async function onCancelAppointment() : Promise<AppointmentModel | null> {
        if(appointment){
            const app = await 
                AppointmentService.cancelAppointment(appointment._id)
            if(app) return app
        }
        return null
    }

    async function onRescheduleAppointment(date: Date) : Promise<AppointmentModel | null>{
        if(appointment){
            const app = await AppointmentService.rescheduleAppointment(appointment._id, date)
            return app
        }
        return null
    }

    if(!appointment || !medicalField || !doctor) return <h3>Loading...</h3>

    return(
        <section className="appointment-management">
            <h1>Appointment Management</h1>
            <p>Field: {medicalField.name}</p>
            <p>Doctor: {doctor.name}</p>
            <p>Date: {appointment.startAt.toString()}</p>

            {
                !wasAppCompleted &&
                <section className="action-buttons">
                    <button onClick={()=>setShowCancelModal(true)}>Cancel</button>
                    <button onClick={()=>setShowRescheduleModal(true)}>Reschedule</button>
                </section>
            }



            {
                showCancelModal && 
                <CancelModal
                    setShowCancelModal={setShowCancelModal}
                    onCancelAppointment={onCancelAppointment}
                />
            }

            {
                showRescheduleModal && 
                <RescheduleModal
                    appointmentId={appointment._id}
                    medicalField={medicalField}
                    doctor={doctor}
                    setShowRescheduleModal={setShowRescheduleModal}
                    onRescheduleAppointment={onRescheduleAppointment}
                />
            }
        </section>
    )
}