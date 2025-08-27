import { useState, useEffect} from "react"
import { useParams, useNavigate } from "react-router-dom"
import { MedicalFieldModel } from "../../models/medicalField.model"
import { DoctorModel } from "../../models/doctor.model"
import { MedicalFieldSelector } from "./MedicalFieldSelector"
import { DoctorSelector } from "./DoctorSelector"
import { TimeSlotSelector } from "./TimeSlotSelector"
import { BookConfirmation } from "./BookConfirmation"
import { AppointmentService } from "../../services/appointment.service"
import { AppointmentModel } from "@/models/appointment.model"


export function BookingFlow() {
  const { step } = useParams<{ step: string }>()
  const navigate = useNavigate()

  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [selectedField, setSelectedField] = useState<MedicalFieldModel | null>(null)
  const [selectedDoctor, setSelectedDoctor] = useState<DoctorModel | null>(null)
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [confirmBooking, setConfirmBooking] = useState<boolean>(false)
  const [appointments, setAppointments] = useState<AppointmentModel[]>([])
  const [appointmentOnFieldExists, setAppointmentOnFieldExists] = useState<boolean>(false)

  const steps = ['medical_field', 'doctor', 'date', 'confirmation']
  let stepNumber = steps.indexOf(step || '')
  // in case the addres is not valid
  stepNumber = (stepNumber === -1) ? 0 : stepNumber

 
  useEffect(() => {
    // to see if user trying book again on some field
    loadAppointments()

    // load sessionStorage
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

  useEffect(()=>{
    if(!selectedField) setAppointmentOnFieldExists(false)
    else{
      const isExists = appointments.some(app =>
        selectedField._id === app.medicalFieldId)
      setAppointmentOnFieldExists(isExists)
    }
  },[selectedField, appointments])

  
  async function loadAppointments(){
      const data = await AppointmentService.getAppointmentsData('scheduled')
      if(data) {
          const { appointments } = data
          setAppointments(appointments)
      }
  }


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
        <MedicalFieldSelector 
          currantField={selectedField}
          appointmentOnFieldExists={appointmentOnFieldExists} 
          onSelect={field => {
            setSelectedField(field)
            setSelectedDoctor(null)
            setSelectedDate(null)
          }
        }/>
      }
      {
        stepNumber === 1 && selectedField &&
        <DoctorSelector 
        currantDoctor={selectedDoctor}
        field={selectedField} 
        onSelect={doctor => {
          setSelectedDoctor(doctor)
          setSelectedDate(null)
        }} />
      }
      {
        stepNumber === 2 && selectedField && selectedDoctor &&
        <TimeSlotSelector 
        doctor={selectedDoctor} 
        field={selectedField}
        selectedDate={selectedDate} 
        onSelect={date => {
          setSelectedDate(date)
        }} />
      }
      {
        stepNumber === 3 && selectedField && selectedDoctor && selectedDate &&
        <BookConfirmation
          field={selectedField}
          doctor={selectedDoctor}
          date={selectedDate}
          confirmBooking={confirmBooking}
          appointmentOnFieldExists={appointmentOnFieldExists}
          setConfirmBooking={setConfirmBooking}
        />
      }

      {/* prev/next buttons */}
      {
        !confirmBooking &&
        <section className="prev-next-buttons">
          <button
            onClick={() => goToStep(stepNumber - 1)}
            disabled={stepNumber < 1}
            style={{ visibility: stepNumber !== 0 ? 'visible' : 'hidden' }}
          >
            <i className="fa-solid fa-angle-left"></i>
            <span>prev</span>
          </button>   

          <button 
            onClick={() => goToStep(stepNumber + 1)} 
            disabled={isNextDisabled()}
            style={{ visibility: stepNumber !== 3 ? 'visible' : 'hidden' }}
          >
            <span>next</span>
            <i className="fa-solid fa-angle-right"></i>
          </button>
        </section>
      }
    </section>
  )
}
