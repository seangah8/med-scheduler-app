import { useNavigate } from "react-router-dom"
import { AppointmentModel } from "@/models/appointment.model"
import { useState } from "react"


interface CancelModalProps{
    wasCanceledSuccessfully: boolean | null
    setShowCancelModal: (toShow : boolean) => void
    setWasCanceledSuccessfully: (success : boolean) => void
    onCancelAppointment: () => Promise<AppointmentModel | null>
}

export function CancelModal({
    wasCanceledSuccessfully,
    setShowCancelModal, 
    setWasCanceledSuccessfully,
    onCancelAppointment
} 
    : CancelModalProps){

    const navigate = useNavigate()
    const [isCanceling, setIsCanceling] = useState(false)

    async function onApprove(){
        setIsCanceling(true)
        const app = await onCancelAppointment()
        if(app) setWasCanceledSuccessfully(true)
        else setWasCanceledSuccessfully(false)
        setIsCanceling(false)
    }
    

    return(
        <section className="cancel-modal"  onClick={e => e.stopPropagation()}>
            {/* cancel confirmation */}
            {
                wasCanceledSuccessfully === null &&
                <section className="cancel-confirmation">
                    <h3>Are you sure you want to cancel your appointment?</h3>
                    <div className="buttons-area">
                        <button className="no-butt" onClick={()=>setShowCancelModal(false)}>No</button>
                        <button className="yes-butt" onClick={onApprove} disabled={isCanceling}>
                           {isCanceling ? 'Canceling...' : 'Yes'}
                        </button>
                    </div>
                </section>
            }

            {/* cancel status */}
            {
                wasCanceledSuccessfully !== null &&
                <section className="cancel-status">
                    <h3>
                        {
                            wasCanceledSuccessfully
                            ? 'Appointment canceled'
                            : 'Could not cancel the appointment, try again later'
                        }
                    </h3>
                    <button onClick={()=>
                        wasCanceledSuccessfully
                        ? navigate('/dashboard')
                        : setShowCancelModal(false)
                    }>
                        Back to home page
                    </button>
                </section>
            }
        </section>
    )
}