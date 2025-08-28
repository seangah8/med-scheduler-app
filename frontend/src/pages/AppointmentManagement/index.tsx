import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { AppointmentService } from "../../services/appointment.service"
import { AppointmentModel } from "../../models/appointment.model"
import { CancelModal } from "./CancelModal"
import { RescheduleModal } from "./RescheduleModal"
import { DoctorModel } from "@/models/doctor.model"
import { MedicalFieldModel } from "@/models/medicalField.model"
import { TimeSlotService } from "../../services/timeSlot.service"

export function AppointmentManagement(){

    const navigator = useNavigate()
    const { id } = useParams<{ id: string }>()
    const [appointment, setAppointment] = useState<AppointmentModel | null>(null)
    const [wasAppCompleted, setWasAppCompleted] = useState<boolean>(false)
    const [doctor, setDoctor] = useState<DoctorModel | null>(null)
    const [medicalField, setMedicalField] = useState<MedicalFieldModel | null>(null)
    const [showCancelModal, setShowCancelModal] = useState<boolean>(false)
    const [showRescheduleModal, setShowRescheduleModal] = useState<boolean>(false)
    const [wasCanceledSuccessfully, setWasCanceledSuccessfully] = useState<boolean | null>(null)
    const [wasRescheduledSuccessfully, setWasRescheduledSuccessfully] = useState<boolean | null>(null)
    const [refreshTrigger, setRefreshTrigger] = useState<number>(0)

    useEffect(()=>{
        setWasCanceledSuccessfully(null)
        setWasRescheduledSuccessfully(null)
        if(id)
            loadAppointment(id)
    },[id, refreshTrigger])

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

    function onClickOutsideModal(){
        if(wasCanceledSuccessfully) navigator('/dashboard')
        if(wasRescheduledSuccessfully) handleRefresh()
        setShowCancelModal(false)
        setShowRescheduleModal(false)
    }

    function handleRefresh() {
        setRefreshTrigger(prev => prev + 1)
    }

    if(!appointment || !medicalField || !doctor) 
        return <h3>Loading...</h3>

    return(
        <section className="appointment-management">
            <h1>Appointment Info</h1>
            <p><span>Field:</span> {medicalField.name}</p>
            <p><span>Doctor:</span> {doctor.name}</p>
            <p><span>Date:</span> {TimeSlotService.formatDateTimeLong(appointment.startAt)}</p>
            {medicalField.requiredInfo && <p><span>Requirements:</span> {medicalField.requiredInfo}</p>}

            {
                !wasAppCompleted &&
                <section className="action-buttons">
                    <button className="reschedule-butt" onClick={()=>setShowRescheduleModal(true)}>Reschedule</button>
                    <button className="cancel-butt" onClick={()=>setShowCancelModal(true)}>Cancel Appointment</button>
                </section>
            }

            { (showCancelModal || showRescheduleModal) &&
            <div className="modals-container" onClick={onClickOutsideModal}>
                {
                    showCancelModal && 
                    <CancelModal
                        setShowCancelModal={setShowCancelModal}
                        onCancelAppointment={onCancelAppointment}
                        wasCanceledSuccessfully={wasCanceledSuccessfully}
                        setWasCanceledSuccessfully={setWasCanceledSuccessfully}
                    />
                }

                {
                    showRescheduleModal && 
                    <RescheduleModal
                        medicalField={medicalField}
                        doctor={doctor}
                        wasRescheduledSuccessfully={wasRescheduledSuccessfully}
                        setShowRescheduleModal={setShowRescheduleModal}
                        onRescheduleAppointment={onRescheduleAppointment}
                        setWasRescheduledSuccessfully={setWasRescheduledSuccessfully}
                        handleRefresh={handleRefresh}
                    />
                }
            </div>
            }
        </section>
    )
}