import { useState, useEffect, useRef } from "react"
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar'
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { format } from 'date-fns'
import { DoctorModel } from "@/models/doctor.model"
import { MedicalFieldModel } from "@/models/medicalField.model"
import { AppointmentService } from "../../services/appointment.service"
import { TimeSlotService } from "../../services/timeSlot.service"


interface TimeSlotSelectorProps {
  field: MedicalFieldModel
  doctor: DoctorModel
  onSelect: (date: Date) => void
}

export function TimeSlotSelector({ field, doctor, onSelect }: TimeSlotSelectorProps) {
  const unavailableDaysSetRef = useRef<Set<string>>(new Set())
  const unavailableSlotsSetRef = useRef<Set<string>>(new Set())
  const [isLoaded, setIsLoaded] = useState<boolean>(false)
  const [calendarDate, setCalendarDate] = useState<Date | null>(new Date())
  const [availableDaySlots, setAvailableDaySlots] = useState<Date[]>([])

  useEffect(() => {
    loadUnavailabilities()
  }, [])

  useEffect(() => {
    if (calendarDate && isLoaded) {
      const slots = TimeSlotService.getAvailableSlots(
        calendarDate,
        doctor,
        unavailableSlotsSetRef.current
      )
      setAvailableDaySlots(slots)
    }
  }, [calendarDate, isLoaded])

  async function loadUnavailabilities() {
    const result = await AppointmentService.getAllUnavailabilities(field._id, doctor._id)
    if (result) {
      const { unavailableDays, unavailableSlots } = result
      const daysSet = new Set<string>(unavailableDays)
      const slotsSet = new Set<string>(unavailableSlots.map(d => new Date(d).toISOString()))
      unavailableDaysSetRef.current = daysSet
      unavailableSlotsSetRef.current = slotsSet
    }

  const firstAvailable = TimeSlotService.findFirstAvailableDate(
    doctor,
    field._id,
    unavailableDaysSetRef.current,
  )

  if (firstAvailable) {
    setCalendarDate(firstAvailable)
  }

    setIsLoaded(true)
  }

  if (!isLoaded) return <h2>Loading...</h2>

  return (
    <section className="time-slot-selector">
      <h1>Time Slot Selector</h1>

      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <DateCalendar
          value={calendarDate}
          onChange={(newDate) => {
            if (!newDate) return
            const dateStr = format(newDate, 'yyyy-MM-dd')
            if (!unavailableDaysSetRef.current.has(dateStr)) {
              setCalendarDate(newDate)
            }
          }}
          shouldDisableDate={(date) => TimeSlotService.isDayDisable
            (date, field._id, doctor, unavailableDaysSetRef.current)}
        />
      </LocalizationProvider>

      <ul>
        {
          availableDaySlots.map(d =>
            <li key={d.toISOString()} onClick={() => onSelect(d)}>
              {TimeSlotService.formatTimeShort(d)}
            </li>
          )
        }
      </ul>
    </section>
  )
}
