import { DoctorModel } from "@/models/doctor.model"
import { httpService } from "./http.service"

export const AppointmentService = {
    getUnavailableDates,
    getAvailableSlots,
}


async function getUnavailableDates(doctorId: string, medicalFieldId : string) : Promise<Date[] | null> {
    try{
        const doctors = await httpService.get<Date[]>(`appointment/unavailable-dates/${doctorId}/${medicalFieldId}`)
        return doctors
    } catch(err){
        console.log('Could not get unavailable dates:', err)
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