

interface RegistrationSendOtpProps{
    phone: string
    setPhone: (str : string) => void
    onGetOtp: () => void
}

export function RegistrationSendOtp({phone, setPhone, onGetOtp} 
    : RegistrationSendOtpProps){

    return(
        <section className="registration-send-otp">
            <label htmlFor="phone">Phone Number:</label>
            <input
                id="phone"
                type="text"
                name="phone"
                value={phone}
                onChange={event=>setPhone(event.target.value)}
            />
            <button onClick={onGetOtp}>Send Me Password</button>
        </section>
    )
}