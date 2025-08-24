import { MedicalFieldModel } from "@/models/medicalField.model"
import { TimeSlotSelector } from "../BookingFlow/TimeSlotSelector"
import { DoctorModel } from "@/models/doctor.model"
import { useState } from "react"
import { AppointmentModel } from "@/models/appointment.model"


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
                    <h3>What time do you want to reschedule the appointment to?</h3>
                    <button onClick={()=>setShowRescheduleModal(false)}>Cancel</button>
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
                    <p>{`Are you sure you want to reschedule the 
                        appointment to ${choosenDate.toString()}`}</p>
                    <button onClick={()=>setChoosenDate(null)}>No</button>
                    <button onClick={onApprove}>Yes</button>
                </section>
            }

            {/* reschedule status */}
            {
                wasRescheduledSuccessfully !== null &&
                <section className="reschedule-status">
                    <p>
                    {
                        wasRescheduledSuccessfully
                        ? 'appointment rescheduled'
                        : 'could not reschedule the appointment, try again later'
                    }
                    </p>
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