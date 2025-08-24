import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { authThunks } from "../../store/thunks/auth.thunks"
import { useAppDispatch } from "../../store/hooks"
import { AppointmentModel } from "../../models/appointment.model"
import { AppointmentService } from "../../services/appointment.service"
import { AppointmentList } from "./AppointmentList"
import { authService } from "../../services/auth.service"
import { medicalFieldService } from "../../services/medicalField.service"
import { MedicalFieldModel } from "../../models/medicalField.model"



export function Dashboard(){

    const navigate = useNavigate()
    const dispatch = useAppDispatch()
    const [appointments, setAppointments] = useState<AppointmentModel[]>([])
    const [doctorMap, setDoctorMap] = useState<Record<string, string>>({})
    const [medicalFieldMap, setMedicalFieldMap] = useState<Record<string, string>>({})
    const [medicalFields, setMedicalFields] = useState<MedicalFieldModel[]>([])
    const [onPast, setOnPast] = useState<boolean>(false)
    const [isUserNew, setIsUserNew] = useState<boolean>(false)
    const [isLoading, setIsLoading] = useState<boolean>(true)

    // check if user is new to display proper welcome
    // if user was new and booked appointment he's not new any more
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

    useEffect(()=>{
        if(isUserNew)
            loadMedicalFields()
    },[isUserNew])

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

    async function loadMedicalFields() {
        const fields = await medicalFieldService.getMedicalFields()
        if(fields) setMedicalFields(fields)
    }

    async function onLogout(){
        await dispatch(authThunks.logout())
    }

    if(isLoading) return <h3>Loading...</h3>

    return(
        <section className="dashboard">

            <button onClick={onLogout}>logout</button>

            {/* for regular users */}
            {
                !isUserNew &&
                <section className="dashboard-regular">
                    <button onClick={()=>navigate('/booking-appointment')}>
                        book appointment +
                    </button>
                    <button onClick={()=>setOnPast(true)}>Past</button>
                    <button onClick={()=>setOnPast(false)}>Upcoming</button>
                    <AppointmentList 
                        appointments={appointments} 
                        doctorMap={doctorMap}
                        medicalFieldMap={medicalFieldMap}
                    />
                </section>
            }

            {/* for new users */}
            {
                isUserNew &&
                <section className="dashboard-new-user">
                    <h1>Welcome To Shiba Connect!</h1>
                    <button onClick={()=>navigate('/booking-appointment')}>
                        book your first appointment here!
                    </button>
                    <ul>
                        {
                            medicalFields.map(field => 
                                <li key={field._id}>
                                    {field.name}
                                </li>
                            )
                        }
                    </ul>
                </section>
            }
        </section>
    )
}