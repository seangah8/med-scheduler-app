import { useNavigate } from "react-router-dom"
import { AppointmentModel } from "@/models/appointment.model"
import { useState } from "react"


interface CancelModalProps{
    setShowCancelModal: (toShow : boolean) => void
    onCancelAppointment: () => Promise<AppointmentModel | null>
}

export function CancelModal({setShowCancelModal, onCancelAppointment} 
    : CancelModalProps){

    const navigate = useNavigate()
    const [wasCanceledSuccessfully, setWasCanceledSuccessfully] 
        = useState<boolean | null>(null)

    async function onApprove(){
        const app = await onCancelAppointment()
        if(app) setWasCanceledSuccessfully(true)
        else setWasCanceledSuccessfully(false)
    }
    

    return(
        <section className="cancel-modal">
            {/* cancel confirmation */}
            {
                wasCanceledSuccessfully === null &&
                <section className="cancel-confirmation">
                    <h3>Are you sure you want to cancel your appointment?</h3>
                    <div className="buttons-area">
                        <button onClick={()=>setShowCancelModal(false)}>No</button>
                        <button onClick={onApprove}>Yes</button>
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
                            ? 'appointment canceled'
                            : 'could not cancel the appointment, try again later'
                        }
                    </h3>
                    <button onClick={()=>
                        wasCanceledSuccessfully
                        ? navigate('/dashboard')
                        : setShowCancelModal(false)
                    }>
                        Approve
                    </button>
                </section>
            }
        </section>
    )
}