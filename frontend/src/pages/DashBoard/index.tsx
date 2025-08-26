import { useState, useEffect } from "react"
import { AppointmentModel } from "../../models/appointment.model"
import { AppointmentService } from "../../services/appointment.service"
import { authService } from "../../services/auth.service"
import { DashboardRegular } from "./DashboardRegular"
import { DashboardWelcome } from "./DashboardWelcome"



export function Dashboard(){

    const [appointments, setAppointments] = useState<AppointmentModel[]>([])
    const [doctorMap, setDoctorMap] = useState<Record<string, string>>({})
    const [medicalFieldMap, setMedicalFieldMap] = useState<Record<string, string>>({})
    const [onPast, setOnPast] = useState<boolean>(false)
    const [isUserNew, setIsUserNew] = useState<boolean>(false)
    const [isLoading, setIsLoading] = useState<boolean>(true)

    // check if user is new to display proper welcome
    // if user was new and booked appointment he's not new anymore
    useEffect(()=>{
        let isNew = authService.getIsUserNew()
        if(isNew !== null){
            if(isNew && appointments.length > 0){
                authService.saveLocalIsUserNew(false)
                isNew = false
            }
            setIsUserNew(isNew)
        }
        setIsLoading(false)
    },[appointments])

    useEffect(()=>{
        loadAppointments()
    },[onPast])



    async function loadAppointments(){
        const status = onPast ? 'completed' : 'scheduled'
        const data = await AppointmentService.getAppointmentsData(status)
        if(data) {
            const { appointments: aps, doctorMap: drMap, 
                medicalFieldMap: fieldMap } = data
            setAppointments(aps)
            setDoctorMap(drMap)
            setMedicalFieldMap(fieldMap)
        }
    }

    if(isLoading) return <h3>Loading...</h3>

    return(
        <section className="dashboard">

            

            {/* for regular users */}
            {
                !isUserNew &&
                <DashboardRegular
                    appointments={appointments} 
                    doctorMap={doctorMap}
                    medicalFieldMap={medicalFieldMap}
                    onPast={onPast}
                    setOnPast={setOnPast}
                />
            }

            {/* for new users */}
            {
                isUserNew &&
                <DashboardWelcome/>
            }
        </section>
    )
}