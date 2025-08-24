import { useState, useEffect } from "react"
import { useAppSelector, useAppDispatch } from "../../store/hooks"
import { authService } from "../../services/auth.service"
import { useNavigate } from "react-router-dom"
import { authThunks } from "../../store/thunks/auth.thunks"
import { RegistrationSendOtp } from "./RegistrationSendOtp"
import { RegistrationVerification } from "./RegistrationVerification"

export function Registration(){

    const loggedInUser = useAppSelector(state => state.authModule.loggedInUser)
    const navigate = useNavigate()
    const dispatch = useAppDispatch()
    const [phone, setPhone] = useState<string>('')
    const [password, setPassword] = useState<string>('')
    const [isGotPassword, setIsGotPassword] = useState<boolean>(false)

    // when user go back to registration it will logout
    useEffect(()=>{
        if(loggedInUser)
            dispatch(authThunks.logout())
    },[])

    async function onGetOtp(){
        const otp = await authService.sendOtp(phone)
        if(otp) {
            console.log(`here is your password: ${otp}`)
            setIsGotPassword(true)
        }
    }

    async function onVerifyOtp(){
        const user = await dispatch(authThunks.login(phone, password))
        if(user) {
            console.log(`user: ${user._id} connected!`)
            navigate('/dashboard')
        }
    }

    return(
        <section className="registration">

            {/* sending phone*/}
            {
                !isGotPassword &&
                <RegistrationSendOtp
                    phone={phone}
                    setPhone={setPhone}
                    onGetOtp={onGetOtp}
                />
            }

            {/* verify otp*/}
            {
                isGotPassword &&
                <RegistrationVerification
                    password={password}
                    setPassword={setPassword}
                    onGetOtp={onGetOtp}
                    onVerifyOtp={onVerifyOtp}
                />
            }

        </section>
    )
}