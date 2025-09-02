import { LoadingSpinner } from "../../components/LoadingSpinner"

interface RegistrationVerificationProps{
    password: string
    isVerifying: boolean
    showInvalidPassMsg: boolean
    waitingForPassword: boolean
    setPassword: (str : string) => void
    onGetOtp: () => void
    onVerifyOtp: () => void
}

export function RegistrationVerification({password, isVerifying, showInvalidPassMsg, waitingForPassword, setPassword, onGetOtp, onVerifyOtp} 
    : RegistrationVerificationProps){

    return(

        <section className="registration-verification">

            { isVerifying && <LoadingSpinner/> }

            <label htmlFor="password">What you received?</label>
            <input
                id="password"
                type="text"
                name="password"
                placeholder="Enter Temporary Code"
                value={password}
                onChange={event=>setPassword(event.target.value)}
            />
            {   showInvalidPassMsg  && 
                <p className="invalid-input-err">
                    Invalid or expired password, please try again.
                </p>
            }
            <button onClick={onVerifyOtp} disabled={isVerifying}>
                {isVerifying ? 'Verifying...' : 'Approve'}
            </button>
            <p className="try-again-text">Did not receive? please  
                <span onClick={()=> !waitingForPassword && onGetOtp()}>
                    {' '} send again
                </span>
            </p>
        </section>
    )
}