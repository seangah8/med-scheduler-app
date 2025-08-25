import { MedicalFieldModel } from "@/models/medicalField.model"
import { TimeSlotSelector } from "../BookingFlow/TimeSlotSelector"
import { DoctorModel } from "@/models/doctor.model"
import { useState } from "react"
import { AppointmentModel } from "@/models/appointment.model"
import { TimeSlotService } from "../../services/timeSlot.service"


interface RescheduleModalProps{
    appointmentId: string
    medicalField: MedicalFieldModel
    doctor: DoctorModel
    setShowRescheduleModal: (toShow : boolean) => void
    onRescheduleAppointment: (date: Date) => Promise<AppointmentModel | null>
}

export function RescheduleModal({appointmentId, medicalField, doctor, setShowRescheduleModal, onRescheduleAppointment} 
    : RescheduleModalProps){

    const [choosenDate, setChoosenDate] = useState<Date | null>(null)
    const [wasRescheduledSuccessfully, setWasRescheduledSuccessfully] 
        = useState<boolean | null>(null)

    async function onApprove() : Promise<void>{
        if(choosenDate){
            const app = await onRescheduleAppointment(choosenDate)
            if(app) setWasRescheduledSuccessfully(true)
            else setWasRescheduledSuccessfully(false)
        } else setWasRescheduledSuccessfully(false)
    }

    return(
        <section className="reschedule-modal">

            {/* reschedule calendar */}
            {
                wasRescheduledSuccessfully === null &&
                !choosenDate &&
                <section className="reschedule-calendar">
                    <button className="cancel-button" onClick={()=>setShowRescheduleModal(false)}>X</button>
                    <TimeSlotSelector 
                        field={medicalField}
                        doctor={doctor}
                        onSelect={(date)=>setChoosenDate(date)}
                    />
                </section>
            }

            {/* reschedule confirmation */}
            {
                wasRescheduledSuccessfully === null &&
                choosenDate &&
                <section className="reschedule-confirmation">
                    <h3>{`Are you sure you want to reschedule your 
                        appointment to ${TimeSlotService.formatDateTimeLong(choosenDate)}?`}</h3>
                    <div className="buttons-area">
                        <button onClick={()=>setChoosenDate(null)}>No</button>
                        <button onClick={onApprove}>Yes</button>
                    </div>
                </section>
            }

            {/* reschedule status */}
            {
                wasRescheduledSuccessfully !== null &&
                <section className="reschedule-status">
                    <h3>
                    {
                        wasRescheduledSuccessfully
                        ? 'appointment rescheduled'
                        : 'could not reschedule the appointment, try again later'
                    }
                    </h3>
                    <button onClick={()=>{
                        setShowRescheduleModal(false)
                        if (wasRescheduledSuccessfully)
                            window.location.href = `/appointment/${appointmentId}`
                        }}>
                        Approve
                    </button>
                </section>
            }
            
        </section>
    )
}