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

    useEffect(() => {
        const validated = validateFilter(filter)

        
        if (JSON.stringify(validated) !== JSON.stringify(filter)) {
            setFilter(validated)
            return
        }

        loadAppointments(validated)
    }, [filter])


    async function loadAppointments(validatedFilter: AppointmentFilterModel) {
        setLoadingApps(true)
        const data = await AppointmentService.getAppointmentsData(validatedFilter)
        if (data) {
            const { appointments: aps, doctorMap: drMap, medicalFieldMap: fieldMap } = data
            setAppointments(aps)
            setDoctorMap(drMap)
            setMedicalFieldMap(fieldMap)
        }
        setLoadingApps(false)
    }

    function validateFilter(filter: AppointmentFilterModel): AppointmentFilterModel {
        let validated = { ...filter }

        if (validated.status === 'scheduled') {
            validated.startDate = undefined
            validated.endDate = undefined
        }

        if (validated.endDate) {
            const endOfDay = new Date(validated.endDate)
            endOfDay.setHours(23, 59, 59, 999)
            validated.endDate = endOfDay
        }

        if (validated.startDate && validated.endDate && validated.startDate > validated.endDate) {
            validated.endDate = validated.startDate
        }

        return validated
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