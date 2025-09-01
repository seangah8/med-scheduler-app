import { useState, useEffect } from "react"
import { AppointmentModel, AppointmentFilterModel } from "../../models/appointment.model"
import { AppointmentService } from "../../services/appointment.service"
import { DashboardRegular } from "./DashboardRegular"
import { DashboardWelcome } from "./DashboardWelcome"
import { LoadingSpinner } from "../../components/LoadingSpinner"
import { useAppSelector } from "../../store/hooks"


export function Dashboard(){

    const loggedInUser = useAppSelector(state => state.authModule.loggedInUser)
    const [appointments, setAppointments] = useState<AppointmentModel[]>([])
    const [loadingApps, setLoadingApps] = useState<boolean>(true)
    const [doctorMap, setDoctorMap] = useState<Record<string, string>>({})
    const [medicalFieldMap, setMedicalFieldMap] = useState<Record<string, string>>({})
    const [filter, setFilter] = useState<AppointmentFilterModel>(AppointmentService.getDefulteAppointmentFilter)

    useEffect(()=>{
        loadAppointments()
    },[filter])


    async function loadAppointments(){

        const validatedFilter = validateFilter(filter)

        setLoadingApps(true)
        const data = await AppointmentService.getAppointmentsData(validatedFilter)
        if(data) {
            const { appointments: aps, doctorMap: drMap, 
                medicalFieldMap: fieldMap } = data
            setAppointments(aps)
            setDoctorMap(drMap)
            setMedicalFieldMap(fieldMap)
        }
        setLoadingApps(false)
    }

    function validateFilter(filter: AppointmentFilterModel)
        : AppointmentFilterModel {

        // keep the original filter
        const validatedFilter = {...filter}
        
        // dont apply startDate and endDate filtering on upcoming appointments 
        if(validatedFilter.status === 'scheduled'){
            validatedFilter.endDate = undefined
            validatedFilter.startDate = undefined
        }

        // make sure endDate include appointments within the same day
        if(validatedFilter.endDate){
            const endOfDay = new Date(validatedFilter.endDate)
            endOfDay.setHours(23, 59, 59, 999)
            validatedFilter.endDate = endOfDay
        }

        // make sure endDate wont be before startDate
        if (validatedFilter.startDate && validatedFilter.endDate && 
            validatedFilter.startDate > validatedFilter.endDate) 
            return { ...validatedFilter, endDate: validatedFilter.startDate }

        return validatedFilter
    }

    if(!loggedInUser) return <LoadingSpinner />

    return(
        <section className="dashboard">

            {/* for regular users */}
            {
                !loggedInUser.isUserNew &&
                <DashboardRegular
                    appointments={appointments} 
                    doctorMap={doctorMap}
                    medicalFieldMap={medicalFieldMap}
                    filter={filter}
                    loadingApps={loadingApps}
                    setFilter={setFilter}
                />
            }

            {/* for new users */}
            {
                loggedInUser.isUserNew &&
                <DashboardWelcome/>
            }
        </section>
    )
}