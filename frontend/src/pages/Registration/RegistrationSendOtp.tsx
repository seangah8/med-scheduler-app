import { useState } from "react"

interface RegistrationSendOtpProps{
    phone: string
    waitingForPassword: boolean
    setPhone: (str : string) => void
    onGetOtp: () => void
}

export function RegistrationSendOtp({phone, waitingForPassword, setPhone, onGetOtp} 
    : RegistrationSendOtpProps){

    const [isPhoneValid, setIsPhoneValid] = useState<boolean>(true)

    function checkPhoneValidation(phone : string){
        const phoneRegex = /^05\d{8}$/
        const valid = phoneRegex.test(phone)
        if(valid) onGetOtp()
        setIsPhoneValid(valid)
    }

    return(
        <section className="registration-send-otp">
            <label htmlFor="phone">Login to your personal area</label>
            <input
                id="phone"
                type="text"
                name="phone"
                value={phone}
                placeholder="Your Phone Number"
                onChange={event=>setPhone(event.target.value)}
            />
            {   !isPhoneValid && 
                <p className="invalid-input-err">
                    please enter a valid phone number.
                </p>
            }
            <p>To identify who we have the honor of dealing with, 
                we will send you a one-time identification code</p>
            <button onClick={()=>checkPhoneValidation(phone)} disabled={waitingForPassword}>
                {waitingForPassword ? 'Sending...' : 'Approve'}
            </button>
        </section>
    )
}