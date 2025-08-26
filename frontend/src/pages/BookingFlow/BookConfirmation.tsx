import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { DoctorModel } from "@/models/doctor.model"
import { MedicalFieldModel } from "@/models/medicalField.model"
import { AppointmentService } from "../../services/appointment.service"
import { TimeSlotService } from "../../services/timeSlot.service"

interface BookConfirmationProps{
    field: MedicalFieldModel
    doctor: DoctorModel
    date: Date
    confirmBooking: boolean
    setConfirmBooking: (confirm : boolean) => void
}

export function BookConfirmation({ field, doctor, date, confirmBooking, setConfirmBooking } : BookConfirmationProps){

    const navigate = useNavigate()
    const [isSuccess, setIsSuccess] = useState<boolean>(false)
    const [isBooking, setIsBooking] = useState(false)

    async function onBookAppointment() {
        setIsBooking(true)
        const appointment = await AppointmentService
            .createAppointment(field._id, doctor._id, date)
        AppointmentService.deleteLocalBookingFlow()
        setIsSuccess(!!appointment)
        setConfirmBooking(true)
        setIsBooking(false)
    }

    return(
        <section className="book-confirmation">

            {/* Confirmation Screen */}
            { 
                !confirmBooking &&
                <section className="confirmation-screen">
                    <h1>Final Details</h1>

                    <p>{`Medical Field: ${field.name}`}</p>
                    <p>{`Doctor: ${doctor.name}`}</p>
                    <p>{`Date: ${TimeSlotService.formatDateTimeLong(date)}`}</p>
                    {field.requiredInfo && <p>{`Requirements: ${field.requiredInfo}`}</p>}

                    <button onClick={onBookAppointment} disabled={isBooking}>
                        {isBooking ? 'Booking...' : 'Book Appointment'}
                    </button>
                </section>
            }

            {/* Success Screen */}
            {
                confirmBooking && isSuccess && 
                <section className="success-screen">
                    <h1>New Appointment Have Been Add!</h1>
                    <button onClick={()=>navigate('/dashboard')}>back to home page</button>
                </section>
            }

            {/* Error Screen */}
            {
                confirmBooking && !isSuccess && 
                <section className="error-screen">
                    <h1>Couldn't save Appointment... please try again</h1>
                    <button onClick={() => window.location.href = '/booking-appointment'}>
                        back booking an appointment</button>
                </section>
            }

        </section>
    )
    
}