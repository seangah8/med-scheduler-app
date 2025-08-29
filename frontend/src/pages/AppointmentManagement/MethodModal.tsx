import { AppointmentModel } from "@/models/appointment.model"
import { useState } from "react"


interface MethodModalProps{
    onVirtual: boolean
    setShowMethodModal: (show: boolean) => void
    onChangeMethod: () => Promise<AppointmentModel | null>
    wasSwitchMethodSuccessfully: boolean | null
    setWasSwitchMethodSuccessfully: (success : boolean) => void
    handleRefresh: () => void
}

export function MethodModal({
    onVirtual,
    setShowMethodModal, 
    onChangeMethod, 
    wasSwitchMethodSuccessfully, 
    setWasSwitchMethodSuccessfully,
    handleRefresh
} : MethodModalProps){

    const [isChanging, setIsChanging] = useState<boolean>(false)

    async function onApprove(){
        setIsChanging(true)
        const app = await onChangeMethod()
        if(app) setWasSwitchMethodSuccessfully(true)
        else setWasSwitchMethodSuccessfully(false)
        setIsChanging(false)
    }

    return(
        <section className="method-modal" onClick={e => e.stopPropagation()}>
            {/* change visit method confirmation */}
            {
                wasSwitchMethodSuccessfully === null &&
                <section className="method-confirmation">
                    <h3>Are you sure you want to change your visit into {onVirtual ? 'in-person' : 'virtual'}?</h3>
                    <div className="buttons-area">
                        <button className="no-butt" onClick={()=>setShowMethodModal(false)}>No</button>
                        <button className="yes-butt" onClick={onApprove} disabled={isChanging}>
                           {isChanging ? 'Changing...' : 'Yes'}
                        </button>
                    </div>
                </section>
            }

            {/* method status */}
            {
                wasSwitchMethodSuccessfully !== null &&
                <section className="method-status">
                    <h3>
                        {
                            wasSwitchMethodSuccessfully
                            ? `Appointment schedule as ${onVirtual ? 'in-person' : 'virtual'} visit`
                            : 'Could not change visit method, try again later'
                        }
                    </h3>
                    <button onClick={()=>{
                        setShowMethodModal(false)
                        if(wasSwitchMethodSuccessfully)
                            handleRefresh()
                    }}>
                        Approve
                    </button>
                </section>
            }
        </section>
    )

}