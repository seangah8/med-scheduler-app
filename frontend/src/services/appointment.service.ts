import { DoctorModel } from "@/models/doctor.model"
import { httpService } from "./http.service"
import { AppointmentModel } from "@/models/appointment.model"

export const AppointmentService = {
    getAllUnavailabilities,
    getAvailableSlots,
    createAppointment,
}

async function createAppointment(medicalFieldId: string, doctorId: string, date: Date)
    : Promise<AppointmentModel | null>{
    try{
        const appointment = await httpService.post<AppointmentModel>
            ('appointment/', {medicalFieldId, doctorId, date})
        return appointment

    } catch(err){
        console.error('Could not create an appointment:', err)
        return null
    }
}

// unavailableDays: days that are completely booked ["2025-08-22", "2025-08-24", ...]
// unavailableSlots: in other days, booked slots ["2025-08-23T10:15:00Z", ...]
async function getAllUnavailabilities(medicalFieldId: string, doctorId: string)
    : Promise<{ unavailableDays: string[], unavailableSlots: string[] } | null> {

    try {
        const allUnavailability = await httpService.get
            <{unavailableDays: string[], unavailableSlots: string[]}>
                (`appointment/unavailable-dates/${medicalFieldId}/${doctorId}`)
        return allUnavailability

    } catch (err) {
        console.error('Could not get unavailable dates:', err)
        return null
    }
}


function getAvailableSlots(date: Date, doctor: DoctorModel, unavailableSet: Set<string>): Date[] {
    const { start, end, intervalMinutes, breaks } = doctor.schedule

    const availableSlots: Date[] = []
    const chosenDate = new Date(date)

    // convert working hours to numbers
    const [startHour, startMin] = start.split(':').map(Number)
    const [endHour, endMin] = end.split(':').map(Number)

    const startMinutes = startHour * 60 + startMin
    const endMinutes = endHour * 60 + endMin

    for (let current = startMinutes; current < endMinutes; current += intervalMinutes) {
        const hours = Math.floor(current / 60)
        const minutes = current % 60

        const slot = new Date(chosenDate)
        slot.setHours(hours, minutes, 0, 0)

        // check if slot is in a break
        const isInBreak = breaks.some(b => {
            const [sh, sm] = b.start.split(':').map(Number)
            const [eh, em] = b.end.split(':').map(Number)

            const breakStart = sh * 60 + sm
            const breakEnd = eh * 60 + em

            return current >= breakStart && current < breakEnd
        })

        if (isInBreak) continue

        // check if this slot is unavailable
        if (unavailableSet.has(slot.toISOString())) continue

        // if passed all filters add to available
        availableSlots.push(slot)
    }

    return availableSlots
}