

interface RegistrationVerificationProps{
    password: string
    isVerifying: boolean
    setPassword: (str : string) => void
    onGetOtp: () => void
    onVerifyOtp: () => void
}

export function RegistrationVerification({password, isVerifying, setPassword, onGetOtp, onVerifyOtp} 
    : RegistrationVerificationProps){

    return(
        <section className="registration-verification">
            <label htmlFor="password">What you received?</label>
            <input
                id="password"
                type="text"
                name="password"
                value={password}
                onChange={event=>setPassword(event.target.value)}
            />
            <button onClick={onVerifyOtp} disabled={isVerifying}>
                {isVerifying ? 'Verifying...' : 'Approve'}
            </button>
            <p>Did not receive, please <span onClick={onGetOtp}>send again</span></p>
        </section>
    )
}