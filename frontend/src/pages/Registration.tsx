import { useState, useEffect } from "react"
import { useSelector } from "react-redux"
import { RootState } from '../store/store'
import { authService } from "../services/auth.service"
import { useNavigate } from "react-router-dom"
import { authActions } from "../store/actions/auth.actions"

export function Registration(){

    const loggedInUser = useSelector((storeState : RootState) => 
        storeState.authModule.loggedInUser)

    const navigate = useNavigate()
    const [phone, setPhone] = useState<string>('')
    const [password, setPassword] = useState<string>('')

    // when user go back to registration it will logout
    useEffect(()=>{
        if(loggedInUser)
            authActions.logout()
    },[])

    async function onGetOtp(){
        const otp = await authService.sendOtp(phone)
        if(otp) console.log(`here is your password: ${otp}`)
    }

    async function onVerifyOtp(){
        const user = await authActions.login(phone, password)
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


            <label htmlFor="password">One Time Password:</label>
            <input
                id="password"
                type="text"
                name="password"
                value={password}
                onChange={event=>setPassword(event.target.value)}
            />
            <button onClick={onVerifyOtp}>Verify Code</button>

        </section>
    )
}