import { useState } from "react"
import { MedicalFieldModel } from "../../models/medicalField.model"
import { DoctorModel } from "../../models/doctor.model"
import { MedicalFieldSelector } from "./MedicalFieldSelector"
import { DoctorSelector } from "./DoctorSelector"
import { DateSelector } from "./DateSelector"

export function BookingFlow(){

    const [step, setStep] = useState(0)
    const [selectedField, setSelectedField] = useState<MedicalFieldModel | null>(null)
    const [selectedDoctor, setSelectedDoctor] = useState<DoctorModel | null>(null)
    const [selectedDate, setSelectedDate] = useState<Date | null>(null)

    return(
        <section className="booking-flow">
            {
                step === 0 && <MedicalFieldSelector 
                    onSelect={(field : MedicalFieldModel) => 
                        { setSelectedField(field); setStep(1); }} />
            }
            {
                step === 1 && selectedField && <DoctorSelector 
                    field={selectedField} onSelect={(doctor) => 
                        { setSelectedDoctor(doctor); setStep(2); }} />
            }
            {
                step === 2 && selectedField && selectedDoctor && <DateSelector 
                    doctor={selectedDoctor} field={selectedField} onSelect={(date) => 
                        { setSelectedDate(date); setStep(3); }} />
            }
            {/* {step === 3 && selectedField && selectedDoctor && selectedDate && <Confirmation field={selectedField} doctor={selectedDoctor} date={selectedDate} />} */}
        </section>
    )
}