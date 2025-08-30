import { useState, useEffect } from "react"
import { AppointmentModel, AppointmentFilterModel } from "../../models/appointment.model"
import { AppointmentService } from "../../services/appointment.service"
import { authService } from "../../services/auth.service"
import { DashboardRegular } from "./DashboardRegular"
import { DashboardWelcome } from "./DashboardWelcome"
import { LoadingSpinner } from "../../components/LoadingSpinner"


export function Dashboard(){

    const [appointments, setAppointments] = useState<AppointmentModel[]>([])
    const [loadingApps, setLoadingApps] = useState<boolean>(true)
    const [doctorMap, setDoctorMap] = useState<Record<string, string>>({})
    const [medicalFieldMap, setMedicalFieldMap] = useState<Record<string, string>>({})
    const [filter, setFilter] = useState<AppointmentFilterModel>(AppointmentService.getDefulteAppointmentFilter)
    const [isUserNew, setIsUserNew] = useState<boolean>(false)
    const [loadingUserStat, setLoadingUserStat] = useState<boolean>(true)

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
        setLoadingUserStat(false)
    },[appointments])

    useEffect(()=>{
        loadAppointments()
    },[filter])



    async function loadAppointments(){

        const validatedFilter = validateStartEndDates(filter)
        setFilter(validatedFilter)

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

    function validateStartEndDates(filter: AppointmentFilterModel)
        : AppointmentFilterModel {

        // make sure endDate include appointments within the same day
        if(filter.endDate){
            const endOfDay = new Date(filter.endDate)
            endOfDay.setHours(23, 59, 59, 999)
            filter.endDate = endOfDay
        }

        if (filter.startDate && filter.endDate && 
            filter.startDate > filter.endDate) 
            return { ...filter, endDate: filter.startDate }
        return filter
    }

    if(loadingUserStat) return <LoadingSpinner />

    return(
        <section className="dashboard">

            {/* for regular users */}
            {
                !isUserNew &&
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
                isUserNew &&
                <DashboardWelcome/>
            }
        </section>
    )
}