

interface CancelModalProps{
    setShowCancelModal: (toShow : boolean) => void
    onCancelAppointment: () => void
}

export function CancelModal({setShowCancelModal, onCancelAppointment} : CancelModalProps){

    return(
        <section className="cancel-modal">
            <h3>Are you sure you want to cancel the appointment?</h3>
            <button onClick={()=>setShowCancelModal(false)}>No</button>
            <button onClick={onCancelAppointment}>Yes</button>
        </section>
    )
}