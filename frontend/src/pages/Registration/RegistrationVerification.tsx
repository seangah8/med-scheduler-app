

interface RegistrationVerificationProps{
    password: string
    setPassword: (str : string) => void
    onGetOtp: () => void
    onVerifyOtp: () => void
}

export function RegistrationVerification({password, setPassword, onGetOtp, onVerifyOtp} 
    : RegistrationVerificationProps){

    return(
        <section className="registration-verification">
            <label htmlFor="password">One Time Password:</label>
            <input
                id="password"
                type="text"
                name="password"
                value={password}
                onChange={event=>setPassword(event.target.value)}
            />
            <button onClick={onVerifyOtp}>Verify Code</button>
            <p onClick={onGetOtp}>did not get a code? try again</p>
        </section>
    )
}