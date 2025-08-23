import { useState, useEffect} from "react"
import { useParams, useNavigate } from "react-router-dom"
import { MedicalFieldModel } from "../../models/medicalField.model"
import { DoctorModel } from "../../models/doctor.model"
import { MedicalFieldSelector } from "./MedicalFieldSelector"
import { DoctorSelector } from "./DoctorSelector"
import { TimeSlotSelector } from "./TimeSlotSelector"
import { BookConfirmation } from "./BookConfirmation"
import { AppointmentService } from "../../services/appointment.service"


export function BookingFlow() {
  const { step } = useParams<{ step: string }>()
  const navigate = useNavigate()

  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [selectedField, setSelectedField] = useState<MedicalFieldModel | null>(null)
  const [selectedDoctor, setSelectedDoctor] = useState<DoctorModel | null>(null)
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [confirmBooking, setConfirmBooking] = useState<boolean>(false)

  const steps = ['medical_field', 'doctor', 'date', 'confirmation']
  let stepNumber = steps.indexOf(step || '')
  // in case the addres is not valid
  stepNumber = (stepNumber === -1) ? 0 : stepNumber

  // load sessionStorage
  useEffect(() => {
    const local = AppointmentService.getLocalBookingFlow()
    if (local) {
      setSelectedField(local.selectedField)
      setSelectedDoctor(local.selectedDoctor)
      setSelectedDate(local.selectedDate)
    }
    setIsLoading(false)
  }, [])

  // save to sessionStorage
  useEffect(() => {
    AppointmentService.saveLocalBookingFlow(selectedField, 
        selectedDoctor, selectedDate)

  }, [selectedField, selectedDoctor, selectedDate])

  function goToStep(num: number) {
    if (num >= 0 && num < steps.length) {
      navigate(`/booking-appointment/${steps[num]}`)
    }
  }

  // if user tries to access step without valid data, send back to start
  useEffect(() => {
    if(isLoading) return
    if (
      (step === 'doctor' && !selectedField) ||
      (step === 'date' && (!selectedField || !selectedDoctor)) ||
      (step === 'confirmation' && (!selectedField || !selectedDoctor || !selectedDate))
    ) navigate('/booking-appointment/medical_field', { replace: true })
    
  }, [step, isLoading])

  function isNextDisabled(): boolean {
    switch (stepNumber) {
      case 0: return selectedField === null
      case 1: return selectedDoctor === null
      case 2: return selectedDate === null
      default: return true
    }
  }

  return (
    <section className="booking-flow">
      {
        stepNumber === 0 &&
        <MedicalFieldSelector onSelect={field => {
          setSelectedField(field)
          setSelectedDoctor(null)
          setSelectedDate(null)
          goToStep(1)
        }} />
      }
      {
        stepNumber === 1 && selectedField &&
        <DoctorSelector field={selectedField} onSelect={doctor => {
          setSelectedDoctor(doctor)
          setSelectedDate(null)
          goToStep(2)
        }} />
      }
      {
        stepNumber === 2 && selectedField && selectedDoctor &&
        <TimeSlotSelector doctor={selectedDoctor} field={selectedField} onSelect={date => {
          setSelectedDate(date)
          goToStep(3)
        }} />
      }
      {
        stepNumber === 3 && selectedField && selectedDoctor && selectedDate &&
        <BookConfirmation
          field={selectedField}
          doctor={selectedDoctor}
          date={selectedDate}
          confirmBooking={confirmBooking}
          setConfirmBooking={setConfirmBooking}
        />
      }

      {/* prev/next buttons */}
      {
        !confirmBooking &&
        <section className="prev-next-buttons">
          <button onClick={() => goToStep(stepNumber - 1)} disabled={stepNumber < 1}>prev</button>
          <button onClick={() => goToStep(stepNumber + 1)} disabled={isNextDisabled()}>next</button>
        </section>
      }
    </section>
  )
}
