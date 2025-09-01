import { MedicalFieldModel } from "@/models/medicalField.model"
import { TimeSlotSelector } from "../BookingFlow/TimeSlotSelector"
import { DoctorModel } from "@/models/doctor.model"
import { useState } from "react"
import { AppointmentModel } from "@/models/appointment.model"
import { TimeSlotService } from "../../services/timeSlot.service"


interface RescheduleModalProps{
    medicalField: MedicalFieldModel
    doctor: DoctorModel
    wasRescheduledSuccessfully : boolean | null
    setShowRescheduleModal: (toShow : boolean) => void
    onRescheduleAppointment: (date: Date) => Promise<AppointmentModel | null>
    setWasRescheduledSuccessfully: (success : boolean) => void
    handleRefresh: () => void
}

export function RescheduleModal({
    medicalField, 
    doctor, 
    wasRescheduledSuccessfully, 
    setShowRescheduleModal, 
    onRescheduleAppointment, 
    setWasRescheduledSuccessfully,
    handleRefresh
} 
    : RescheduleModalProps){

    const [choosenDate, setChoosenDate] = useState<Date | null>(null)
    const [isRescheduling, setIsRescheduling] = useState(false)

    async function onApprove() : Promise<void>{
        setIsRescheduling(true)
        if(choosenDate){
            const app = await onRescheduleAppointment(choosenDate)
            if(app) setWasRescheduledSuccessfully(true)
            else setWasRescheduledSuccessfully(false)
        } 
        else setWasRescheduledSuccessfully(false)
        setIsRescheduling(false)
    }

    return(
        <section className="reschedule-modal"  onClick={e => e.stopPropagation()}>

            {/* reschedule calendar */}
            {
                wasRescheduledSuccessfully === null &&
                !choosenDate &&
                <section className="reschedule-calendar">
                    <button className="cancel-button" onClick={()=>setShowRescheduleModal(false)}>X</button>
                    <TimeSlotSelector 
                        field={medicalField}
                        doctor={doctor}
                        selectedDate={choosenDate}
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
                        <button className="no-butt" onClick={()=>setChoosenDate(null)}>No</button>
                        <button className="yes-butt" onClick={onApprove} disabled={isRescheduling}>
                            {isRescheduling ? 'Rescheduling...' : 'Yes'}
                        </button>
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
                        ? 'Appointment rescheduled'
                        : 'Could not reschedule the appointment, try again later'
                    }
                    </h3>
                    <button onClick={()=>{
                        setShowRescheduleModal(false)
                        handleRefresh()
                        }}>
                        Approve
                    </button>
                </section>
            }
            
        </section>
    )
}