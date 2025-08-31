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
    const [waitingForPassword, setWaitingForPassword] = useState<boolean>(false)
    const [isVerifying, setIsVerifying] = useState<boolean>(false)
    const [showInvalidPassMsg, setShowInvalidPassMsg] = useState<boolean>(false)

    // when user go back to registration it will logout
    useEffect(()=>{
        if(loggedInUser)
            dispatch(authThunks.logout())
    },[])

    async function onGetOtp(){
        setWaitingForPassword(true)
        const otp = await authService.sendOtp(phone)
        if(otp) {
            console.log(`your one time password: ${otp}`)
            setIsGotPassword(true)
        }
        setWaitingForPassword(false)
    }

    async function onVerifyOtp(){
        setIsVerifying(true)
        const user = await dispatch(authThunks.login(phone, password))
        if(user) {
            navigate('/dashboard')
        } else setShowInvalidPassMsg(true)
        setIsVerifying(false)
    }

    return(
        <section className="registration">

            <div className="registration-main">

                {/* sending phone*/}
                {
                    !isGotPassword &&
                    <RegistrationSendOtp
                        phone={phone}
                        waitingForPassword={waitingForPassword}
                        setPhone={setPhone}
                        onGetOtp={onGetOtp}
                    />
                }

                {/* verify otp*/}
                {
                    isGotPassword &&
                    <RegistrationVerification
                        password={password}
                        isVerifying={isVerifying}
                        showInvalidPassMsg={showInvalidPassMsg}
                        waitingForPassword={waitingForPassword}
                        setPassword={setPassword}
                        onGetOtp={onGetOtp}
                        onVerifyOtp={onVerifyOtp}
                    />
                }

            </div>

        </section>
    )
}