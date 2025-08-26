import { format } from 'date-fns'
import { DoctorModel } from "@/models/doctor.model"

export const TimeSlotService = {
  formatTimeShort,
  formatDateTimeLong,
  getAvailableSlots,
  isDayDisable,
  findFirstAvailableDate,
}


// converts a date to HH:MM
function formatTimeShort(date: Date): string {
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })
}

// converts a date to YYYY-MM-DD HH:MM
function formatDateTimeLong(date: Date): string {
  const dateStr = date.toLocaleDateString('en-CA') // gives "YYYY-MM-DD"
  const timeStr = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })
  return `${dateStr} ${timeStr}`
}





function getAvailableSlots(date: Date, doctor: DoctorModel, unavailableSet: Set<string>): Date[] {
    const { start, end, intervalMinutes, breaks } = doctor.schedule

    const now = new Date()

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

        // chek if slot already passed
        if (slot < now) continue

        // check if this slot is unavailable
        if (unavailableSet.has(slot.toISOString())) continue

        // if passed all filters add to available
        availableSlots.push(slot)
    }

    return availableSlots
}


function isDayDisable(
  date: Date,
  fieldId: string,
  doctor: DoctorModel,
  unavailableDaysSet: Set<string>
): boolean {

  const todayStr = format(new Date(), 'yyyy-MM-dd')
  const targetStr = format(date, 'yyyy-MM-dd')

  const dayOfWeek = date.getDay() // 0 = Sunday

  // is before today
  const isPast = targetStr < todayStr

  // is friday or saturday
  const isWeekend = dayOfWeek === 5 || dayOfWeek === 6

  // is not in doctor's field workdays
  const fieldSchedule = doctor.schedule.fieldWorkdays.find(f => 
    f.medicalFieldId === fieldId)
  const isNotAvailableForFieldToday =
    !fieldSchedule || !fieldSchedule.days.includes(dayOfWeek)

  // is in unavailableDaysSetRef
  const isInUnavailableDays = unavailableDaysSet.has(targetStr)

  return isPast || isWeekend || isNotAvailableForFieldToday || isInUnavailableDays
}

function findFirstAvailableDate(
  doctor: DoctorModel,
  fieldId: string,
  unavailableDays: Set<string>,
  maxDays = 365
): Date | null {

  const today = new Date()

  for (let i = 0; i < maxDays; i++) {
    const candidate = new Date(today)
    candidate.setDate(today.getDate() + i)

    if (!isDayDisable(candidate, fieldId, doctor, unavailableDays)) {
      return candidate
    }
  }

  return null
}


