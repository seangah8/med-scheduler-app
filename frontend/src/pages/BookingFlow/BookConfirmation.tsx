import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Switch } from '@mui/material'
import { DoctorModel } from "@/models/doctor.model"
import { MedicalFieldModel } from "@/models/medicalField.model"
import { AppointmentService } from "../../services/appointment.service"
import { TimeSlotService } from "../../services/timeSlot.service"
import { LoadingSpinner } from "../../components/LoadingSpinner"


interface BookConfirmationProps{
    field: MedicalFieldModel
    doctor: DoctorModel
    date: Date
    confirmBooking: boolean
    appointmentOnFieldExists: boolean
    setConfirmBooking: (confirm : boolean) => void
}

export function BookConfirmation({ field, doctor, date, confirmBooking, appointmentOnFieldExists, setConfirmBooking } : BookConfirmationProps){

    const navigate = useNavigate()
    const [isSuccess, setIsSuccess] = useState<boolean>(false)
    const [isBooking, setIsBooking] = useState(false)
    const [isVirtual, setIsVirtual] = useState(false)

    async function onBookAppointment() {
        setIsBooking(true)
        const appointment = await AppointmentService
            .createAppointment(field._id, doctor._id, date, isVirtual)
        AppointmentService.deleteLocalBookingFlow()
        setIsSuccess(!!appointment)
        setConfirmBooking(true)
        setIsBooking(false)
    }

    return(
        <section className="book-confirmation">

            {isBooking && <LoadingSpinner/>}

            {/* Confirmation Screen */}
            { 
                !confirmBooking &&
                <section className="confirmation-screen">
                    <h1>Final Details</h1>

                    <p> <span>Medical Field:</span> {field.name}</p>
                    <p> <span>Doctor:</span> {doctor.name}</p>
                    <p> <span>Date:</span> {TimeSlotService.formatDateTimeLong(date)}</p>
                    {field.requiredInfo && <p> <span>Requirements:</span> {field.requiredInfo}</p>}

                    {
                        !appointmentOnFieldExists &&
                        <div className="switch">
                            <Switch
                                checked={isVirtual}
                                onChange={e => setIsVirtual(e.target.checked)}
                            />
                            <span className="switch-label">{isVirtual ? "Virtual" : "In-Person"}</span>
                        </div>
                    }


                    {
                        appointmentOnFieldExists && 
                        <p className="overbooking-text">
                            can't book appointment - already have one for this field.
                        </p>
                    }

                    <button 
                        onClick={onBookAppointment} 
                        disabled={isBooking || appointmentOnFieldExists} 
                        style={{visibility: appointmentOnFieldExists ? 'hidden' : 'visible'}}
                    >
                        {isBooking ? 'Booking...' : 'Book Appointment'}
                    </button>
                </section>
            }

            {/* Success Screen */}
            {
                confirmBooking && isSuccess && 
                <section className="success-screen">
                    <h1>New Appointment Has Been Added!</h1>
                    <button onClick={()=>navigate('/dashboard')}>back to home page</button>
                </section>
            }

            {/* Error Screen */}
            {
                confirmBooking && !isSuccess && 
                <section className="error-screen">
                    <h1>Couldn't save appointment... Please try again</h1>
                    <button onClick={() => navigate('/booking-appointment')}>
                        book new appointment</button>
                </section>
            }

        </section>
    )
    
}