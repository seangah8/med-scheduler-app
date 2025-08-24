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
    const [isLoading, setIsLoading] = useState(false)

    async function onBookAppointment() {
        setIsLoading(true)
        const appointment = await AppointmentService
            .createAppointment(field._id, doctor._id, date)
        AppointmentService.deleteLocalBookingFlow()
        setIsSuccess(!!appointment)
        if(appointment)
        setConfirmBooking(true)
        setIsLoading(false)
    }

    return(
        <section className="book-confirmation">

            {/* Confirmation Screen */}
            { 
                !confirmBooking &&
                <section className="confirmation-screen">
                    <h1>Book Confirmation</h1>

                    <h3>{`Medical Field: ${field.name}`}</h3>
                    <h3>{`Doctor: ${doctor.name}`}</h3>
                    <h3>{`Date: ${TimeSlotService.formatDateTimeLong(date)}`}</h3>

                    <button onClick={onBookAppointment} disabled={isLoading}>
                        {isLoading ? 'Booking...' : 'Book Appointment'}
                    </button>
                </section>
            }

            {/* Success Screen */}
            {
                confirmBooking && isSuccess && 
                <section className="success-screen">
                    <h1>Appointment added!</h1>
                    <button onClick={()=>navigate('/dashboard')}>back to home page</button>
                </section>
            }

            {/* Error Screen */}
            {
                confirmBooking && !isSuccess && 
                <section className="error-screen">
                    <h1>Couldn't save Appointment... please try again</h1>
                    <button onClick={() => window.location.href = '/booking-appointment'}>
                        back to book an appointment</button>
                </section>
            }

        </section>
    )
    
}