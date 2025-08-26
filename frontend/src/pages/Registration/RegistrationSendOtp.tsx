
interface RegistrationSendOtpProps{
    phone: string
    waitingForPassword: boolean
    setPhone: (str : string) => void
    onGetOtp: () => void
}

export function RegistrationSendOtp({phone, waitingForPassword, setPhone, onGetOtp} 
    : RegistrationSendOtpProps){

    return(
        <section className="registration-send-otp">
            <label htmlFor="phone">Login to your personal area</label>
            <input
                id="phone"
                type="text"
                name="phone"
                value={phone}
                placeholder="Phone Number"
                onChange={event=>setPhone(event.target.value)}
            />
            <p>To identify who we have the honor of dealing with, 
                we will send you a one-time identification code</p>
            <button onClick={onGetOtp} disabled={waitingForPassword}>
                {waitingForPassword ? 'Sending...' : 'Approve'}
            </button>
        </section>
    )
}