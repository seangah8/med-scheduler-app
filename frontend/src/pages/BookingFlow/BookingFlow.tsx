import { useState, useEffect } from "react"
import { MedicalFieldModel } from "../../models/medicalField.model"
import { DoctorModel } from "../../models/doctor.model"
import { MedicalFieldSelector } from "./MedicalFieldSelector"
import { DoctorSelector } from "./DoctorSelector"
import { TimeSlotSelector } from "./TimeSlotSelector"
import { BookConfirmation } from "./BookConfirmation"
import { AppointmentService } from "../../services/appointment.service"

export function BookingFlow(){

    const [stepNumber, setStepNumber] = useState<number>(0)
    const [selectedField, setSelectedField] = useState<MedicalFieldModel | null>(null)
    const [selectedDoctor, setSelectedDoctor] = useState<DoctorModel | null>(null)
    const [selectedDate, setSelectedDate] = useState<Date | null>(null)
    const [confirmBooking, setConfirmBooking] = useState<boolean>(false)

    // get info from session storage
    useEffect(()=>{
        const localBookingFlow = AppointmentService.getLocalBookingFlow()
        if(localBookingFlow){
            setStepNumber(localBookingFlow.stepNumber)
            setSelectedField(localBookingFlow.selectedField)
            setSelectedDoctor(localBookingFlow.selectedDoctor)
            setSelectedDate(localBookingFlow.selectedDate)
        }
    },[])

    // update session storage
    useEffect(() => {
        AppointmentService.saveLocalBookingFlow(
            stepNumber, selectedField, selectedDoctor, selectedDate)
    }, [stepNumber])

    function isNextDisable() : boolean{
        switch (stepNumber) {
            case 0:
                return selectedField === null  
            case 1:
                return selectedDoctor === null
            case 2:
                return selectedDate === null
            default:
                return true
        }
    }

    return(
        <section className="booking-flow">
            {
                stepNumber === 0 && <MedicalFieldSelector 
                    onSelect={(field : MedicalFieldModel) => 
                        { setSelectedField(field); setSelectedDoctor(null); 
                            setSelectedDate(null); setStepNumber(1); }} />
            }
            {
                stepNumber === 1 && selectedField && <DoctorSelector 
                    field={selectedField} onSelect={(doctor) => 
                        { setSelectedDoctor(doctor); setSelectedDate(null); 
                            setStepNumber(2); }} />
            }
            {
                stepNumber === 2 && selectedField && selectedDoctor && <TimeSlotSelector 
                    doctor={selectedDoctor} field={selectedField} onSelect={(date) => 
                        { setSelectedDate(date); setStepNumber(3); }} />
            }
            {   
                stepNumber === 3 && selectedField && selectedDoctor && 
                    selectedDate && <BookConfirmation field={selectedField} doctor={selectedDoctor} 
                        date={selectedDate} confirmBooking={confirmBooking}
                            setConfirmBooking={setConfirmBooking}/>
            }

            {/* prev & next buttons */}
            {
                !confirmBooking &&
                <section className="prev-next-buttons">
                    <button onClick={()=>setStepNumber(prev=>prev-1)} 
                        disabled={stepNumber<1}>prev</button>

                    <button onClick={()=>setStepNumber(prev=>prev+1)} 
                        disabled={isNextDisable()}>next</button>
                </section>
            }


        </section>
    )
}