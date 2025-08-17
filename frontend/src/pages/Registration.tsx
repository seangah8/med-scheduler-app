import { useState } from "react"
import { authService } from "../services/auth.service"
import { useNavigate } from "react-router-dom"

export function Registration(){

    const navigate = useNavigate()
    const [phone, setPhone] = useState<string>('')
    const [otp, setOtp] = useState<string>('')

    async function onGetOtp(){
        const password = await authService.sendOtp(phone)
        if(password) console.log(`here is your password: ${password}`)
    }

    async function onVerifyOtp(){
        const user = await authService.verifyOtp(phone, otp)
        if(user) {
            console.log(`user: ${user._id} connected!`)
            navigate('/dashboard')
        }
    }

    return(
        <section className="registration">

            <label htmlFor="phone">Phone Number:</label>
            <input
                id="phone"
                type="text"
                name="phone"
                value={phone}
                onChange={event=>setPhone(event.target.value)}
            />
            <button onClick={onGetOtp}>Send Me Password</button>


            <label htmlFor="otp">One Time Password:</label>
            <input
                id="otp"
                type="text"
                name="otp"
                value={otp}
                onChange={event=>setOtp(event.target.value)}
            />
            <button onClick={onVerifyOtp}>Verify Code</button>

        </section>
    )
}