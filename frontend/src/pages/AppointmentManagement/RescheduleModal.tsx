import { MedicalFieldModel } from "@/models/medicalField.model"
import { TimeSlotSelector } from "../BookingFlow/TimeSlotSelector"
import { DoctorModel } from "@/models/doctor.model"
import { useState } from "react"


interface RescheduleModalProps{
    medicalField: MedicalFieldModel
    doctor: DoctorModel
    setShowRescheduleModal: (toShow : boolean) => void
    onRescheduleAppointment: (date: Date) => void
}

export function RescheduleModal({medicalField, doctor, setShowRescheduleModal, onRescheduleAppointment} 
    : RescheduleModalProps){

    const [choosenDate, setChoosenDate] = useState<Date | null>(null)
    
    function onSelectDate(date: Date){
        setChoosenDate(date)
    }

    return(
        <section className="reschedule-modal">
            <h3>What time do you want to reschedule the appointment to?</h3>
            <button onClick={()=>setShowRescheduleModal(false)}>Cancel</button>

            {
                choosenDate &&
                <section className="reschedule-confirmation">
                    <p>{`Are you sure you want to reschedule the 
                        appointment to ${choosenDate.toString()}`}</p>
                    <button onClick={()=>setChoosenDate(null)}>No</button>
                    <button onClick={()=>onRescheduleAppointment(choosenDate)}>Yes</button>
                </section>
            }


            <TimeSlotSelector 
                field={medicalField}
                doctor={doctor}
                onSelect={onSelectDate}
            />
        </section>
    )
}